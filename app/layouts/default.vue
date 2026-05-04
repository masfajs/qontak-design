<template>
  <!-- Sidebar (fixed left) -->
  <aside :style="sidebarStyle">
    <!-- Logo zone -->
    <MpFlex
      alignItems="center"
      gap="2"
      paddingX="4"
      :style="logoZoneStyle"
    >
      <div :class="logoMarkClass" />
      <MpText size="label" weight="semiBold" color="text.primary">Qontak</MpText>
    </MpFlex>

    <!-- Nav items -->
    <MpFlex
      direction="column"
      gap="1"
      paddingX="2"
      paddingY="3"
      :style="{ flex: '1', overflowY: 'auto' }"
    >
      <MpFlex
        v-for="item in navItems"
        :key="item.label"
        alignItems="center"
        gap="3"
        paddingX="3"
        paddingY="2"
        :backgroundColor="item.active ? 'background.neutral' : undefined"
        :style="{ borderRadius: '6px', cursor: 'pointer' }"
        :class="item.active ? '' : navItemHoverClass"
      >
        <MpIcon :name="item.icon" size="sm" :color="item.active ? 'brand.mekari' : 'icon.secondary'" />
        <MpText size="body" :color="item.active ? 'text.primary' : 'text.secondary'">
          {{ item.label }}
        </MpText>
      </MpFlex>
    </MpFlex>

    <!-- User zone -->
    <MpFlex
      alignItems="center"
      gap="3"
      paddingX="4"
      paddingY="3"
      :style="userZoneStyle"
    >
      <MpAvatar name="User" size="sm" variant-color="sky" />
      <MpFlex direction="column">
        <MpText size="label" weight="semiBold" color="text.primary">User</MpText>
        <MpText size="body-small" color="text.secondary">user@mekari.com</MpText>
      </MpFlex>
    </MpFlex>
  </aside>

  <!-- Topbar (fixed top-right) -->
  <header :style="topbarStyle">
    <MpFlex
      alignItems="center"
      justifyContent="space-between"
      paddingX="6"
      :style="{ height: '100%' }"
    >
      <MpFlex alignItems="center" gap="2">
        <MpText size="body-small" color="text.secondary">Home</MpText>
      </MpFlex>
      <MpFlex alignItems="center" gap="2">
        <MpFlex
          alignItems="center"
          justifyContent="center"
          :style="{ width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }"
          :class="iconHoverClass"
        >
          <MpIcon name="bell" size="sm" color="icon.secondary" />
        </MpFlex>
        <MpAvatar name="User" size="sm" variant-color="sky" />
      </MpFlex>
    </MpFlex>
  </header>

  <!-- Page content (offset to sit beside sidebar + below topbar) -->
  <div :style="contentStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { MpFlex, MpText, MpAvatar, MpIcon, css } from '@mekari/pixel3'
  import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from '~/composables/usePixelLayout'

  const navItems = [
    { label: 'Dashboard', icon: 'home', active: true },
    { label: 'Contacts', icon: 'profile', active: false },
    { label: 'Inbox', icon: 'chat', active: false },
    { label: 'Reports', icon: 'chart', active: false },
    { label: 'Settings', icon: 'setting', active: false },
  ]

  // Layout styles via :style (guarantees px values apply correctly)
  const sidebarStyle = computed(() => ({
    position: 'fixed' as const,
    top: '0',
    left: '0',
    height: '100svh',
    width: SIDEBAR_WIDTH,
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: '10',
    overflow: 'hidden',
    backgroundColor: 'var(--pixel-colors-background-surface)',
    borderRight: '1px solid var(--pixel-colors-border-default)',
  }))

  const logoZoneStyle = computed(() => ({
    height: TOPBAR_HEIGHT,
    flexShrink: '0',
    borderBottom: '1px solid var(--pixel-colors-border-default)',
  }))

  const userZoneStyle = computed(() => ({
    flexShrink: '0',
    borderTop: '1px solid var(--pixel-colors-border-default)',
  }))

  const topbarStyle = computed(() => ({
    position: 'fixed' as const,
    top: '0',
    left: SIDEBAR_WIDTH,
    right: '0',
    height: TOPBAR_HEIGHT,
    zIndex: '9',
    backgroundColor: 'var(--pixel-colors-background-surface)',
    borderBottom: '1px solid var(--pixel-colors-border-default)',
  }))

  const contentStyle = computed(() => ({
    marginLeft: SIDEBAR_WIDTH,
    paddingTop: TOPBAR_HEIGHT,
    minHeight: '100svh',
    backgroundColor: 'var(--pixel-colors-background-surface)',
  }))

  // Hover classes via css() for pseudo-state
  const navItemHoverClass = css({ _hover: { bg: 'background.neutral' } })
  const iconHoverClass = css({ _hover: { bg: 'background.neutral' } })

  const logoMarkClass = css({
    w: '6',
    h: '6',
    rounded: 'md',
    bg: 'brand.mekari',
    flexShrink: '0',
  })
</script>
