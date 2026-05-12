<template>
  <div :class="contentAreaClass">

    <!-- Stats row -->
    <MpFlex
      borderWidth="1"
      borderColor="border.default"
      rounded="md"
      mb="6"
      overflow="hidden"
    >
      <MpFlex
        v-for="(stat, i) in stats"
        :key="stat.label"
        direction="column"
        gap="1"
        px="6"
        py="4"
        flex="1"
        :borderLeftWidth="i > 0 ? '1' : '0'"
        borderColor="border.default"
      >
        <MpText size="body-small" color="text.secondary">{{ stat.label }}</MpText>
        <MpText size="h2" weight="semiBold">{{ stat.value }}</MpText>
      </MpFlex>
    </MpFlex>

    <!-- Filter bar -->
    <MpFlex alignItems="center" mb="4" gap="4">
      <MpFlex :class="css({ width: '180px', flexShrink: '0' })">
        <MpSelect v-model="statusFilter" id="status-filter" is-full-width>
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </MpSelect>
      </MpFlex>

      <MpFlex flex="1" justifyContent="flex-end">
        <MpFormControl id="agent-search" :class="css({ width: '260px' })">
          <MpInput
            id="agent-search-input"
            v-model="searchQuery"
            placeholder="Search..."
            left-icon="search"
            is-full-width
          />
        </MpFormControl>
      </MpFlex>
    </MpFlex>

    <!-- Table -->
    <MpTableContainer>
      <MpTable is-hoverable>
        <MpTableHead>
          <MpTableRow>
            <MpTableCell scope="col">AI agent name</MpTableCell>
            <MpTableCell scope="col">
              <MpFlex alignItems="center" gap="1">
                Accuracy rate
                <MpIcon name="info" size="sm" color="icon.default" />
              </MpFlex>
            </MpTableCell>
            <MpTableCell scope="col">Status</MpTableCell>
            <MpTableCell scope="col">Usage</MpTableCell>
            <MpTableCell scope="col">
              <MpFlex alignItems="center" gap="1">
                Last updated
                <MpIcon name="sort-descending" size="sm" color="icon.default" />
              </MpFlex>
            </MpTableCell>
            <MpTableCell scope="col" />
          </MpTableRow>
        </MpTableHead>

        <MpTableBody>
          <MpTableRow v-for="agent in filteredAgents" :key="agent.name">
            <MpTableCell as="td" scope="row">{{ agent.name }}</MpTableCell>
            <MpTableCell as="td" scope="row">
              <MpFlex alignItems="center" gap="2">
                <MpText size="body">{{ agent.accuracy }}%</MpText>
                <MpBadge
                  for="tableStatus"
                  :type="agent.accuracyStatus === 'Passed' ? 'completed' : 'warning'"
                >{{ agent.accuracyStatus }}</MpBadge>
              </MpFlex>
            </MpTableCell>
            <MpTableCell as="td" scope="row">
              <MpBadge
                for="tableStatus"
                :type="agent.status === 'Active' ? 'completed' : 'announcement'"
              >{{ agent.status }}</MpBadge>
            </MpTableCell>
            <MpTableCell as="td" scope="row">
              <MpText
                v-if="agent.usage !== '-'"
                size="body"
                color="text.link"
                :class="css({ cursor: 'pointer', _hover: { textDecoration: 'underline' } })"
              >{{ agent.usage }}</MpText>
              <MpText v-else size="body" color="text.secondary">-</MpText>
            </MpTableCell>
            <MpTableCell as="td" scope="row">
              <MpText size="body" color="text.default">{{ agent.lastUpdated }}</MpText>
            </MpTableCell>
            <MpTableCell as="td" scope="row" :class="css({ textAlign: 'right' })">
              <MpButton variant="secondary" size="sm" right-icon="chevrons-down">
                Actions
              </MpButton>
            </MpTableCell>
          </MpTableRow>
        </MpTableBody>
      </MpTable>
    </MpTableContainer>

    <!-- Pagination -->
    <Pixel.div px="2" py="4">
      <MpFlex justify="space-between">
        <MpFlex align="center">
          <MpText :class="css({ pr: '1', pl: '1' })" color="text.secondary">Rows per page</MpText>
          <MpPopover is-close-on-select>
            <MpPopoverTrigger>
              <MpButton
                size="sm"
                variant="ghost"
                :class="css({ h: '7', display: 'inline-flex', pl: '3', pr: '2', py: '2' })"
              >
                <MpText>{{ rowsPerPage }}</MpText>
                <MpIcon name="chevrons-down" size="sm" />
              </MpButton>
            </MpPopoverTrigger>
            <MpPopoverContent>
              <MpPopoverList>
                <MpPopoverListItem
                  v-for="opt in [10, 25, 50, 100]"
                  :key="opt"
                  :is-active="rowsPerPage === opt"
                  @click="rowsPerPage = opt"
                >{{ opt }}</MpPopoverListItem>
              </MpPopoverList>
            </MpPopoverContent>
          </MpPopover>

          <MpText :class="css({ pl: '5', py: '1' })" color="text.secondary">
            Showing {{ showingStart }}-{{ showingEnd }} of {{ filteredAgents.length }}
          </MpText>
        </MpFlex>

        <MpFlex alignItems="center">
          <MpFlex :class="css({ flexShrink: '0' })">
            <MpSelect
              size="sm"
              :model-value="String(currentPage)"
              @change="(e: Event) => currentPage = Number((e.target as HTMLSelectElement).value)"
            >
              <option v-for="p in totalPages" :key="p" :value="String(p)">{{ p }}</option>
            </MpSelect>
          </MpFlex>
          <MpText :class="css({ pl: '2', pr: '4', py: '1', whiteSpace: 'nowrap' })" color="text.secondary">
            of {{ totalPages }} page
          </MpText>
          <MpTooltip label="Prev page" position="bottom">
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

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Pixel,
  css,
  MpFlex, MpText, MpBadge, MpIcon, MpButton,
  MpSelect, MpInput, MpFormControl,
  MpTooltip,
  MpPopover, MpPopoverTrigger, MpPopoverContent, MpPopoverList, MpPopoverListItem,
  MpTable, MpTableContainer, MpTableHead, MpTableBody, MpTableRow, MpTableCell,
} from '@mekari/pixel3'
import { contentAreaClass } from '~/composables/usePixelLayout'

