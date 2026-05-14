import { PixelPlugin, type PixelPluginConfig } from '@mekari/pixel3'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PixelPlugin, {
  pixelTheme: true, // To enable pixel theme watcher.
  tooltipDirective: true, // To enable tooltip directive.
  toastManager: true, // To enable toast manager.
  maskDirective: true, // To enable mask directive.
} as PixelPluginConfig)
})