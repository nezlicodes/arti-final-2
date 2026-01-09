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
              <h1 class="text-lg font-semibold text-gray-900">{{ $t('admin.general.title') }}</h1>
              <p class="text-xs text-gray-500">{{ $t('admin.general.subtitle') }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="saveSettings"
              :disabled="saving || !hasChanges"
              class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Icon v-if="!saving" name="ph:check-bold" class="w-4 h-4" />
              <Icon v-else name="ph:spinner-bold" class="w-4 h-4 animate-spin" />
              {{ saving ? $t('admin.general.saving') : $t('admin.general.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-3 border-gray-300 border-t-gray-900 mx-auto"></div>
        <p class="mt-4 text-sm text-gray-600">{{ $t('admin.general.loading') }}</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-6">
        <!-- Language Tabs -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center gap-2">
              <Icon name="ph:translate-bold" class="w-5 h-5 text-gray-700" />
              <h2 class="text-base font-semibold text-gray-900">{{ $t('admin.general.editingLanguage') }}</h2>
            </div>
            <p class="mt-1 text-sm text-gray-500">{{ $t('admin.general.languageHint') }}</p>
          </div>
          <div class="p-6">
            <div class="flex gap-2">
              <button
                v-for="lang in languages"
                :key="lang.code"
                @click="currentLanguage = lang.code"
                :class="[
                  'px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                  currentLanguage === lang.code
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ lang.flag }} {{ lang.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Site Information Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-base font-semibold text-gray-900">{{ $t('admin.general.siteInformation') }}</h2>
            <p class="mt-1 text-sm text-gray-500">{{ $t('admin.general.siteInformationDesc') }}</p>
          </div>
          <div class="p-6 space-y-6">
            <!-- Site Name -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                {{ $t('admin.general.siteName') }}
              </label>
              <input
                v-model="siteConfig.site_name_translations[currentLanguage]"
                type="text"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                :placeholder="$t('admin.general.siteNamePlaceholder')"
              />
            </div>

            <!-- Site Description -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                {{ $t('admin.general.siteDescription') }}
              </label>
              <textarea
                v-model="siteConfig.site_description_translations[currentLanguage]"
                rows="4"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                :placeholder="$t('admin.general.siteDescriptionPlaceholder')"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Logos & Icons Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-base font-semibold text-gray-900">{{ $t('admin.general.logosFavicon') }}</h2>
            <p class="mt-1 text-sm text-gray-500">{{ $t('admin.general.logosFaviconDesc') }}</p>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Site Logo -->
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-3">
                  {{ $t('admin.general.siteLogo') }}
                </label>
                <div class="space-y-3">
                  <div v-if="uploadingLogo" class="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div class="animate-spin rounded-full h-8 w-8 border-3 border-gray-300 border-t-gray-900"></div>
                  </div>
                  <div v-else-if="siteConfig.site_logo" class="relative inline-block">
                    <NuxtImg
                      :src="siteConfig.site_logo"
                      alt="Logo"
                      class="h-32 w-auto object-contain bg-gray-50 rounded-lg p-3 border border-gray-200"
                    />
                    <button
                      @click="removeLogo"
                      type="button"
                      class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-sm"
                    >
                      <Icon name="ph:x-bold" class="w-3 h-3" />
                    </button>
                  </div>
                  <div v-else class="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Icon name="ph:image-bold" class="w-12 h-12 text-gray-400" />
                  </div>
                  <label
                    class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Icon name="ph:upload-bold" class="w-4 h-4 mr-2" />
                    {{ $t('admin.general.chooseLogo') }}
                    <input
                      type="file"
                      class="hidden"
                      accept="image/*"
                      @change="handleLogoUpload"
                      :disabled="uploadingLogo"
                    />
                  </label>
                  <p class="text-xs text-gray-500">{{ $t('admin.general.logoHint') }}</p>
                </div>
              </div>

              <!-- Site Favicon -->
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-3">
                  {{ $t('admin.general.siteFavicon') }}
                </label>
                <div class="space-y-3">
                  <div v-if="uploadingFavicon" class="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div class="animate-spin rounded-full h-8 w-8 border-3 border-gray-300 border-t-gray-900"></div>
                  </div>
                  <div v-else-if="siteConfig.site_favicon" class="relative inline-block">
                    <NuxtImg
                      :src="siteConfig.site_favicon"
                      alt="Favicon"
                      class="h-16 w-16 object-contain bg-gray-50 rounded-lg p-2 border border-gray-200"
                    />
                    <button
                      @click="removeFavicon"
                      type="button"
                      class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-sm"
                    >
                      <Icon name="ph:x-bold" class="w-3 h-3" />
                    </button>
                  </div>
                  <div v-else class="flex items-center justify-center h-16 w-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Icon name="ph:image-bold" class="w-6 h-6 text-gray-400" />
                  </div>
                  <label
                    class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Icon name="ph:upload-bold" class="w-4 h-4 mr-2" />
                    {{ $t('admin.general.chooseFavicon') }}
                    <input
                      type="file"
                      class="hidden"
                      accept="image/*"
                      @change="handleFaviconUpload"
                      :disabled="uploadingFavicon"
                    />
                  </label>
                  <p class="text-xs text-gray-500">{{ $t('admin.general.faviconHint') }}</p>
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
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()

// Language management
const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇩🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
]
const currentLanguage = ref('fr')

// State
const loading = ref(true)
const saving = ref(false)
const uploadingLogo = ref(false)
const uploadingFavicon = ref(false)

const siteConfig = ref({
  id: null,
  site_name_translations: { en: '', fr: '', ar: '' },
  site_description_translations: { en: '', fr: '', ar: '' },
  site_logo: '',
  site_favicon: ''
})

const originalConfig = ref(null)

// Check if there are unsaved changes
const hasChanges = computed(() => {
  if (!originalConfig.value) return false
  return JSON.stringify(siteConfig.value) !== JSON.stringify(originalConfig.value)
})

// Load site configuration
const loadSettings = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .single()

    if (error) throw error

    if (data) {
      siteConfig.value = {
        id: data.id,
        site_name_translations: data.site_name_translations || { en: '', fr: '', ar: '' },
        site_description_translations: data.site_description_translations || { en: '', fr: '', ar: '' },
        site_logo: data.site_logo || '',
        site_favicon: data.site_favicon || ''
      }
      originalConfig.value = JSON.parse(JSON.stringify(siteConfig.value))
    } else {
      // Create default config if doesn't exist
      await createDefaultConfig()
    }
  } catch (error) {
    console.error('Error loading settings:', error)
    showError($t('admin.general.errorLoading'))
  } finally {
    loading.value = false
  }
}

// Create default config
const createDefaultConfig = async () => {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .insert({
        site_name_translations: { en: 'My Store', fr: 'Ma Boutique', ar: 'متجري' },
        site_description_translations: { en: 'Welcome to my store', fr: 'Bienvenue dans ma boutique', ar: 'مرحبا بكم في متجري' },
        site_logo: '',
        site_favicon: ''
      })
      .select()
      .single()

    if (error) throw error
    
    siteConfig.value = data
    originalConfig.value = JSON.parse(JSON.stringify(data))
  } catch (error) {
    console.error('Error creating default config:', error)
    showError($t('admin.general.errorCreating'))
  }
}

