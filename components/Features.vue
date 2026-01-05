<template>
  <div v-if="sectionData.is_active" class="x-features" aria-label="Store benefits">
    <!-- Loading State -->
    <div v-if="loading" class="x-features__row" aria-busy="true" aria-live="polite">
      <div v-for="n in 4" :key="n" class="x-features__cell">
        <div class="x-features__icon-skel" />
        <div class="space-y-2">
          <div class="x-features__line-skel w-16" />
          <div class="x-features__line-skel w-24" />
        </div>
      </div>
    </div>

    <!-- Features -->
    <div v-else class="x-features__row">
      <div
        v-for="(feature, index) in currentFeatures"
        :key="`feature-${index}`"
        class="x-features__cell"
      >
        <div class="x-features__icon">
          <Icon :name="feature.icon" class="w-4 h-4" />
        </div>

        <div class="min-w-0">
          <p class="x-features__title">{{ feature.title }}</p>
          <p class="x-features__desc">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>
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

<style scoped>
/* Dawn / Shopify-like: simple row, subtle dividers, no card boxes */
.x-features {
  @apply mt-8 pt-6 border-t border-mgray-200;
}

.x-features__row {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2;
}

.x-features__cell {
  @apply flex items-start gap-3 px-0 py-4;
}

/* vertical dividers on large screens */
@media (min-width: 1024px) {
  .x-features__cell {
    @apply px-6;
  }
  .x-features__cell:not(:nth-child(2n)) {
    @apply border-r border-mgray-200;
  }
}

/* small divider between rows on mobile/tablet */
@media (max-width: 1023px) {
  .x-features__cell {
    @apply border-b border-mgray-200;
  }
  .x-features__cell:last-child {
    @apply border-b-0;
  }
}

.x-features__icon {
  @apply mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-mgray-50 text-mgray-800;
}

.x-features__title {
  @apply text-sm font-semibold text-mgray-950 leading-snug;
}

.x-features__desc {
  @apply mt-1 text-xs text-mgray-600 leading-relaxed;
}

/* Skeleton */
.x-features__icon-skel {
  @apply mt-0.5 h-8 w-8 flex-none rounded-full bg-mgray-100 animate-pulse;
}

.x-features__line-skel {
  @apply h-3 rounded bg-mgray-100 animate-pulse;
}
</style>
