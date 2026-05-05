<template>
  <main data-pixel-component="PixelContent" v-bind="pixelContentAttrs">

    <!-- ═══════════════════════════════════════════
         PAGE HEADER
         Ubah: judul halaman + label tombol aksi
    ═══════════════════════════════════════════ -->
    <MpFlex justify="space-between" align-items="center" px="6" py="1.063rem">
      <MpText size="h1" weight="semiBold">Page Title</MpText>
      <MpButton left-icon="add">Action</MpButton>
    </MpFlex>

    <!-- ═══════════════════════════════════════════
         CONTENT AREA — taruh semua konten di sini
    ═══════════════════════════════════════════ -->
    <div :class="contentAreaClass">

      <!-- ────────────────────────────────────────
           CONTOH BLOK — hapus yang tidak dipakai
      ──────────────────────────────────────────── -->

      <!-- Stats row -->
      <!-- <MpFlex gap="4" mb="6">
        <div :class="cardClass">
          <MpText size="label" color="text.secondary">Total</MpText>
          <MpText size="h1" weight="semiBold">1,234</MpText>
        </div>
        <div :class="cardClass">
          <MpText size="label" color="text.secondary">Active</MpText>
          <MpText size="h1" weight="semiBold">567</MpText>
        </div>
      </MpFlex> -->

      <!-- Empty state -->
      <MpFlex
        direction="column"
        alignItems="center"
        justify="center"
        gap="3"
        :style="{ minHeight: '320px' }"
      >
        <MpIcon name="doc" size="sm" color="icon.default" />
        <MpFlex direction="column" alignItems="center" gap="1">
          <MpText size="label" weight="semiBold">Belum ada data</MpText>
          <MpText size="label-small" color="text.secondary">Mulai dengan menambahkan item pertama</MpText>
        </MpFlex>
        <MpButton variant="secondary" left-icon="add">Tambah</MpButton>
      </MpFlex>

      <!-- ────────────────────────────────────────
           MULAI EDIT KONTEN DI ATAS SINI
      ──────────────────────────────────────────── -->

    </div>
  </main>
</template>

<script setup lang="ts">
  import { MpButton, MpFlex, MpText, MpIcon, css } from '@mekari/pixel3'
  import { usePixelLayout } from '~/composables/usePixelLayout'

  // ─── Wajib ada di setiap halaman ───────────────
  definePageMeta({ layout: 'default' })
  const { pixelContentAttrs } = usePixelLayout()

  // ─── Content area wrapper ──────────────────────
  const contentAreaClass = css({
    bg: 'background.neutral',
    borderTopWidth: '1px',
    borderLeftWidth: '1px',
    borderColor: 'border.default',
    roundedTopLeft: 'md',
    p: 6,
    flexGrow: '1',
  })

  // ─── Reusable card style ───────────────────────
  // const cardClass = css({
  //   bg: 'background.surface',
  //   borderWidth: '1px',
  //   borderColor: 'border.default',
  //   rounded: 'md',
  //   p: 4,
  //   flex: '1',
  // })
</script>
