<template>
  <MpTabs
    v-model="activeTab"
    :is-show-border="false"
    :class="tabsClass"
  >
    <MpTabList id="campaign-template-tabs" :class="tabListClass">
      <MpTab>WhatsApp</MpTab>
      <MpTab>Email</MpTab>
    </MpTabList>

    <div :class="templatesAreaClass">
      <MpTabPanels>
        <MpTabPanel>
          <MpFlex direction="column" gap="4">
            <MpFlex direction="column" gap="1">
              <MpText size="h2" weight="semiBold">WhatsApp template</MpText>
              <MpText color="text.secondary">
                Create template to send campaign and follow up messages to your customers.
                <MpText as="span" color="text.link">Learn more</MpText>
              </MpText>
            </MpFlex>

            <MpFlex alignItems="center" justifyContent="space-between" gap="4" :class="filterBarClass">
              <MpFlex alignItems="center" gap="3" :class="filterGroupClass">
                <MpSelect
                  v-model="typeFilter"
                  id="template-type-filter"
                  placeholder="All types"
                  is-full-width
                >
                  <option value="Campaign">Campaign</option>
                  <option value="Follow up">Follow up</option>
                </MpSelect>

                <MpSelect
                  v-model="categoryFilter"
                  id="template-category-filter"
                  placeholder="All categories"
                  is-full-width
                >
                  <option value="Marketing">Marketing</option>
                  <option value="Utility">Utility</option>
                  <option value="Authentication">Authentication</option>
                </MpSelect>

                <MpSelect
                  v-model="statusFilter"
                  id="template-status-filter"
                  placeholder="All status"
                  is-full-width
                >
                  <option value="In review">In review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Disabled">Disabled</option>
                  <option value="Draft">Draft</option>
                </MpSelect>
              </MpFlex>

              <MpFormControl id="template-search" :class="searchControlClass">
                <MpInput
                  id="template-search-input"
                  v-model="searchQuery"
                  placeholder="Search template name..."
                  left-icon="search"
                  is-clearable
                  is-full-width
                />
              </MpFormControl>
            </MpFlex>

            <MpTableContainer has-shadow :class="tableContainerClass">
              <MpTable is-hoverable>
                <MpTableHead>
                  <MpTableRow>
                    <MpTableCell scope="col" :class="checkboxCellClass">
                      <MpCheckbox id="select-all-templates" />
                    </MpTableCell>
                    <MpTableCell scope="col" :class="nameCellClass">Template name</MpTableCell>
                    <MpTableCell scope="col" :class="typeCellClass">Type</MpTableCell>
                    <MpTableCell scope="col" :class="categoryCellClass">Category</MpTableCell>
                    <MpTableCell scope="col" :class="statusCellClass">
                      <MpFlex alignItems="center" gap="1">
                        Status
                        <MpIcon name="info" size="sm" color="icon.default" />
                      </MpFlex>
                    </MpTableCell>
                    <MpTableCell scope="col" :class="qualityCellClass">
                      <MpFlex alignItems="center" gap="1">
                        Quality
                        <MpIcon name="info" size="sm" color="icon.default" />
                      </MpFlex>
                    </MpTableCell>
                    <MpTableCell scope="col" :class="languageCellClass">Language</MpTableCell>
                    <MpTableCell scope="col" :class="actionCellClass" />
                  </MpTableRow>
                </MpTableHead>

                <MpTableBody>
                  <MpTableRow v-for="template in paginatedTemplates" :key="template.name">
                    <MpTableCell as="td" scope="row" :class="checkboxCellClass">
                      <MpCheckbox :id="`select-${template.name}`" />
                    </MpTableCell>
                    <MpTableCell as="td" scope="row" :class="nameCellClass">
                      <MpText
                        color="text.link"
                        :class="template.name.length > 32 ? templateNameLongClass : templateNameClass"
                      >
                        {{ template.name }}
                      </MpText>
                    </MpTableCell>
                    <MpTableCell as="td" scope="row" :class="typeCellClass">{{ template.type }}</MpTableCell>
                    <MpTableCell as="td" scope="row" :class="categoryCellClass">{{ template.category }}</MpTableCell>
                    <MpTableCell as="td" scope="row" :class="statusCellClass">
                      <MpBadge for="tableStatus" :type="statusBadgeType(template.status)">
                        {{ template.status }}
                      </MpBadge>
                    </MpTableCell>
                    <MpTableCell as="td" scope="row" :class="qualityCellClass">
                      <MpFlex alignItems="center" gap="2">
                        <span :class="qualityDotClass(template.quality)" />
                        <MpText>{{ template.quality }}</MpText>
                      </MpFlex>
                    </MpTableCell>
                    <MpTableCell as="td" scope="row" :class="languageCellClass">{{ template.language }}</MpTableCell>
                    <MpTableCell as="td" scope="row" :class="actionCellClass">
                      <MpButton variant="secondary" size="sm" right-icon="chevrons-down">
                        Action
                      </MpButton>
                    </MpTableCell>
                  </MpTableRow>

                  <MpTableRow v-if="paginatedTemplates.length === 0">
                    <MpTableCell as="td" scope="row" :class="emptyCellClass">
                      <MpFlex direction="column" alignItems="center" gap="1" py="8">
                        <MpText weight="semiBold">No templates found</MpText>
                        <MpText color="text.secondary">Try changing the filters or search keyword.</MpText>
                      </MpFlex>
                    </MpTableCell>
                  </MpTableRow>
                </MpTableBody>
              </MpTable>
            </MpTableContainer>

            <Pixel.div px="2" py="4">
              <MpFlex justifyContent="space-between" alignItems="center" gap="4" :class="paginationClass">
                <MpFlex alignItems="center" gap="3" :class="paginationLeftClass">
                  <MpText color="text.secondary">Rows per page</MpText>
                  <MpPopover is-close-on-select>
                    <MpPopoverTrigger>
                      <MpButton size="sm" variant="ghost" :class="rowsButtonClass">
                        <MpText>{{ rowsPerPage }}</MpText>
                        <MpIcon name="chevrons-down" size="sm" />
                      </MpButton>
                    </MpPopoverTrigger>
                    <MpPopoverContent>
                      <MpPopoverList>
                        <MpPopoverListItem
                          v-for="option in rowsPerPageOptions"
                          :key="option"
                          :is-active="rowsPerPage === option"
                          @click="rowsPerPage = option"
                        >
                          {{ option }}
                        </MpPopoverListItem>
                      </MpPopoverList>
                    </MpPopoverContent>
                  </MpPopover>

                  <MpText color="text.secondary">
                    Showing {{ showingStart }}-{{ showingEnd }} of {{ filteredTemplates.length }}
                  </MpText>
                </MpFlex>

                <MpFlex alignItems="center" gap="2" :class="paginationRightClass">
                  <MpSelect
                    id="template-page-select"
                    size="sm"
                    :model-value="String(currentPage)"
                    :class="pageSelectClass"
                    @change="handlePageChange"
                  >
                    <option v-for="page in totalPages" :key="page" :value="String(page)">
                      {{ page }}
                    </option>
                  </MpSelect>
                  <MpText color="text.secondary" :class="pageCountClass">of {{ totalPages }} pages</MpText>
                  <MpTooltip label="Previous page" position="bottom">
                    <MpButton
                      variant="ghost"
                      left-icon="chevrons-left"
                      size="sm"
                      :is-disabled="currentPage === 1"
                      @click="prevPage"
                    />
                  </MpTooltip>
                  <MpTooltip label="Next page" position="bottom">
                    <MpButton
                      variant="ghost"
                      left-icon="chevrons-right"
                      size="sm"
                      :is-disabled="currentPage === totalPages"
                      @click="nextPage"
                    />
                  </MpTooltip>
                </MpFlex>
              </MpFlex>
            </Pixel.div>
          </MpFlex>
        </MpTabPanel>

        <MpTabPanel>
          <MpFlex direction="column" alignItems="center" gap="1" py="12">
            <MpText weight="semiBold">Email templates</MpText>
            <MpText color="text.secondary">Place content here...</MpText>
          </MpFlex>
        </MpTabPanel>
      </MpTabPanels>
    </div>
  </MpTabs>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Pixel,
  css,
  MpBadge,
  MpButton,
  MpCheckbox,
  MpFlex,
  MpFormControl,
  MpIcon,
  MpInput,
  MpPopover,
  MpPopoverContent,
  MpPopoverList,
  MpPopoverListItem,
  MpPopoverTrigger,
  MpSelect,
  MpTab,
  MpTabList,
  MpTabPanel,
  MpTabPanels,
  MpTable,
  MpTableBody,
  MpTableCell,
  MpTableContainer,
  MpTableHead,
  MpTableRow,
  MpTabs,
  MpText,
  MpTooltip,
} from '@mekari/pixel3'

