<template>
  <MpFlex
    as="button"
    alignItems="center"
    gap="2"
    :style="{
      backgroundColor: 'var(--mp-colors-background-success)',
      borderRadius: '999px',
      paddingLeft: '16px',
      paddingRight: '12px',
      paddingTop: '8px',
      paddingBottom: '8px',
      cursor: 'pointer',
      border: 'none',
      flexShrink: '0',
    }"
  >
    <MpText size="label" :style="{ color: 'var(--mp-colors-text-success)', whiteSpace: 'nowrap' }">
      Online
    </MpText>
    <MpIcon name="chevrons-down" size="sm" :style="{ '--mp-icon-color': 'var(--mp-colors-text-success)' }" />
  </MpFlex>
</template>

<script setup lang="ts">
  import { MpFlex, MpText, MpIcon } from '@mekari/pixel3'
</script>
