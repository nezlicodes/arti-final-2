<template>
  <div class="space-y-3">
    <div class="bg-white shadow overflow-hidden relative">
      <!-- Toggle visibility -->
      <button @click="toggleVisibility" class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all" :title="sectionData.is_active ? 'Masquer' : 'Afficher'">
        <Icon :name="sectionData.is_active ? 'heroicons-outline:eye' : 'heroicons-outline:eye-off'" class="h-5 w-5 text-gray-700" />
      </button>

      <!-- Hidden placeholder -->
      <div v-if="!sectionData.is_active" class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
        <div class="text-center">
          <Icon name="heroicons-outline:document-text" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Footer masqué</h3>
          <p class="mt-1 text-sm text-gray-500">Cliquez sur l'icône d'œil pour afficher</p>
        </div>
      </div>

      <!-- Footer Preview -->
      <div v-if="sectionData.is_active">
        <footer class="border-t border-primary bg-primary text-contrast1">
          <div class="mx-auto max-w-7xl px-6 py-8 lg:py-12 lg:px-8">
            <!-- Main Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              <!-- About Section -->
              <div class="space-y-4">
                <div class="flex items-center">
                  <NuxtImg v-if="settings?.site_logo" :src="settings.site_logo" :alt="settings.site_name" class="h-10 w-auto" />
                </div>
                <div class="relative border-2 border-transparent rounded-lg transition-all hover:border-white/30 px-4 py-2">
                  <p class="text-base leading-relaxed max-w-md font-medium">{{ getCurrentContent().about_text }}</p>
                  <button type="button" @click="openFieldEditor('about_text')" class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all transform hover:scale-110">
                    <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
                  </button>
                  <div class="text-xs text-white/70 mt-1">Cliquez pour modifier</div>
                </div>
                <!-- Social placeholder -->
                <div class="flex space-x-4">
                  <div class="h-10 w-10 rounded-full border border-primary flex items-center justify-center opacity-50"><Icon name="ph:facebook-logo" class="w-5 h-5" /></div>
                  <div class="h-10 w-10 rounded-full border border-primary flex items-center justify-center opacity-50"><Icon name="ph:instagram-logo" class="w-5 h-5" /></div>
                  <div class="h-10 w-10 rounded-full border border-primary flex items-center justify-center opacity-50"><Icon name="ph:twitter-logo" class="w-5 h-5" /></div>
                </div>
              </div>

              <!-- Shop Section -->
              <div class="relative border-2 border-transparent rounded-lg transition-all hover:border-white/30 px-4 py-2">
                <h3 class="text-lg font-bold mb-4">{{ getCurrentContent().shop_title }}</h3>
                <ul class="space-y-3">
                  <li v-for="(link, i) in getCurrentContent().shop_links" :key="i" class="text-base font-semibold">{{ link.text }}</li>
                </ul>
                <button type="button" @click="openSectionEditor('shop')" class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all transform hover:scale-110">
                  <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
                </button>
                <div class="text-xs text-white/70 mt-1">Cliquez pour modifier</div>
              </div>

              <!-- Company Section -->
              <div class="relative border-2 border-transparent rounded-lg transition-all hover:border-white/30 px-4 py-2">
                <h3 class="text-lg font-bold mb-4">{{ getCurrentContent().company_title }}</h3>
                <ul class="space-y-3">
                  <li v-for="(link, i) in getCurrentContent().company_links" :key="i" class="text-base font-semibold">{{ link.text }}</li>
                </ul>
                <button type="button" @click="openSectionEditor('company')" class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all transform hover:scale-110">
                  <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
                </button>
                <div class="text-xs text-white/70 mt-1">Cliquez pour modifier</div>
              </div>

              <!-- Support Section -->
              <div class="relative border-2 border-transparent rounded-lg transition-all hover:border-white/30 px-4 py-2">
                <h3 class="text-lg font-bold mb-4">{{ getCurrentContent().support_title }}</h3>
                <ul class="space-y-3">
                  <li v-for="(link, i) in getCurrentContent().support_links" :key="i" class="text-base font-semibold">{{ link.text }}</li>
                </ul>
                <button type="button" @click="openSectionEditor('support')" class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all transform hover:scale-110">
                  <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
                </button>
                <div class="text-xs text-white/70 mt-1">Cliquez pour modifier</div>
              </div>
            </div>

            <!-- Copyright -->
            <div class="mt-8 pt-6 border-t border-primary relative border-2 border-transparent rounded-lg transition-all hover:border-white/30 px-4 py-2">
              <p class="text-sm font-medium text-center md:text-left">{{ getCurrentContent().copyright }}</p>
              <button type="button" @click="openFieldEditor('copyright')" class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all transform hover:scale-110">
                <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
              </button>
              <div class="text-xs text-white/70 mt-1 text-right">Cliquez pour modifier</div>
            </div>
          </div>
        </footer>
      </div>
    </div>

    <!-- Loading/Saving -->
    <div v-if="loading || saving" class="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
      <Icon name="heroicons-outline:refresh" class="w-4 h-4 animate-spin" />
      <span class="text-sm">{{ loading ? 'Chargement...' : 'Enregistrement...' }}</span>
    </div>

    <!-- Field Modal -->
    <div v-if="showFieldModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showFieldModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Modifier {{ getFieldLabel(currentField) }}</h3>
          <button @click="showFieldModal = false" class="text-gray-400 hover:text-gray-500"><Icon name="heroicons-outline:x" class="h-5 w-5" /></button>
        </div>
        <textarea v-if="currentField === 'about_text'" v-model="tempFieldValue" rows="4" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" ref="fieldInput"></textarea>
        <input v-else v-model="tempFieldValue" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" @keyup.enter="saveFieldValue" ref="fieldInput" />
        <div class="mt-4 flex justify-end space-x-3">
          <button type="button" class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" @click="showFieldModal = false"><Icon name="heroicons-outline:x" class="mr-1.5 h-4 w-4" />Annuler</button>
          <button type="button" :disabled="saving" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50" @click="saveFieldValue"><Icon :name="saving ? 'heroicons-outline:refresh' : 'heroicons-outline:check'" class="mr-1.5 h-4 w-4" :class="{ 'animate-spin': saving }" />{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
        </div>
      </div>
    </div>

    <!-- Section Modal -->
    <div v-if="showSectionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showSectionModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Modifier {{ getSectionLabel(currentSection) }}</h3>
          <button @click="showSectionModal = false" class="text-gray-400 hover:text-gray-500"><Icon name="heroicons-outline:x" class="h-5 w-5" /></button>
        </div>
        <div class="space-y-4">
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Titre</label><input v-model="tempSectionData.title" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" ref="sectionTitleInput" /></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-2">Liens (textes)</label><div v-for="(link, i) in tempSectionData.links" :key="i" class="mb-2"><input v-model="link.text" type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" :placeholder="`Lien ${i + 1}`" /></div></div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button type="button" class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" @click="showSectionModal = false"><Icon name="heroicons-outline:x" class="mr-1.5 h-4 w-4" />Annuler</button>
          <button type="button" :disabled="saving" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50" @click="saveSectionValue"><Icon :name="saving ? 'heroicons-outline:refresh' : 'heroicons-outline:check'" class="mr-1.5 h-4 w-4" :class="{ 'animate-spin': saving }" />{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { fetchSection } = useContentSections()