definePageMeta({ layout: 'default', pageAction: { label: 'Create template', icon: null } })

type TemplateStatus = 'In review' | 'Approved' | 'Rejected' | 'Disabled' | 'Draft'
type TemplateQuality = 'Neutral' | 'Medium' | 'High' | 'Low'

type TemplateRow = {
  name: string
  type: 'Campaign' | 'Follow up'
  category: 'Marketing' | 'Utility' | 'Authentication'
  status: TemplateStatus
  quality: TemplateQuality
  language: 'ID' | 'EN_US'
}

const activeTab = ref(0)
const typeFilter = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const searchQuery = ref('')
const rowsPerPage = ref(10)
const currentPage = ref(1)
const rowsPerPageOptions = [10, 25, 50, 100]

const templates: TemplateRow[] = [
  {
    name: 'promo_diskon_september',
    type: 'Campaign',
    category: 'Marketing',
    status: 'In review',
    quality: 'Neutral',
    language: 'ID',
  },
  {
    name: 'promo_tanggal_kembar',
    type: 'Campaign',
    category: 'Marketing',
    status: 'Approved',
    quality: 'Neutral',
    language: 'ID',
  },
  {
    name: 'faq_update',
    type: 'Campaign',
    category: 'Utility',
    status: 'Approved',
    quality: 'Medium',
    language: 'ID',
  },
  {
    name: 'payment_reminder',
    type: 'Follow up',
    category: 'Utility',
    status: 'Rejected',
    quality: 'High',
    language: 'EN_US',
  },
  {
    name: 'annual_membership_discount_promo_for_loyal_customers_with_points',
    type: 'Campaign',
    category: 'Authentication',
    status: 'Approved',
    quality: 'Neutral',
    language: 'ID',
  },
  {
    name: 'promo_hari_kemerdekaan',
    type: 'Campaign',
    category: 'Marketing',
    status: 'Disabled',
    quality: 'High',
    language: 'ID',
  },
  {
    name: 'holiday_special_offer',
    type: 'Campaign',
    category: 'Marketing',
    status: 'Draft',
    quality: 'High',
    language: 'ID',
  },
  {
    name: 'idle_customer',
    type: 'Follow up',
    category: 'Marketing',
    status: 'Approved',
    quality: 'High',
    language: 'ID',
  },
  {
    name: 'customer_survey_incentive',
    type: 'Campaign',
    category: 'Utility',
    status: 'Approved',
    quality: 'Medium',
    language: 'ID',
  },
  {
    name: 'limited_time_flash_sale',
    type: 'Campaign',
    category: 'Marketing',
    status: 'Approved',
    quality: 'Low',
    language: 'ID',
  },
]

