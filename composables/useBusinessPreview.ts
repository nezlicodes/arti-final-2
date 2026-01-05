import { BUSINESS_PRESETS, DEFAULT_BUSINESS_ID, type BusinessId, type ThemeColors } from '~/utils/business-presets'

const STORAGE_KEY = 'xone_business_preview'

type StoredPreview = {
  businessId: BusinessId
  colorOverrides?: Partial<ThemeColors>
}

export const useBusinessPreview = () => {
  // During Nitro prerender, Nuxt instance/state can be unavailable.
  // Use a safe fallback so build/prerender does not crash.
  const safeState = <T>(key: string, init: () => T): Ref<T> => {
    try {
      return useState<T>(key, init)
    } catch {
      return ref(init()) as Ref<T>
    }
  }

  const businessId = safeState<BusinessId>('businessPreviewId', () => DEFAULT_BUSINESS_ID)
  const colorOverrides = safeState<Partial<ThemeColors>>('businessPreviewColors', () => ({}))

  const preset = computed(() => BUSINESS_PRESETS[businessId.value] || BUSINESS_PRESETS[DEFAULT_BUSINESS_ID])

  const effectiveColors = computed<ThemeColors>(() => {
    return {
      ...preset.value.colors,
      ...colorOverrides.value
    }
  })

  const load = () => {
    if (!process.client) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed: StoredPreview = JSON.parse(raw)
      if (parsed?.businessId && parsed.businessId in BUSINESS_PRESETS) {
        businessId.value = parsed.businessId
      }
      if (parsed?.colorOverrides && typeof parsed.colorOverrides === 'object') {
        colorOverrides.value = parsed.colorOverrides
      }
    } catch (e) {
      console.error('Failed to load business preview from storage', e)
    }
  }

  const persist = () => {
    if (!process.client) return
    const payload: StoredPreview = {
      businessId: businessId.value,
      colorOverrides: colorOverrides.value
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch (e) {
      console.error('Failed to persist business preview to storage', e)
    }
  }

  const setBusiness = (id: BusinessId) => {
    if (!(id in BUSINESS_PRESETS)) return
    businessId.value = id
    // Reset color overrides when switching business to avoid weird mixes
    colorOverrides.value = {}
    persist()
  }

  const setColorOverrides = (overrides: Partial<ThemeColors>) => {
    colorOverrides.value = { ...colorOverrides.value, ...overrides }
    persist()
  }

  const reset = () => {
    businessId.value = DEFAULT_BUSINESS_ID
    colorOverrides.value = {}
    if (process.client) localStorage.removeItem(STORAGE_KEY)
  }

  // Auto-load once on client
  if (process.client) {
    // prevent reloading on each import
    const loaded = safeState<boolean>('businessPreviewLoaded', () => false)
    if (!loaded.value) {
      load()
      loaded.value = true
    }
  }

  return {
    businessId,
    preset,
    effectiveColors,
    colorOverrides,
    setBusiness,
    setColorOverrides,
    reset
  }
}
