<template>
  <div :class="contentAreaClass">
    <!--
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Mekari Qontak — Bulk URL Fetcher (Knowledge Base)
      Source: https://jurnal.atlassian.net/wiki/spaces/QON/pages/50977341492/
      Token mode: Pixel 2.4
      Patterns used: layout-shell, index-view (URL list), bulk-select, confirmation
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      STATES INCLUDED:
        - Step 1 idle: empty domain input
        - Step 1 discovering: skeleton rows
        - Step 1 discovered: URL list with bulk-select + primary Fetch CTA in footer
        - Step 1 error: discovery error inline panel
        - Step 2 fetching: progress bar + batch list + ghost Stop
        - Step 3 review: filter + review items with left accent bar + primary Add CTA in footer
        - Step 3 filtered-empty: no-results inline state
        - Step 4 success: centered completion screen
        - Confirmation modal (non-destructive, blue primary)

      COPY DEFAULTS (PRD did not fully specify — iterate freely):
        - Discovery helper: "Enter one domain to find crawlable internal pages. Maximum 100 pages per session."
        - Fetch helper: "Pages are fetched in batches of 5. This may take a moment."
        - Review helper: "Review fetched pages before adding them to the chatbot knowledge base. Failed pages can be retried."

      CONVENTIONS APPLIED:
        - No section-level card wrappers (panelClass removed) — content flows in contentAreaClass directly
        - Single primary MpButton per step: in a border-top footer row
        - "Discover" is variant="secondary" (outline) — not primary
        - Review items use left 3px accent bar + white bg on neutral stage, not full card border
        - Stepper circles use inline CSS vars for brand/success/neutral colors
    -->

    <!-- ═════ Stepper ═════ -->
    <div :class="stepperClass">
      <div :class="stepWrapClass">
        <div :class="stepCircleWrapClass" :style="stepCircleStyle(1)">
          <span>{{ currentStep > 1 ? '✓' : '1' }}</span>
        </div>
        <MpText
          size="label-small"
          :weight="currentStep === 1 ? 'semiBold' : undefined"
          :color="currentStep === 1 ? 'text.default' : 'text.secondary'"
          :class="stepLabelClass"
        >
          Discover URLs
        </MpText>
      </div>
      <div :class="connectorClass(1)" />
      <div :class="stepWrapClass">
        <div :class="stepCircleWrapClass" :style="stepCircleStyle(2)">
          <span>{{ currentStep > 2 ? '✓' : '2' }}</span>
        </div>
        <MpText
          size="label-small"
          :weight="currentStep === 2 ? 'semiBold' : undefined"
          :color="currentStep === 2 ? 'text.default' : 'text.secondary'"
          :class="stepLabelClass"
        >
          Fetch pages
        </MpText>
      </div>
      <div :class="connectorClass(2)" />
      <div :class="stepWrapClass">
        <div :class="stepCircleWrapClass" :style="stepCircleStyle(3)">
          <span>{{ currentStep > 3 ? '✓' : '3' }}</span>
        </div>
        <MpText
          size="label-small"
          :weight="currentStep === 3 ? 'semiBold' : undefined"
          :color="currentStep === 3 ? 'text.default' : 'text.secondary'"
          :class="stepLabelClass"
        >
          Review & add
        </MpText>
      </div>
    </div>

    <!-- ═════ Step 1: Discover URLs ═════ -->
    <MpFlex v-if="currentStep === 1" direction="column" gap="6">
      <MpFlex direction="column" gap="1">
        <MpText weight="semiBold">Discover URLs</MpText>
        <MpText size="label-small" color="text.secondary">
          Enter one domain to find crawlable internal pages. Maximum 100 pages per session.
        </MpText>
      </MpFlex>

      <!-- Domain input row -->
      <MpFlex alignItems="flex-start" gap="3" :class="domainRowClass">
        <MpFormControl id="domain-url" :class="domainControlClass">
          <MpInputGroup id="domain-input-group">
            <MpInputLeftAddon id="domain-input-prefix">
              <MpIcon name="link" size="sm" />
            </MpInputLeftAddon>
            <MpInput
              id="domain-url-input"
              v-model="domain"
              placeholder="https://help.example.com"
              is-full-width
              :is-invalid="Boolean(domainError)"
              :is-disabled="workflowState === 'discovering'"
              @input="domainError = ''"
            />
          </MpInputGroup>
          <MpText v-if="domainError" size="label-small" :class="errorTextClass">{{ domainError }}</MpText>
          <MpText v-else size="label-small" color="text.secondary">Include the full URL with https://</MpText>
        </MpFormControl>

        <MpButton
          variant="secondary"
          left-icon="search"
          :is-loading="workflowState === 'discovering'"
          @click="discoverUrls"
        >
          Discover
        </MpButton>
      </MpFlex>

      <!-- Skeleton while discovering -->
      <MpFlex v-if="workflowState === 'discovering'" direction="column" gap="2">
        <div v-for="index in 5" :key="index" :class="skeletonRowClass" />
      </MpFlex>

      <!-- Discovery error -->
      <MpFlex v-else-if="discoveryError" direction="column" gap="3" :class="errorPanelClass">
        <MpFlex alignItems="center" gap="2">
          <MpIcon name="warning-circular" size="sm" />
          <MpText weight="semiBold">We couldn't discover pages from this domain.</MpText>
        </MpFlex>
        <MpText size="label-small" color="text.secondary">{{ discoveryError }}</MpText>
      </MpFlex>

      <!-- URL list -->
      <MpFlex v-else-if="workflowState === 'discovered'" direction="column" gap="3">
        <MpFlex alignItems="center" justifyContent="space-between" gap="4" :class="selectionHeaderClass">
          <MpCheckbox
            id="select-all-discovered-urls"
            :is-checked="isAllSelected"
            :is-indeterminate="isPartiallySelected"
            @change="toggleSelectAll"
          >
            Select all
          </MpCheckbox>
          <MpText color="text.secondary">{{ selectedUrlCount }} of {{ discoveredUrls.length }} pages selected</MpText>
        </MpFlex>

        <div :class="urlListClass">
          <MpFlex
            v-for="url in discoveredUrls"
            :key="url.id"
            alignItems="flex-start"
            gap="3"
            :class="urlRowClass(url.isSelected)"
          >
            <MpCheckbox
              :id="`url-${url.id}`"
              :is-checked="url.isSelected"
              @change="(checked: boolean) => setUrlSelection(url.id, checked)"
            />
            <MpFlex direction="column" gap="1" :class="urlTextClass">
              <MpText weight="semiBold">{{ url.title }}</MpText>
              <MpText size="label-small" color="text.secondary">{{ url.path }}</MpText>
            </MpFlex>
          </MpFlex>
        </div>
      </MpFlex>

      <!-- Step footer (single primary CTA) -->
      <MpFlex
        v-if="workflowState === 'discovered'"
        justifyContent="space-between"
        alignItems="center"
        gap="3"
        :class="stepFooterClass"
      >
        <MpButton variant="textLink" @click="clearSelection">Deselect all</MpButton>
        <MpButton
          left-icon="play"
          :is-disabled="selectedUrlCount === 0"
          @click="startFetch"
        >
          Fetch {{ selectedUrlCount }} {{ selectedUrlCount === 1 ? 'page' : 'pages' }}
        </MpButton>
      </MpFlex>
    </MpFlex>

    <!-- ═════ Step 2: Fetch pages ═════ -->
    <MpFlex v-else-if="currentStep === 2" direction="column" gap="6">
      <MpFlex direction="column" gap="1">
        <MpText weight="semiBold">Fetching pages</MpText>
        <MpText size="label-small" color="text.secondary">
          Pages are fetched in batches of 5. This may take a moment.
        </MpText>
      </MpFlex>

      <!-- Progress bar -->
      <MpFlex direction="column" gap="2">
        <MpFlex alignItems="center" justifyContent="space-between" gap="4">
          <MpText weight="semiBold">{{ fetchStatusLabel }}</MpText>
          <MpText color="text.secondary">{{ progress.percentage }}%</MpText>
        </MpFlex>
        <MpProgress variant="linear" color="information" :value="String(progress.percentage)" />
        <MpText size="label-small" color="text.secondary">
          Batch {{ progress.currentBatch }} of {{ progress.totalBatches }} · {{ progress.processed }}/{{ progress.total }} pages fetched
        </MpText>
      </MpFlex>

      <!-- Current batch list -->
      <MpFlex direction="column" gap="2" :class="batchPanelClass">
        <MpFlex alignItems="center" justifyContent="space-between">
          <MpText weight="semiBold">Currently fetching</MpText>
          <MpButton
            variant="ghost"
            size="sm"
            :right-icon="isBatchExpanded ? 'chevrons-up' : 'chevrons-down'"
            @click="isBatchExpanded = !isBatchExpanded"
          >
            {{ isBatchExpanded ? 'Collapse' : 'Expand' }}
          </MpButton>
        </MpFlex>

        <MpFlex v-if="isBatchExpanded" direction="column" gap="2">
          <MpFlex v-for="url in progress.currentBatchUrls" :key="url.id" alignItems="center" gap="2">
            <MpIcon :name="statusIcon(url.status)" size="sm" :color="statusColor(url.status)" />
            <MpText :class="currentUrlClass">{{ url.path }}</MpText>
            <MpText v-if="url.error" size="label-small" :class="errorTextClass">{{ url.error }}</MpText>
          </MpFlex>
        </MpFlex>
      </MpFlex>

      <!-- Ghost stop — no primary button in this step -->
      <MpFlex justifyContent="flex-end">
        <MpButton variant="ghost" left-icon="close" @click="stopFetch">Stop fetching</MpButton>
      </MpFlex>
    </MpFlex>

    <!-- ═════ Step 3: Review & add ═════ -->
    <MpFlex v-else-if="currentStep === 3" direction="column" gap="6">
      <MpFlex alignItems="flex-start" justifyContent="space-between" gap="4" :class="reviewHeadRowClass">
        <MpFlex direction="column" gap="1">
          <MpText weight="semiBold">Review results</MpText>
          <MpText size="label-small" color="text.secondary">
            Review fetched pages before adding them to the chatbot knowledge base. Failed pages can be retried.
          </MpText>
        </MpFlex>
        <MpBadge v-if="failedPages.length" for="additionalInformation" type="warning">
          {{ failedPages.length }} failed
        </MpBadge>
      </MpFlex>

      <!-- Filter toolbar -->
      <MpFlex alignItems="center" justifyContent="space-between" gap="3" :class="reviewToolbarClass">
        <MpFlex :class="filterClass">
          <MpSelect id="review-filter" v-model="reviewFilter" is-full-width>
            <option value="all">All ({{ activeFetchedPages.length }})</option>
            <option value="success">Success ({{ activeSuccessfulPages.length }})</option>
            <option value="failed">Failed ({{ activeFailedPages.length }})</option>
          </MpSelect>
        </MpFlex>
        <MpButton v-if="activeFailedPages.length > 1" variant="secondary" left-icon="refresh" @click="retryAllFailed">
          Retry all failed
        </MpButton>
      </MpFlex>

      <!-- Review items — left accent bar, white bg on neutral stage -->
      <MpFlex v-if="filteredReviewPages.length" direction="column" gap="3">
        <MpFlex
          v-for="page in filteredReviewPages"
          :key="page.id"
          direction="column"
          gap="2"
          :class="reviewItemClass(page.status)"
        >
          <MpFlex alignItems="flex-start" justifyContent="space-between" gap="4">
            <MpFlex direction="column" gap="1" :class="reviewTitleClass">
              <MpFlex alignItems="center" gap="2">
                <MpText weight="semiBold">{{ page.title }}</MpText>
                <MpBadge for="tableStatus" :type="page.status === 'success' ? 'completed' : 'critical'">
                  {{ page.status === 'success' ? 'Success' : 'Failed' }}
                </MpBadge>
              </MpFlex>
              <MpText size="label-small" color="text.secondary">
                {{ page.path }} · {{ page.charCount.toLocaleString('id-ID') }} chars
              </MpText>
            </MpFlex>

            <MpFlex alignItems="center" gap="2" flexShrink="0">
              <MpButton
                v-if="page.status === 'failed'"
                variant="secondary"
                size="sm"
                left-icon="refresh"
                @click="retryPage(page.id)"
              >
                Retry
              </MpButton>
              <MpButton
                v-else
                variant="ghost"
                size="sm"
                left-icon="close"
                aria-label="Remove this page"
                @click="removePage(page.id)"
              />
            </MpFlex>
          </MpFlex>

          <MpText v-if="page.status === 'failed'" size="label-small" :class="errorTextClass">
            {{ page.error }}
          </MpText>
          <MpText v-else color="text.secondary">
            {{ page.isExpanded ? page.content : page.contentPreview }}
          </MpText>

          <MpButton
            v-if="page.status === 'success'"
            variant="textLink"
            size="sm"
            :class="showMoreClass"
            @click="page.isExpanded = !page.isExpanded"
          >
            {{ page.isExpanded ? 'Show less' : 'Show more' }}
          </MpButton>
        </MpFlex>
      </MpFlex>

      <!-- Filtered-empty state (no illustration — user actively filtered) -->
      <MpFlex v-else direction="column" alignItems="center" gap="2" py="10">
        <MpText weight="semiBold">{{ reviewEmptyTitle }}</MpText>
        <MpText size="label-small" color="text.secondary">{{ reviewEmptyHelper }}</MpText>
        <MpButton v-if="reviewFilter !== 'all'" variant="textLink" @click="reviewFilter = 'all'">Clear filter</MpButton>
      </MpFlex>

      <!-- Step footer (single primary CTA) -->
      <MpFlex
        justifyContent="space-between"
        alignItems="center"
        gap="3"
        :class="stepFooterClass"
      >
        <MpButton variant="textLink" @click="clearReview">Clear all</MpButton>
        <MpButton
          left-icon="save"
          :is-disabled="activeSuccessfulPages.length === 0"
          :is-loading="workflowState === 'submitting'"
          @click="isConfirmOpen = true"
        >
          Add {{ activeSuccessfulPages.length }} {{ activeSuccessfulPages.length === 1 ? 'page' : 'pages' }} to Knowledge Base
        </MpButton>
      </MpFlex>
    </MpFlex>

    <!-- ═════ Success ═════ -->
    <MpFlex v-else-if="currentStep === 4" direction="column" alignItems="center" gap="4" :class="successClass">
      <MpIcon name="done" size="md" color="success" />
      <MpFlex direction="column" alignItems="center" gap="1">
        <MpText size="h3" weight="semiBold">{{ lastAddedCount }} {{ lastAddedCount === 1 ? 'page' : 'pages' }} added to Knowledge Base</MpText>
        <MpText color="text.secondary">{{ lastAddedCharacters.toLocaleString('id-ID') }} characters from {{ sourceDomain }}</MpText>
      </MpFlex>
      <MpFlex gap="3" :class="successActionsClass">
        <MpButton variant="secondary" @click="workflowState = 'review'">View Knowledge Base</MpButton>
        <MpButton @click="resetWorkflow">Fetch more URLs</MpButton>
      </MpFlex>
    </MpFlex>

    <!-- ═════ Add confirmation modal ═════ -->
    <MpModal
      v-if="isConfirmOpen"
      id="add-to-kb-confirmation"
      :is-open="isConfirmOpen"
      is-centered
      :is-keep-alive="false"
      @close="isConfirmOpen = false"
    >
      <!-- v-if on overlay: workaround for MpModalOverlay not self-hiding when is-open flips to false -->
      <MpModalOverlay v-if="isConfirmOpen" />
      <MpModalContent>
        <MpModalHeader>
          Add pages to Knowledge Base?
          <MpModalCloseButton />
        </MpModalHeader>
        <MpModalBody>
          <MpFlex direction="column" gap="3">
            <MpText>
              {{ activeSuccessfulPages.length }} {{ activeSuccessfulPages.length === 1 ? 'page' : 'pages' }} from {{ sourceDomain }} will be added to the chatbot knowledge base and will be available to the chatbot immediately.
            </MpText>
            <MpFlex direction="column" gap="2" :class="modalSummaryClass">
              <MpFlex justifyContent="space-between" alignItems="center">
                <MpText size="label-small" color="text.secondary">Pages</MpText>
                <MpText weight="semiBold">{{ activeSuccessfulPages.length }}</MpText>
              </MpFlex>
              <MpFlex justifyContent="space-between" alignItems="center">
                <MpText size="label-small" color="text.secondary">Total characters</MpText>
                <MpText weight="semiBold">{{ totalCharacters.toLocaleString('id-ID') }}</MpText>
              </MpFlex>
              <MpFlex justifyContent="space-between" alignItems="center">
                <MpText size="label-small" color="text.secondary">Source domain</MpText>
                <MpText weight="semiBold">{{ sourceDomain }}</MpText>
              </MpFlex>
            </MpFlex>
            <MpText v-if="submitError" size="label-small" :class="errorTextClass">{{ submitError }}</MpText>
          </MpFlex>
        </MpModalBody>
        <MpModalFooter>
          <MpButton variant="secondary" @click="isConfirmOpen = false">Cancel</MpButton>
          <MpButton left-icon="save" :is-loading="workflowState === 'submitting'" @click="submitToKnowledgeBase">
            Add to Knowledge Base
          </MpButton>
        </MpModalFooter>
      </MpModalContent>
    </MpModal>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import {
  css,
  MpBadge,
  MpButton,
  MpCheckbox,
  MpFlex,
  MpFormControl,
  MpIcon,
  MpInput,
  MpInputGroup,
  MpInputLeftAddon,
  MpModal,
  MpModalBody,
  MpModalCloseButton,
  MpModalContent,
  MpModalFooter,
  MpModalHeader,
  MpModalOverlay,
  MpProgress,
  MpSelect,
  MpText,
} from '@mekari/pixel3'
import { contentAreaClass } from '~/composables/usePixelLayout'