const filteredTemplates = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return templates.filter((template) => {
    const matchesType = !typeFilter.value || template.type === typeFilter.value
    const matchesCategory = !categoryFilter.value || template.category === categoryFilter.value
    const matchesStatus = !statusFilter.value || template.status === statusFilter.value
    const matchesSearch = !keyword || template.name.toLowerCase().includes(keyword)

    return matchesType && matchesCategory && matchesStatus && matchesSearch
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTemplates.value.length / rowsPerPage.value))
)

const paginatedTemplates = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  return filteredTemplates.value.slice(start, start + rowsPerPage.value)
})

const showingStart = computed(() =>
  filteredTemplates.value.length === 0 ? 0 : (currentPage.value - 1) * rowsPerPage.value + 1
)

const showingEnd = computed(() =>
  Math.min(currentPage.value * rowsPerPage.value, filteredTemplates.value.length)
)

watch([filteredTemplates, rowsPerPage], () => {
  currentPage.value = 1
})

function handlePageChange(event: Event) {
  currentPage.value = Number((event.target as HTMLSelectElement).value)
}

function prevPage() {
  currentPage.value = Math.max(1, currentPage.value - 1)
}

function nextPage() {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1)
}

function statusBadgeType(status: TemplateStatus) {
  const badgeTypes: Record<TemplateStatus, 'warning' | 'completed' | 'critical' | 'announcement'> = {
    'In review': 'warning',
    Approved: 'completed',
    Rejected: 'critical',
    Disabled: 'critical',
    Draft: 'announcement',
  }

  return badgeTypes[status]
}

