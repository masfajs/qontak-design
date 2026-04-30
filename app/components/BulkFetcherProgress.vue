<template>
  <MpFlex direction="column" gap="6">
    <MpFlex direction="column" gap="1">
      <MpText size="h3">Step 2: Fetching Pages</MpText>
      <MpText color="text.secondary">Please wait while we fetch the selected pages.</MpText>
    </MpFlex>

    <!-- Progress bar block -->
    <MpFlex direction="column" gap="3">
      <MpFlex justifyContent="space-between" alignItems="center">
        <MpFlex gap="2" alignItems="center">
          <MpSpinner size="sm" />
          <MpText size="label">Fetching pages...</MpText>
        </MpFlex>
        <MpText size="label" color="text.secondary">{{ progress.percentage }}%</MpText>
      </MpFlex>

      <MpProgress :value="progress.percentage" variant="linear" color="information" />

      <MpFlex gap="2" alignItems="center">
        <MpText size="body-small" color="text.secondary">
          Batch {{ progress.currentBatch }} of {{ progress.totalBatches }}
          &nbsp;•&nbsp;
          {{ progress.processed }}/{{ progress.total }} pages fetched
        </MpText>
        <MpBadge
          v-if="progress.failedCount > 0"
          for="additionalInformation"
          type="warning"
          size="sm"
        >
          {{ progress.failedCount }} failed
        </MpBadge>
      </MpFlex>
    </MpFlex>

    <!-- Current batch status list -->
    <MpFlex
      v-if="progress.currentBatchUrls.length > 0"
      direction="column"
      gap="3"
      paddingX="4"
      paddingY="3"
      backgroundColor="background.subtle"
      borderWidth="1"
      borderColor="border.default"
      rounded="md"
    >
      <MpText size="label">Currently fetching:</MpText>
      <MpFlex direction="column" gap="2">
        <MpFlex
          v-for="item in progress.currentBatchUrls"
          :key="item.url"
          gap="3"
          alignItems="center"
        >
          <!-- Status indicator -->
          <MpSpinner v-if="item.status === 'processing'" size="sm" />
          <MpBadge
            v-else-if="item.status === 'complete'"
            for="indicator"
            type="completed"
          />
          <MpBadge
            v-else-if="item.status === 'failed'"
            for="indicator"
            type="critical"
          />
          <MpBadge
            v-else
            for="indicator"
            type="information"
          />

          <MpText size="body-small" :color="item.status === 'failed' ? 'text.danger' : 'text.primary'">
            {{ item.url }}
          </MpText>
        </MpFlex>
      </MpFlex>
    </MpFlex>
  </MpFlex>
</template>

<script setup lang="ts">
import { MpFlex, MpText, MpProgress, MpSpinner, MpBadge } from '@mekari/pixel3'
import { useBulkFetcher } from '~/composables/useBulkFetcher'

const { progress } = useBulkFetcher()
</script>