const supabase = useSupabaseClient()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()
const { editorLanguage } = useEditorLanguage()

const props = defineProps({ settings: Object })

const defaultContent = { about_text: 'Boutique en ligne de qualité pour tous vos besoins', copyright: '© 2024 Tous droits réservés', shop_title: 'Boutique', shop_links: [{ text: 'Produits', url: '/products' }, { text: 'Panier', url: '/cart' }], company_title: 'Entreprise', company_links: [{ text: 'À Propos', url: '/#about' }, { text: 'Contact', url: '/#contact' }], support_title: 'Assistance', support_links: [{ text: 'Livraison', url: '/shipping-policies' }, { text: 'Retours', url: '/return-policy' }] }

const loading = ref(true)
const saving = ref(false)
const sectionData = ref({ section_key: 'footer', section_type: 'footer', is_active: true, content_translations: { en: { ...defaultContent }, fr: { ...defaultContent }, ar: { ...defaultContent } } })

const showFieldModal = ref(false)
const showSectionModal = ref(false)
const currentField = ref('')
const currentSection = ref('')
const tempFieldValue = ref('')
const tempSectionData = ref({ title: '', links: [] })
const fieldInput = ref(null)
const sectionTitleInput = ref(null)

const getCurrentContent = () => sectionData.value.content_translations?.[editorLanguage.value] || defaultContent

