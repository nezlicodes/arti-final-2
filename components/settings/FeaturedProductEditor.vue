<template>
  <div class="space-y-3">
    <div class="bg-white shadow overflow-hidden relative rounded-xl">
      <div class="absolute top-4 right-4 z-50 flex items-center gap-2">
        <button @click="toggleVisibility" class="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg" :title="sectionData.is_active ? 'Hide Section' : 'Show Section'">
          <Icon :name="sectionData.is_active ? 'heroicons-outline:eye' : 'heroicons-outline:eye-off'" class="h-5 w-5 text-gray-700" />
        </button>
      </div>

      <div v-if="!sectionData.is_active" class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
        <div class="text-center">
          <Icon name="heroicons-outline:information-circle" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Featured Products section hidden</h3>
          <p class="mt-1 text-sm text-gray-500">Click the eye icon to show the section</p>
        </div>
      </div>

      <section v-else class="py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-8">
            <div class="relative inline-block group">
              <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {{ currentTitle || 'Click to add title' }}
              </h2>
              <button @click="openFieldEditor('title')" class="absolute -top-2 -right-10 bg-primary p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100" title="Edit title">
                <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
              </button>
            </div>
            <div class="w-16 h-0.5 bg-primary mx-auto mb-4"></div>
            <div class="relative inline-block group">
              <p class="text-base text-gray-600 max-w-2xl mx-auto">
                {{ currentSubtitle || 'Click to add subtitle' }}
              </p>
              <button @click="openFieldEditor('subtitle')" class="absolute -top-2 -right-10 bg-primary p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100" title="Edit subtitle">
                <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
              </button>
            </div>
          </div>

          <div class="mt-8 max-w-3xl mx-auto text-left">
            <template v-if="!selectedProductId">
              <label class="block text-sm font-medium text-gray-700 mb-1">Select product</label>
              <div class="flex gap-2 mb-3">
                <input v-model="productSearch" type="text" class="flex-1 border rounded-lg px-3 py-2" placeholder="Search products..." />
                <button @click="loadProducts" type="button" class="px-3 py-2 border rounded-lg hover:bg-gray-50">Refresh</button>
              </div>
              <select v-model="selectedProductId" @change="handleProductChange" class="w-full border rounded-lg px-3 py-2">
                <option :value="null">-- None --</option>
                <option v-for="p in filteredProducts" :key="p.id" :value="p.id">
                  {{ p.name_translations?.[editorLanguage] || p.name_translations?.fr || p.name || `#${p.id}` }}
                </option>
              </select>
            </template>

            <template v-else>
              <div class="p-4 border rounded-lg bg-gray-50">
                <div class="flex items-start gap-4">
                  <NuxtImg v-if="selectedProductImage" :src="selectedProductImage.url" :alt="selectedProductName" class="w-28 h-28 object-cover rounded"/>
                  <div class="flex-1">
                    <div class="font-semibold">{{ selectedProductName }}</div>
                    <div class="text-sm text-gray-600" v-if="selectedProduct?.price != null">{{ formatPrice(selectedProduct.price) }}</div>
                    <div class="text-sm text-gray-500" v-if="selectedProduct?.slug">Slug: {{ selectedProduct.slug }}</div>
                  </div>
                </div>
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Product description ({{ getCurrentLanguageName() }})</label>
                  <textarea v-model="sectionData.content_translations[editorLanguage].product_description" rows="5" class="w-full border rounded-lg px-3 py-2" placeholder="Add a description for the featured product..."></textarea>
                </div>
                <div class="mt-4 flex gap-2">
                  <button type="button" class="px-3 py-2 border rounded-lg hover:bg-white" @click="selectedProductId = null; handleProductChange()">Change product</button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>
    </div>

    <!-- Field Editor Modal -->
    <div v-if="editingField !== null" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" @click.self="closeFieldEditor">
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">{{ getModalTitle() }}</h3>
          <button @click="closeFieldEditor" class="p-1 hover:bg-gray-100 rounded-full"><Icon name="heroicons-outline:x" class="w-5 h-5 text-gray-500" /></button>
        </div>
        <AdminFormField v-if="editingField === 'title'" v-model="editData.content_translations[editorLanguage].title" type="text" label="Section Title" :language-code="editorLanguage" :language-name="getCurrentLanguageName()" />
        <AdminFormField v-else-if="editingField === 'subtitle'" v-model="editData.content_translations[editorLanguage].subtitle" type="text" label="Section Subtitle" :language-code="editorLanguage" :language-name="getCurrentLanguageName()" />
        <div class="flex justify-end gap-3 mt-6">
          <button @click="closeFieldEditor" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          <button @click="saveField" class="px-4 py-2 bg-primary text-contrast1 rounded-lg hover:bg-primary-600">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { editorLanguage } = useEditorLanguage()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()
