# Qontak Chatbot – Knowledge Base URL Fetcher Enhancement

| Field              | Value                                  |
| ------------------ | -------------------------------------- |
| **Product**        | Qontak Chatbot                         |
| **Feature**        | Knowledge Base URL Fetcher Enhancement |
| **Version**        | 1.0                                    |
| **Status**         | Draft                                  |
| **Target Release** | Q1 2026                                |
| **Epic**           | -                                      |

---

## Background

Qontak Chatbot uses knowledge base to answer customer questions. One way to build knowledge base is by fetching content from company websites (help center, FAQ, product pages, etc).

**Current Flow (Manual & Tedious):**

```text
User enters URL → Fetch single page → Add to KB → Repeat for each URL
```

**Expected Flow (Bulk & Efficient):**

```text
User enters domain → See all pages → Select pages → Bulk fetch → Review → Add to KB
```

---

## Problem Statement

| #   | Current State          | Pain Point                  | User Impact                 |
| --- | ---------------------- | --------------------------- | --------------------------- |
| 1   | Fetch URL one by one   | Repetitive manual work      | 50 URLs = 50x input & click |
| 2   | No URL discovery       | User must know all URLs     | Miss important pages        |
| 3   | No bulk selection      | Can't select multiple       | No efficiency gain          |
| 4   | No progress visibility | Blank screen while fetching | User thinks system stuck    |
| 5   | No review before save  | Bad content enters KB       | Chatbot gives wrong answers |

**User Feedback:**

> _"Saya harus copy-paste 100+ URL dari sitemap, capek banget"_  
> _"Kadang ada page yang ke-skip karena ga tau URL-nya"_  
> _"Fetch lama, ga tau udah sampe mana"_

---

## Solution Overview

### New User Flow

```text
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: DISCOVER URLs                                      │
│                                                             │
│  Enter domain: [https://help.example.com    ] [🔍 Discover] │
│                                                             │
│  ✅ Found 47 pages                                          │
│                                                             │
│  [✓] Select All                                             │
│  ├─ [✓] /getting-started                                    │
│  ├─ [✓] /faq                                                │
│  ├─ [✓] /pricing                                            │
│  ├─ [ ] /terms-of-service        ← user unchecks            │
│  ├─ [✓] /contact                                            │
│  └─ ... 42 more                                             │
│                                                             │
│  Selected: 45 of 47 pages                                   │
│                                                             │
│  [▶ Fetch Selected Pages]                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: BULK FETCH with PROGRESS                           │
│                                                             │
│  ⚡ Fetching pages...                                       │
│  ━━━━━━━━━━━━░░░░░░░░ 60%                                   │
│                                                             │
│  Batch 6 of 9 • 27/45 pages fetched                         │
│                                                             │
│  Currently fetching:                                        │
│    ✓ /getting-started                                       │
│    ✓ /faq                                                   │
│    ⟳ /pricing                                               │
│    ⟳ /contact                                               │
│    ⟳ /about-us                                              │
│                                                             │
│  ⚠️ 2 pages failed (will retry)                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: REVIEW & ADD TO KNOWLEDGE BASE                     │
│                                                             │
│  📄 Review Results (43 pages ready)                         │
│                                                             │
│  Filter: [All ▾]  Sort: [Newest ▾]                          │
│                                                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │ ✓ Getting Started Guide                       [×]  │     │
│  │   /getting-started • 2,450 chars                   │     │
│  │   Welcome to our platform. This guide will...      │     │
│  │   [Show More]                                      │     │
│  └────────────────────────────────────────────────────┘     │
│                                                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │ ✗ Pricing Page                           [Retry]   │     │
│  │   /pricing • Failed: Connection timeout            │     │
│  └────────────────────────────────────────────────────┘     │
│                                                             │
│  [Clear All]  [💾 Add 43 Pages to Knowledge Base]           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ✅ Success!                                                │
│                                                             │
│  43 pages added to Knowledge Base                           │
│  Total KB size: 125,000 characters                          │
│                                                             │
│  [View Knowledge Base]  [Fetch More URLs]                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Feature Breakdown

### Feature 1: URL Discovery

**What:** Automatically find all pages from a domain  
**Why:** User doesn't need to manually list URLs

| Input                      | Output                        |
| -------------------------- | ----------------------------- |
| `https://help.example.com` | List of 47 discoverable pages |

**How it works:**

1. Crawl the domain (follow internal links)
2. Extract all unique URLs
3. Display as selectable list

