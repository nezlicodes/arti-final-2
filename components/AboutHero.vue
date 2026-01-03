<template>
  <section class="relative pt-32 pb-40 bg-white overflow-hidden">
    <div
      class="absolute top-0 left-0 right-0 h-48 bg-secondary-200 transform -skew-y-3 origin-top-left -mt-24"
    ></div>

    <div class="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
      <div v-if="loading" class="text-left animate-pulse space-y-8">
        <div class="h-20 bg-gray-200 rounded-none w-11/12"></div>
        <div class="h-8 bg-gray-200 rounded-none w-5/6"></div>
        <div class="h-8 bg-gray-200 rounded-none w-3/4 mb-16"></div>
        <div class="h-16 bg-gray-200 rounded-none w-52"></div>
      </div>

      <div v-else-if="section" class="text-left">
        <h1
          class="text-6xl sm:text-7xl lg:text-9xl font-thin text-gray-900 tracking-tighter mb-8 max-w-4xl"
          style="line-height: 0.9; font-weight: 200"
        >
          {{ currentTitle }}
        </h1>

        <p
          class="text-base sm:text-lg text-gray-600 max-w-xl leading-snug mb-16 font-mono border-l-4 border-secondary-300 pl-6 py-2"
        >
          {{ currentContent }}
        </p>

        <div class="flex flex-col sm:flex-row gap-6 justify-start items-start">
          <NuxtLink
            :to="cta1Link"
            class="group inline-flex items-center justify-center text-xl font-bold tracking-widest text-gray-900 transition-all duration-300 relative"
          >
            <span class="relative z-10">
              {{ cta1Label || "CTA Principal" }}
            </span>
            <div
              class="absolute bottom-0 left-0 w-full h-1 bg-secondary-300 transform scale-x-75 group-hover:scale-x-100 transition-transform origin-left"
            ></div>

            <svg
              class="ml-3 w-6 h-6 transform translate-x-1 group-hover:translate-x-3 transition-transform text-primary opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  section: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const { locale } = useI18n();

// --- Core Content Logic ---

const currentTitle = computed(() => {
  if (!props.section?.title_translations) return "Bienvenue";
  return (
    props.section.title_translations[locale.value] ||
    props.section.title_translations.fr ||
    "Bienvenue"
  );
});

const currentContent = computed(() => {
  if (!props.section?.content_translations)
    return "Découvrez notre nouvelle collection.";
  return (
    props.section.content_translations[locale.value] ||
    props.section.content_translations.fr ||
    "Découvrez notre nouvelle collection."
  );
});

// --- CTA Logic (Using additional_data) ---

const cta1Label = computed(() => {
  const translations = props.section?.additional_data?.cta1_label || {};
  return (
    translations[locale.value] || translations.fr || "Découvrir nos produits"
  );
});

const cta1Link = computed(() => {
  return props.section?.additional_data?.cta1_link || "/products";
});
</script>