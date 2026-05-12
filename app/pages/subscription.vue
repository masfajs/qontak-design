<template>
  <MpTabs v-model="activeTab" :is-show-border="false" style="display: flex; flex-direction: column; flex-grow: 1">

    <!-- Tab list sits above the bordered content area -->
    <MpTabList id="tab-title" :class="css({ '& div': { marginBottom: '0' }})">
      <MpTab>Package</MpTab>
      <MpTab>Invoices</MpTab>
      <MpTab>Quota usage</MpTab>
    </MpTabList>

    <!-- Bordered content area below the tabs -->
    <div :class="contentAreaClass" style="padding: 0">
      <MpTabPanels>
        <!-- Package -->
        <MpTabPanel>
          <MpFlex direction="column" gap="4" p="6">

            <!-- Package info card -->
            <MpFlex
              borderWidth="1"
              borderColor="border.default"
              rounded="lg"
              p="6"
              gap="16"
            >
              <MpFlex direction="column" gap="1">
                <MpText size="label-small" color="text.secondary">Package name</MpText>
                <MpFlex alignItems="center" gap="2">
                  <MpText size="h2" weight="semiBold">Qontak 360</MpText>
                  <MpBadge for="additionalInformation" type="completed">Active</MpBadge>
                </MpFlex>
              </MpFlex>

              <MpFlex direction="column" gap="1">
                <MpText size="label-small" color="text.secondary">Renewal date</MpText>
                <MpText size="h2" weight="semiBold">12 July 2026</MpText>
              </MpFlex>
            </MpFlex>

            <!-- Quota table -->
            <MpTableContainer>
              <MpTable is-hoverable>
                <MpTableHead>
                  <MpTableRow>
                    <MpTableCell scope="col">Quota type</MpTableCell>
                    <MpTableCell scope="col">
                      <MpFlex alignItems="center" gap="1">
                        Initial
                        <MpIcon name="info" size="sm" color="icon.default" />
                      </MpFlex>
                    </MpTableCell>
                    <MpTableCell scope="col">Remaining initial</MpTableCell>
                    <MpTableCell scope="col">
                      <MpFlex alignItems="center" gap="1">
                        Remaining additional
                        <MpIcon name="info" size="sm" color="icon.default" />
                      </MpFlex>
                    </MpTableCell>
                    <MpTableCell scope="col">Total remaining</MpTableCell>
                  </MpTableRow>
                </MpTableHead>

                <MpTableBody>
                  <MpTableRow v-for="row in quotaRows" :key="row.type">
                    <MpTableCell as="td" scope="row">
                      <template v-if="row.subtitle">
                        {{ row.type }}
                        <MpText size="body-small" color="text.secondary">{{ row.subtitle }}</MpText>
                      </template>
                      <template v-else>{{ row.type }}</template>
                    </MpTableCell>
                    <MpTableCell as="td" scope="row">{{ row.initial }}</MpTableCell>
                    <MpTableCell as="td" scope="row">{{ row.remainingInitial }}</MpTableCell>
                    <MpTableCell as="td" scope="row">{{ row.remainingAdditional }}</MpTableCell>
                    <MpTableCell as="td" scope="row">{{ row.totalRemaining }}</MpTableCell>
                  </MpTableRow>
                </MpTableBody>
              </MpTable>
            </MpTableContainer>

          </MpFlex>
        </MpTabPanel>

        <!-- Invoices -->
        <MpTabPanel>
          <MpFlex p="6">
            <MpText color="text.secondary">Place content here...</MpText>
          </MpFlex>
        </MpTabPanel>

        <!-- Quota usage -->
        <MpTabPanel>
          <MpFlex p="6">
            <MpText color="text.secondary">Place content here...</MpText>
          </MpFlex>
        </MpTabPanel>
      </MpTabPanels>
    </div>
  </MpTabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  css,
  MpFlex, MpText, MpBadge, MpIcon,
  MpTabs, MpTabList, MpTab, MpTabPanels, MpTabPanel,
  MpTable, MpTableContainer, MpTableHead, MpTableBody, MpTableRow, MpTableCell,
} from '@mekari/pixel3'
import { contentAreaClass } from '~/composables/usePixelLayout'

definePageMeta({ layout: 'default', pageAction: { label: 'Top up quota', icon: null } })

const activeTab = ref(0)

const quotaRows = [
  {
    type: 'Ask Airene credits',
    subtitle: '',
    initial: '1.000',
    remainingInitial: '500',
    remainingAdditional: '0',
    totalRemaining: '500',
  },
  {
    type: 'Bot AI credits',
    subtitle: '',
    initial: '1.000',
    remainingInitial: '500',
    remainingAdditional: '0',
    totalRemaining: '500',
  },
  {
    type: 'Call balance',
    subtitle: '',
    initial: 'Rp1.000',
    remainingInitial: 'Rp500',
    remainingAdditional: '0',
    totalRemaining: 'Rp500',
  },
  {
    type: 'Call recording',
    subtitle: '',
    initial: '1.500 minutes',
    remainingInitial: '0',
    remainingAdditional: '1.500 minutes',
    totalRemaining: '1.500 minutes',
  },
  {
    type: 'E-commerce integration quota',
    subtitle: '',
    initial: '5',
    remainingInitial: '3',
    remainingAdditional: '0',
    totalRemaining: '2',
  },
  {
    type: 'Email campaign',
    subtitle: '',
    initial: '50.000',
    remainingInitial: '20.000',
    remainingAdditional: '10.000',
    totalRemaining: '40.000',
  },
  {
    type: 'Unique visitor',
    subtitle: '',
    initial: '1.000',
    remainingInitial: '200',
    remainingAdditional: '200',
    totalRemaining: '1.000',
  },
  {
    type: 'Users',
    subtitle: '',
    initial: '5',
    remainingInitial: '0',
    remainingAdditional: '2',
    totalRemaining: '2',
  },
  {
    type: 'WhatsApp balance',
    subtitle: 'Used by all WhatsApp business account.',
    initial: 'Rp2.000.000',
    remainingInitial: 'Rp1.000.000',
    remainingAdditional: 'Rp2.000.000',
    totalRemaining: 'Rp3.000.000',
  },
]
</script>

<style scoped>
:deep(.mp-tab-list__root) {
  height: fit-content;
}
:deep(.mp-tab-list__list) {
  padding: 0;
  padding-inline: var(--mp-spacing-6);
}
:deep(.mp-tab-list__list [role='tab']:not([aria-selected='true']):hover) {
  color: var(--mp-colors-text-link) !important;
  border-color: transparent !important;
  box-shadow: none !important;
}
</style>
