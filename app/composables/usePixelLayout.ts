import { computed } from 'vue'
import { css } from '@mekari/pixel3'

export const SIDEBAR_WIDTH = '240px'
export const TOPBAR_HEIGHT = '56px'

export function usePixelLayout() {
  const pixelContentAttrs = computed(() => ({
    class: css({
      display: 'flex',
      flexDirection: 'column',
      flexGrow: '1',
      minH: '100svh',
      bg: 'background.surface',
    })
  }))

  return { pixelContentAttrs, SIDEBAR_WIDTH, TOPBAR_HEIGHT }
}
