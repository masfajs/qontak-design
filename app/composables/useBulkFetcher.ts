import { ref, computed, onUnmounted } from 'vue'
import type { DiscoveredUrl, FetchedPage, BatchUrl, FetchProgress } from '~/types/kb'

const BATCH_SIZE = 5

const MOCK_URL_POOL: Array<{ url: string; title: string; content: string }> = [
  {
    url: '/getting-started',
    title: 'Getting Started',
    content:
      'Welcome to our platform. This guide will walk you through the basics of getting started. You will learn how to set up your account, configure your settings, and begin using our core features effectively.',
  },
  {
    url: '/faq',
    title: 'Frequently Asked Questions',
    content:
      'Find answers to the most common questions about our platform. Topics include billing, account management, technical requirements, and integration capabilities with third-party tools.',
  },
  {
    url: '/pricing',
    title: 'Pricing Plans',
    content:
      'Explore our flexible pricing plans designed for teams of all sizes. Compare features across Starter, Professional, and Enterprise tiers with transparent monthly and annual billing options.',
  },
  {
    url: '/about-us',
    title: 'About Us',
    content:
      'Learn about our company mission, values, and the team behind the platform. We are dedicated to building tools that help businesses communicate better with their customers at every touchpoint.',
  },
  {
    url: '/contact',
    title: 'Contact Us',
    content:
      'Get in touch with our team. Reach out for sales inquiries, technical support, or partnership opportunities. Our team is available Monday through Friday, 9am to 6pm WIB.',
  },
  {
    url: '/blog',
    title: 'Blog',
    content:
      'Stay up to date with the latest news, product updates, and industry insights. Our blog covers topics ranging from customer service best practices to AI-powered communication strategies.',
  },
  {
    url: '/help-center',
    title: 'Help Center',
    content:
      'Browse our comprehensive help center documentation. Find step-by-step guides, video tutorials, and troubleshooting articles for every feature of our platform.',
  },
  {
    url: '/features',
    title: 'Features',
    content:
      'Discover all the powerful features our platform offers. From live chat and chatbots to CRM integration and analytics, we have everything you need to deliver exceptional customer experiences.',
  },
  {
    url: '/integrations',
    title: 'Integrations',
    content:
      'Connect our platform with your favorite tools. We support integrations with Salesforce, HubSpot, Slack, Zapier, and over 100 other business applications to streamline your workflow.',
  },
  {
    url: '/documentation',
    title: 'Documentation',
    content:
      'Access our full technical documentation including API references, SDK guides, webhook configurations, and developer resources for building custom integrations.',
  },
  {
    url: '/api-reference',
    title: 'API Reference',
    content:
      'Complete reference documentation for our REST API. Includes authentication guides, endpoint descriptions, request/response examples, and rate limiting information for developers.',
  },
  {
    url: '/release-notes',
    title: 'Release Notes',
    content:
      'Track all product updates and improvements. Our release notes provide detailed changelogs for every version, including new features, bug fixes, and performance improvements.',
  },
  {
    url: '/security',
    title: 'Security',
    content:
      'We take security seriously. Learn about our data encryption, compliance certifications (SOC2, ISO 27001), vulnerability disclosure policy, and security best practices for enterprise customers.',
  },
  {
    url: '/privacy-policy',
    title: 'Privacy Policy',
    content:
      'Our privacy policy explains how we collect, use, and protect your personal information in accordance with GDPR, CCPA, and other applicable privacy regulations worldwide.',
  },
  {
    url: '/terms-of-service',
    title: 'Terms of Service',
    content:
      'Read the complete terms and conditions governing the use of our platform. This document covers user responsibilities, prohibited activities, and dispute resolution procedures.',
  },
]

const MOCK_URL_MAP = new Map(MOCK_URL_POOL.map((m) => [m.url, m]))

// Indices in the selected list that simulate network failures
const FAILED_INDICES = new Set([2, 9])

const INITIAL_PROGRESS: FetchProgress = {
  percentage: 0,
  currentBatch: 0,
  totalBatches: 0,
  processed: 0,
  total: 0,
  currentBatchUrls: [],
  failedCount: 0,
  status: 'idle',
}

// Shared singleton — all components on this page read from the same state
const currentStep = ref<1 | 2 | 3 | 4>(1)
const domain = ref('')
const domainError = ref('')
const isDiscovering = ref(false)
const discoveredUrls = ref<DiscoveredUrl[]>([])
const progress = ref<FetchProgress>({ ...INITIAL_PROGRESS })
const fetchedPages = ref<FetchedPage[]>([])
const reviewFilter = ref<'all' | 'success' | 'failed'>('all')
const isSubmitting = ref(false)

let fetchInterval: ReturnType<typeof setInterval> | null = null
let pendingBatchTimeout: ReturnType<typeof setTimeout> | null = null

const selectedUrls = computed(() => discoveredUrls.value.filter((u) => u.selected))
const selectedCount = computed(() => selectedUrls.value.length)
const allSelected = computed(
  () => discoveredUrls.value.length > 0 && discoveredUrls.value.every((u) => u.selected),
)
const isIndeterminate = computed(
  () => selectedCount.value > 0 && selectedCount.value < discoveredUrls.value.length,
)
const filteredPages = computed(() => {
  if (reviewFilter.value === 'all') return fetchedPages.value
  return fetchedPages.value.filter((p) => p.status === reviewFilter.value)
})
const successCount = computed(() => fetchedPages.value.filter((p) => p.status === 'success').length)
const failedCount = computed(() => fetchedPages.value.filter((p) => p.status === 'failed').length)
const totalChars = computed(() =>
  fetchedPages.value
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.charCount, 0),
)

