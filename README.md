# Qontak Design Prototype Template

Prototyping template berbasis **Nuxt 4** + **Mekari Pixel 3** untuk tim Qontak. Layout shell (navbar + sidebar) sudah terpasang — kamu cukup fokus pada konten halaman.

---

## Prasyarat

| Tool | Versi minimum | Cek |
|------|--------------|-----|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Git | — | `git -v` |

---

## First Run (Pertama Kali)

```bash
# 1. Clone repo
git clone https://github.com/masfajs/qontak-design.git
cd qontak-design/mystifying-spence-55c131

# 2. Install dependencies
npm install

# 3. Jalankan dev server
npm run dev
```

Buka **http://localhost:3000** — kamu akan melihat layout Qontak dengan sidebar + navbar.

---

## Struktur Project

```
app/
├── layouts/
│   └── default.vue          ← Shell utama: navbar + sidebar (JANGAN diubah)
├── composables/
│   └── usePixelLayout.ts    ← Konstanta layout: SIDEBAR_WIDTH, TOPBAR_HEIGHT (JANGAN diubah)
├── components/
│   └── AppStatusButton.vue  ← Contoh shared component
├── pages/
│   ├── index.vue            ← Halaman Home (canvas utama)
│   └── [nama-halaman].vue   ← Tambahkan halaman baru di sini ✅
└── app.vue                  ← Entry point, aktifkan Token v2.4 (JANGAN diubah)
```

### Yang boleh diubah

| File | Boleh diubah? | Keterangan |
|------|:---:|---|
| `app/pages/index.vue` | ✅ | Canvas utama — isi konten di sini |
| `app/pages/template.vue` | ✅ | Boilerplate — duplikat untuk halaman baru |
| `app/pages/[nama].vue` | ✅ | Buat halaman baru bebas |
| `app/components/*.vue` | ✅ | Tambah shared component |
| `app/layouts/default.vue` | ❌ | Layout shell — jangan diubah |
| `app/composables/usePixelLayout.ts` | ❌ | Konstanta layout |
| `app/app.vue` | ❌ | Entry point global |

---

## Membuat Halaman Baru

### 1. Duplikat `template.vue` sebagai starting point

```bash
cp app/pages/template.vue app/pages/contacts.vue
```

### 2. Edit konten halaman

```vue
<!-- app/pages/contacts.vue -->
<template>
  <main data-pixel-component="PixelContent" v-bind="pixelContentAttrs">

    <!-- Header row: ubah Title dan Action sesuai halaman -->
    <MpFlex justify="space-between" align-items="center" px="6" py="1.063rem">
      <MpText size="h1" weight="semiBold">Contacts</MpText>
      <MpButton>Add Contact</MpButton>
    </MpFlex>

    <!-- Content area: taruh komponen UI di bawah ini -->
    <div :class="contentAreaClass">

      <!-- ✏️ MULAI EDIT DI SINI -->
      <MpText color="text.secondary">Place content here...</MpText>
      <!-- ✏️ SELESAI EDIT DI SINI -->

    </div>
  </main>
</template>

<script setup lang="ts">
  import { MpButton, MpFlex, MpText, css } from '@mekari/pixel3'
  import { usePixelLayout } from '~/composables/usePixelLayout'

  definePageMeta({ layout: 'default' })  // ← wajib ada di setiap halaman

  const { pixelContentAttrs } = usePixelLayout()

  const contentAreaClass = css({
    bg: 'background.neutral',
    borderTopWidth: '1px',
    borderLeftWidth: '1px',
    borderColor: 'border.default',
    roundedTopLeft: 'md',
    p: 6,
    minH: '100svh',
  })
</script>
```

### 3. Akses halaman baru

Buka **http://localhost:3000/contacts** — layout shell otomatis terpasang.

---

## Pixel 3 Component Cheatsheet

### Import

```ts
import { MpFlex, MpText, MpButton, MpIcon, MpAvatar, MpBadge, css } from '@mekari/pixel3'
```

> **Penting:** Pixel components **tidak** auto-import — selalu import manual dari `@mekari/pixel3`.

### Komponen yang sering dipakai

```vue
<!-- Layout -->
<MpFlex gap="4" alignItems="center" direction="column">...</MpFlex>

<!-- Teks -->
<MpText size="h1" weight="semiBold">Judul</MpText>
<MpText size="label" color="text.secondary">Subtitle</MpText>

<!-- Button -->
<MpButton>Primary</MpButton>
<MpButton variant="secondary">Secondary</MpButton>
<MpButton variant="ghost" left-icon="edit">Edit</MpButton>

<!-- Icon -->
<MpIcon name="home" size="sm" color="icon.brand" />
<MpIcon name="home" variant="fill" size="sm" />

<!-- Avatar -->
<MpAvatar name="Rizal Candra" size="lg" />
<MpAvatar src="https://..." size="lg" />

<!-- Badge -->
<MpBadge type="critical" size="sm">NEW</MpBadge>
<MpBadge for="indicator" type="critical" />  <!-- dot badge -->
```

### Design Token v2.4 (warna)

```
Background:  background.surface · background.neutral · background.brand-selected
Text:        text.default · text.secondary · text.link · text.success · text.selected
Icon:        icon.default · icon.brand · icon.success
Border:      border.default · border.bold
```

### Custom styling dengan `css()`

```ts
const cardClass = css({
  bg: 'background.surface',
  borderWidth: '1px',
  borderColor: 'border.default',
  rounded: 'md',
  p: 4,
})
```

---

## Workflow Kontribusi

```
main
 └── claude/mystifying-spence-55c131   ← branch utama template ini

Untuk fitur/halaman baru:
main → buat branch baru → PR → review → merge
```

### Langkah kontribusi

```bash
# Buat branch baru dari main
git checkout main
git pull
git checkout -b feature/halaman-inbox

# Edit/tambah halaman
# ...

# Commit dan push
git add app/pages/inbox.vue
git commit -m "Add Inbox page prototype"
git push origin feature/halaman-inbox

# Buat PR di GitHub
```

---

## Referensi

| Link | Keterangan |
|------|-----------|
| [Pixel 3 Docs](https://docs.mekari.design) | Dokumentasi komponen & token |
| [Pixel Patterns](https://pattern.mekari.design) | Contoh pattern & layout |
| [Figma Pixel 2.4](https://www.figma.com/design/ITbZIdlWAVG7oiN4gftx1g/) | Design file token & komponen |
| [Figma Qontak Patterns](https://www.figma.com/design/ZZI12IoNXy8De4m4tbeU76/) | Pattern Qontak |

---

## Troubleshooting

**Port 3000 sudah dipakai?**
```bash
npm run dev -- --port 3001
```

**Komponen tidak muncul / error import?**
```bash
# Pastikan import dari @mekari/pixel3 (bukan auto-import)
import { MpButton } from '@mekari/pixel3'
```

**CSS variable tidak resolve (warna transparan)?**
```
Gunakan --mp-colors-* bukan --pixel-colors-*
Contoh: var(--mp-colors-background-surface)
```

**Setelah `npm install` ada error?**
```bash
rm -rf node_modules package-lock.json
npm install
```
