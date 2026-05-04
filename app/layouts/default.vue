<template>
  <!-- Sidebar -->
  <aside :class="sidebarClass">
    <!-- Logo zone -->
    <MpFlex
      align-items="center"
      px="4"
      gap="2"
      :class="logoZoneClass"
    >
      <div :class="logoMarkClass" />
      <MpText size="label" weight="semiBold" color="text.primary">Qontak</MpText>
    </MpFlex>

    <!-- Nav items -->
    <MpFlex direction="column" gap="1" px="2" py="3" :class="navListClass">
      <MpFlex
        v-for="item in navItems"
        :key="item.label"
        align-items="center"
        gap="3"
        px="3"
        py="2"
        :class="navItemClass(item.active)"
      >
        <div :class="navIconClass(item.active)" />
        <MpText size="body" :color="item.active ? 'text.primary' : 'text.secondary'">
          {{ item.label }}
        </MpText>
      </MpFlex>
    </MpFlex>

    <!-- User zone -->
    <MpFlex align-items="center" gap="2" px="4" py="4" :class="userZoneClass">
      <MpAvatar name="User" size="sm" variant-color="sky" />
      <MpFlex direction="column" gap="0">
        <MpText size="label" weight="semiBold" color="text.primary">User</MpText>
        <MpText size="body-small" color="text.secondary">user@mekari.com</MpText>
      </MpFlex>
    </MpFlex>
  </aside>

  <!-- Topbar -->
  <header :class="topbarClass">
    <MpFlex align-items="center" h="full" px="6" justify="space-between">
      <MpFlex align-items="center" gap="2">
        <MpText size="body" color="text.secondary">Home</MpText>
      </MpFlex>
      <MpFlex align-items="center" gap="2">
        <div :class="topbarIconClass" />
        <div :class="topbarIconClass" />
      </MpFlex>
    </MpFlex>
  </header>

  <!-- Page content slot -->
  <div :class="contentWrapperClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { MpFlex, MpText, MpAvatar, css } from '@mekari/pixel3'
  import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from '~/composables/usePixelLayout'

  const navItems = [
    { label: 'Dashboard', active: true },
    { label: 'Contacts', active: false },
    { label: 'Inbox', active: false },
    { label: 'Reports', active: false },
    { label: 'Settings', active: false },
  ]

  const sidebarClass = computed(() => css({
    position: 'fixed',
    top: '0',
    left: '0',
    h: '100svh',
    w: SIDEBAR_WIDTH,
    bg: 'background.surface',
    borderRightWidth: '1px',
    borderColor: 'border.default',
    display: 'flex',
    flexDirection: 'column',
    zIndex: '10',
    overflow: 'hidden',
  }))

  const logoZoneClass = computed(() => css({
    h: TOPBAR_HEIGHT,
    borderBottomWidth: '1px',
    borderColor: 'border.default',
    flexShrink: '0',
  }))

  const logoMarkClass = computed(() => css({
    w: '6',
    h: '6',
    rounded: 'md',
    bg: 'brand.mekari',
    flexShrink: '0',
  }))

  const navListClass = computed(() => css({
    flex: '1',
    overflowY: 'auto',
  }))

  function navItemClass(active: boolean) {
    return css({
      rounded: 'md',
      cursor: 'pointer',
      bg: active ? 'background.neutral' : 'transparent',
      _hover: { bg: 'background.neutral' },
      transition: 'background',
      transitionDuration: '150ms',
    })
  }

  function navIconClass(active: boolean) {
    return css({
      w: '6',
      h: '6',
      rounded: 'md',
      bg: active ? 'brand.mekari' : 'background.neutral',
      flexShrink: '0',
    })
  }

  const userZoneClass = computed(() => css({
    borderTopWidth: '1px',
    borderColor: 'border.default',
    flexShrink: '0',
  }))

  const topbarClass = computed(() => css({
    position: 'fixed',
    top: '0',
    left: SIDEBAR_WIDTH,
    right: '0',
    h: TOPBAR_HEIGHT,
    bg: 'background.surface',
    borderBottomWidth: '1px',
    borderColor: 'border.default',
    zIndex: '9',
  }))

  const topbarIconClass = computed(() => css({
    w: '8',
    h: '8',
    rounded: 'full',
    bg: 'background.neutral',
    cursor: 'pointer',
    _hover: { bg: 'border.default' },
  }))

  const contentWrapperClass = computed(() => css({
    marginLeft: SIDEBAR_WIDTH,
    paddingTop: TOPBAR_HEIGHT,
    minH: '100svh',
  }))
</script>