definePageMeta({ layout: 'default', pageAction: { label: null, icon: null } })

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkflowState = 'idle' | 'discovering' | 'discovered' | 'fetching' | 'review' | 'submitting' | 'success'
type FetchStatus = 'pending' | 'processing' | 'success' | 'failed'
type ReviewFilter = 'all' | 'success' | 'failed'

type DiscoveredUrl = {
  id: string
  url: string
  path: string
  title: string
  isSelected: boolean
}

type FetchedPage = {
  id: string
  url: string
  path: string
  title: string
  contentPreview: string
  content: string
  charCount: number
  status: FetchStatus
  error?: string
  isExpanded: boolean
  isRemoved: boolean
}

type FetchProgress = {
  sessionId: string
  currentBatch: number
  totalBatches: number
  processed: number
  total: number
  percentage: number
  currentBatchUrls: Array<Pick<FetchedPage, 'id' | 'path' | 'status' | 'error'>>
}

// ─── State ────────────────────────────────────────────────────────────────────

const workflowState = ref<WorkflowState>('idle')
const domain = ref('https://help.example.com')
const domainError = ref('')
const discoveryError = ref('')
const submitError = ref('')
const discoveredUrls = ref<DiscoveredUrl[]>([])
const fetchedPages = ref<FetchedPage[]>([])
const reviewFilter = ref<ReviewFilter>('all')
const isBatchExpanded = ref(true)
const isConfirmOpen = ref(false)
const lastAddedCount = ref(0)
const lastAddedCharacters = ref(0)
let fetchTimer: ReturnType<typeof window.setInterval> | undefined

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockUrls: DiscoveredUrl[] = [
  { id: 'getting-started', url: 'https://help.example.com/getting-started', path: '/getting-started', title: 'Getting Started Guide', isSelected: true },
  { id: 'faq', url: 'https://help.example.com/faq', path: '/faq', title: 'FAQ', isSelected: true },
  { id: 'pricing', url: 'https://help.example.com/pricing', path: '/pricing', title: 'Pricing Page', isSelected: true },
  { id: 'contact', url: 'https://help.example.com/contact', path: '/contact', title: 'Contact Support', isSelected: true },
  { id: 'about-us', url: 'https://help.example.com/about-us', path: '/about-us', title: 'About Us', isSelected: true },
  { id: 'terms', url: 'https://help.example.com/terms-of-service', path: '/terms-of-service', title: 'Terms of Service', isSelected: false },
  { id: 'setup', url: 'https://help.example.com/setup', path: '/setup', title: 'Account Setup', isSelected: true },
  { id: 'billing', url: 'https://help.example.com/billing', path: '/billing', title: 'Billing Help', isSelected: true },
]

