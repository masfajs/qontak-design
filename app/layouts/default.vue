<template>
  <!-- PixelNavbar — full width, logo + actions in one bar -->
  <nav data-pixel-component="PixelNavbar" data-slot="root" :style="navbarStyle">
    <div data-slot="leftContent" :style="{ display: 'flex', gap: '8px', alignItems: 'center' }">
      <img src="https://cdn.mekari.design/logo/qontak/default.svg" alt="Qontak" height="32" />
    </div>
    <div data-slot="rightContent" :style="{ display: 'flex', gap: '8px', alignItems: 'center' }">
      <AppStatusButton />
      <div :style="{ position: 'relative', display: 'inline-flex' }">
        <MpButton variant="ghost" left-icon="notification" aria-label="notification button" />
        <MpBadge
          for="indicator"
          type="critical"
          size="sm"
          :style="{ position: 'absolute', top: '6px', right: '6px', pointerEvents: 'none' }"
        />
      </div>
      <MpButton variant="ghost" left-icon="shortcuts" aria-label="shortcuts button" />
      <MpFlex
        alignItems="center"
        gap="3"
        paddingX="2"
        paddingY="1"
        :style="{ borderRadius: '6px', cursor: 'pointer' }"
        :class="profileHoverClass"
      >
        <MpAvatar
          src="https://randomuser.me/api/portraits/women/11.jpg"
          name="Rizal Candra"
          size="lg"
        />
        <MpFlex direction="column" :style="{ whiteSpace: 'nowrap' }">
          <MpText size="label" weight="semiBold">Rizal Candra</MpText>
          <MpText size="label-small" color="text.secondary">PT Central Perk Cafe</MpText>
        </MpFlex>
      </MpFlex>
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
            :class="isActive(item.route) ? 'nav-item nav-item--active' : 'nav-item'"
            :style="{
              height: '36px',
              borderRadius: '6px',
              cursor: 'pointer',
              flexShrink: '0',
              transition: 'background-color 150ms ease',
              backgroundColor: isActive(item.route) ? 'var(--mp-colors-background-brand-selected)' : 'transparent',
            }"
            @click="router.push(item.route)"
          >
            <MpIcon
              :name="item.icon"
              :variant="isActive(item.route) ? 'fill' : 'outline'"
              size="sm"
              :color="isActive(item.route) ? 'icon.brand' : 'icon.default'"
            />
            <MpFlex alignItems="center" gap="1" :style="{ flex: '1' }">
              <MpText
                size="label"
                :weight="isActive(item.route) ? 'semiBold' : 'regular'"
                :style="{ color: isActive(item.route) ? 'var(--mp-colors-text-selected)' : 'var(--mp-colors-text-default)' }"
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
        <MpIcon name="arrow-collapse" size="sm" color="text.secondary" />
        <MpText size="body-small" color="text.secondary">Company ID: 102938</MpText>
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
  import { useRoute, useRouter } from 'vue-router'
  import { MpFlex, MpText, MpAvatar, MpIcon, MpBadge, MpButton, css } from '@mekari/pixel3'
  import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from '~/composables/usePixelLayout'

  const route  = useRoute()
  const router = useRouter()

  const navGroups = [
    [
      { icon: 'home',      label: 'Home',             route: '/',                badge: false },
      { icon: 'inbox',     label: 'Inbox',            route: '/inbox',           badge: false },
      { icon: 'phone',     label: 'Calls',            route: '/calls',           badge: true  },
      { icon: 'broadcast', label: 'Campaigns',        route: '/campaigns',       badge: false },
      { icon: 'chatbot',   label: 'Bot & automation', route: '/bot-automation',  badge: false },
    ],
    [
      { icon: 'team',              label: 'Customers', route: '/customers', badge: false },
      { icon: 'talent-management', label: 'Loyalty',   route: '/loyalty',   badge: false },
      { icon: 'reports',           label: 'Reports',   route: '/reports',   badge: false },
    ],
    [
      { icon: 'sales',        label: 'Deals',   route: '/deals',   badge: false },
      { icon: 'voucher',      label: 'Tickets', route: '/tickets', badge: false },
      { icon: 'competencies', label: 'Tasks',   route: '/tasks',   badge: false },
    ],
    [
      { icon: 'shop',     label: 'Commerce',  route: '/commerce',   badge: true  },
      { icon: 'book',     label: 'Resources', route: '/resources',  badge: false },
      { icon: 'doc',      label: 'Documents', route: '/documents',  badge: false },
      { icon: 'products', label: 'Products',  route: '/products',   badge: false },
      { icon: 'expenses', label: 'Expenses',  route: '/expenses',   badge: false },
    ],
    [
      { icon: 'officeless', label: 'Custom solutions', route: '/custom-solutions', badge: false },
    ],
    [
      { icon: 'transfer', label: 'Subscription', route: '/subscription', badge: false },
      { icon: 'settings', label: 'Settings',     route: '/settings',     badge: false },
    ],
  ]

  const isActive = (itemRoute: string) =>
    itemRoute === '/' ? route.path === '/' : route.path.startsWith(itemRoute)

  const headerBg     = 'var(--mp-colors-background-neutral)'
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
    backgroundColor: 'var(--mp-colors-background-surface)',
  }))

  const navAreaStyle = {
    flex: '1',
    overflowY: 'auto' as const,
    backgroundColor: 'var(--mp-colors-background-surface)',
  }

  const dividerStyle = {
    height: '1px',
    backgroundColor: '#E2E8F0',
    marginLeft: '8px',
    marginRight: '8px',
  }

  const companyZoneStyle = computed(() => ({
    flexShrink: '0',
    backgroundColor: 'var(--mp-colors-background-surface)',
    borderTop: headerBorder,
  }))

  const contentStyle = computed(() => ({
    marginLeft: SIDEBAR_WIDTH,
    paddingTop: TOPBAR_HEIGHT,
    minHeight: '100svh',
    backgroundColor: 'var(--mp-colors-background-surface)',
  }))


  const profileHoverClass = css({ _hover: { bg: 'background.neutral.hovered' } })

  const logoMarkClass = css({
    w: '6',
    h: '6',
    rounded: 'md',
    bg: 'brand.mekari',
    flexShrink: '0',
  })
</script>

<style scoped>
/* Hover: text.brand, icon.brand */
.nav-item:not(.nav-item--active):hover :deep(p.mp-text) {
  color: var(--mp-colors-text-link) !important;
}
.nav-item:not(.nav-item--active):hover :deep(svg.mp-icon) {
  --mp-icon-color: var(--mp-colors-icon-brand) !important;
}
</style>
