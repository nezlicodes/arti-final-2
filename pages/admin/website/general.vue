<template>
  <div class="max-w-7xl pt-6 mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="mr-3">
            <div class="p-2 bg-blue-50 rounded-lg">
              <Icon name="heroicons-outline:cog" class="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 leading-tight">
              Paramètres généraux du site
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Gérez les informations de base et l'apparence de votre site
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
        <p class="mt-4 text-sm text-gray-600">Chargement des paramètres...</p>
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Language Tabs -->
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="heroicons-outline:translate" class="w-5 h-5 text-blue-600" />
          <label class="text-sm font-medium text-gray-700">
            Langue d'édition
          </label>
        </div>
        <div class="flex gap-2">
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="currentLanguage = lang.code"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-all',
              currentLanguage === lang.code
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ lang.flag }} {{ lang.name }}
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-2">
          Les modifications seront enregistrées pour la langue {{ languages.find(l => l.code === currentLanguage)?.name }}
        </p>
      </div>

      <!-- Site Information Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Informations du site
        </h2>
        <div class="space-y-4">
          <!-- Site Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nom du site
            </label>
            <input
              v-model="siteConfig.site_name_translations[currentLanguage]"
              type="text"
              class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nom de votre site"
            />
          </div>

          <!-- Site Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description du site
            </label>
            <textarea
              v-model="siteConfig.site_description_translations[currentLanguage]"
              rows="3"
              class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description de votre site"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Logos & Icons Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Logo et favicon
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Site Logo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Logo du site
            </label>
            <div class="space-y-3">
              <div v-if="uploadingLogo" class="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
                <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
              </div>
              <div v-else-if="siteConfig.site_logo" class="relative inline-block">
                <NuxtImg
                  :src="siteConfig.site_logo"
                  alt="Logo"
                  class="h-32 w-auto object-contain bg-gray-50 rounded-lg p-2"
                />
                <button
                  @click="removeLogo"
                  type="button"
                  class="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                >
                  <Icon name="heroicons-outline:x" class="w-4 h-4" />
                </button>
              </div>
              <div v-else class="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Icon name="heroicons-outline:photograph" class="w-12 h-12 text-gray-400" />
              </div>
              <label
                class="inline-flex items-center px-4 py-2 border border-blue-500 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 cursor-pointer"
              >
                <Icon name="heroicons-outline:upload" class="w-4 h-4 mr-2" />
                Choisir un logo
                <input
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="handleLogoUpload"
                  :disabled="uploadingLogo"
                />
              </label>
              <p class="text-xs text-gray-500">PNG, JPG recommandé. Max 2MB</p>
            </div>
          </div>

          <!-- Site Favicon -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Favicon
            </label>
            <div class="space-y-3">
              <div v-if="uploadingFavicon" class="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
                <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
              </div>
              <div v-else-if="siteConfig.site_favicon" class="relative inline-block">
                <NuxtImg
                  :src="siteConfig.site_favicon"
                  alt="Favicon"
                  class="h-16 w-16 object-contain bg-gray-50 rounded-lg p-2"
                />
                <button
                  @click="removeFavicon"
                  type="button"
                  class="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                >
                  <Icon name="heroicons-outline:x" class="w-4 h-4" />
                </button>
              </div>
              <div v-else class="flex items-center justify-center h-16 w-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Icon name="heroicons-outline:photograph" class="w-6 h-6 text-gray-400" />
              </div>
              <label
                class="inline-flex items-center px-4 py-2 border border-blue-500 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 cursor-pointer"
              >
                <Icon name="heroicons-outline:upload" class="w-4 h-4 mr-2" />
                Choisir un favicon
                <input
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="handleFaviconUpload"
                  :disabled="uploadingFavicon"
                />
              </label>
              <p class="text-xs text-gray-500">ICO, PNG 32x32px recommandé</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div v-if="hasChanges" class="flex items-center text-sm text-amber-600">
            <Icon name="heroicons-outline:exclamation-circle" class="w-4 h-4 mr-1" />
            Modifications non enregistrées
          </div>
          <div class="flex-1 flex justify-end">
            <button
              @click="saveSettings"
              :disabled="saving || !hasChanges"
              :class="[
                'inline-flex items-center px-6 py-2 rounded-lg text-sm font-medium transition-colors',
                saving || !hasChanges
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              ]"
            >
              <Icon
                :name="saving ? 'heroicons-outline:refresh' : 'heroicons-outline:check'"
                class="w-4 h-4 mr-2"
                :class="{ 'animate-spin': saving }"
              />
              {{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
    showError('Impossible de charger les paramètres')
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
    showError('Erreur lors de la création de la configuration')
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
    showSuccess('Paramètres enregistrés avec succès')
  } catch (error) {
    console.error('Error saving settings:', error)
    showError('Erreur lors de l\'enregistrement')
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
      throw new Error('L\'image doit faire moins de 2 Mo')
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
    showError(error.message || 'Erreur lors du téléchargement')
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
      throw new Error('L\'image doit faire moins de 1 Mo')
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
    showError(error.message || 'Erreur lors du téléchargement')
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
    showError('Erreur lors de la suppression')
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
    showError('Erreur lors de la suppression')
  }
}

onMounted(async () => {
  await loadSettings()
})

useHead({
  title: 'Paramètres généraux',
  meta: [
    {
      name: 'description',
      content: 'Gérez les paramètres généraux de votre site'
    }
  ]
})
</script>