const progress = ref<FetchProgress>({
  sessionId: 'kb-session-demo',
  currentBatch: 0,
  totalBatches: 0,
  processed: 0,
  total: 0,
  percentage: 0,
  currentBatchUrls: [],
})

// ─── Computed ─────────────────────────────────────────────────────────────────

/** Maps workflowState to a 1–4 step index for the stepper and v-if blocks. */
const currentStep = computed((): number => {
  if (['idle', 'discovering', 'discovered'].includes(workflowState.value)) return 1
  if (workflowState.value === 'fetching') return 2
  if (workflowState.value === 'success') return 4
  return 3 // review, submitting
})

const selectedUrlCount = computed(() => discoveredUrls.value.filter((url) => url.isSelected).length)
const isAllSelected = computed(() => discoveredUrls.value.length > 0 && selectedUrlCount.value === discoveredUrls.value.length)
const isPartiallySelected = computed(() => selectedUrlCount.value > 0 && selectedUrlCount.value < discoveredUrls.value.length)
const sourceDomain = computed(() => domain.value.replace(/^https?:\/\//, '').replace(/\/$/, ''))
const activeFetchedPages = computed(() => fetchedPages.value.filter((page) => !page.isRemoved))
const activeSuccessfulPages = computed(() => activeFetchedPages.value.filter((page) => page.status === 'success'))
const activeFailedPages = computed(() => activeFetchedPages.value.filter((page) => page.status === 'failed'))
const failedPages = computed(() => fetchedPages.value.filter((page) => page.status === 'failed'))
const totalCharacters = computed(() => activeSuccessfulPages.value.reduce((sum, page) => sum + page.charCount, 0))

const filteredReviewPages = computed(() => {
  if (reviewFilter.value === 'success') return activeSuccessfulPages.value
  if (reviewFilter.value === 'failed') return activeFailedPages.value
  return activeFetchedPages.value
})

const fetchStatusLabel = computed(() => workflowState.value === 'fetching' ? 'Fetching pages...' : 'Fetch complete')
const reviewEmptyTitle = computed(() => reviewFilter.value === 'failed' ? 'No failed pages' : 'No pages to review')
const reviewEmptyHelper = computed(() => reviewFilter.value === 'failed' ? 'All selected pages were fetched successfully.' : 'Discover and fetch pages to review them here.')

// ─── Actions ──────────────────────────────────────────────────────────────────

function discoverUrls() {
  domainError.value = ''
  discoveryError.value = ''
  if (!domain.value.trim()) {
    domainError.value = 'Enter a domain URL.'
    return
  }
  if (!/^https?:\/\/.+\..+/.test(domain.value.trim())) {
    domainError.value = 'Enter a valid URL, including https://.'
    return
  }

  workflowState.value = 'discovering'
  window.setTimeout(() => {
    if (domain.value.includes('invalid')) {
      discoveryError.value = 'The domain could not be reached. Check the URL and try again.'
      workflowState.value = 'idle'
      return
    }
    discoveredUrls.value = mockUrls.map((url) => ({ ...url, url: url.url.replace('help.example.com', sourceDomain.value) }))
    fetchedPages.value = []
    progress.value = createEmptyProgress()
    workflowState.value = 'discovered'
  }, 700)
}

function toggleSelectAll(checked: boolean) {
  discoveredUrls.value = discoveredUrls.value.map((url) => ({ ...url, isSelected: checked }))
}

function clearSelection() {
  toggleSelectAll(false)
}

function setUrlSelection(id: string, checked: boolean) {
  discoveredUrls.value = discoveredUrls.value.map((url) => url.id === id ? { ...url, isSelected: checked } : url)
}

function startFetch() {
  const selected = discoveredUrls.value.filter((url) => url.isSelected)
  if (!selected.length) return

  workflowState.value = 'fetching'
  reviewFilter.value = 'all'
  fetchedPages.value = selected.map((url, index) => createFetchedPage(url, index))
  progress.value = {
    sessionId: 'kb-session-demo',
    currentBatch: 1,
    totalBatches: Math.ceil(selected.length / 5),
    processed: 0,
    total: selected.length,
    percentage: 0,
    currentBatchUrls: fetchedPages.value.slice(0, 5).map((page) => ({ id: page.id, path: page.path, status: page.status })),
  }

  let tick = 0
  if (fetchTimer) window.clearInterval(fetchTimer)
  fetchTimer = window.setInterval(() => {
    tick += 1
    const processed = Math.min(tick, selected.length)
    fetchedPages.value = fetchedPages.value.map((page, index) => {
      if (index < processed) return { ...page, status: page.id === 'pricing' ? 'failed' : 'success', error: page.id === 'pricing' ? 'Connection timeout after 10s' : undefined }
      if (index < processed + 2) return { ...page, status: 'processing' }
      return { ...page, status: 'pending' }
    })

    const currentBatch = Math.max(1, Math.ceil(Math.max(processed, 1) / 5))
    const batchStart = (currentBatch - 1) * 5
    progress.value = {
      ...progress.value,
      currentBatch,
      processed,
      percentage: Math.round((processed / selected.length) * 100),
      currentBatchUrls: fetchedPages.value.slice(batchStart, batchStart + 5).map((page) => ({
        id: page.id,
        path: page.path,
        status: page.status,
        error: page.error,
      })),
    }

    if (processed === selected.length) {
      if (fetchTimer) window.clearInterval(fetchTimer)
      workflowState.value = 'review'
    }
  }, 450)
}

function stopFetch() {
  if (fetchTimer) window.clearInterval(fetchTimer)
  // Move to review with whatever has been fetched so far
  workflowState.value = 'review'
}

function createFetchedPage(url: DiscoveredUrl, index: number): FetchedPage {
  const content = `${url.title} explains how customers can use the product, resolve common questions, and find the next best action. This fetched content is reviewed before it becomes part of the chatbot knowledge base so low-quality or irrelevant pages do not affect chatbot answers.`
  return {
    id: url.id,
    url: url.url,
    path: url.path,
    title: url.title,
    contentPreview: `${content.slice(0, 150)}...`,
    content,
    charCount: [2450, 1830, 0, 1260, 940, 2100, 1660, 1510][index] ?? 1200,
    status: 'pending',
    isExpanded: false,
    isRemoved: false,
  }
}

function retryPage(id: string) {
  fetchedPages.value = fetchedPages.value.map((page) =>
    page.id === id ? { ...page, status: 'success', error: undefined, charCount: page.charCount || 1320 } : page
  )
}

function retryAllFailed() {
  fetchedPages.value = fetchedPages.value.map((page) =>
    page.status === 'failed' ? { ...page, status: 'success', error: undefined, charCount: page.charCount || 1320 } : page
  )
}

function removePage(id: string) {
  fetchedPages.value = fetchedPages.value.map((page) => page.id === id ? { ...page, isRemoved: true } : page)
}

function clearReview() {
  fetchedPages.value = fetchedPages.value.map((page) => ({ ...page, isRemoved: true }))
}

async function submitToKnowledgeBase() {
  submitError.value = ''
  workflowState.value = 'submitting'
  window.setTimeout(async () => {
    lastAddedCount.value = activeSuccessfulPages.value.length
    lastAddedCharacters.value = totalCharacters.value
    // Close modal first, then let Vue flush, then change step so the
    // re-render doesn't race with MpModalOverlay's exit animation.
    isConfirmOpen.value = false
    await nextTick()
    workflowState.value = 'success'
  }, 650)
}

function resetWorkflow() {
  workflowState.value = 'idle'
  discoveredUrls.value = []
  fetchedPages.value = []
  progress.value = createEmptyProgress()
  reviewFilter.value = 'all'
  isConfirmOpen.value = false
}

function createEmptyProgress(): FetchProgress {
  return {
    sessionId: 'kb-session-demo',
    currentBatch: 0,
    totalBatches: 0,
    processed: 0,
    total: 0,
    percentage: 0,
    currentBatchUrls: [],
  }
}

function statusIcon(status: FetchStatus): string {
  if (status === 'success') return 'done'
  if (status === 'failed') return 'close'
  if (status === 'processing') return 'refresh'
  return 'time'
}

function statusColor(status: FetchStatus): string {
  if (status === 'success') return 'success'
  if (status === 'failed') return 'danger'
  if (status === 'processing') return 'brand'
  return 'text.secondary'
}

onBeforeUnmount(() => {
  if (fetchTimer) window.clearInterval(fetchTimer)
})

// ─── CSS classes ──────────────────────────────────────────────────────────────
// No panelClass — content flows directly in contentAreaClass (background.neutral).
// White (background.default) is only used for item-level surfaces (url rows, batch list, review items).

// Stepper
const stepperClass = css({
  display: 'flex',
  alignItems: 'flex-start',
  mb: '8',
})

const stepWrapClass = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2',
  flexShrink: '0',
  width: '20', // 80px — enough for 2-line label
})

