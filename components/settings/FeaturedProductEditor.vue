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
          <h3 class="mt-2 text-sm font-medium text-gray-900">Featured Product section hidden</h3>
          <p class="mt-1 text-sm text-gray-500">Click the eye icon to show the section</p>
        </div>
      </div>

      <section v-else class="x-section relative overflow-hidden">
        <div class="x-container relative px-4 sm:px-6 lg:px-8">
          
          <!-- Section Header -->
          <div class="text-center mb-14">
            <div class="relative inline-block group">
              <h2 class="x-title">
                {{ currentTitle || 'Click to add title' }}
              </h2>
              <button @click="openFieldEditor('title')" class="absolute -top-2 -right-10 bg-primary p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" title="Edit title">
                <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
              </button>
            </div>
            <div class="relative inline-block group mt-2">
              <p class="x-subtitle max-w-2xl mx-auto">
                {{ currentSubtitle || 'Click to add subtitle' }}
              </p>
              <button @click="openFieldEditor('subtitle')" class="absolute -top-2 -right-10 bg-primary p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" title="Edit subtitle">
                <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
              </button>
            </div>
            <div class="x-divider mx-auto"></div>
          </div>

          <!-- Product Selection (when no product selected) -->
          <div v-if="!selectedProductId" class="max-w-3xl mx-auto mb-8">
            <div class="bg-blue-50 border-2 border-dashed border-blue-300 rounded-3xl p-8 text-center">
              <Icon name="ph:package" class="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Select a Featured Product</h3>
              <p class="text-sm text-gray-600 mb-4">Choose a product to feature in this section</p>
              
              <div class="max-w-md mx-auto space-y-3">
                <div class="flex gap-2">
                  <input v-model="productSearch" type="text" class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Search products..." />
                  <button @click="loadProducts" type="button" class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-white text-sm">
                    <Icon name="heroicons-outline:refresh" class="w-4 h-4" />
                  </button>
                </div>
                <div v-if="products.length === 0" class="text-sm text-gray-500 py-4">
                  No products available. Please create products first.
                </div>
                <div v-else>
                  <select v-model="localSelectedProductId" @change="handleProductSelect" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option :value="null">-- Select a product --</option>
                    <option v-for="p in filteredProducts" :key="p.id" :value="p.id">
                      {{ p.name_translations?.[editorLanguage] || p.name_translations?.fr || p.name || `#${p.id}` }}
                    </option>
                  </select>
                  <div class="mt-2 text-xs text-gray-500">
                    Debug: localSelectedProductId = {{ localSelectedProductId }}, selectedProductId = {{ selectedProductId }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Featured Product Card (matching FeaturedProductSection UI) -->
          <div v-else class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
            <!-- Change Product Button -->
            <button 
              @click="clearProductSelection" 
              type="button"
              class="absolute top-4 left-4 z-10 px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg shadow-lg text-sm font-medium text-gray-700 flex items-center gap-2 transition-all"
            >
              <Icon name="heroicons-outline:refresh" class="w-4 h-4" />
              Change Product
            </button>

            <div class="grid lg:grid-cols-2 gap-0">
              
              <!-- Product Image -->
              <div class="relative aspect-square lg:aspect-auto bg-gray-50">
                <NuxtImg
                  v-if="selectedProductImage"
                  :src="selectedProductImage.url"
                  :alt="selectedProductName"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <div class="text-center space-y-4">
                    <Icon name="ph:package" class="w-20 h-20 text-gray-300 mx-auto" />
                    <p class="text-gray-400 font-medium">Product Image</p>
                  </div>
                </div>
              </div>

              <!-- Product Details -->
              <div class="p-8 lg:p-12 flex flex-col justify-center">
                
                <!-- Product Name -->
                <h3 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {{ selectedProductName }}
                </h3>

                <!-- Price -->
                <div class="flex items-baseline space-x-4 mb-8">
                  <span v-if="selectedProduct?.price != null" class="text-4xl lg:text-5xl font-bold text-gray-900">
                    {{ formatPrice(selectedProduct.price) }}
                  </span>
                </div>

                <!-- Description Editor -->
                <div class="mb-8">
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-medium text-gray-700">
                      Product Description ({{ getCurrentLanguageName() }})
                    </label>
                    <button @click="saveDescription" type="button" :disabled="saving" class="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1">
                      <Icon :name="saving ? 'heroicons-outline:refresh' : 'heroicons-outline:check'" class="w-3 h-3" :class="{ 'animate-spin': saving }" />
                      {{ saving ? 'Saving...' : 'Save' }}
                    </button>
                  </div>
                  <textarea 
                    v-model="localDescription" 
                    @blur="saveDescription"
                    rows="4" 
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg text-gray-600 leading-relaxed focus:ring-2 focus:ring-primary focus:border-transparent" 
                    placeholder="Add a description for the featured product..."
                  ></textarea>
                  <p class="text-xs text-gray-500 mt-1">This description will be displayed below the price</p>
                </div>

                <!-- CTA Button Preview -->
                <div class="flex flex-col sm:flex-row gap-4">
                  <div class="flex-1 inline-flex items-center justify-center px-8 py-4 bg-primary text-contrast1 text-lg font-semibold rounded-2xl pointer-events-none opacity-75">
                    View Product
                    <Icon name="ph:arrow-right-bold" class="w-5 h-5 ml-2" />
                  </div>
                </div>

              </div>
            </div>
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
const saving = ref(false)

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

// Local state for better UX
const localDescription = ref('')
const localSelectedProductId = ref(null)

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

// Watch for language changes and sync local description
watch([editorLanguage, () => sectionData.value.content_translations], () => {
  if (!sectionData.value.content_translations[editorLanguage.value]) {
    sectionData.value.content_translations[editorLanguage.value] = { 
      title: '', 
      subtitle: '', 
      product_description: '' 
    }
  }
  localDescription.value = sectionData.value.content_translations[editorLanguage.value]?.product_description || ''
}, { immediate: true, deep: true })

// Sync local product ID with the computed one
watch(selectedProductId, (newVal) => {
  localSelectedProductId.value = newVal
}, { immediate: true })

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
    console.log('Loaded products:', products.value.length)
    console.log('First product:', products.value[0])
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
      
      // Initialize missing language objects
      ['fr', 'ar', 'en'].forEach(lang => {
        if (!sectionData.value.content_translations[lang]) {
          sectionData.value.content_translations[lang] = { 
            title: '', 
            subtitle: '', 
            product_description: '' 
          }
        }
      })
      
      // Sync local description
      localDescription.value = sectionData.value.content_translations[editorLanguage.value]?.product_description || ''
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
    saving.value = true
    
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
  } finally {
    saving.value = false
  }
}