function qualityDotClass(quality: TemplateQuality) {
  return [
    qualityDotBaseClass,
    quality === 'Neutral' && qualityDotNeutralClass,
    quality === 'Medium' && qualityDotMediumClass,
    quality === 'High' && qualityDotHighClass,
    quality === 'Low' && qualityDotLowClass,
  ]
}

const tabsClass = css({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
})

const tabListClass = css({
  px: '6',
  '& div': { mb: 0 },
})

const templatesAreaClass = css({
  bg: 'background.neutral',
  borderTopWidth: '1px',
  borderLeftWidth: '1px',
  borderColor: 'border.default',
  roundedTopLeft: 'md',
  p: 6,
  flexGrow: 1,
})

const filterBarClass = css({
  flexWrap: 'wrap',
})

const filterGroupClass = css({
  '& > *': {
    width: '180px',
  },
})

const searchControlClass = css({
  width: '260px',
  ml: 'auto',
})

const tableContainerClass = css({
  overflow: 'auto',
})

const checkboxCellClass = css({
  width: '44px',
  minWidth: '44px',
})

const nameCellClass = css({
  minWidth: '240px',
})

const typeCellClass = css({
  minWidth: '140px',
})

const categoryCellClass = css({
  minWidth: '140px',
})

const statusCellClass = css({
  minWidth: '112px',
})

const qualityCellClass = css({
  minWidth: '104px',
})

const languageCellClass = css({
  minWidth: '88px',
})

const actionCellClass = css({
  minWidth: '116px',
  textAlign: 'right',
})

const emptyCellClass = css({
  textAlign: 'center',
})

const templateNameClass = css({
  cursor: 'pointer',
  whiteSpace: 'nowrap',
})

const templateNameLongClass = css({
  cursor: 'pointer',
  maxWidth: '240px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'normal',
})

const qualityDotBaseClass = css({
  display: 'inline-block',
  width: '8px',
  height: '8px',
  rounded: 'full',
  flexShrink: 0,
})

const qualityDotNeutralClass = css({
  bg: 'icon.disabled',
})

const qualityDotMediumClass = css({
  bg: 'icon.warning',
})

const qualityDotHighClass = css({
  bg: 'icon.success',
})

const qualityDotLowClass = css({
  bg: 'icon.danger',
})

const paginationClass = css({
  flexWrap: 'wrap',
})

const paginationLeftClass = css({
  flexWrap: 'wrap',
})

const paginationRightClass = css({
  flexShrink: 0,
})

const rowsButtonClass = css({
  h: '7',
  display: 'inline-flex',
  pl: '3',
  pr: '2',
  py: '2',
})

const pageSelectClass = css({
  width: '76px',
})

const pageCountClass = css({
  whiteSpace: 'nowrap',
})
</script>