const loadSectionData = async () => {
  loading.value = true
  try {
    const { data, error } = await fetchSection('footer')
    if (error) throw error
    if (data) sectionData.value = data
    else {
      const { data: newSection, error: createError } = await supabase.from('content_sections').insert({ section_key: 'footer', section_type: 'footer', content_translations: { en: { ...defaultContent }, fr: { ...defaultContent }, ar: { ...defaultContent } }, is_active: true, display_order: 10 }).select().single()
      if (createError) throw createError
      sectionData.value = newSection
    }
  } catch (error) {
    console.error(error); showError('Erreur')
  } finally {
    loading.value = false
  }
}

const saveSectionData = async () => {
  saving.value = true
  try {
    const { data, error } = await supabase.from('content_sections').upsert({ section_key: 'footer', section_type: 'footer', content_translations: sectionData.value.content_translations, is_active: sectionData.value.is_active, display_order: 10 }, { onConflict: 'section_key' }).select().single()
    if (error) throw error
    sectionData.value = data
    showSuccess('Footer enregistré')
  } catch (error) {
    console.error(error); showError('Erreur')
  } finally {
    saving.value = false
  }
}

const toggleVisibility = async () => { sectionData.value.is_active = !sectionData.value.is_active; await saveSectionData() }

const openFieldEditor = (field) => {
  currentField.value = field
  tempFieldValue.value = getCurrentContent()[field] || defaultContent[field]
  showFieldModal.value = true
  nextTick(() => { if (fieldInput.value) fieldInput.value.focus() })
}

const saveFieldValue = async () => {
  if (!sectionData.value.content_translations[editorLanguage.value]) sectionData.value.content_translations[editorLanguage.value] = {}
  sectionData.value.content_translations[editorLanguage.value][currentField.value] = tempFieldValue.value
  showFieldModal.value = false
  await saveSectionData()
}

const openSectionEditor = (section) => {
  currentSection.value = section
  const content = getCurrentContent()
  tempSectionData.value = { title: content[`${section}_title`] || '', links: JSON.parse(JSON.stringify(content[`${section}_links`] || [])) }
  showSectionModal.value = true
  nextTick(() => { if (sectionTitleInput.value) sectionTitleInput.value.focus() })
}

const saveSectionValue = async () => {
  if (!sectionData.value.content_translations[editorLanguage.value]) sectionData.value.content_translations[editorLanguage.value] = {}
  sectionData.value.content_translations[editorLanguage.value][`${currentSection.value}_title`] = tempSectionData.value.title
  sectionData.value.content_translations[editorLanguage.value][`${currentSection.value}_links`] = tempSectionData.value.links
  showSectionModal.value = false
  await saveSectionData()
}

const getFieldLabel = (field) => ({ about_text: 'le texte', copyright: 'le copyright' })[field] || field
const getSectionLabel = (section) => ({ shop: 'Boutique', company: 'Entreprise', support: 'Assistance' })[section] || section

onMounted(async () => { await loadSectionData() })
</script>