<template>
  <section class="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Explore Our 
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Categories
          </span>
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover premium products across all our carefully curated categories. Quality, innovation, and style in every collection.
        </p>
        <div class="mt-8 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="i in 8" :key="i" class="animate-pulse">
          <div class="bg-gray-200 rounded-2xl h-64 mb-4"></div>
          <div class="bg-gray-200 rounded h-4 mb-2"></div>
          <div class="bg-gray-200 rounded h-3 w-3/4"></div>
        </div>
      </div>

      <!-- Categories Grid -->
      <div v-else-if="categories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <NuxtLink
          v-for="(category, index) in categories"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- Category Image -->
          <div class="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
            <NuxtImg
              v-if="category.image_url"
              :src="category.image_url"
              :alt="getCategoryName(category)"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                </svg>
              </div>
            </div>
            
            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <!-- Quick View Button -->
            <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
            </div>

            <!-- Featured Badge -->
            <div v-if="category.is_featured" class="absolute top-4 left-4">
              <span class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                ⭐ Featured
              </span>
            </div>
          </div>

          <!-- Category Info -->
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
              {{ getCategoryName(category) }}
            </h3>
            
            <p v-if="category.description" class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {{ getCategoryDescription(category) }}
            </p>
            
            <!-- Stats -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2 text-gray-500 text-sm">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                </svg>
                <span>{{ category.product_count || 0 }} products</span>
              </div>
              
              <!-- Arrow -->
              <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                <svg class="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Animated Border -->
          <div class="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: xor;"></div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">No Categories Available</h3>
        <p class="text-gray-600">We're working on adding amazing categories for you. Check back soon!</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const { fetchCategories } = useCategories()
const { locale } = useI18n()

// State
const categories = ref([])
const loading = ref(true)

// Get category name based on locale
const getCategoryName = (category) => {
  return category.name_translations?.[locale.value] || 
         category.name_translations?.en || 
         category.slug
}

// Get category description based on locale
const getCategoryDescription = (category) => {
  return category.description_translations?.[locale.value] || 
         category.description_translations?.en || 
         category.description || 
         'Discover amazing products in this category'
}

// Load all categories
const loadCategories = async () => {
  loading.value = true
  
  try {
    const { data } = await fetchCategories({ 
      active: true, 
      withProductCount: true 
    })
    if (data) {
      categories.value = data
    }
  } catch (error) {
    console.error('Error loading categories:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCategories()
})

// Watch locale changes and reload if needed
watch(locale, () => {
  // Categories will automatically update due to computed properties
})
</script>

<style scoped>
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > * {
  animation: slideInUp 0.6s ease-out forwards;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>