// Static structure for all step circles; colors come from stepCircleStyle()
const stepCircleWrapClass = css({
  width: '8',   // 32px
  height: '8',  // 32px
  rounded: 'full',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'semibold',
  fontSize: 'sm',
  flexShrink: '0',
  borderWidth: '1px',
  borderColor: 'transparent', // overridden by stepCircleStyle for pending state
  transition: 'background 0.2s, color 0.2s',
})

const stepLabelClass = css({
  textAlign: 'center',
  maxWidth: '80px',
})

// Connector line between step circles; mt=4 (16px) aligns with center of 32px circle
function connectorClass(step: number) {
  const isPast = currentStep.value > step
  return css({
    flex: '1',
    alignSelf: 'flex-start',
    mt: '4',  // 16px = half of 32px circle height → line sits at circle center
    borderTopWidth: '2px',
    borderColor: isPast ? 'border.default' : 'border.default',
    opacity: isPast ? '1' : '0.4',
  })
}

// Inline style for step circle — uses CSS vars for brand/success colors
function stepCircleStyle(step: number): Record<string, string> {
  const isDone = currentStep.value > step
  const isActive = currentStep.value === step
  if (isDone) {
    return {
      backgroundColor: 'var(--mp-colors-background-success-bold)',
      color: 'white',
      borderColor: 'transparent',
    }
  }
  if (isActive) {
    return {
      backgroundColor: 'var(--mp-colors-background-brand-bold)',
      color: 'white',
      borderColor: 'transparent',
    }
  }
  return {
    backgroundColor: 'var(--mp-colors-background-neutral)',
    color: 'var(--mp-colors-text-secondary)',
    borderColor: 'var(--mp-colors-border-default)',
  }
}

