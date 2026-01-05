<template>
  <div class="min-h-screen bg-white">
    <!-- Header Minimaliste -->
    <section class="py-20 lg:py-32">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <!-- Titre épuré -->
        <h1 class="text-4xl lg:text-6xl font-light text-gray-900 mb-6 tracking-wide">
          {{ currentHeroContent.title || 'Products' }}
        </h1>
        
        <!-- Description simple -->
        <p class="text-lg text-gray-500 mb-16 font-light">
          {{ currentHeroContent.description || 'Carefully selected items' }}
        </p>

        <!-- Stats discrètes -->
        <div class="flex justify-center items-center gap-12 text-sm text-gray-400">
          <span>{{ totalProducts }} Products</span>
          <div class="w-1 h-1 bg-gray-300 rounded-full"></div>
          <span>{{ totalCategories }} Categories</span>
        </div>
      </div>
    </section>

    <!-- Filters Section Minimaliste -->
    <section class="py-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Barre de recherche simple -->
        <div class="max-w-md mx-auto mb-12">
          <div class="relative">
            <Icon name="ph:magnifying-glass" class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
        </div>


        <!-- Catégories épurées -->
        <div class="flex justify-center">
          <div class="flex items-center gap-1 text-xs">
            <button
              @click="selectedCategories = []"
              :class="[
                'px-3 py-1 transition-colors',
                selectedCategories.length === 0
                  ? 'text-black font-medium'
                  : 'text-gray-400 hover:text-gray-600'
              ]"
            >
              All
            </button>
            <span class="text-gray-300">•</span>
            <button
              v-for="category in categories"
              :key="category.id"
              @click="toggleCategory(category.id)"
              :class="[
                'px-3 py-1 transition-colors',
                selectedCategories.includes(category.id)
                  ? 'text-black font-medium'
                  : 'text-gray-400 hover:text-gray-600'
              ]"
            >
              {{ getCategoryName(category) }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Products Grid Épuré -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State simple -->
        <div v-if="productsLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div v-for="n in 8" :key="n">
            <div class="aspect-square bg-gray-100 mb-4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-100"></div>
              <div class="h-4 bg-gray-100 w-2/3"></div>
              <div class="h-4 bg-gray-100 w-1/3"></div>
            </div>
          </div>
        </div>

        <!-- No Products -->
        <div v-else-if="filteredProducts.length === 0" class="text-center py-20">
          <p class="text-gray-500">No products found</p>
        </div>

        <!-- Products Grid Simple -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            class="group"
          >
            <!-- Image produit simple -->
            <div class="aspect-square overflow-hidden bg-gray-50 mb-4">
              <NuxtImg
                v-if="getProductImage(product)"
                :src="getProductImage(product)"
                :alt="getProductName(product)"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <!-- Infos produit minimalistes -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium text-gray-900 line-clamp-2">
                {{ getProductName(product) }}
              </h3>
              
              <!-- Prix simple -->
              <div class="flex items-baseline space-x-2 text-sm">
                <span class="font-medium text-gray-900">{{ formatPrice(product.price) }}</span>
                <span v-if="product.original_price && product.original_price > product.price"
                      class="text-gray-400 line-through">
                  {{ formatPrice(product.original_price) }}
                </span>
              </div>
              
              <!-- Lien discret -->
              <NuxtLink
                :to="`/products/${product.slug || product.id}`"
                class="text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                View details
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Pagination simple -->
        <div v-if="totalPages > 1" class="flex justify-center mt-16">
          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'w-8 h-8 text-xs transition-colors',
                page === currentPage
                  ? 'text-black font-medium'
                  : 'text-gray-400 hover:text-gray-600'
              ]"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { locale } = useI18n()
const supabase = useSupabaseClient()

// Reactive locale
const currentLocale = computed(() => locale.value || 'fr')

// State
const heroLoading = ref(true)
const productsLoading = ref(true)
const searchQuery = ref('')
const selectedCategories = ref([])
const currentPage = ref(1)
const itemsPerPage = 12

