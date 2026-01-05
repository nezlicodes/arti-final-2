<template>
  <section v-if="sectionData.is_active" class="py-16 lg:py-20 bg-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
        <div v-for="n in 4" :key="n" class="text-center space-y-3">
          <div class="w-8 h-8 rounded-lg bg-gray-200 animate-pulse mx-auto"></div>
          <div class="space-y-2">
            <div class="h-6 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
        <div
          v-for="(feature, index) in currentFeatures"
          :key="`feature-${index}`"
          class="text-center space-y-4"
        >
          <!-- Icon -->
          <div class="flex items-center justify-center w-8 h-8 mx-auto text-gray-700">
            <Icon
              :name="feature.icon"
              class="w-8 h-8"
            />
          </div>

          <!-- Content -->
          <div class="space-y-2">
            <h3 class="text-lg lg:text-xl font-bold text-gray-900">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-gray-600 font-medium">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { fetchSection } = useContentSections();
const { locale } = useI18n();

// Reactive locale
const currentLocale = computed(() => locale.value);

// Default features
const defaultFeatures = [
  {
    icon: "ph:users-three-fill",
    title: "100M+",
    description: "produits vendus"
  },
  {
    icon: "ph:globe-hemisphere-west-fill",
    title: "60+ pays",
    description: "couverts"
  },
  {
    icon: "ph:package-fill",
    title: "Livraison DZ",
    description: "rapide & sécurisée"
  },
  {
    icon: "ph:headset-fill",
    title: "Support 24/7",
    description: "toujours disponible"
  }
];

// State
const loading = ref(true);
const sectionData = ref({
  is_active: true,
  content_translations: {
    fr: { features: defaultFeatures },
    ar: { features: defaultFeatures },
    en: { features: defaultFeatures }
  }
});

// Get current language features
const currentFeatures = computed(() => {
  const content = sectionData.value.content_translations?.[currentLocale.value];
  return content?.features || defaultFeatures;
});

// Load section data
const loadSectionData = async () => {
  loading.value = true;
  try {
    const { data, error } = await fetchSection('features');
    
    if (error) throw error;
    
    if (data) {
      sectionData.value = data;
    }
  } catch (error) {
    console.error('Error loading features section:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadSectionData();
});
</script>