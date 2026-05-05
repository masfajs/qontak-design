<template>
  <!-- PixelNavbar — full width, logo + actions in one bar -->
  <nav data-pixel-component="PixelNavbar" data-slot="root" :style="navbarStyle">
    <div data-slot="leftContent" :style="{ display: 'flex', gap: '8px', alignItems: 'center' }">
      <img src="https://cdn.mekari.design/logo/qontak/default.svg" alt="Qontak" height="32" />
    </div>
    <div data-slot="rightContent" :style="{ display: 'flex', gap: '8px', alignItems: 'center' }">
      <MpButton variant="ghost" left-icon="bell" aria-label="notification button" />
      <MpButton variant="ghost" size="sm">
        <MpAvatar name="Rizal Chandra" size="sm" variant-color="sky" />
        <div :style="{ textAlign: 'left' }">
          <MpText size="label" weight="semiBold">Rizal Chandra</MpText>
          <MpText size="label-small" color="text.secondary">PT Qontak</MpText>
        </div>
      </MpButton>
    </div>
  </nav>

  <!-- Sidebar — positioned below navbar -->
  <aside :style="sidebarStyle">

    <!-- Scrollable nav area -->
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
            <MpFlex alignItems="center" gap="1" :style="{ flex: '1' }">
              <MpText
                size="body"
                :color="item.active ? 'text.primary' : 'text.secondary'"
              >{{ item.label }}</MpText>
              <MpBadge v-if="item.badge" for="additionalInformation" type="critical" size="sm">NEW</MpBadge>
            </MpFlex>
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

  <!-- Page content -->
  <div :style="contentStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { MpFlex, MpText, MpAvatar, MpIcon, MpBadge, MpButton, css } from '@mekari/pixel3'
  import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from '~/composables/usePixelLayout'

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
      { icon: 'shop',     label: 'Commerce',  active: false, badge: true  },
      { icon: 'book',     label: 'Resources', active: false, badge: false },
      { icon: 'doc',      label: 'Documents', active: false, badge: false },
      { icon: 'product',  label: 'Products',  active: false, badge: false },
      { icon: 'expenses', label: 'Expenses',  active: false, badge: false },
    ],
    [
      { icon: 'officeless', label: 'Custom solutions', active: false, badge: false },
    ],
    [
      { icon: 'transfer', label: 'Subscription', active: false, badge: false },
      { icon: 'settings', label: 'Settings',     active: false, badge: false },
    ],
  ]

  const headerBg     = 'var(--mp-colors-background-surface)'
  const headerBorder = '1px solid var(--mp-colors-border-default)'

  const navbarStyle = computed(() => ({
    position: 'fixed' as const,
    top: '0',
    left: '0',
    right: '0',
    height: TOPBAR_HEIGHT,
    zIndex: '11',
    backgroundColor: headerBg,
    borderBottom: headerBorder,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '16px',
    paddingRight: '16px',
  }))

  const sidebarStyle = computed(() => ({
    position: 'fixed' as const,
    top: TOPBAR_HEIGHT,
    left: '0',
    width: SIDEBAR_WIDTH,
    height: `calc(100svh - ${TOPBAR_HEIGHT})`,
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: '10',
    overflow: 'hidden',
    borderRight: headerBorder,
  }))

  const navAreaStyle = {
    flex: '1',
    overflowY: 'auto' as const,
    backgroundColor: '#F1F5F9',
  }

  const dividerStyle = {
    height: '1px',
    backgroundColor: '#E2E8F0',
    marginLeft: '8px',
    marginRight: '8px',
  }

  const companyZoneStyle = computed(() => ({
    flexShrink: '0',
    backgroundColor: '#F1F5F9',
    borderTop: headerBorder,
  }))

  const contentStyle = computed(() => ({
    marginLeft: SIDEBAR_WIDTH,
    paddingTop: TOPBAR_HEIGHT,
    minHeight: '100svh',
    backgroundColor: 'var(--mp-colors-background-surface)',
  }))

  const navItemHoverClass = css({ _hover: { bg: 'background.neutral' } })

  const logoMarkClass = css({
    w: '6',
    h: '6',
    rounded: 'md',
    bg: 'brand.mekari',
    flexShrink: '0',
  })
</script>