---

### Feature 2: Bulk Selection

**What:** Checkbox to select which pages to fetch  
**Why:** User can skip irrelevant pages (ToS, login, etc)

**Controls:**

- Select All / Deselect All
- Individual checkbox per URL
- Counter: "Selected: 45 of 47"

---

### Feature 3: Batch Fetch with Progress

**What:** Fetch multiple pages at once with real-time progress  
**Why:** Efficient processing + user knows system is working

**Progress shows:**

- Overall percentage (e.g., 60%)
- Batch info (e.g., "Batch 6 of 9")
- Pages count (e.g., "27/45 fetched")
- Current batch URLs with status icons
- Error count

---

### Feature 4: Review Before Save

**What:** Preview fetched content before adding to KB  
**Why:** Quality control - remove bad/irrelevant content

**Per page shows:**

- Title
- URL
- Content preview (expandable)
- Character count
- Status (success/failed)
- Remove button

---

### Feature 5: Bulk Add to Knowledge Base

**What:** One-click add all reviewed pages to KB  
**Why:** Efficient KB building

**Flow:**

1. Click "Add to Knowledge Base"
2. Confirmation modal with summary
3. Submit to KB API
4. Success feedback

---

## Success Metrics

| Metric               | Before           | Target        | Measurement     |
| -------------------- | ---------------- | ------------- | --------------- |
| Time to add 50 pages | ~30 min (manual) | <3 min        | Stopwatch       |
| Pages discovered     | Only known URLs  | All crawlable | Discovery count |
| Fetch success rate   | N/A              | >95%          | Success/Total   |
| User effort          | 50 clicks        | 3 clicks      | Click count     |

---

## Scope

### ✅ In Scope (V1)

| Feature                           | Priority |
| --------------------------------- | -------- |
| URL discovery from domain         | P0       |
| Bulk URL selection (checkboxes)   | P0       |
| Batch fetch (5 URLs at a time)    | P0       |
| Progress bar with batch status    | P0       |
| Review panel with content preview | P0       |
| Filter: Success/Failed            | P1       |
| Bulk add to Knowledge Base        | P0       |
| Retry failed URLs                 | P1       |

### ❌ Out of Scope (V1)

| Feature                     | Reason                 | Future |
| --------------------------- | ---------------------- | ------ |
| Scheduled/auto fetch        | MVP focus on manual    | V2     |
| Sitemap.xml import          | Discovery handles this | V2     |
| Content editing before save | Review only for V1     | V2     |
| Duplicate detection         | Separate feature       | V2     |
| Multi-domain at once        | Keep it simple         | V2     |

---

### List of URL for Testing

1. <https://www.thebodyshop.co.id/>
2. <https://help-center.qontak.com/hc/en-us/#article>
3. <https://www.lexus.co.id/en.html>
4. <https://www.satudental.com/promo/>
5. <https://www.bekasikab.go.id/>

---

## Technical Notes

### Batch Processing

- Batch size: 5 URLs (configurable)
- Concurrent fetch within batch
- Sequential batches (wait for completion)
- Rate limiting: 200ms delay between URLs

### Session Management

- UUID-based session ID
- In-memory storage (Redis for prod scale)
- Expiry: 1 hour inactive
- Cleanup: 24 hours after completion

### Error Handling