function getMockContent(url: string): string {
  return MOCK_URL_MAP.get(url)?.content ?? 'Page content loaded successfully.'
}

function resolvePageSuccess(page: FetchedPage): FetchedPage {
  const content = getMockContent(page.url)
  return { ...page, status: 'success' as const, content, charCount: content.length, error: undefined }
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function stopTimers() {
  if (fetchInterval) { clearInterval(fetchInterval); fetchInterval = null }
  if (pendingBatchTimeout) { clearTimeout(pendingBatchTimeout); pendingBatchTimeout = null }
}

async function discoverUrls() {
  if (!isValidUrl(domain.value)) {
    domainError.value = 'Please enter a valid URL (e.g. https://help.example.com)'
    return
  }
  domainError.value = ''
  isDiscovering.value = true
  discoveredUrls.value = []

  await new Promise((resolve) => setTimeout(resolve, 2000))

  discoveredUrls.value = MOCK_URL_POOL.map((u) => ({ url: u.url, title: u.title, selected: true }))
  isDiscovering.value = false
}

function toggleSelectAll(checked: boolean) {
  discoveredUrls.value = discoveredUrls.value.map((u) => ({ ...u, selected: checked }))
}

function toggleUrl(url: string, checked: boolean) {
  const idx = discoveredUrls.value.findIndex((u) => u.url === url)
  if (idx !== -1) {
    discoveredUrls.value[idx] = { ...discoveredUrls.value[idx], selected: checked }
  }
}

function startBulkFetch() {
  const urls = selectedUrls.value
  const total = urls.length
  const totalBatches = Math.ceil(total / BATCH_SIZE)

  progress.value = { ...INITIAL_PROGRESS, totalBatches, total, status: 'processing' }
  fetchedPages.value = []
  currentStep.value = 2

  let batchIndex = 0

  fetchInterval = setInterval(() => {
    if (batchIndex >= totalBatches) {
      stopTimers()
      progress.value = { ...progress.value, status: 'complete', percentage: 100 }
      setTimeout(() => { currentStep.value = 3 }, 600)
      return
    }

    const start = batchIndex * BATCH_SIZE
    const end = Math.min(start + BATCH_SIZE, total)
    const batchUrls = urls.slice(start, end)
    const processedBefore = progress.value.processed

    progress.value = {
      ...progress.value,
      currentBatch: batchIndex + 1,
      currentBatchUrls: batchUrls.map((u) => ({ url: u.url, status: 'processing' as const })),
    }

    pendingBatchTimeout = setTimeout(() => {
      pendingBatchTimeout = null
      const newPages: FetchedPage[] = []
      let newFailed = 0
      const updatedBatchUrls: BatchUrl[] = []

      batchUrls.forEach((u, i) => {
        const isFailed = FAILED_INDICES.has(start + i)
        if (isFailed) {
          newPages.push({ url: u.url, title: u.title, content: '', charCount: 0, status: 'failed', error: 'Connection timeout' })
          newFailed++
          updatedBatchUrls.push({ url: u.url, status: 'failed' })
        } else {
          const content = getMockContent(u.url)
          newPages.push({ url: u.url, title: u.title, content, charCount: content.length, status: 'success' })
          updatedBatchUrls.push({ url: u.url, status: 'complete' })
        }
      })

      fetchedPages.value.push(...newPages)
      const processed = Math.min(processedBefore + batchUrls.length, total)

      progress.value = {
        ...progress.value,
        processed,
        percentage: Math.round((processed / total) * 100),
        failedCount: progress.value.failedCount + newFailed,
        currentBatchUrls: updatedBatchUrls,
      }
    }, 800)

    batchIndex++
  }, 1400)
}

function removePage(url: string) {
  fetchedPages.value = fetchedPages.value.filter((p) => p.url !== url)
}

function retrySinglePage(url: string) {
  const idx = fetchedPages.value.findIndex((p) => p.url === url)
  if (idx !== -1) {
    fetchedPages.value[idx] = resolvePageSuccess(fetchedPages.value[idx])
  }
}

function retryFailed() {
  fetchedPages.value
    .filter((p) => p.status === 'failed')
    .forEach((p) => retrySinglePage(p.url))
}

async function addToKnowledgeBase() {
  isSubmitting.value = true
  await new Promise((resolve) => setTimeout(resolve, 1500))
  isSubmitting.value = false
  currentStep.value = 4
}

function reset() {
  stopTimers()
  currentStep.value = 1
  domain.value = ''
  domainError.value = ''
  discoveredUrls.value = []
  fetchedPages.value = []
  reviewFilter.value = 'all'
  isSubmitting.value = false
  progress.value = { ...INITIAL_PROGRESS }
}

export function useBulkFetcher() {
  onUnmounted(stopTimers)

  return {
    currentStep,
    domain,
    domainError,
    isDiscovering,
    discoveredUrls,
    progress,
    fetchedPages,
    reviewFilter,
    isSubmitting,
    selectedUrls,
    selectedCount,
    allSelected,
    isIndeterminate,
    filteredPages,
    successCount,
    failedCount,
    totalChars,
    discoverUrls,
    toggleSelectAll,
    toggleUrl,
    startBulkFetch,
    removePage,
    retrySinglePage,
    retryFailed,
    addToKnowledgeBase,
    reset,
  }
}