definePageMeta({ layout: 'default', pageAction: { label: 'Create AI agent', icon: null } })

const statusFilter = ref('all')
const searchQuery = ref('')
const rowsPerPage = ref(10)
const currentPage = ref(1)

const agents = [
  { name: 'Customer support', accuracy: 30, accuracyStatus: 'Need review', status: 'Active', usage: '1', lastUpdated: '15 Mar 2024 at 16:00' },
  { name: 'Sales agent',      accuracy: 80, accuracyStatus: 'Passed',      status: 'Active', usage: '2', lastUpdated: '14 Mar 2024 at 17:00' },
  { name: 'Lead generation',  accuracy: 50, accuracyStatus: 'Need review', status: 'Inactive', usage: '-', lastUpdated: '14 Mar 2024 at 17:00' },
]

const stats = computed(() => [
  { label: 'Total created', value: `${agents.length} agents` },
  { label: 'Active',        value: `${agents.filter(a => a.status === 'Active').length} agents` },
  { label: 'Inactive',      value: `${agents.filter(a => a.status === 'Inactive').length} agent` },
])

const filteredAgents = computed(() => {
  return agents.filter(agent => {
    const matchesStatus =
      statusFilter.value === 'all' ||
      agent.status.toLowerCase() === statusFilter.value
    const matchesSearch =
      !searchQuery.value ||
      agent.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesStatus && matchesSearch
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredAgents.value.length / rowsPerPage.value))
)

const pageOptions = computed(() =>
  Array.from({ length: totalPages.value }, (_, i) => String(i + 1))
)

const showingStart = computed(() =>
  filteredAgents.value.length === 0 ? 0 : (currentPage.value - 1) * rowsPerPage.value + 1
)

const showingEnd = computed(() =>
  Math.min(currentPage.value * rowsPerPage.value, filteredAgents.value.length)
)

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>
