<template>
  <section class="x-section relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-transparent"></div>
    <div class="x-container relative">
      <!-- Section Header -->
      <div class="text-center mb-14">
        <div class="flex justify-center mb-4">
          <span class="x-eyebrow">
            <Icon name="ph:grid-four-fill" class="w-3.5 h-3.5 text-primary" />
            {{ $t('categories.title') || 'Categories' }}
          </span>
        </div>
        <h2 class="x-title">
          {{ sectionTitle }}
        </h2>
        <p class="x-subtitle max-w-2xl mx-auto">
          {{ sectionSubtitle }}
        </p>
        <div class="x-divider mx-auto"></div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="bg-gray-200 rounded-2xl h-80 mb-4"></div>
          <div class="bg-gray-200 rounded h-4 mb-2"></div>
          <div class="bg-gray-200 rounded h-3 w-3/4"></div>
        </div>
      </div>

      <!-- Featured Categories Grid -->
      <div
        v-else-if="featuredCategories.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        <NuxtLink
          v-for="(category, index) in featuredCategories"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="group relative x-surface-strong overflow-hidden transition-all duration-500 hover:-translate-y-2"
          :style="{ animationDelay: `${index * 150}ms` }"
        >
          <!-- Category Image -->
          <div class="relative h-60 sm:h-64 overflow-hidden">
            <NuxtImg
              v-if="category.image_url"
              :src="category.image_url"
              :alt="getCategoryName(category)"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center"
            >
              <div
                class="w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center"
              >
                <svg
                  class="w-10 h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
                  ></path>
                </svg>
              </div>
            </div>

            <!-- Gradient Overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
            ></div>

          

            <!-- View Products Button -->
            <div
              class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div
                class="bg-white/90 backdrop-blur-sm text-gray-900 font-semibold px-6 py-3 rounded-xl shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300"
              >
                {{ $t("categories.viewProducts") || "View Products" }}
              </div>
            </div>
          </div>

          <!-- Category Info -->
          <div class="p-6 lg:p-7">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-semibold tracking-tight text-mgray-950 mb-2 group-hover:text-primary transition-colors duration-300">
                  {{ getCategoryName(category) }}
                </h3>

                <p
                  v-if="category.description"
                  class="text-mgray-700 text-sm line-clamp-2 leading-relaxed"
                >
                  {{ getCategoryDescription(category) }}
                </p>
              </div>

              <!-- Arrow Icon -->
              <div
                class="w-10 h-10 bg-primary/10 group-hover:bg-primary rounded-2xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-4"
              >
                <svg
                  class="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  ></path>
                </svg>
              </div>
            </div>

            <!-- Stats Bar -->
            <div
              class="flex items-center justify-between pt-4 border-t border-mgray-100"
            >
              <div class="flex items-center space-x-2 text-mgray-500 text-sm">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  ></path>
                </svg>
              </div>

            
            </div>
          </div>

          <!-- Hover Border Effect -->
          <div
            class="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/50 transition-colors duration-300 pointer-events-none"
          ></div>
        </NuxtLink>
      </div>

      <!-- Show All Categories Button -->
      <div v-if="featuredCategories.length > 0" class="text-center mt-14">
        <NuxtLink
          to="/categories"
          class="x-btn-primary"
        >
          <span>{{ $t("categories.exploreAll") || "Explore All Categories" }}</span>
          <Icon name="ph:arrow-right-bold" class="w-4 h-4" />
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div
          class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            class="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            ></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">
          No Featured Categories
        </h3>
        <p class="text-gray-600">
          We're working on featuring amazing categories for you. Check back
          soon!
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const supabase = useSupabaseClient();
const { fetchCategories } = useCategories();

// State
const featuredCategories = ref([]);
const loading = ref(true);

const { businessId } = useBusinessPreview()

const BUSINESS_SECTION_COPY: Record<string, any> = {
  ecommerce: {
    en: { title: 'Featured', subtitle: 'Handpicked categories showcasing our most popular and trending products' },
    fr: { title: 'Catégories populaires', subtitle: 'Découvrez les catégories les plus appréciées du moment' },
    ar: { title: 'الفئات المميزة', subtitle: 'فئات مختارة من الأكثر شعبية' },
  },
  restaurant: {
    en: { title: 'Menu', subtitle: 'Explore starters, mains, desserts and drinks' },
    fr: { title: 'Notre menu', subtitle: 'Entrées, plats, desserts et boissons' },
    ar: { title: 'قائمة الطعام', subtitle: 'مقبلات، أطباق، حلويات ومشروبات' },
  },
  artisan: {
    en: { title: 'Collections', subtitle: 'Ceramics, leather, jewelry and home decor' },
    fr: { title: 'Collections', subtitle: 'Céramique, cuir, bijoux et décoration' },
    ar: { title: 'مجموعات', subtitle: 'خزف، جلد، مجوهرات وديكور' },
  }
}

// Section data
const sectionData = ref({
  is_active: true,
  content_translations: BUSINESS_SECTION_COPY[String(businessId.value)] || BUSINESS_SECTION_COPY.ecommerce,
});

// Computed properties for title and subtitle based on current language
const sectionTitle = computed(() => {
  const b = BUSINESS_SECTION_COPY[String(businessId.value)] || BUSINESS_SECTION_COPY.ecommerce
  return (
    sectionData.value.content_translations?.[locale.value]?.title ||
    sectionData.value.content_translations?.fr?.title ||
    b?.[locale.value]?.title ||
    b?.fr?.title ||
    'Categories'
  );
});

const sectionSubtitle = computed(() => {
  const b = BUSINESS_SECTION_COPY[String(businessId.value)] || BUSINESS_SECTION_COPY.ecommerce
  return (
    sectionData.value.content_translations?.[locale.value]?.subtitle ||
    sectionData.value.content_translations?.fr?.subtitle ||
    b?.[locale.value]?.subtitle ||
    b?.fr?.subtitle ||
    ''
  );
});

// Get category name based on locale
const getCategoryName = (category) => {
  return (
    category.name_translations?.[locale.value] ||
    category.name_translations?.en ||
    category.slug
  );
};

// Get category description based on locale
const getCategoryDescription = (category) => {
  return (
    category.description_translations?.[locale.value] ||
    category.description_translations?.en ||
    category.description ||
    "Discover amazing products in this category"
  );
};

// Load featured categories only
const loadFeaturedCategories = async () => {
  loading.value = true;

  try {
    const data = await fetchCategories({ featured: true, active: true });
    featuredCategories.value = data || [];
  } catch (error) {
    console.error("Error loading featured categories:", error);
  } finally {
    loading.value = false;
  }
};

// Load section data from backend
const loadSectionData = async () => {
  try {
    const { data, error } = await supabase
      .from("content_sections")
      .select("*")
      .eq("section_key", "featured_categories")
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error loading section:", error);
      return;
    }

    if (data) {
      sectionData.value = data;
    }
  } catch (error) {
    console.error("Error loading featured categories section:", error);
  }
};

// Fetch all data
const fetchData = async () => {
  try {
    await Promise.all([loadSectionData(), loadFeaturedCategories()]);
  } catch (error) {
    console.error("Error fetching featured categories data:", error);
  }
};

onMounted(async () => {
  await fetchData();
});

// Reload categories when switching preview business
watch(businessId, async () => {
  await fetchData();
});

// Watch locale changes
watch(locale, () => {
  // Categories will automatically update due to computed properties
});
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