// Step footer — top border divider + single primary CTA
const stepFooterClass = css({
  borderTopWidth: '1px',
  borderColor: 'border.default',
  pt: '6',
  flexDirection: { base: 'column', md: 'row' },
  alignItems: { base: 'stretch', md: 'center' },
})

// Step 1 — domain discovery
const domainRowClass = css({ flexDirection: { base: 'column', md: 'row' } })
const domainControlClass = css({ flex: '1', width: '100%' })
const errorTextClass = css({ color: 'red.600' })
const errorPanelClass = css({ bg: 'red.50', borderLeftWidth: '3px', borderColor: 'red.500', rounded: 'md', p: '4' })
const skeletonRowClass = css({ h: '10', rounded: 'md', bg: 'gray.100' })
const selectionHeaderClass = css({
  flexDirection: { base: 'column', md: 'row' },
  alignItems: { base: 'flex-start', md: 'center' },
})
// Bordered scroll container for URL list — structural containment, not decorative card
const urlListClass = css({
  borderWidth: '1px',
  borderColor: 'border.default',
  rounded: 'md',
  overflow: 'hidden',
  maxHeight: '320px',
  overflowY: 'auto',
})
const urlTextClass = css({ minWidth: '0', flex: '1' })

// Step 2 — fetch progress
// White bg for batch list gives contrast against the neutral stage
const batchPanelClass = css({
  bg: 'background.default',
  rounded: 'md',
  p: '4',
})
const currentUrlClass = css({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: '1' })

