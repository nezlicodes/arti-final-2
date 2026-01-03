<template>
  <section v-if="sectionData.is_active" class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header - Debut Style -->
      <div class="text-center mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {{ sectionTitle }}
        </h2>
        <div class="w-16 h-0.5 bg-primary mx-auto mb-4"></div>
        <p class="text-base text-gray-600 max-w-2xl mx-auto" v-html="sectionSubtitle"></p>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div v-for="i in 4" :key="i" class="animate-pulse">
          <div class="bg-gray-200 rounded h-48 mb-3"></div>
          <div class="bg-gray-200 rounded h-4 mb-2"></div>
          <div class="bg-gray-200 rounded h-3 w-3/4"></div>
        </div>
      </div>

      <!-- Categories Grid - Debut Style -->
      <div
        v-else-if="categories.length > 0"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="group bg-white border border-gray-200 rounded hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Category Image -->
          <div class="aspect-square overflow-hidden bg-gray-100">
            <NuxtImg
              v-if="category.image_url"
              :src="category.image_url"
              :alt="category.name"
              class="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-gray-400"
            >
              <Icon name="ph:package" class="w-12 h-12" />
            </div>
          </div>

          <!-- Category Info -->
          <div class="p-4 text-center">
            <h3 class="text-sm font-medium text-gray-900 mb-1 group-hover:text-primary transition-colors">
              {{ category.name }}
            </h3>
            <p v-if="category.description" class="text-xs text-gray-500 line-clamp-2">
              {{ category.description }}
            </p>
            <p v-if="category.product_count" class="text-xs text-gray-400 mt-1">
              {{ category.product_count }} {{ $t("products") || "products" }}
            </p>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <Icon name="ph:package" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">{{ $t("home.categories.empty") || "No categories available" }}</p>
      </div>

      <!-- View All Button - Debut Style -->
      <div v-if="categories.length > 0" class="text-center mt-10">
        <NuxtLink
          to="/categories"
          class="inline-block bg-primary text-white px-6 py-2 text-sm font-medium rounded hover:bg-primary/90 transition-colors"
        >
          {{ $t("home.categories.viewAll") || "View all categories" }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
  
<script setup>
const { fetchCategories } = useCategories();
const supabase = useSupabaseClient();
const { locale } = useI18n();

const categories = ref([]);
const loading = ref(true);

// Section data
const sectionData = ref({
  is_active: true,
  content_translations: {
    en: {
      title: "Featured Categories",
      subtitle: "Explore our most popular product categories",
    },
    fr: {
      title: "Catégories populaires",
      subtitle: "Découvrez nos catégories de produits les plus populaires",
    },
    ar: {
      title: "الفئات المميزة",
      subtitle: "استكشف فئات المنتجات الأكثر شعبية",
    },
  },
});

// Computed properties for title and subtitle based on current language
const sectionTitle = computed(() => {
  return (
    sectionData.value.content_translations?.[locale.value]?.title ||
    sectionData.value.content_translations?.fr?.title ||
    "Catégories populaires"
  );
});

const sectionSubtitle = computed(() => {
  return (
    sectionData.value.content_translations?.[locale.value]?.subtitle ||
    sectionData.value.content_translations?.fr?.subtitle ||
    "Découvrez nos catégories de produits les plus populaires"
  );
});

// Load section data
const loadSectionData = async () => {
  try {
    const { data, error } = await supabase
      .from("content_sections")
      .select("*")
      .eq("section_key", "featured_categories")
      .single();

    if (error && error.code !== 'PGRST116') {
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

// Load categories
const loadCategories = async () => {
  loading.value = true;

  const { data } = await fetchCategories({ featured: true, active: true });

  if (data) {
    categories.value = data;
  }

  loading.value = false;
};

onMounted(async () => {
  await loadSectionData();
  await loadCategories();
});

// Watch locale changes and reload section data
watch(locale, async () => {
  // No need to reload from database, just the computed will react
  // But we can reload if needed for other reasons
});
</script>
