<template>
  <main data-pixel-component="PixelContent" v-bind="pixelContentAttrs">

    <MpFlex justify="space-between" align-items="center" px="6" py="1.063rem">
      <MpText size="h1" weight="semiBold">Email Advanced Campaigns</MpText>
      <MpButton left-icon="add">Create Campaign</MpButton>
    </MpFlex>

    <div :class="contentAreaClass">
      <MpFlex
        direction="column"
        alignItems="center"
        justify="center"
        gap="3"
        :style="{ minHeight: '320px' }"
      >
        <MpIcon name="doc" size="sm" color="icon.default" />
        <MpFlex direction="column" alignItems="center" gap="1">
          <MpText size="label" weight="semiBold">No advanced email campaigns yet</MpText>
          <MpText size="label-small" color="text.secondary">Create your first advanced email campaign</MpText>
        </MpFlex>
        <MpButton variant="secondary" left-icon="add">Create Campaign</MpButton>
      </MpFlex>
    </div>

  </main>
</template>

<script setup lang="ts">
  import { MpButton, MpFlex, MpText, MpIcon, css } from '@mekari/pixel3'
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
