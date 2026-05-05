<script setup lang="ts">
  // Redirect /campaigns → /campaigns/whatsapp (default sub-page)
  definePageMeta({ layout: 'default' })
  await navigateTo('/campaigns/whatsapp', { replace: true })
</script>
