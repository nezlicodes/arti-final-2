<template>
  <div class="min-h-screen mt-36">
    <section v-if="policy" class="py-10">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-3xl md:text-4xl font-bold mb-3">
          {{ getTranslation(policy.title_translations) }}
        </h1>
        <div
          v-if="policy.simple_content_translations && getTranslation(policy.simple_content_translations)"
          v-html="getTranslation(policy.simple_content_translations)"
          class="prose prose-lg max-w-none"
        ></div>
        <p
          v-else-if="policy.short_description_translations && getTranslation(policy.short_description_translations)"
          v-html="getTranslation(policy.short_description_translations)"
          class="text-lg text-gray-600 mb-6"
        ></p>
      </div>
    </section>

    <section v-else-if="!loading" class="py-16">
      <div class="max-w-4xl mx-auto px-4 text-center text-gray-500">
        <h1 class="text-2xl font-bold mb-4">Policy not found</h1>
        <p>The policy you're looking for doesn't exist or has been removed.</p>
        <NuxtLink to="/" class="mt-4 inline-block text-blue-600 hover:text-blue-800">
          Return to home
        </NuxtLink>
      </div>
    </section>

    <section v-else class="py-16">
      <div class="max-w-4xl mx-auto px-4 text-center text-gray-500">
        <div class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p class="mt-4">Loading policy...</p>
      </div>
    </section>
  </div>
</template>

<script setup>
const route = useRoute();
const { fetchPolicyBySlug, getTranslation } = usePolicies();
const { locale } = useI18n();

const policy = ref(null);
const loading = ref(true);

const loadData = async () => {
  loading.value = true;
  const slug = Array.isArray(route.params.slug)
    ? route.params.slug[0]
    : route.params.slug;
  try {
    const { data, error } = await fetchPolicyBySlug(slug);
    if (error) throw error;
    policy.value = data;
  } catch (err) {
    console.error("Error loading policy:", err);
    policy.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);

// Watch for slug changes
watch(() => route.params.slug, () => {
  loadData();
});

// Computed values for SEO
const pageTitle = computed(() => {
  if (!policy.value) return 'Policy | Arti';
  
  // Try meta title first, then regular title
  const metaTitle = policy.value.meta_title_translations
    ? getTranslation(policy.value.meta_title_translations)
    : null;
  
  const regularTitle = getTranslation(policy.value.title_translations);
  
  return metaTitle || regularTitle || 'Policy';
});

const pageDescription = computed(() => {
  if (!policy.value) return 'Read our policy information';
  
  // Try meta description first, then short description
  const metaDesc = policy.value.meta_description_translations
    ? getTranslation(policy.value.meta_description_translations)
    : null;
  
  const shortDesc = policy.value.short_description_translations
    ? getTranslation(policy.value.short_description_translations)
    : null;
  
  // Remove HTML tags from description
  const desc = metaDesc || shortDesc || '';
  return desc.replace(/<[^>]*>/g, '').substring(0, 160);
});

const ogTitle = computed(() => {
  if (!policy.value) return 'Policy | Arti';
  return getTranslation(policy.value.title_translations) || 'Policy';
});

const ogDescription = computed(() => {
  if (!policy.value) return 'Read our policy information';
  
  const shortDesc = policy.value.short_description_translations
    ? getTranslation(policy.value.short_description_translations)
    : '';
  
  return shortDesc.replace(/<[^>]*>/g, '').substring(0, 160);
});

// SEO Meta Tags
useHead(() => ({
  title: pageTitle.value,
  meta: [
    {
      name: 'description',
      content: pageDescription.value,
    },
    {
      name: 'keywords',
      content: policy.value?.policy_type ? `${policy.value.policy_type}, policy, ${ogTitle.value}` : 'policy',
    },
    // Open Graph
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:title',
      content: ogTitle.value,
    },
    {
      property: 'og:description',
      content: ogDescription.value,
    },
    {
      property: 'og:locale',
      content: locale.value === 'ar' ? 'ar_DZ' : locale.value === 'fr' ? 'fr_FR' : 'en_US',
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary',
    },
    {
      name: 'twitter:title',
      content: ogTitle.value,
    },
    {
      name: 'twitter:description',
      content: ogDescription.value,
    },
    // Robots
    {
      name: 'robots',
      content: policy.value?.is_active ? 'index, follow' : 'noindex, nofollow',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://yourdomain.com/policies/${route.params.slug}`,
    },
  ],
}));

// Structured Data (JSON-LD)
useHead(() => {
  if (!policy.value) return {};
  
  return {
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: ogTitle.value,
          description: ogDescription.value,
          url: `https://yourdomain.com/policies/${route.params.slug}`,
          inLanguage: locale.value,
          isPartOf: {
            '@type': 'WebSite',
            name: 'Arti',
            url: 'https://yourdomain.com',
          },
        }),
      },
    ],
  };
});
</script>
