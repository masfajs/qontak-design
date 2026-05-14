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
        <MpFlex
          direction="column"
          gap="1"
          :paddingX="isSubmenuOpen ? '1' : '2'"
          paddingY="4"
        >
          <MpFlex
            v-for="item in group"
            :key="item.label"
            alignItems="center"
            :gap="isSubmenuOpen ? '0' : '3'"
            :paddingX="isSubmenuOpen ? '0' : '2'"
            paddingY="2"
            :class="isActive(item.route) ? 'nav-item nav-item--active' : 'nav-item'"
            :style="{
              height: '36px',
              borderRadius: '6px',
              cursor: 'pointer',
              flexShrink: '0',
              transition: 'background-color 150ms ease',
              justifyContent: isSubmenuOpen ? 'center' : undefined,
              backgroundColor: isActive(item.route) ? 'var(--mp-colors-background-brand-selected)' : 'transparent',
            }"
            @click="handleNavClick(item)"
          >
            <MpIcon
              :name="item.icon"
              :variant="isActive(item.route) ? 'fill' : 'outline'"
              size="sm"
              :color="isActive(item.route) ? 'icon.brand' : 'icon.default'"
            />
            <MpFlex v-if="!isSubmenuOpen" alignItems="center" gap="1" :style="{ flex: '1' }">
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
        :style="{
          flex: '1',
          borderRadius: '6px',
          cursor: 'pointer',
          height: '36px',
          justifyContent: isSubmenuOpen ? 'center' : undefined,
        }"
        :class="navItemHoverClass"
      >
        <MpIcon name="arrow-collapse" size="sm" color="text.secondary" />
        <MpText v-if="!isSubmenuOpen" size="body-small" color="text.secondary">Company ID: 102938</MpText>
      </MpFlex>
    </MpFlex>

  </aside>

  <!-- Generic Submenu Panel — renders for any active submenu -->
  <aside v-if="activeSubmenuData" :style="submenuPanelStyle">
    <div :style="{ flex: '1', overflowY: 'auto', backgroundColor: 'var(--mp-colors-background-surface)', paddingTop: '16px' }">

      <!-- Section header -->
      <MpFlex alignItems="center" paddingX="4" :style="{ height: '36px' }">
        <MpText
          size="label-small"
          weight="semiBold"
          :style="{ color: 'var(--mp-colors-text-link)', letterSpacing: '0.08em', textTransform: 'uppercase' }"
        >{{ activeSubmenuData.title }}</MpText>
      </MpFlex>

      <!-- Submenu items -->
      <MpFlex direction="column" gap="1" paddingX="2">
        <template v-for="subItem in activeSubmenuData.items" :key="subItem.label">

          <!-- ── Accordion parent (has children) ── -->
          <template v-if="subItem.children">
            <MpFlex
              alignItems="center"
              gap="3"
              paddingX="2"
              paddingY="2"
              class="nav-item"
              :style="{
                height: '36px',
                borderRadius: '6px',
                cursor: 'pointer',
                flexShrink: '0',
                transition: 'background-color 150ms ease',
                backgroundColor: expandedAccordion === subItem.route
                  ? 'var(--mp-colors-background-brand-selected)'
                  : 'transparent',
              }"
              @click="toggleAccordion(subItem)"
            >
              <MpText
                size="label"
                :weight="expandedAccordion === subItem.route ? 'semiBold' : 'regular'"
                :style="{
                  flex: '1',
                  minWidth: '0',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  color: expandedAccordion === subItem.route
                    ? 'var(--mp-colors-text-selected)'
                    : 'var(--mp-colors-text-default)',
                }"
              >{{ subItem.label }}</MpText>
              <MpIcon
                :name="expandedAccordion === subItem.route ? 'chevrons-down' : 'chevrons-right'"
                size="sm"
                :color="expandedAccordion === subItem.route ? 'icon.brand' : 'icon.default'"
              />
            </MpFlex>

            <!-- Accordion children -->
            <template v-if="expandedAccordion === subItem.route">
              <MpFlex
                v-for="child in subItem.children"
                :key="child.label"
                alignItems="center"
                gap="3"
                paddingY="2"
                :class="isActive(child.route) ? 'nav-item nav-item--active' : 'nav-item'"
                :style="{
                  height: '36px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  flexShrink: '0',
                  transition: 'background-color 150ms ease',
                  paddingLeft: '28px',
                  paddingRight: '8px',
                  backgroundColor: 'transparent',
                }"
                @click="router.push(child.route)"
              >
                <MpText
                  size="label"
                  :weight="isActive(child.route) ? 'semiBold' : 'regular'"
                  :style="{
                    flex: '1',
                    minWidth: '0',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    color: isActive(child.route)
                      ? 'var(--mp-colors-text-default)'
                      : 'var(--mp-colors-text-secondary)',
                  }"
                >{{ child.label }}</MpText>
              </MpFlex>
            </template>
          </template>

          <!-- ── Regular item (no children) ── -->
          <MpFlex
            v-else
            alignItems="center"
            gap="3"
            paddingX="2"
            paddingY="2"
            :class="isActive(subItem.route) ? 'nav-item nav-item--active' : 'nav-item'"
            :style="{
              height: '36px',
              borderRadius: '6px',
              cursor: 'pointer',
              flexShrink: '0',
              transition: 'background-color 150ms ease',
              backgroundColor: isActive(subItem.route)
                ? 'var(--mp-colors-background-brand-selected)'
                : 'transparent',
            }"
            @click="subItem.newTab ? openNewTab(subItem.route) : router.push(subItem.route)"
          >
            <MpText
              size="label"
              :weight="isActive(subItem.route) ? 'semiBold' : 'regular'"
              :style="{
                flex: '1',
                minWidth: '0',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                color: isActive(subItem.route)
                  ? 'var(--mp-colors-text-selected)'
                  : 'var(--mp-colors-text-default)',
              }"
            >{{ subItem.label }}</MpText>
            <MpIcon v-if="subItem.newTab"        name="newtab"         size="sm" color="icon.default" />
            <MpIcon v-else-if="subItem.hasArrow" name="chevron-right" size="sm" color="icon.default" />
            <MpBadge v-if="subItem.count"        for="additionalInformation" type="critical" size="sm">{{ subItem.count }}</MpBadge>
          </MpFlex>

        </template>
      </MpFlex>

    </div>

    <MpFlex v-if="isCampaignTemplatesPage" paddingX="3" paddingBottom="4" :style="{ flexShrink: '0' }">
      <MpFlex
        direction="column"
        gap="3"
        padding="3"
        :style="{
          width: '100%',
          borderRadius: '6px',
          backgroundColor: 'var(--mp-colors-background-brand-selected)',
        }"
      >
        <MpFlex direction="column" gap="2">
          <MpText size="label" weight="semiBold">Explore new WhatsApp campaign template</MpText>
          <MpText size="body-small" color="text.secondary">
            Experience enhanced user interface and performance with the updated WhatsApp template builder.
          </MpText>
        </MpFlex>

        <MpButton variant="secondary" size="sm" :style="{ width: '100%' }">
          Switch to old template
        </MpButton>
        <MpButton variant="primary" size="sm" :style="{ width: '100%' }">
          Give feedback
        </MpButton>
      </MpFlex>
    </MpFlex>
  </aside>

  <!-- Page content -->
  <div :style="contentStyle">
    <MpFlex justify="space-between" px="6" :style="{ height: '72px', flexShrink: '0', alignItems: 'center' }">
      <MpText size="h1" weight="semiBold">{{ activePageTitle }}</MpText>
      <MpButton
        v-if="pageAction.label !== null"
        v-bind="pageAction.icon !== null ? { 'left-icon': pageAction.icon ?? 'add' } : {}"
      >{{ pageAction.label ?? 'Action' }}</MpButton>
    </MpFlex>
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { MpFlex, MpText, MpAvatar, MpIcon, MpBadge, MpButton, css } from '@mekari/pixel3'
  import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from '~/composables/usePixelLayout'

  const ICON_SIDEBAR_WIDTH = '52px'
  const SUBMENU_WIDTH      = '212px'

  const route  = useRoute()
  const router = useRouter()

  const pageAction = computed(() => (route.meta as any).pageAction ?? {})

  // ─── Nav groups ─────────────────────────────────────────────────────────────
  // Untuk menambah submenu pada menu manapun, tambahkan properti `submenu`:
  //   submenu: {
  //     title: 'Nama Section',
  //     items: [
  //       { label: 'Item 1', route: '/route/item-1' },
  //       { label: 'Item 2', route: '/route/item-2' },
  //     ]
  //   }
  // ─────────────────────────────────────────────────────────────────────────────
  const navGroups = [
    [
      { icon: 'home',      label: 'Home',             route: '/',               badge: false },
      { icon: 'inbox',     label: 'Inbox',            route: '/inbox',          badge: false,
        submenu: {
          title: 'Inbox',
          items: [
            { label: 'All chats',   route: '/inbox/all-chats'   },
            { label: 'My chats',    route: '/inbox/my-chats'    },
            { label: 'Unassigned',  route: '/inbox/unassigned'  },
            { label: 'Assigned',    route: '/inbox/assigned'    },
            { label: 'Resolved',    route: '/inbox/resolved'    },
          ]
        }
      },
      { icon: 'phone',     label: 'Calls',            route: '/calls',          badge: true  },
      { icon: 'broadcast', label: 'Campaigns',        route: '/campaigns',      badge: false,
        submenu: {
          title: 'Campaigns',
          items: [
            { label: 'WhatsApp',        route: '/campaigns/whatsapp'       },
            { label: 'Email',           route: '/campaigns/email-basic'    },
            { label: 'Recipient lists', route: '/campaigns/recipient-list' },
            { label: 'Templates',       route: '/campaigns/templates'      },
          ]
        }
      },
      { icon: 'chatbot',   label: 'Bot & automation', route: '/bot-automation', badge: false,
        submenu: {
          title: 'Bot & Automation',
          items: [
            { label: 'Conversations',       route: '/bot-automation/conversations'       },
            { label: 'AI agents',           route: '/bot-automation/ai-agents'           },
            { label: 'Knowledge Base',       route: '/bot-automation/knowledge-base'      },
            { label: 'Custom instruction',  route: '/bot-automation/custom-instruction'  },
            { label: 'Settings',            route: '/bot-automation/settings', newTab: true },
          ]
        }
      },
    ],
    [
      { icon: 'team',              label: 'Customers', route: '/customers', badge: false,
        submenu: {
          title: 'Customers',
          items: [
            { label: 'All customers',  route: '/customers/all-customers'  },
            { label: 'All companies',  route: '/customers/all-companies'  },
            { label: 'Assigned to me', route: '/customers/assigned-to-me' },
            { label: 'Owned by me',    route: '/customers/owned-by-me'    },
          ]
        }
      },
      { icon: 'talent-management', label: 'Loyalty', route: '/loyalty', badge: false,
        submenu: {
          title: 'Loyalty',
          items: [
            { label: 'Members', route: '/loyalty/members', children: [
              { label: 'Member list',        route: '/loyalty/members/member-list'        },
              { label: 'Member wallets',     route: '/loyalty/members/member-wallets'     },
              { label: 'Member tier status', route: '/loyalty/members/member-tier-status' },
            ]},
            { label: 'Points & rewards', route: '/loyalty/points-rewards', children: [
              { label: 'Points activity',   route: '/loyalty/points-rewards/points-activity'   },
              { label: 'Reward redemption', route: '/loyalty/points-rewards/reward-redemption' },
            ]},
            { label: 'Configurations', route: '/loyalty/configurations', children: [
              { label: 'Master activity', route: '/loyalty/configurations/master-activity' },
              { label: 'Currencies',      route: '/loyalty/configurations/currencies'      },
              { label: 'Tiers',           route: '/loyalty/configurations/tiers'           },
              { label: 'Earning rules',   route: '/loyalty/configurations/earning-rules'   },
              { label: 'Rewards',         route: '/loyalty/configurations/rewards'         },
            ]},
          ]
        }
      },
      { icon: 'reports', label: 'Reports', route: '/reports', badge: false,
        submenu: {
          title: 'Reports',
          items: [
            { label: 'General reports',     route: '/reports/general-reports'     },
            { label: 'Business operations', route: '/reports/business-operations' },
            { label: 'Customer insights',   route: '/reports/customer-insights'   },
            { label: 'Agent performance', route: '/reports/agent-performance', children: [
              { label: 'SLA',            route: '/reports/agent-performance/sla'            },
              { label: 'Performance',    route: '/reports/agent-performance/performance'    },
              { label: 'Agent scoring',  route: '/reports/agent-performance/agent-scoring'  },
            ]},
            { label: 'Ticketing report',    route: '/reports/ticketing-report'    },
            { label: 'Broadcast', route: '/reports/broadcast', children: [
              { label: 'Summary',  route: '/reports/broadcast/summary'  },
              { label: 'Activity', route: '/reports/broadcast/activity' },
            ]},
            { label: 'Bot performance',     route: '/reports/bot-performance'     },
            { label: 'Mekari Insights',     route: '/reports/mekari-insights'     },
            { label: 'Custom goals',        route: '/reports/custom-goals'        },
            { label: 'Survey', route: '/reports/survey', children: [
              { label: 'CSAT', route: '/reports/survey/csat' },
              { label: 'CES',  route: '/reports/survey/ces'  },
              { label: 'NPS',  route: '/reports/survey/nps'  },
            ]},
            { label: 'Export',              route: '/reports/export'              },
          ]
        }
      },
    ],
    [
      { icon: 'sales', label: 'Deals', route: '/deals', badge: false,
        submenu: {
          title: 'Deals',
          items: [
            { label: 'All deals',        route: '/deals/all-deals'        },
            { label: 'Need my approval', route: '/deals/need-my-approval', count: 2 },
          ]
        }
      },
      { icon: 'voucher', label: 'Tickets', route: '/tickets', badge: false,
        submenu: {
          title: 'Tickets',
          items: [
            { label: 'All tickets',        route: '/tickets/all-tickets'        },
            { label: 'Assigned to my team', route: '/tickets/assigned-to-my-team' },
            { label: 'Assigned to me',     route: '/tickets/assigned-to-me'     },
            { label: 'Unassigned',         route: '/tickets/unassigned'         },
            { label: 'Report by me',       route: '/tickets/report-by-me'       },
          ]
        }
      },
      { icon: 'competencies', label: 'Tasks',   route: '/tasks',   badge: false },
    ],
    [
      { icon: 'shop',     label: 'Commerce',  route: '/commerce',  badge: true  },
      { icon: 'book',     label: 'Resources', route: '/resources', badge: false,
        submenu: {
          title: 'Resources',
          items: [
            { label: 'AI resources',   route: '/resources/ai-resources'   },
            { label: 'Knowledge Base', route: '/resources/knowledge-base' },
          ]
        }
      },
      { icon: 'doc',      label: 'Documents', route: '/documents', badge: false,
        submenu: {
          title: 'Documents',
          items: [
            { label: 'Documents list', route: '/documents/documents-list' },
            { label: 'Templates',      route: '/documents/templates'      },
            { label: 'Short code',     route: '/documents/short-code'     },
          ]
        }
      },
      { icon: 'products', label: 'Products',  route: '/products',  badge: false },
      { icon: 'expenses', label: 'Expenses',  route: '/expenses',  badge: false },
    ],
    [
      { icon: 'officeless', label: 'Custom solutions', route: '/custom-solutions', badge: false,
        submenu: {
          title: 'Custom solutions',
          items: [
            { label: 'Applications', route: '/custom-solutions/applications' },
            { label: 'Workflows',    route: '/custom-solutions/workflows'    },
            { label: 'Reports',      route: '/custom-solutions/reports'      },
          ]
        }
      },
    ],
    [
      { icon: 'transfer', label: 'Subscription', route: '/subscription', badge: false },
      { icon: 'settings', label: 'Settings', route: '/settings', badge: false,
        submenu: {
          title: 'Settings',
          items: [
            { label: 'Account', route: '/settings/account', children: [
              { label: 'Users',           route: '/settings/account/users'           },
              { label: 'Company setting', route: '/settings/account/company-setting' },
              { label: 'Roles',           route: '/settings/account/roles'           },
              { label: 'Teams',           route: '/settings/account/teams'           },
              { label: 'Security',        route: '/settings/account/security'        },
            ]},
            { label: 'Bot & automation', route: '/settings/bot-automation', children: [
              { label: 'Automated actions',    route: '/settings/bot-automation/automated-actions'    },
              { label: 'Bot configuration',    route: '/settings/bot-automation/bot-configuration'    },
              { label: 'WhatsApp auto-message', route: '/settings/bot-automation/whatsapp-auto-message' },
              { label: 'Mekari Airene',        route: '/settings/bot-automation/mekari-airene'        },
              { label: 'Chat conversion',      route: '/settings/bot-automation/chat-conversion'      },
            ]},
            { label: 'Assignment', route: '/settings/assignment', children: [
              { label: 'Chat', route: '/settings/assignment/chat' },
              { label: 'Call', route: '/settings/assignment/call' },
            ]},
            { label: 'SLA management', route: '/settings/sla-management', children: [
              { label: 'Inbox SLA',  route: '/settings/sla-management/inbox-sla'  },
              { label: 'Ticket SLA', route: '/settings/sla-management/ticket-sla' },
            ]},
            { label: 'Feature configuration', route: '/settings/feature-configuration', children: [
              { label: 'Inbox',                route: '/settings/feature-configuration/inbox'                },
              { label: 'Call',                 route: '/settings/feature-configuration/call'                 },
              { label: 'Agent management',     route: '/settings/feature-configuration/agent-management'     },
              { label: 'Feature list',         route: '/settings/feature-configuration/feature-list'         },
              { label: 'Payments & expenses',  route: '/settings/feature-configuration/payments-expenses'    },
              { label: 'Approval',             route: '/settings/feature-configuration/approval'             },
              { label: 'Live location',        route: '/settings/feature-configuration/live-location'        },
              { label: 'Tracking time',        route: '/settings/feature-configuration/tracking-time'        },
            ]},
            { label: 'Customization', route: '/settings/customization', children: [
              { label: 'Layout',         route: '/settings/customization/layout'         },
              { label: 'Company locale', route: '/settings/customization/company-locale' },
              { label: 'Deal locale',    route: '/settings/customization/deal-locale'    },
              { label: 'Product locale', route: '/settings/customization/product-locale' },
              { label: 'Task locale',    route: '/settings/customization/task-locale'    },
              { label: 'Customers',      route: '/settings/customization/customers'      },
              { label: 'Companies',      route: '/settings/customization/companies'      },
              { label: 'Deals',          route: '/settings/customization/deals'          },
              { label: 'Products',       route: '/settings/customization/products'       },
              { label: 'Tasks',          route: '/settings/customization/tasks'          },
              { label: 'Tickets',        route: '/settings/customization/tickets'        },
            ]},
            { label: 'Data management', route: '/settings/data-management', children: [
              { label: 'Business operations', route: '/settings/data-management/business-operations' },
              { label: 'Export to GSheet',    route: '/settings/data-management/export-to-gsheet'   },
              { label: 'Bot',                 route: '/settings/data-management/bot'                 },
            ]},
            { label: 'Integrations', route: '/settings/integrations', children: [
              { label: 'Outlook email sync',  route: '/settings/integrations/outlook-email-sync'  },
              { label: 'Facebook leads',      route: '/settings/integrations/facebook-leads'      },
              { label: 'Bot API token',       route: '/settings/integrations/bot-api-token'       },
              { label: 'Channel integration', route: '/settings/integrations/channel-integration' },
            ]},
            { label: 'Performance management', route: '/settings/performance-management', children: [
              { label: 'User performance',  route: '/settings/performance-management/user-performance'  },
              { label: 'Customer survey',   route: '/settings/performance-management/customer-survey'   },
              { label: 'Scorecard',         route: '/settings/performance-management/scorecard'         },
            ]},
          ]
        }
      },
    ],
  ]

  // ─── Active page title (driven by nav structure) ─────────────────────────────
  const activePageTitle = computed(() => {
    const path = route.path
    for (const group of navGroups) {
      for (const item of group) {
        if (!item.submenu) {
          if (path === '/' ? item.route === '/' : path === item.route) return item.label
        }
        if (item.submenu) {
          for (const sub of (item.submenu as any).items) {
            if (sub.children) {
              for (const child of sub.children) {
                if (path === child.route) return child.label
              }
            } else if (path === sub.route) {
              return sub.label
            }
          }
        }
      }
    }
    return ''
  })

  // ─── Submenu state ───────────────────────────────────────────────────────────
  const activeSubmenu      = ref<string | null>(null)
  const expandedAccordion  = ref<string | null>(null)

  // Flatten all items to find submenu definitions
  const allNavItems = navGroups.flat()

  // Auto-open/close submenu and accordion based on current route
  watch(
    () => route.path,
    (newPath) => {
      const match = allNavItems.find(
        (item: any) => item.submenu && newPath.startsWith(item.route)
      )
      activeSubmenu.value = match ? match.route : null

      // Auto-expand/collapse accordion based on current route
      if (match?.submenu) {
        const accordionParent = (match.submenu as any).items.find(
          (item: any) => item.children && newPath.startsWith(item.route)
        )
        expandedAccordion.value = accordionParent ? accordionParent.route : null
      } else {
        expandedAccordion.value = null
      }
    },
    { immediate: true }
  )

  const isSubmenuOpen = computed(() => activeSubmenu.value !== null)

  // Active submenu data (title + items) for the panel
  const activeSubmenuData = computed(() => {
    if (!activeSubmenu.value) return null
    return allNavItems.find(item => item.route === activeSubmenu.value)?.submenu ?? null
  })

  const isCampaignTemplatesPage = computed(() => route.path === '/campaigns/templates')

  function openNewTab(path: string) {
    window.open(path, '_blank')
  }

  function handleNavClick(item: any) {
    if (item.submenu) {
      activeSubmenu.value = item.route
      // If first submenu item is an accordion parent, expand it and navigate to first child
      const firstItem = item.submenu.items[0]
      if (firstItem.children) {
        expandedAccordion.value = firstItem.route
        router.push(firstItem.children[0].route)
      } else {
        router.push(firstItem.route)
      }
    } else {
      activeSubmenu.value = null
      router.push(item.route)
    }
  }

  function toggleAccordion(item: any) {
    const isExpanding = expandedAccordion.value !== item.route
    expandedAccordion.value = isExpanding ? item.route : null
    if (isExpanding) router.push(item.children[0].route)
  }

  const isActive = (itemRoute: string) =>
    itemRoute === '/' ? route.path === '/' : route.path.startsWith(itemRoute)

  // ─── Layout constants ────────────────────────────────────────────────────────
  const headerBg     = 'var(--mp-colors-background-neutral)'
  const headerBorder = '1px solid var(--mp-colors-border-default)'

  // ─── Styles ──────────────────────────────────────────────────────────────────
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
    width: isSubmenuOpen.value ? ICON_SIDEBAR_WIDTH : SIDEBAR_WIDTH,
    minWidth: isSubmenuOpen.value ? ICON_SIDEBAR_WIDTH : SIDEBAR_WIDTH,
    maxWidth: isSubmenuOpen.value ? ICON_SIDEBAR_WIDTH : SIDEBAR_WIDTH,
    height: `calc(100svh - ${TOPBAR_HEIGHT})`,
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: '10',
    overflow: 'hidden',
    backgroundColor: isSubmenuOpen.value
      ? 'var(--mp-colors-background-nav-parent)'
      : 'var(--mp-colors-background-surface)',
    borderRight: isSubmenuOpen.value ? headerBorder : 'none',
  }))

  const submenuPanelStyle = computed(() => ({
    position: 'fixed' as const,
    top: TOPBAR_HEIGHT,
    left: ICON_SIDEBAR_WIDTH,
    width: SUBMENU_WIDTH,
    height: `calc(100svh - ${TOPBAR_HEIGHT})`,
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: '10',
    overflow: 'hidden',
    backgroundColor: 'var(--mp-colors-background-surface)',
  }))

  const navAreaStyle = computed(() => ({
    flex: '1',
    overflowY: 'auto' as const,
    backgroundColor: isSubmenuOpen.value
      ? 'var(--mp-colors-background-nav-parent)'
      : 'var(--mp-colors-background-surface)',
  }))

  const dividerStyle = computed(() => ({
    height: '1px',
    backgroundColor: isSubmenuOpen.value
      ? 'var(--mp-colors-border-default)'
      : '#E2E8F0',
    marginLeft: '8px',
    marginRight: '8px',
  }))

  const companyZoneStyle = computed(() => ({
    flexShrink: '0',
    backgroundColor: isSubmenuOpen.value
      ? 'var(--mp-colors-background-nav-parent)'
      : 'var(--mp-colors-background-surface)',
    borderTop: headerBorder,
  }))

  const contentStyle = computed(() => ({
    marginLeft: isSubmenuOpen.value
      ? `calc(${ICON_SIDEBAR_WIDTH} + ${SUBMENU_WIDTH})`
      : SIDEBAR_WIDTH,
    paddingTop: TOPBAR_HEIGHT,
    minHeight: '100svh',
    backgroundColor: 'var(--mp-colors-background-surface)',
    display: 'flex',
    flexDirection: 'column' as const,
  }))

  const profileHoverClass = css({ _hover: { bg: 'background.neutral.hovered' } })
  const navItemHoverClass = css({ _hover: { bg: 'background.neutral.hovered' } })
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
