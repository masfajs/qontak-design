<template>
  <main data-pixel-component="PixelContent" v-bind="pixelContentAttrs">
    <MpFlex justify="space-between" align-items="center" px="6" py="1.063rem">
      <MpText size="h1" weight="semiBold">Commerce</MpText>
      <MpButton left-icon="add">Action</MpButton>
    </MpFlex>
    <div :class="contentAreaClass">
      <!-- place content here -->
      <MpFlex direction="column" alignItems="center" justify="center" gap="3" :style="{ minHeight: '320px' }">
        <MpText size="label" weight="semiBold">Commerce</MpText>
        <MpText size="label-small" color="text.secondary">Place content here...</MpText>
      </MpFlex>
    </div>
  </main>
</template>

<script setup lang="ts">
  import { MpButton, MpFlex, MpText, css } from '@mekari/pixel3'
  import { usePixelLayout } from '~/composables/usePixelLayout'

  definePageMeta({ layout: 'default' })
  const { pixelContentAttrs } = usePixelLayout()

  const contentAreaClass = css({
    bg: 'background.neutral',
    borderTopWidth: '1px',
    borderLeftWidth: '1px',
    borderColor: 'border.default',
    roundedTopLeft: 'md',
    p: 6,
    flexGrow: '1',
  })
</script>