// Save settings
const saveSettings = async () => {
  saving.value = true
  try {
    const { error } = await supabase
      .from('site_config')
      .update({
        site_name_translations: siteConfig.value.site_name_translations,
        site_description_translations: siteConfig.value.site_description_translations,
        site_logo: siteConfig.value.site_logo,
        site_favicon: siteConfig.value.site_favicon,
        updated_at: new Date().toISOString()
      })
      .eq('id', siteConfig.value.id)

    if (error) throw error

    originalConfig.value = JSON.parse(JSON.stringify(siteConfig.value))
    showSuccess($t('admin.general.savedSuccess'))
  } catch (error) {
    console.error('Error saving settings:', error)
    showError($t('admin.general.errorSaving'))
  } finally {
    saving.value = false
  }
}

// Handle logo upload
const handleLogoUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  uploadingLogo.value = true
  try {
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error($t('admin.general.errorFileSize2MB'))
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `logo-${Date.now()}.${fileExt}`
    const filePath = `settings/${fileName}`

    // Delete old logo if exists
    if (siteConfig.value.site_logo) {
      const oldFileName = siteConfig.value.site_logo.split('/').pop()
      if (oldFileName) {
        await supabase.storage.from('site').remove([`settings/${oldFileName}`])
      }
    }

    // Upload new logo
    const { error: uploadError } = await supabase.storage
      .from('site')
      .upload(filePath, file, { upsert: true, cacheControl: '3600' })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from('site').getPublicUrl(filePath)
    siteConfig.value.site_logo = publicUrl
  } catch (error) {
    console.error('Upload error:', error)
    showError(error.message || $t('admin.general.errorUpload'))
  } finally {
    uploadingLogo.value = false
    event.target.value = ''
  }
}

// Handle favicon upload
const handleFaviconUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  uploadingFavicon.value = true
  try {
    // Validate file size (1MB max)
    if (file.size > 1 * 1024 * 1024) {
      throw new Error($t('admin.general.errorFileSize1MB'))
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `favicon-${Date.now()}.${fileExt}`
    const filePath = `settings/${fileName}`

    // Delete old favicon if exists
    if (siteConfig.value.site_favicon) {
      const oldFileName = siteConfig.value.site_favicon.split('/').pop()
      if (oldFileName) {
        await supabase.storage.from('site').remove([`settings/${oldFileName}`])
      }
    }

    // Upload new favicon
    const { error: uploadError } = await supabase.storage
      .from('site')
      .upload(filePath, file, { upsert: true, cacheControl: '3600' })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from('site').getPublicUrl(filePath)
    siteConfig.value.site_favicon = publicUrl
  } catch (error) {
    console.error('Upload error:', error)
    showError(error.message || $t('admin.general.errorUpload'))
  } finally {
    uploadingFavicon.value = false
    event.target.value = ''
  }
}

// Remove logo
const removeLogo = async () => {
  if (!siteConfig.value.site_logo) return

  try {
    const fileName = siteConfig.value.site_logo.split('/').pop()
    if (fileName) {
      await supabase.storage.from('site').remove([`settings/${fileName}`])
    }
    siteConfig.value.site_logo = ''
  } catch (error) {
    console.error('Delete error:', error)
    showError($t('admin.general.errorDelete'))
  }
}

// Remove favicon
const removeFavicon = async () => {
  if (!siteConfig.value.site_favicon) return

  try {
    const fileName = siteConfig.value.site_favicon.split('/').pop()
    if (fileName) {
      await supabase.storage.from('site').remove([`settings/${fileName}`])
    }
    siteConfig.value.site_favicon = ''
  } catch (error) {
    console.error('Delete error:', error)
    showError($t('admin.general.errorDelete'))
  }
}

onMounted(async () => {
  await loadSettings()
})

useHead(() => ({
  title: $t('admin.general.pageTitle'),
  meta: [
    {
      name: 'description',
      content: $t('admin.general.pageDescription')
    }
  ]
}))
</script>