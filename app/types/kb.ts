export interface DiscoveredUrl {
  url: string
  title: string
  selected: boolean
}

export interface FetchedPage {
  url: string
  title: string
  content: string
  charCount: number
  status: 'success' | 'failed'
  error?: string
}

export interface BatchUrl {
  url: string
  status: 'pending' | 'processing' | 'complete' | 'failed'
}

export interface FetchProgress {
  percentage: number
  currentBatch: number
  totalBatches: number
  processed: number
  total: number
  currentBatchUrls: BatchUrl[]
  failedCount: number
  status: 'idle' | 'processing' | 'complete'
}
