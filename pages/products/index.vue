<template>
  <div class="min-h-screen">
    <!-- Collection header -->
    <section class="x-section">
      <div class="x-container text-center" data-aos="fade-up">
        <h1 class="x-title">
          {{ currentHeroContent.title || 'Products' }}
        </h1>
        <p class="x-subtitle max-w-2xl mx-auto">
          {{ currentHeroContent.description || 'Carefully selected items' }}
        </p>
        <div class="x-divider mx-auto"></div>

        <div class="mt-8 flex justify-center items-center gap-4 text-sm text-mgray-600">
          <span class="font-medium text-mgray-800">{{ totalProducts }}</span>
          <span>{{ $t('products.title') || 'Products' }}</span>
          <span class="text-mgray-300">•</span>
          <span class="font-medium text-mgray-800">{{ totalCategories }}</span>
          <span>{{ $t('categories.title') || 'Categories' }}</span>
        </div>
      </div>
    </section>

    <!-- Toolbar (Shopify-like) -->
    <section class="pb-10">
      <div class="x-container" data-aos="fade-up" data-aos-delay="100">
        <div class="rounded-2xl border border-mgray-200 bg-white p-4 sm:p-5">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Search -->
            <div class="relative">
              <Icon name="ph:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mgray-400" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('products.search') || 'Search products…'"
                class="w-full pl-12 pr-4 py-3 rounded-xl border border-mgray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <!-- Category -->
            <div>
              <select
                class="w-full px-4 py-3 rounded-xl border border-mgray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                :value="selectedCategories[0] || ''"
                @change="onCategorySelect"
              >
                <option value="">{{ $t('products.allCategories') || 'All categories' }}</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ getCategoryName(category) }}
                </option>
              </select>
            </div>

            <!-- Sort (simple, no backend changes) -->
            <div>
              <select
                class="w-full px-4 py-3 rounded-xl border border-mgray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                v-model="sortBy"
              >
                <option value="featured">{{ $t('products.sort.featured') || 'Featured' }}</option>
                <option value="price-asc">{{ $t('products.sort.priceAsc') || 'Price: Low to high' }}</option>
                <option value="price-desc">{{ $t('products.sort.priceDesc') || 'Price: High to low' }}</option>
                <option value="name-asc">{{ $t('products.sort.nameAsc') || 'Name: A–Z' }}</option>
              </select>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-between text-xs text-mgray-600">
            <p>
              <span class="font-semibold text-mgray-900">{{ filteredProducts.length }}</span>
              {{ $t('products.results') || 'results' }}
            </p>
            <button
              v-if="searchQuery || selectedCategories.length"
              class="font-semibold underline hover:opacity-80"
              @click="clearFilters"
            >
              {{ $t('products.clear') || 'Clear' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Products grid -->
    <section class="pb-20">
      <div class="x-container" data-aos="fade-up" data-aos-delay="150">
        <ProductsGrid
          :products="paginatedProducts"
          :loading="productsLoading"
          :skeleton-count="12"
        />

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-12" data-aos="fade-up" data-aos-delay="200">
          <nav class="inline-flex items-center gap-1 rounded-xl border border-mgray-200 bg-white p-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="page !== '...' && (currentPage = page)"
              :disabled="page === '...'"
              :class="[
                'min-w-9 h-9 px-3 text-sm rounded-lg transition-colors',
                page === currentPage ? 'bg-mgray-950 text-white' : 'text-mgray-700 hover:bg-mgray-100',
                page === '...' ? 'cursor-default opacity-60' : ''
              ]"
            >
              {{ page }}
            </button>
          </nav>
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
const productsLoading = ref(true)
const searchQuery = ref('')
const selectedCategories = ref([])
const currentPage = ref(1)
const itemsPerPage = 12

// Toolbar
const sortBy = ref('featured')

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

  return filtered
})

const sortedProducts = computed(() => {
  const list = [...filteredProducts.value]

  switch (sortBy.value) {
    case 'price-asc':
      return list.sort((a, b) => (a.price || 0) - (b.price || 0))
    case 'price-desc':
      return list.sort((a, b) => (b.price || 0) - (a.price || 0))
    case 'name-asc':
      return list.sort((a, b) => getProductName(a).localeCompare(getProductName(b)))
    case 'featured':
    default:
      // keep backend order (currently created_at desc)
      return list
  }
})

const totalPages = computed(() => Math.ceil(sortedProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedProducts.value.slice(start, end)
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
    // no-op
  }
}

const onCategorySelect = (event) => {
  const value = event?.target?.value
  selectedCategories.value = value ? [value] : []
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategories.value = []
  currentPage.value = 1
}

// Watch for toolbar changes
watch([searchQuery, selectedCategories, sortBy], () => {
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

