<template>
  <div class="min-h-screen bg-[#f1f1f1]">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <NuxtLink to="/admin/website" class="text-gray-400 hover:text-gray-600">
              <Icon name="ph:arrow-left-bold" class="w-5 h-5" />
            </NuxtLink>
            <div>
              <h1 class="text-lg font-semibold text-gray-900">{{ $t('admin.colors.title') }}</h1>
              <p class="text-xs text-gray-500">{{ $t('admin.colors.subtitle') }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="saveColors"
              :disabled="saving || !hasChanges"
              class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Icon v-if="!saving" name="ph:check-bold" class="w-4 h-4" />
              <Icon v-else name="ph:spinner-bold" class="w-4 h-4 animate-spin" />
              {{ saving ? $t('admin.colors.saving') : $t('admin.colors.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-3 border-gray-300 border-t-gray-900 mx-auto"></div>
        <p class="mt-4 text-sm text-gray-600">{{ $t('admin.colors.loadingColors') }}</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left: Color Settings -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-base font-semibold text-gray-900">{{ $t('admin.colors.colorsTitle') }}</h2>
              <p class="mt-1 text-sm text-gray-500">{{ $t('admin.colors.colorsSubtitle') }}</p>
            </div>
            
            <div class="p-6 space-y-0">
              <!-- Primary -->
              <div class="flex items-center justify-between py-4 border-b border-gray-100">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-900">{{ $t('admin.colors.primary') }}</label>
                  <p class="text-xs text-gray-500 mt-0.5">{{ $t('admin.colors.primaryDesc') }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <input :value="primaryColorHex" @input="updatePrimaryFromHex" type="text" class="w-28 px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" placeholder="#000000"/>
                  <div class="relative group">
                    <input :value="primaryColorHex" @input="updatePrimaryFromHex" type="color" class="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-all shadow-sm hover:shadow-md" style="padding: 3px;"/>
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Icon name="ph:palette-bold" class="w-3 h-3 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Primary Contrast -->
              <div class="flex items-center justify-between py-4 border-b border-gray-100">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-900">{{ $t('admin.colors.primaryContrast') }}</label>
                  <p class="text-xs text-gray-500 mt-0.5">{{ $t('admin.colors.primaryContrastDesc') }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <input :value="primaryContrastHex" @input="updatePrimaryContrastFromHex" type="text" class="w-28 px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" placeholder="#FFFFFF"/>
                  <div class="relative group">
                    <input :value="primaryContrastHex" @input="updatePrimaryContrastFromHex" type="color" class="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-all shadow-sm hover:shadow-md" style="padding: 3px;"/>
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Icon name="ph:palette-bold" class="w-3 h-3 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Secondary -->
              <div class="flex items-center justify-between py-4 border-b border-gray-100">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-900">{{ $t('admin.colors.secondary') }}</label>
                  <p class="text-xs text-gray-500 mt-0.5">{{ $t('admin.colors.secondaryDesc') }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <input :value="secondaryColorHex" @input="updateSecondaryFromHex" type="text" class="w-28 px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" placeholder="#000000"/>
                  <div class="relative group">
                    <input :value="secondaryColorHex" @input="updateSecondaryFromHex" type="color" class="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-all shadow-sm hover:shadow-md" style="padding: 3px;"/>
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Icon name="ph:palette-bold" class="w-3 h-3 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Secondary Contrast -->
              <div class="flex items-center justify-between py-4 border-b border-gray-100">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-900">{{ $t('admin.colors.secondaryContrast') }}</label>
                  <p class="text-xs text-gray-500 mt-0.5">{{ $t('admin.colors.secondaryContrastDesc') }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <input :value="secondaryContrastHex" @input="updateSecondaryContrastFromHex" type="text" class="w-28 px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" placeholder="#FFFFFF"/>
                  <div class="relative group">
                    <input :value="secondaryContrastHex" @input="updateSecondaryContrastFromHex" type="color" class="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-all shadow-sm hover:shadow-md" style="padding: 3px;"/>
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Icon name="ph:palette-bold" class="w-3 h-3 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Background -->
              <div class="flex items-center justify-between py-4 border-b border-gray-100">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-900">{{ $t('admin.colors.background') }}</label>
                  <p class="text-xs text-gray-500 mt-0.5">{{ $t('admin.colors.backgroundDesc') }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <input :value="bodyBgHex" @input="updateBodyBgFromHex" type="text" class="w-28 px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" placeholder="#FFFFFF"/>
                  <div class="relative group">
                    <input :value="bodyBgHex" @input="updateBodyBgFromHex" type="color" class="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-all shadow-sm hover:shadow-md" style="padding: 3px;"/>
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Icon name="ph:palette-bold" class="w-3 h-3 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Text -->
              <div class="flex items-center justify-between py-4">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-900">{{ $t('admin.colors.text') }}</label>
                  <p class="text-xs text-gray-500 mt-0.5">{{ $t('admin.colors.textDesc') }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <input :value="textColorHex" @input="updateTextColorFromHex" type="text" class="w-28 px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" placeholder="#000000"/>
                  <div class="relative group">
                    <input :value="textColorHex" @input="updateTextColorFromHex" type="color" class="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-all shadow-sm hover:shadow-md" style="padding: 3px;"/>
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Icon name="ph:palette-bold" class="w-3 h-3 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Preview -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-base font-semibold text-gray-900">{{ $t('admin.colors.previewTitle') }}</h2>
              <p class="mt-1 text-sm text-gray-500">{{ $t('admin.colors.previewSubtitle') }}</p>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Buttons -->
              <div class="space-y-4">
                <div>
                  <p class="text-xs font-medium text-gray-700 mb-2">{{ $t('admin.colors.primaryButton') }}</p>
                  <button type="button" class="w-full px-4 py-2.5 rounded-lg text-sm font-semibold" :style="{ backgroundColor: primaryColorHex, color: primaryContrastHex }">
                    {{ $t('admin.colors.addToCart') }}
                  </button>
                </div>
                
                <div>
                  <p class="text-xs font-medium text-gray-700 mb-2">{{ $t('admin.colors.secondaryButton') }}</p>
                  <button type="button" class="w-full px-4 py-2.5 rounded-lg text-sm font-semibold" :style="{ backgroundColor: secondaryColorHex, color: secondaryContrastHex }">
                    {{ $t('admin.colors.viewDetails') }}
                  </button>
                </div>
              </div>

              <!-- Swatches -->
              <div class="pt-4 border-t border-gray-200">
                <p class="text-xs font-medium text-gray-700 mb-3">{{ $t('admin.colors.colorPalette') }}</p>
                <div class="grid grid-cols-3 gap-2">
                  <div class="text-center">
                    <div class="w-full h-12 rounded-lg border border-gray-200" :style="{ backgroundColor: primaryColorHex }"></div>
                    <p class="text-[10px] text-gray-600 mt-1 font-mono">{{ primaryColorHex }}</p>
                  </div>
                  <div class="text-center">
                    <div class="w-full h-12 rounded-lg border border-gray-200" :style="{ backgroundColor: secondaryColorHex }"></div>
                    <p class="text-[10px] text-gray-600 mt-1 font-mono">{{ secondaryColorHex }}</p>
                  </div>
                  <div class="text-center">
                    <div class="w-full h-12 rounded-lg border border-gray-200" :style="{ backgroundColor: bodyBgHex }"></div>
                    <p class="text-[10px] text-gray-600 mt-1 font-mono">{{ bodyBgHex }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t: $t } = useI18n()
const supabase = useSupabaseClient()
const { showError, showSuccess } = useErrorModal()

const loading = ref(true)
const saving = ref(false)

const colors = ref({
  id: null,
  primary_color: '37, 99, 235',
  primary_contrast_color: '255, 255, 255',
  secondary_color: '107, 114, 128',
  secondary_contrast_color: '255, 255, 255',
  body_bg: '255, 255, 255',
  text_color: '17, 24, 39'
})

const originalColors = ref(null)

const primaryRgb = ref({ r: 37, g: 99, b: 235 })
const primaryContrastRgb = ref({ r: 255, g: 255, b: 255 })
const secondaryRgb = ref({ r: 107, g: 114, b: 128 })
const secondaryContrastRgb = ref({ r: 255, g: 255, b: 255 })
const bodyBgRgb = ref({ r: 255, g: 255, b: 255 })
const textColorRgb = ref({ r: 17, g: 24, b: 39 })

// Helper functions
const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

const rgbStringToObject = (rgbString) => {
  const [r, g, b] = rgbString.split(',').map(c => parseInt(c.trim()))
  return { r: r || 0, g: g || 0, b: b || 0 }
}

const primaryColorHex = computed(() => rgbToHex(primaryRgb.value.r, primaryRgb.value.g, primaryRgb.value.b))
const primaryContrastHex = computed(() => rgbToHex(primaryContrastRgb.value.r, primaryContrastRgb.value.g, primaryContrastRgb.value.b))
const secondaryColorHex = computed(() => rgbToHex(secondaryRgb.value.r, secondaryRgb.value.g, secondaryRgb.value.b))
const secondaryContrastHex = computed(() => rgbToHex(secondaryContrastRgb.value.r, secondaryContrastRgb.value.g, secondaryContrastRgb.value.b))
const bodyBgHex = computed(() => rgbToHex(bodyBgRgb.value.r, bodyBgRgb.value.g, bodyBgRgb.value.b))
const textColorHex = computed(() => rgbToHex(textColorRgb.value.r, textColorRgb.value.g, textColorRgb.value.b))

const hasChanges = computed(() => {
  if (!originalColors.value) return false
  return JSON.stringify(colors.value) !== JSON.stringify(originalColors.value)
})

const updatePrimaryFromHex = (e) => {
  const rgb = hexToRgb(e.target.value)
  primaryRgb.value = rgb
  colors.value.primary_color = `${rgb.r}, ${rgb.g}, ${rgb.b}`
}

const updatePrimaryFromRgb = () => {
  colors.value.primary_color = `${primaryRgb.value.r}, ${primaryRgb.value.g}, ${primaryRgb.value.b}`
}

const updatePrimaryContrastFromHex = (e) => {
  const rgb = hexToRgb(e.target.value)
  primaryContrastRgb.value = rgb
  colors.value.primary_contrast_color = `${rgb.r}, ${rgb.g}, ${rgb.b}`
}

const updatePrimaryContrastFromRgb = () => {
  colors.value.primary_contrast_color = `${primaryContrastRgb.value.r}, ${primaryContrastRgb.value.g}, ${primaryContrastRgb.value.b}`
}

const updateSecondaryFromHex = (e) => {
  const rgb = hexToRgb(e.target.value)
  secondaryRgb.value = rgb
  colors.value.secondary_color = `${rgb.r}, ${rgb.g}, ${rgb.b}`
}

const updateSecondaryFromRgb = () => {
  colors.value.secondary_color = `${secondaryRgb.value.r}, ${secondaryRgb.value.g}, ${secondaryRgb.value.b}`
}

const updateSecondaryContrastFromHex = (e) => {
  const rgb = hexToRgb(e.target.value)
  secondaryContrastRgb.value = rgb
  colors.value.secondary_contrast_color = `${rgb.r}, ${rgb.g}, ${rgb.b}`
}

const updateSecondaryContrastFromRgb = () => {
  colors.value.secondary_contrast_color = `${secondaryContrastRgb.value.r}, ${secondaryContrastRgb.value.g}, ${secondaryContrastRgb.value.b}`
}

const updateBodyBgFromHex = (e) => {
  const rgb = hexToRgb(e.target.value)
  bodyBgRgb.value = rgb
  colors.value.body_bg = `${rgb.r}, ${rgb.g}, ${rgb.b}`
}

const updateBodyBgFromRgb = () => {
  colors.value.body_bg = `${bodyBgRgb.value.r}, ${bodyBgRgb.value.g}, ${bodyBgRgb.value.b}`
}

const updateTextColorFromHex = (e) => {
  const rgb = hexToRgb(e.target.value)
  textColorRgb.value = rgb
  colors.value.text_color = `${rgb.r}, ${rgb.g}, ${rgb.b}`
}

const updateTextColorFromRgb = () => {
  colors.value.text_color = `${textColorRgb.value.r}, ${textColorRgb.value.g}, ${textColorRgb.value.b}`
}

const loadColors = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('id, primary_color, primary_contrast_color, secondary_color, secondary_contrast_color, body_bg, text_color')
      .single()

    if (error) throw error

    if (data) {
      colors.value = {
        id: data.id,
        primary_color: data.primary_color || '59, 130, 246',
        primary_contrast_color: data.primary_contrast_color || '255, 255, 255',
        secondary_color: data.secondary_color || '236, 72, 153',
        secondary_contrast_color: data.secondary_contrast_color || '255, 255, 255',
        body_bg: data.body_bg || '255, 255, 255',
        text_color: data.text_color || '17, 24, 39'
      }

      primaryRgb.value = rgbStringToObject(colors.value.primary_color)
      primaryContrastRgb.value = rgbStringToObject(colors.value.primary_contrast_color)
      secondaryRgb.value = rgbStringToObject(colors.value.secondary_color)
      secondaryContrastRgb.value = rgbStringToObject(colors.value.secondary_contrast_color)
      bodyBgRgb.value = rgbStringToObject(colors.value.body_bg)
      textColorRgb.value = rgbStringToObject(colors.value.text_color)

      originalColors.value = JSON.parse(JSON.stringify(colors.value))
    }
  } catch (error) {
    console.error('Error:', error)
    showError($t('admin.colors.errorLoading'))
  } finally {
    loading.value = false
  }
}

const saveColors = async () => {
  saving.value = true
  try {
    const { error } = await supabase
      .from('site_config')
      .update({
        primary_color: colors.value.primary_color,
        primary_contrast_color: colors.value.primary_contrast_color,
        secondary_color: colors.value.secondary_color,
        secondary_contrast_color: colors.value.secondary_contrast_color,
        body_bg: colors.value.body_bg,
        text_color: colors.value.text_color,
        updated_at: new Date().toISOString()
      })
      .eq('id', colors.value.id)

    if (error) throw error

    originalColors.value = JSON.parse(JSON.stringify(colors.value))
    showSuccess($t('admin.colors.savedSuccess'))
  } catch (error) {
    console.error('Error:', error)
    showError($t('admin.colors.errorSaving'))
  } finally {
    saving.value = false
  }
}

onMounted(() => loadColors())

useHead(() => ({
  title: $t('admin.colors.pageTitle'),
  meta: [{ name: 'description', content: $t('admin.colors.pageDescription') }]
}))
</script>