// Save description function
const saveDescription = async () => {
  // Ensure the language object exists
  if (!sectionData.value.content_translations[editorLanguage.value]) {
    sectionData.value.content_translations[editorLanguage.value] = { 
      title: '', 
      subtitle: '', 
      product_description: '' 
    }
  }
  
  // Update the description in sectionData
  sectionData.value.content_translations[editorLanguage.value].product_description = localDescription.value
  
  // Save to database
  await saveSection()
}

const handleProductSelect = async () => {
  console.log('handleProductSelect called')
  console.log('localSelectedProductId:', localSelectedProductId.value)
  console.log('Type:', typeof localSelectedProductId.value)
  
  // Update the actual selectedProductId from local value
  selectedProductId.value = localSelectedProductId.value
  
  console.log('After assignment - selectedProductId:', selectedProductId.value)
  console.log('sectionData.content_translations.meta:', sectionData.value.content_translations.meta)
  
  try {
    await saveSection()
    showSuccess('Product selected successfully')
  } catch (e) {
    console.error('Failed to save selection', e)
    showError('Failed to save product selection')
  }
}

const clearProductSelection = () => {
  // Clear both local and actual selected product
  localSelectedProductId.value = null
  selectedProductId.value = null
  // Don't need to save when clearing, just reset the UI
}

const handleProductChange = async () => {
  try {
    await saveSection()
    showSuccess('Product selection saved')
  } catch (e) {
    console.error('Failed to save selection', e)
  }
}

onMounted(async () => { 
  await Promise.all([loadProducts(), loadData()])
  // Sync local product ID after data is loaded
  localSelectedProductId.value = selectedProductId.value
})
</script>
