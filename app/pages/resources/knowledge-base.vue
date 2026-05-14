<template>
  <div :class="contentAreaClass">
    <MpText color="text.secondary">Place content here...</MpText>
  </div>
</template>

<script setup lang="ts">
  import { MpText } from '@mekari/pixel3'
  import { contentAreaClass } from '~/composables/usePixelLayout'

  definePageMeta({ layout: 'default' })
</script>
