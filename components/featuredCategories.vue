<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {{ sectionTitle }}
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {{ sectionSubtitle }}
        </p>
        <div
          class="mt-8 w-24 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 mx-auto rounded-full"
        ></div>
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
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <NuxtLink
          v-for="(category, index) in featuredCategories"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
          :style="{ animationDelay: `${index * 150}ms` }"
        >
          <!-- Category Image -->
          <div class="relative h-64 overflow-hidden">
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

            <!-- Featured Badge -->
            <div class="absolute top-4 left-4">
              <span
                class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm"
              >
                ⭐ Featured
              </span>
            </div>

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
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3
                  class="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300"
                >
                  {{ getCategoryName(category) }}
                </h3>

                <p
                  v-if="category.description"
                  class="text-gray-600 text-sm line-clamp-2 leading-relaxed"
                >
                  {{ getCategoryDescription(category) }}
                </p>
              </div>

              <!-- Arrow Icon -->
              <div
                class="w-10 h-10 bg-gray-100 group-hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-4"
              >
                <svg
                  class="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1"
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
              class="flex items-center justify-between pt-4 border-t border-gray-100"
            >
              <div class="flex items-center space-x-2 text-gray-500 text-sm">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  ></path>
                </svg>
              </div>

              <div
                class="text-sm text-primary font-medium group-hover:opacity-80 transition-colors duration-300"
              >
                {{ $t("common.explore") || "Explore" }} →
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
      <div v-if="featuredCategories.length > 0" class="text-center mt-16">
        <NuxtLink
          to="/categories"
          class="inline-flex items-center space-x-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <span>{{
            $t("categories.exploreAll") || "Explore All Categories"
          }}</span>
          <svg
            class="w-5 h-5"
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

<script setup>
const { locale } = useI18n();
const supabase = useSupabaseClient();

// State
const featuredCategories = ref([]);
const loading = ref(true);

// Section data
const sectionData = ref({
  is_active: true,
  content_translations: {
    en: {
      title: "Featured",
      subtitle:
        "Handpicked categories showcasing our most popular and trending products",
    },
    fr: {
      title: "Populaires",
      subtitle:
        "Catégories sélectionnées présentant nos produits les plus populaires et tendance",
    },
    ar: {
      title: "المميزة",
      subtitle: "فئات مختارة تعرض منتجاتنا الأكثر شعبية ورواجاً",
    },
  },
});

// Computed properties for title and subtitle based on current language
const sectionTitle = computed(() => {
  return (
    sectionData.value.content_translations?.[locale.value]?.title ||
    sectionData.value.content_translations?.fr?.title ||
    "Populaires"
  );
});

const sectionSubtitle = computed(() => {
  return (
    sectionData.value.content_translations?.[locale.value]?.subtitle ||
    sectionData.value.content_translations?.fr?.subtitle ||
    "Catégories sélectionnées présentant nos produits les plus populaires et tendance"
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
    const { data, error } = await supabase
      .from("categories")
      .select(
        "id, name_translations, slug, is_featured, is_active, display_order, description_translations, image_url"
      )
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("display_order", { ascending: true });
    console.log("da", data);
    if (error) {
      console.error("❌ Error fetching featured categories:", error);
      return;
    }

    if (data) {
      featuredCategories.value = data;
    }
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