// Quick filters
const quickFilters = ref([
  { id: 'sale', label: 'On Sale', active: false },
  { id: 'new', label: 'New', active: false },
  { id: 'popular', label: 'Popular', active: false },
  { id: 'premium', label: 'Premium', active: false },
])

// Data
const heroData = ref({
  is_active: true,
  content_translations: {
    fr: { title: 'Nos Produits', description: 'Découvrez notre collection soigneusement sélectionnée' },
    ar: { title: 'منتجاتنا', description: 'اكتشف مجموعتنا المختارة بعناية' },
    en: { title: 'Our Products', description: 'Discover our carefully curated collection' },
  },
})

const categories = ref([])
const products = ref([])

// Computed
const currentHeroContent = computed(() => {
  const content = heroData.value.content_translations?.[currentLocale.value]
  return content || heroData.value.content_translations.fr
})

const totalProducts = computed(() => products.value.length)
const totalCategories = computed(() => categories.value.length)

const filteredProducts = computed(() => {
  let filtered = [...products.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => {
      const name = getProductName(product).toLowerCase()
      const description = product.description?.toLowerCase() || ''
      return name.includes(query) || description.includes(query)
    })
  }

  // Category filter
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(product => 
      selectedCategories.value.includes(product.category_id)
    )
  }

  // Quick filters
  quickFilters.value.forEach(filter => {
    if (filter.active) {
      switch (filter.id) {
        case 'sale':
          filtered = filtered.filter(product => 
            product.original_price && product.original_price > product.price
          )
          break
        case 'new':
          // Assume products created in last 30 days are new
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter(product => 
            new Date(product.created_at) > thirtyDaysAgo
          )
          break
      }
    }
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1, '...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    }
  }

  return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
})

// Helper functions
const getCategoryName = (category) => {
  if (!category?.name_translations) return category?.name || ''
  return (
    category.name_translations[currentLocale.value] ||
    category.name_translations.fr ||
    category.name_translations.en ||
    category.name ||
    ''
  )
}

const getProductName = (product) => {
  if (!product?.name_translations) return product?.name || ''
  return (
    product.name_translations[currentLocale.value] ||
    product.name_translations.fr ||
    product.name_translations.en ||
    product.name ||
    ''
  )
}

const getProductImage = (product) => {
  return product.images?.[0]?.url || product.image_url || null
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
  }).format(price)
}

const toggleCategory = (categoryId) => {
  const index = selectedCategories.value.indexOf(categoryId)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(categoryId)
  }
  currentPage.value = 1 // Reset to first page
}

const toggleQuickFilter = (filterId) => {
  const filter = quickFilters.value.find(f => f.id === filterId)
  if (filter) {
    filter.active = !filter.active
    currentPage.value = 1 // Reset to first page
  }
}

const getFilterIcon = (filterId) => {
  const icons = {
    sale: 'ph:tag',
    new: 'ph:sparkle',
    popular: 'ph:fire',
    premium: 'ph:crown'
  }
  return icons[filterId] || 'ph:circle'
}

const isNewProduct = (product) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  return new Date(product.created_at) > thirtyDaysAgo
}

// Data loading
const loadData = async () => {
  productsLoading.value = true
  try {
    // Load categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (categoriesData) {
      categories.value = categoriesData
    }

    // Load products with images
    const { data: productsData } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(url)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (productsData) {
      products.value = productsData
    }
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    productsLoading.value = false
  }
}

const loadHeroData = async () => {
  heroLoading.value = true
  try {
    const { data } = await supabase
      .from('content_sections')
      .select('*')
      .eq('section_key', 'products_hero')
      .single()

    if (data) {
      heroData.value = data
    }
  } catch (error) {
    console.error('Error loading hero data:', error)
  } finally {
    heroLoading.value = false
  }
}

// Watch for search changes
watch([searchQuery, selectedCategories], () => {
  currentPage.value = 1
})

// Load data on mount
onMounted(async () => {
  await Promise.all([loadHeroData(), loadData()])
})

// SEO
useSeoMeta({
  title: 'Products',
  description: 'Explore our collection of premium products',
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>