// Step 3 — review
const reviewHeadRowClass = css({ flexDirection: { base: 'column', md: 'row' } })
const reviewToolbarClass = css({
  flexDirection: { base: 'column', md: 'row' },
  alignItems: { base: 'stretch', md: 'center' },
})
const filterClass = css({ width: { base: '100%', md: '220px' } })
const reviewTitleClass = css({ minWidth: '0', flex: '1' })
const showMoreClass = css({ alignSelf: 'flex-start' })

// Modal summary table
const modalSummaryClass = css({
  bg: 'background.neutral',
  borderWidth: '1px',
  borderColor: 'border.default',
  rounded: 'md',
  p: '4',
})

// Success
const successClass = css({ py: '16', textAlign: 'center' })
const successActionsClass = css({ flexDirection: { base: 'column', md: 'row' } })

// Review item — white card with left 3px accent bar (white-on-neutral IS correct layering)
function reviewItemClass(status: FetchStatus) {
  return css({
    bg: 'background.default',
    borderLeftWidth: '3px',
    borderColor: status === 'success' ? 'green.500' : 'red.500',
    rounded: 'sm',
    pl: '4',
    pr: '4',
    py: '3',
  })
}

// URL row — highlights selected rows in blue.50
function urlRowClass(isSelected: boolean) {
  return css({
    px: '4',
    py: '3',
    bg: isSelected ? 'blue.50' : 'background.default',
    borderBottomWidth: '1px',
    borderColor: 'border.default',
    transition: 'background 0.15s',
  })
}
</script>
