<template>
  <section v-if="isLoaded && isEnabled" class="x-section">
    <div class="x-container">
      <!-- Shopify-like section header (centered, simple) -->
      <header class="text-center mb-14" data-aos="fade-up">
        <h2 class="x-title">
          {{ headerContent.title }}
        </h2>
        <p class="x-subtitle">
          {{ headerContent.subtitle }}
        </p>
        <div class="x-divider mx-auto"></div>
      </header>

      <div class="mx-auto mt-10 max-w-3xl" data-aos="fade-up" data-aos-delay="100">
        <!-- Loading State -->
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="h-14 rounded-xl bg-mgray-100/60"></div>
          </div>
        </div>

        <!-- No results message -->
        <div
          v-else-if="filteredItems.length === 0"
          class="rounded-2xl border border-mgray-200 bg-white p-8 text-center"
        >
          <h3 class="text-lg font-semibold text-mgray-950">
            {{ headerContent.no_questions_title }}
          </h3>
          <p class="mt-2 text-mgray-700">
            {{ headerContent.no_questions_description }}
          </p>
        </div>

        <!-- FAQ Accordion (Shopify/Dawn-like) -->
        <div v-else class="divide-y divide-mgray-200 rounded-2xl border border-mgray-200 bg-white">
          <details
            v-for="(item, index) in filteredItems"
            :key="item.id"
            class="group faq-accordion"
            :data-aos="'fade-up'"
            :data-aos-delay="index * 40"
          >
            <summary
              class="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-left"
            >
              <span class="text-base sm:text-lg font-medium text-mgray-950">
                {{ getQuestion(item) }}
              </span>

              <!-- Plus / Minus toggle -->
              <span
                class="relative flex h-10 w-10 flex-none items-center justify-center rounded-full border border-mgray-200 bg-white text-mgray-700 transition-colors group-hover:bg-mgray-50 group-hover:text-mgray-950"
                aria-hidden="true"
              >
                <span class="absolute inset-0 grid place-items-center transition-opacity duration-200 group-open:opacity-0 opacity-100">
                  <Icon name="ph:plus" class="h-5 w-5" />
                </span>
                <span class="absolute inset-0 grid place-items-center transition-opacity duration-200 opacity-0 group-open:opacity-100">
                  <Icon name="ph:minus" class="h-5 w-5" />
                </span>
              </span>
            </summary>

            <div class="px-6 pb-6">
              <div class="pt-4 border-t border-mgray-200">
                <div
                  v-html="getAnswer(item)"
                  class="prose prose-base max-w-none text-mgray-700 leading-relaxed"
                ></div>
              </div>
            </div>
          </details>
        </div>

        <!-- Optional helper note (very Shopify-ish) -->
        <div class="mt-6 text-center text-sm text-mgray-600">
          <span class="font-medium text-mgray-800">{{ headerContent.help_card_title }}</span>
          <span class="mx-2">·</span>
          <span>{{ headerContent.help_card_description }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const supabase = useSupabaseClient();
const { locale } = useI18n();
const { fetchSection } = useContentSections();

// Reactive locale
const currentLocale = computed(() => locale.value);

// State
const isLoaded = ref(false);
const loading = ref(true);
const error = ref(null);
const items = ref([]);
const isEnabled = ref(true);
const headerData = ref(null);

// Default header content (fallback)
const defaultHeaderContent = {
  badge_text: "FAQ",
  title: "Questions Fréquentes",
  subtitle: "Trouvez des réponses aux questions les plus courantes",
  help_card_title: "Besoin d'aide supplémentaire ?",
  help_card_description: "Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à nous contacter directement.",
  no_questions_title: "Aucune question disponible",
  no_questions_description: "Les questions fréquentes seront bientôt disponibles."
};

// Get header content based on current locale
const headerContent = computed(() => {
  if (!headerData.value?.content_translations) {
    return defaultHeaderContent;
  }
  return headerData.value.content_translations?.[currentLocale.value] || defaultHeaderContent;
});

// Translation helpers for FAQ items
const getTranslation = (translations) => {
  if (!translations || typeof translations !== 'object') return '';
  return translations[currentLocale.value] || translations.fr || translations.en || translations.ar || '';
};

const getQuestion = (item) => {
  return getTranslation(item.question_translations);
};

const getAnswer = (item) => {
  return getTranslation(item.answer_translations);
};

// Computed properties for filtering and organizing items
const filteredItems = computed(() => {
  let result = [...items.value];

  // Sort: active items only
  result = result.filter(item => item.is_active);

  // Sort by display_order
  result.sort((a, b) => {
    if (a.display_order !== null && b.display_order !== null) {
      return a.display_order - b.display_order;
    } else if (a.display_order !== null) {
      return -1;
    } else if (b.display_order !== null) {
      return 1;
    }
    return 0;
  });

  return result;
});

// Fetch FAQ data
const fetchFaqData = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Fetch FAQ header configuration from content_sections
    const { data: headerConfigData, error: headerError } = await fetchSection('faq');
    
    if (headerError) {
      console.warn('Error fetching FAQ header:', headerError);
    } else {
      headerData.value = headerConfigData;
      isEnabled.value = headerConfigData?.is_active ?? true;
    }

    // If FAQ section is disabled, stop here
    if (!isEnabled.value) {
      isLoaded.value = true;
      loading.value = false;
      return;
    }

    // Fetch FAQ items
    const { data: itemsData, error: itemsError } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (itemsError) throw itemsError;

    items.value = itemsData || [];
    isLoaded.value = true;
  } catch (err) {
    console.error("Error fetching FAQ data:", err);
    error.value = err.message;
    items.value = [];
    isLoaded.value = true;
  } finally {
    loading.value = false;
  }
};


// Initialize component
onMounted(fetchFaqData);
</script>

<style scoped>
/* Remove default details marker */
details summary::-webkit-details-marker,
details summary::marker {
  display: none;
}

details summary {
  list-style: none;
}

/* Shopify-ish accordion behavior */
.faq-accordion {
  @apply transition-colors;
}

.faq-accordion[open] > summary {
  @apply bg-mgray-50;
}

/* Subtle reveal animation */
details[open] > summary ~ * {
  animation: faqExpand 0.25s ease-out;
}

@keyframes faqExpand {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Focus styles for accessibility */
details summary:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--primary-color), 0.25);
  border-radius: 0.75rem;
}

/* Prose styling */
:deep(.prose p) {
  @apply mb-4 leading-relaxed;
}

:deep(.prose p:last-child) {
  @apply mb-0;
}

:deep(.prose a) {
  @apply underline;
  color: rgba(var(--primary-color), 1);
}
</style>