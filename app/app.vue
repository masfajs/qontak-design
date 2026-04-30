<template>
  <NuxtPage />
</template>

<script setup lang="ts">
  import { MpFlex, MpText, MpButton, usePixelTheme } from '@mekari/pixel3'

  const { setNextTheme, isNextTheme } = usePixelTheme()

  setNextTheme(true) // Enable Design Token v2.4
</script>