const supabase = useSupabaseClient()

const SECTION_KEY = 'featured_product'

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'en', name: 'English' }
]

const editingField = ref(null)
const editData = ref({})

const sectionData = ref({
  section_key: SECTION_KEY,
  is_active: true,
  content_translations: {
    fr: { title: '', subtitle: '', product_description: '' },
    ar: { title: '', subtitle: '', product_description: '' },
    en: { title: '', subtitle: '', product_description: '' },
    meta: { selected_product_id: null }
  }
})

const currentTitle = computed(() => sectionData.value.content_translations?.[editorLanguage.value]?.title || '')
const currentSubtitle = computed(() => sectionData.value.content_translations?.[editorLanguage.value]?.subtitle || '')
const currentProductDescription = computed(() => sectionData.value.content_translations?.[editorLanguage.value]?.product_description || '')
const selectedProductId = computed({
  get: () => sectionData.value.content_translations?.meta?.selected_product_id ?? null,
  set: (v) => {
    if (!sectionData.value.content_translations.meta) sectionData.value.content_translations.meta = { selected_product_id: null }
    const num = typeof v === 'string' && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : (v === '' ? null : v)
    sectionData.value.content_translations.meta.selected_product_id = num
  }
})

const getCurrentLanguageName = () => languages.find(l => l.code === editorLanguage.value)?.name || ''

const getModalTitle = () => {
  if (editingField.value === 'title') return 'Edit Section Title'
  if (editingField.value === 'subtitle') return 'Edit Section Subtitle'
  return 'Edit'
}

const products = ref([])
const productSearch = ref('')
const filteredProducts = computed(() => {
  const q = productSearch.value.toLowerCase().trim()
  if (!q) return products.value
  return products.value.filter((p) => {
    const label = (p.name_translations?.[editorLanguage.value] || p.name_translations?.fr || p.name || '').toLowerCase()
    return label.includes(q)
  })
})

const coerceId = (v) => {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isNaN(n) ? v : n
}

const selectedProduct = computed(() => {
  const id = coerceId(selectedProductId.value)
  return products.value.find(p => p.id === id) || null
})

const selectedProductName = computed(() => {
  const p = selectedProduct.value
  if (!p) return ''
  return p.name_translations?.[editorLanguage.value] || p.name_translations?.fr || p.name || `#${p.id}`
})

const selectedProductImage = computed(() => {
  const p = selectedProduct.value
  const images = p?.images || []
  return images[0] || null
})

const formatPrice = (price) => new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', minimumFractionDigits: 0 }).format(price)

const loadProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, price, name_translations, images:product_images(url)')
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) throw error
    products.value = data || []
  } catch (e) {
    console.error('Error loading products', e)
  }
}

const loadData = async () => {
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .select('id, is_active, content_translations')
      .eq('section_key', SECTION_KEY)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (data) {
      sectionData.value = {
        ...sectionData.value,
        id: data.id,
        is_active: data.is_active ?? true,
        meta: data.meta || { selected_product_id: null },
        content_translations: data.content_translations || sectionData.value.content_translations,
      }
      if (!sectionData.value.content_translations.meta) {
        sectionData.value.content_translations.meta = { selected_product_id: null }
      }
    }
  } catch (error) {
    console.error('Error loading section:', error)
  }
}

const toggleVisibility = async () => {
  sectionData.value.is_active = !sectionData.value.is_active
  await saveSection()
}

const openFieldEditor = (field) => {
  editingField.value = field
  editData.value = JSON.parse(JSON.stringify(sectionData.value))
}

const closeFieldEditor = () => {
  editingField.value = null
  editData.value = {}
}

const saveField = async () => {
  sectionData.value = JSON.parse(JSON.stringify(editData.value))
  await saveSection()
  closeFieldEditor()
}

const saveSection = async () => {
  try {
    const dataToSave = {
      section_key: SECTION_KEY,
      is_active: sectionData.value.is_active,
      content_translations: sectionData.value.content_translations,
    }

    if (sectionData.value.id) {
      const { error } = await supabase
        .from('content_sections')
        .update(dataToSave)
        .eq('id', sectionData.value.id)
      if (error) throw error
    } else {
      const { data, error } = await supabase
        .from('content_sections')
        .insert(dataToSave)
        .select('id, is_active, content_translations')
        .single()
      if (error) throw error
      if (data) sectionData.value.id = data.id
    }

    showSuccess('Saved successfully')
  } catch (error) {
    console.error('Save error:', error)
    showError(`Failed to save: ${error.message}`)
  }
}

const handleProductChange = async () => {
  try {
    await saveSection()
    showSuccess('Product selection saved')
  } catch (e) {
    console.error('Failed to save selection', e)
  }
}

onMounted(async () => { await Promise.all([loadProducts(), loadData()]) })
</script>
