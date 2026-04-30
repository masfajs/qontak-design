<template>
  <MpFlex direction="column" gap="8" padding="8">
    <MpFlex direction="column" gap="1">
      <MpText size="h2">Knowledge Base – URL Fetcher</MpText>
      <MpText color="text.secondary">
        Discover and bulk-fetch pages from your website to build your chatbot knowledge base.
      </MpText>
    </MpFlex>

    <MpFlex gap="4" alignItems="center">
      <MpFlex
        v-for="(label, index) in STEPS"
        :key="index"
        gap="2"
        alignItems="center"
      >
        <MpFlex
          :class="css({
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'semibold',
            flexShrink: '0',
          })"
          :backgroundColor="STEP_BG[stepState(index)]"
          :style="{ color: stepState(index) === 'upcoming' ? '#6b7280' : 'white' }"
        >
          {{ stepState(index) === 'complete' ? '✓' : index + 1 }}
        </MpFlex>
        <MpText
          size="body-small"
          :color="stepState(index) === 'active' ? 'text.primary' : 'text.secondary'"
        >
          {{ label }}
        </MpText>
        <MpText v-if="index < STEPS.length - 1" size="body-small" color="text.secondary">
          →
        </MpText>
      </MpFlex>
    </MpFlex>

    <BulkFetcherDiscovery v-if="currentStep === 1" />
    <BulkFetcherProgress v-if="currentStep === 2" />
    <BulkFetcherReview v-if="currentStep === 3" />

    <MpFlex v-if="currentStep === 4" direction="column" gap="6">
      <MpBanner id="kb-success-banner" variant="success">
        <MpBannerIcon id="kb-success-banner-icon" />
        <MpBannerTitle id="kb-success-banner-title">
          {{ successCount }} pages added to Knowledge Base
        </MpBannerTitle>
        <MpBannerDescription id="kb-success-banner-desc">
          Your knowledge base has been updated and is ready for your chatbot to use.
        </MpBannerDescription>
      </MpBanner>

      <MpFlex gap="3">
        <MpButton variant="secondary">View Knowledge Base</MpButton>
        <MpButton variant="primary" @click="reset">Fetch More URLs</MpButton>
      </MpFlex>
    </MpFlex>
  </MpFlex>
</template>

<script setup lang="ts">
import {
  css,
  MpFlex,
  MpText,
  MpButton,
  MpBanner,
  MpBannerTitle,
  MpBannerDescription,
  MpBannerIcon,
} from '@mekari/pixel3'
import { useBulkFetcher } from '~/composables/useBulkFetcher'

const { currentStep, successCount, reset } = useBulkFetcher()

const STEPS = ['Discover Pages', 'Fetch Pages', 'Review & Add']
const STEP_BG = { active: 'brand.mekari', complete: 'green.400', upcoming: 'gray.200' } as const

function stepState(index: number): 'active' | 'complete' | 'upcoming' {
  if (currentStep.value === index + 1) return 'active'
  if (currentStep.value > index + 1) return 'complete'
  return 'upcoming'
}
</script>
