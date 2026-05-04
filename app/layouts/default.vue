<template>
  <!-- Sidebar (fixed left) -->
  <aside :style="sidebarStyle">

    <!-- Logo zone — same bg as topbar so they merge into one header band -->
    <MpFlex alignItems="center" gap="2" paddingX="4" :style="logoZoneStyle">
      <div :class="logoMarkClass" />
      <MpText size="label" weight="semiBold" color="text.primary">Qontak</MpText>
    </MpFlex>

    <!-- Scrollable nav area — light blue-gray bg -->
    <div :style="navAreaStyle">
      <div v-for="(group, gi) in navGroups" :key="gi">

        <!-- 1px divider between groups -->
        <div v-if="gi > 0" :style="dividerStyle" />

        <!-- Group items -->
        <MpFlex direction="column" gap="1" paddingX="2" paddingY="4">
          <MpFlex
            v-for="item in group"
            :key="item.label"
            alignItems="center"
            gap="3"
            paddingX="2"
            paddingY="2"
            :style="{
              height: '36px',
              borderRadius: '6px',
              cursor: 'pointer',
              flexShrink: '0',
              backgroundColor: item.active ? '#D6DBF7' : 'transparent',
            }"
            :class="!item.active ? navItemHoverClass : ''"
          >
            <MpIcon
              :name="item.icon"
              size="sm"
              :color="item.active ? 'brand.mekari' : 'text.secondary'"
            />
            <MpText
              size="body"
              :color="item.active ? 'text.primary' : 'text.secondary'"
              :style="{ flex: '1' }"
            >{{ item.label }}</MpText>
            <MpTag v-if="item.badge" id="badge-new" variant="red" size="sm">NEW</MpTag>
          </MpFlex>
        </MpFlex>

      </div>
    </div>

    <!-- Company ID footer -->
    <MpFlex paddingX="2" paddingY="3" :style="companyZoneStyle">
      <MpFlex
        alignItems="center"
        gap="2"
        paddingX="2"
        paddingY="2"
        :style="{ flex: '1', borderRadius: '6px', cursor: 'pointer', height: '36px' }"
        :class="navItemHoverClass"
      >
        <MpIcon name="collapse" size="sm" color="text.secondary" />
        <MpText size="body" color="text.secondary">Company ID: 102938</MpText>
      </MpFlex>
    </MpFlex>

  </aside>

  <!-- Topbar — same bg as logo zone, together they form one full-width header -->
  <header :style="topbarStyle">
    <MpFlex alignItems="center" justifyContent="space-between" paddingX="6" :style="{ height: '100%' }">
      <MpText size="body-small" color="text.secondary">Home</MpText>
      <MpFlex alignItems="center" gap="2">
        <MpFlex
          alignItems="center"
          justifyContent="center"
          :style="{ width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }"
          :class="iconHoverClass"
        >
          <MpIcon name="bell" size="sm" color="text.secondary" />
        </MpFlex>
        <MpAvatar name="User" size="sm" variant-color="sky" />
      </MpFlex>
    </MpFlex>
  </header>

  <!-- Page content -->
  <div :style="contentStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { MpFlex, MpText, MpAvatar, MpIcon, MpTag, css } from '@mekari/pixel3'
  import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from '~/composables/usePixelLayout'

  // Nav groups from Qontak Figma design (node 5732:46541)
  // "Call" removed per request; expense + product icon names kept as-is from Figma
  const navGroups = [
    [
      { icon: 'home',      label: 'Home',             active: true,  badge: false },
      { icon: 'inbox',     label: 'Inbox',            active: false, badge: false },
      { icon: 'phone',     label: 'Calls',            active: false, badge: true  },
      { icon: 'broadcast', label: 'Campaigns',        active: false, badge: false },
      { icon: 'chatbot',   label: 'Bot & automation', active: false, badge: false },
    ],
    [
      { icon: 'team',              label: 'Customers', active: false, badge: false },
      { icon: 'talent-management', label: 'Loyalty',   active: false, badge: false },
      { icon: 'reports',           label: 'Reports',   active: false, badge: false },
    ],
    [
      { icon: 'sales',        label: 'Deals',   active: false, badge: false },
      { icon: 'voucher',      label: 'Tickets', active: false, badge: false },
      { icon: 'competencies', label: 'Tasks',   active: false, badge: false },
    ],
    [
      { icon: 'shop',    label: 'Commerce',  active: false, badge: true  },
      { icon: 'book',    label: 'Resources', active: false, badge: false },
      { icon: 'doc',     label: 'Documents', active: false, badge: false },
      { icon: 'product', label: 'Products',  active: false, badge: false },
      { icon: 'expense', label: 'Expenses',  active: false, badge: false },
    ],
    [
      { icon: 'officeless', label: 'Custom solutions', active: false, badge: false },
    ],
    [
      { icon: 'transfer', label: 'Subscription', active: false, badge: false },
      { icon: 'settings', label: 'Settings',     active: false, badge: false },
    ],
  ]

  // Logo zone + topbar share the same surface background → unified top header band
  const sharedHeaderBg = 'var(--pixel-colors-background-surface)'
  const sharedHeaderBorder = '1px solid var(--pixel-colors-border-default)'

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
    borderRight: sharedHeaderBorder,
  }))

  const logoZoneStyle = computed(() => ({
    height: TOPBAR_HEIGHT,
    flexShrink: '0',
    backgroundColor: sharedHeaderBg,
    borderBottom: sharedHeaderBorder,
  }))

  const navAreaStyle = {
    flex: '1',
    overflowY: 'auto' as const,
    backgroundColor: '#F1F5F9',
  }

  // Divider line between nav groups — matches Figma design
  const dividerStyle = {
    height: '1px',
    backgroundColor: '#E2E8F0',
    marginLeft: '8px',
    marginRight: '8px',
  }

  const companyZoneStyle = computed(() => ({
    flexShrink: '0',
    backgroundColor: '#F1F5F9',
    borderTop: sharedHeaderBorder,
  }))

  const topbarStyle = computed(() => ({
    position: 'fixed' as const,
    top: '0',
    left: SIDEBAR_WIDTH,
    right: '0',
    height: TOPBAR_HEIGHT,
    zIndex: '9',
    backgroundColor: sharedHeaderBg,
    borderBottom: sharedHeaderBorder,
  }))

  const contentStyle = computed(() => ({
    marginLeft: SIDEBAR_WIDTH,
    paddingTop: TOPBAR_HEIGHT,
    minHeight: '100svh',
    backgroundColor: 'var(--pixel-colors-background-surface)',
  }))

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