- Retry: 3 attempts with backoff
- Continue on error (don't stop batch)
- Clear error messages per URL

---

## Risks

| Risk                       | Impact              | Mitigation                     |
| -------------------------- | ------------------- | ------------------------------ |
| Target site blocks crawler | Can't discover URLs | Respect robots.txt, rate limit |
| Large site (1000+ pages)   | Slow discovery      | Limit depth, pagination        |
| Many failed fetches        | Incomplete KB       | Retry logic, manual retry      |
| Content quality issues     | Bad KB data         | Review before save             |

---

## Open Questions

| #   | Question                                   | Owner   | Status |
| --- | ------------------------------------------ | ------- | ------ |
| 1   | Max pages per session? (suggest: 100)      | Product | ⏳     |
| 2   | Discovery depth limit? (suggest: 3 levels) | Product | ⏳     |
| 3   | KB API endpoint ready?                     | Backend | ⏳     |
| 4   | Rate limit for crawler?                    | Backend | ⏳     |

---

# JIRA Tickets

## Epic: CHAT-KB-100 - Bulk URL Fetcher for Knowledge Base

---

### CHAT-KB-101: URL Discovery - Backend API

| Field        | Value |
| ------------ | ----- |
| **Type**     | Story |
| **Priority** | High  |
| **Points**   | 5     |
| **Sprint**   | 1     |

**User Story:**  
Sebagai admin chatbot, saya ingin memasukkan domain dan mendapatkan list semua halaman yang bisa di-crawl, supaya tidak perlu input URL satu-satu.

**Endpoint:**

```http
POST /api/knowledge-base/discover-urls
Body: { "domain": "https://help.example.com", "max_depth": 3 }
Response: {
  "success": true,
  "domain": "help.example.com",
  "urls": [
    { "url": "/getting-started", "title": "Getting Started" },
    { "url": "/faq", "title": "FAQ" },
    ...
  ],
  "total": 47
}
```

**Acceptance Criteria:**

- [ ] Crawl domain dan extract semua internal links
- [ ] Return list URL dengan title (dari `<title>` tag)
- [ ] Configurable max depth (default: 3)
- [ ] Respect robots.txt
- [ ] Handle timeout (30 detik max)
- [ ] Return error yang jelas kalau domain tidak bisa diakses

---

### CHAT-KB-102: URL Discovery - Frontend UI

| Field        | Value |
| ------------ | ----- |
| **Type**     | Story |
| **Priority** | High  |
| **Points**   | 3     |
| **Sprint**   | 1     |

**User Story:**  
Sebagai admin chatbot, saya ingin melihat hasil discovery dalam bentuk list yang bisa di-select, supaya bisa pilih halaman mana yang mau di-fetch.

**Acceptance Criteria:**

- [ ] Input field untuk domain URL
- [ ] "Discover" button trigger API call
- [ ] Loading state saat discovering
- [ ] Display list URLs dengan checkbox
- [ ] Show page title + URL path
- [ ] Counter: "Found X pages"
- [ ] Error message jika discovery gagal

**UI:**

```text
Domain: [https://help.example.com    ] [🔍 Discover]

⏳ Discovering pages...

✅ Found 47 pages
┌──────────────────────────────────────┐
│ [✓] Getting Started - /getting-started│
│ [✓] FAQ - /faq                        │
│ [✓] Pricing - /pricing                │
│ [ ] Terms of Service - /tos           │
└──────────────────────────────────────┘
```

---

### CHAT-KB-103: Bulk Selection Controls

| Field        | Value |
| ------------ | ----- |
| **Type**     | Story |
| **Priority** | High  |
| **Points**   | 2     |
| **Sprint**   | 1     |

**User Story:**  
Sebagai admin chatbot, saya ingin bisa select/deselect semua URL sekaligus, supaya tidak perlu klik satu-satu.

**Acceptance Criteria:**

- [ ] "Select All" checkbox di header
- [ ] "Deselect All" option
- [ ] Individual checkbox per URL
- [ ] Counter update real-time: "Selected: 45 of 47"
- [ ] "Fetch Selected" button (disabled jika 0 selected)
- [ ] State persist saat scroll (virtual list jika >100 items)

---

### CHAT-KB-104: Batch Fetch - Backend API

| Field        | Value |
| ------------ | ----- |
| **Type**     | Story |
| **Priority** | High  |
| **Points**   | 8     |
| **Sprint**   | 1     |

**User Story:**  
Sebagai sistem, saya ingin memproses URLs dalam batch supaya tidak overload target server dan bisa track progress.

**Start Fetch Endpoint:**

```http
POST /api/knowledge-base/fetch-pages
Body: {
  "urls": ["url1", "url2", ...],
  "batch_size": 5
}
Response: {
  "session_id": "uuid-xxx",
  "total_urls": 45,
  "total_batches": 9,
  "status": "processing"
}
```

**Progress Endpoint:**

```http
GET /api/knowledge-base/fetch-progress?session_id=xxx
Response: {
  "session_id": "uuid-xxx",
  "status": "processing",
  "current_batch": 3,
  "total_batches": 9,
  "processed": 15,
  "total": 45,
  "percentage": 33,
  "current_batch_urls": [
    { "url": "/page1", "status": "complete" },
    { "url": "/page2", "status": "processing" },
    { "url": "/page3", "status": "pending" }
  ],
    "completed_pages": [...],
    "failed_urls": [
      { "url": "/broken", "error": "404 Not Found" }
    ]
}
```

**Acceptance Criteria:**

- [ ] Process URLs in batches (default: 5)
- [ ] Create session dengan UUID
- [ ] Async processing (return session_id immediately)
- [ ] Track progress per batch
- [ ] Store fetched content (title, body text)
- [ ] Handle errors gracefully (continue to next URL)
- [ ] Retry failed URLs 3x dengan backoff
- [ ] Session cleanup after 24 hours

---

### CHAT-KB-105: Progress Bar UI

| Field          | Value       |
| -------------- | ----------- |
| **Type**       | Story       |
| **Priority**   | High        |
| **Points**     | 5           |
| **Sprint**     | 1           |
| **Depends On** | CHAT-KB-104 |

**User Story:**  
Sebagai admin chatbot, saya ingin melihat progress fetching secara real-time, supaya tahu sistem sedang bekerja dan estimasi selesai.

**Acceptance Criteria:**

- [ ] Progress bar 0–100% dengan animasi smooth
- [ ] Text: "Batch X of Y"
- [ ] Text: "X/Y pages fetched"
- [ ] Polling setiap 1 detik
- [ ] Stop polling saat status = "complete"
- [ ] Show error count jika ada
- [ ] Auto-scroll ke review panel saat selesai

**UI:**

```text
⚡ Fetching pages...
━━━━━━━━━━━━░░░░░░░░ 60%

Batch 6 of 9 • 27/45 pages • ⚠️ 2 failed
```

---

### CHAT-KB-106: Current Batch Status Display

| Field        | Value  |
| ------------ | ------ |
| **Type**     | Story  |
| **Priority** | Medium |
| **Points**   | 3      |
| **Sprint**   | 1      |

**User Story:**  
Sebagai admin chatbot, saya ingin melihat URL mana yang sedang di-fetch saat ini, supaya tahu detail progress.

**Acceptance Criteria:**

- [ ] List URLs dalam current batch
- [ ] Status icon: ⟳ processing, ✓ complete, ✗ failed
- [ ] URL text (truncate jika panjang)
- [ ] Update real-time saat URL selesai
- [ ] Collapse/expand (default: expanded)

**UI:**

```text
Currently fetching:
  ✓ /getting-started
  ✓ /faq
  ⟳ /pricing
  ⟳ /contact
  ⟳ /about-us
```

---

### CHAT-KB-107: Review Panel

| Field        | Value |
| ------------ | ----- |
| **Type**     | Story |
| **Priority** | High  |
| **Points**   | 5     |
| **Sprint**   | 2     |

**User Story:**  
Sebagai admin chatbot, saya ingin review content yang sudah di-fetch sebelum ditambahkan ke KB, supaya bisa memastikan kualitas data.

**Acceptance Criteria:**

- [ ] Card layout per page
- [ ] Show: title, URL, content preview (200 chars)
- [ ] Show: character count
- [ ] Show: status badge (success/failed)
- [ ] "Show More" untuk expand full content
- [ ] Remove button (X) per card
- [ ] Total count di header
- [ ] Empty state jika belum ada data

**UI:**

```text
📄 Review Results (43 pages)

┌─────────────────────────────────────────────┐
│ ✓ Getting Started Guide                [×]  │
│   /getting-started • 2,450 chars            │
│   Welcome to our platform. This guide...    │
│   [Show More]                               │
└─────────────────────────────────────────────┘
```

---

### CHAT-KB-108: Review Filter & Sort

| Field        | Value  |
| ------------ | ------ |
| **Type**     | Story  |
| **Priority** | Medium |
| **Points**   | 2      |
| **Sprint**   | 2      |

**User Story:**  
Sebagai admin chatbot, saya ingin filter hasil fetch berdasarkan status, supaya bisa fokus review yang sukses atau retry yang gagal.

**Acceptance Criteria:**

- [ ] Filter dropdown: All / Success / Failed
- [ ] Show count per filter: "All (45)" "Success (43)" "Failed (2)"
- [ ] Filter applied immediately
- [ ] Clear filter option

---

### CHAT-KB-109: Add to Knowledge Base - Backend API

| Field        | Value |
| ------------ | ----- |
| **Type**     | Story |
| **Priority** | High  |
| **Points**   | 5     |
| **Sprint**   | 2     |

**User Story:**  
Sebagai sistem, saya ingin menerima bulk pages dan menyimpan ke Knowledge Base, supaya chatbot bisa menggunakan content tersebut.

**Endpoint:**

```http
POST /api/knowledge-base/add-pages
Body: {
  "source_domain": "help.example.com",
  "pages": [
    {
      "url": "https://help.example.com/getting-started",
      "title": "Getting Started Guide",
      "content": "Full extracted text...",
      "char_count": 2450
    },
    ...
  ],
  "total_pages": 43,
  "total_characters": 125000
}
Response: {
  "success": true,
  "pages_added": 43,
  "kb_id": "kb-12345",
  "message": "43 pages added to Knowledge Base"
}
```

**Acceptance Criteria:**

- [ ] Validate required fields (url, title, content)
- [ ] Save ke Knowledge Base storage
- [ ] Handle duplicate URLs (update atau skip?)
- [ ] Return success count
- [ ] Return KB identifier
- [ ] Log submission

---

### CHAT-KB-110: Add to KB - Frontend UI

| Field        | Value |
| ------------ | ----- |
| **Type**     | Story |
| **Priority** | High  |
| **Points**   | 3     |
| **Sprint**   | 2     |

**User Story:**  
Sebagai admin chatbot, saya ingin menambahkan semua reviewed pages ke KB dengan satu klik, supaya proses cepat selesai.

**Acceptance Criteria:**

- [ ] "Add to Knowledge Base" button di review panel
- [ ] Button disabled jika tidak ada pages
- [ ] Confirmation modal dengan summary
- [ ] Loading state saat submitting
- [ ] Success message dengan count
- [ ] Clear review panel setelah success
- [ ] Error message jika gagal (dengan retry option)

**UI - Confirmation Modal:**

```text
┌─────────────────────────────────────────────┐
│ 💾 Add to Knowledge Base?                   │
│                                             │
│ You are about to add:                       │
│   • 43 pages                                │
│   • 125,000 characters                      │
│   • Source: help.example.com                │
│                                             │
│ [Cancel]  [✓ Add to Knowledge Base]         │
└─────────────────────────────────────────────┘
```

**UI - Success:**

```text
✅ Success! 43 pages added to Knowledge Base

[View Knowledge Base]  [Fetch More URLs]
```

---

### CHAT-KB-111: Retry Failed URLs

| Field        | Value  |
| ------------ | ------ |
| **Type**     | Story  |
| **Priority** | Medium |
| **Points**   | 3      |
| **Sprint**   | 2      |

**User Story:**  
Sebagai admin chatbot, saya ingin retry fetch untuk URL yang gagal, supaya bisa maximize coverage KB.

**Acceptance Criteria:**

- [ ] "Retry" button per failed URL card
- [ ] "Retry All Failed" button jika ada multiple failures
- [ ] Re-fetch single URL dan update status
- [ ] Move to success list jika berhasil
- [ ] Show updated error jika masih gagal

---

### CHAT-KB-112: End-to-End Testing

| Field        | Value |
| ------------ | ----- |
| **Type**     | Task  |
| **Priority** | High  |
| **Points**   | 5     |
| **Sprint**   | 3     |

**Test Cases:**

- [ ] Discovery: domain dengan 10 pages
- [ ] Discovery: domain dengan 100+ pages
- [ ] Discovery: invalid domain (error handling)
- [ ] Fetch: 10 URLs happy path
- [ ] Fetch: 50 URLs dengan some failures
- [ ] Review: filter success/failed
- [ ] Review: remove individual pages
- [ ] Submit: add to KB success
- [ ] Submit: KB API error (retry)
- [ ] Browser: Chrome, Firefox, Safari
- [ ] Mobile responsive

---

### CHAT-KB-113: Documentation

| Field        | Value  |
| ------------ | ------ |
| **Type**     | Task   |
| **Priority** | Medium |
| **Points**   | 2      |
| **Sprint**   | 3      |

**Deliverables:**

- [ ] API documentation
- [ ] User guide dengan screenshots
- [ ] Release notes

---

# Summary

## Before vs After

| Aspect            | Before (Current) | After (New)               |
| ----------------- | ---------------- | ------------------------- |
| Input URLs        | Manual satu-satu | Auto-discover dari domain |
| Selection         | N/A              | Checkbox bulk select      |
| Fetch             | One at a time    | Batch 5 sekaligus         |
| Progress          | No feedback      | Real-time progress bar    |
| Review            | Langsung save    | Preview dulu baru save    |
| Effort (50 pages) | ~30 menit        | ~3 menit                  |

## Total Effort

| Sprint    | Points | Duration    |
| --------- | ------ | ----------- |
| Sprint 1  | 26     | 1 week      |
| **Total** | **26** | **1 weeks** |
