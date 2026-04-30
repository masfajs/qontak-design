<template>
  <MpFlex direction="column" gap="6">
    <MpFlex direction="column" gap="1">
      <MpText size="h3">Step 3: Review Results</MpText>
      <MpText color="text.secondary">
        {{ fetchedPages.length }} pages fetched. Review before adding to Knowledge Base.
      </MpText>
    </MpFlex>

    <!-- max 6 columns wide per design spec -->
    <MpFlex :class="css({ maxWidth: '600px' })">
      <MpFormControl id="filter-select">
        <MpFormLabel>Filter by status</MpFormLabel>
        <MpSelect v-model="reviewFilter" id="filter-select-input" is-full-width>
          <option value="all">All ({{ fetchedPages.length }})</option>
          <option value="success">Success ({{ successCount }})</option>
          <option value="failed">Failed ({{ failedCount }})</option>
        </MpSelect>
      </MpFormControl>
    </MpFlex>

    <MpFlex
      v-if="filteredPages.length === 0"
      direction="column"
      alignItems="center"
      gap="3"
      paddingY="12"
    >
      <MpText color="text.secondary">No pages to show for this filter.</MpText>
    </MpFlex>

    <MpFlex v-else direction="column" gap="4">
      <MpFlex
        v-for="page in filteredPages"
        :key="page.url"
        direction="column"
        gap="3"
        padding="4"
        borderWidth="1"
        borderColor="border.default"
        rounded="md"
      >
        <MpFlex justifyContent="space-between" alignItems="flex-start" gap="3">
          <MpFlex direction="column" gap="2" flexGrow="1">
            <MpFlex gap="2" alignItems="center" flexWrap="wrap">
              <MpBadge
                for="tableStatus"
                :type="page.status === 'success' ? 'completed' : 'critical'"
              >
                {{ page.status === 'success' ? 'Success' : 'Failed' }}
              </MpBadge>
              <MpText size="label">{{ page.title }}</MpText>
            </MpFlex>

            <MpFlex gap="2" alignItems="center" flexWrap="wrap">
              <MpText size="body-small" color="text.secondary">{{ page.url }}</MpText>
              <MpText v-if="page.status === 'success'" size="body-small" color="text.secondary">
                • {{ page.charCount.toLocaleString() }} chars
              </MpText>
              <MpText v-else size="body-small" color="text.danger">
                • {{ page.error }}
              </MpText>
            </MpFlex>
          </MpFlex>

          <MpButton
            variant="ghost"
            size="sm"
            left-icon="delete"
            aria-label="Remove page"
            @click="removePage(page.url)"
          />
        </MpFlex>

        <template v-if="page.status === 'success'">
          <MpText size="body-small" color="text.secondary">
            {{
              expandedUrls.has(page.url)
                ? page.content
                : page.content.slice(0, 200) + (page.content.length > 200 ? '...' : '')
            }}
          </MpText>
          <MpButton
            v-if="page.content.length > 200"
            variant="textLink"
            size="sm"
            @click="toggleExpand(page.url)"
          >
            {{ expandedUrls.has(page.url) ? 'Show Less' : 'Show More' }}
          </MpButton>
        </template>

        <MpButton
          v-if="page.status === 'failed'"
          variant="secondary"
          size="sm"
          @click="retrySinglePage(page.url)"
        >
          Retry
        </MpButton>
      </MpFlex>
    </MpFlex>

    <MpFlex gap="3" paddingTop="2">
      <MpButton
        v-if="failedCount > 0"
        variant="secondary"
        @click="retryFailed"
      >
        Retry All Failed ({{ failedCount }})
      </MpButton>
      <MpButton
        variant="primary"
        :is-disabled="successCount === 0"
        @click="showConfirmModal = true"
      >
        Add {{ successCount }} Pages to Knowledge Base
      </MpButton>
    </MpFlex>

    <BulkFetcherConfirmModal
      :is-open="showConfirmModal"
      :success-count="successCount"
      :total-chars="totalChars"
      :domain="domain"
      @close="showConfirmModal = false"
    />
  </MpFlex>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { css, MpFlex, MpText, MpButton, MpSelect, MpBadge, MpFormControl, MpFormLabel } from '@mekari/pixel3'
import { useBulkFetcher } from '~/composables/useBulkFetcher'

const {
  domain,
  fetchedPages,
  reviewFilter,
  filteredPages,
  successCount,
  failedCount,
  totalChars,
  removePage,
  retrySinglePage,
  retryFailed,
} = useBulkFetcher()

const showConfirmModal = ref(false)
const expandedUrls = ref(new Set<string>())

function toggleExpand(url: string) {
  const next = new Set(expandedUrls.value)
  if (next.has(url)) {
    next.delete(url)
  } else {
    next.add(url)
  }
  expandedUrls.value = next
}
</script>
