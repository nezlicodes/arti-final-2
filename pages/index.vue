<template>
  <div>
    <HomeHero />

    <!-- Keep existing sections but respect feature flags -->
    <FeaturedProductSection />

    <FeaturedCategories v-if="categoriesEnabled" />
    <AboutUs />
    <FAQ v-if="faqEnabled" />
    <Testimonials v-if="testimonialsEnabled" />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();

// Check feature flags
const categoriesEnabled = ref(true);
const testimonialsEnabled = ref(true);
const faqEnabled = ref(true);

// Fetch feature config
const loadFeatureConfig = async () => {
  try {
    const { data, error } = await supabase
      .from("features_config")
      .select("*")
      .single();

    if (data) {
      categoriesEnabled.value = data.categories_enabled;
      testimonialsEnabled.value = data.testimonials_enabled;
      faqEnabled.value = data.faq_enabled;
    }
  } catch (error) {
    console.error("Error loading feature config:", error);
  }
};

onMounted(() => {
  loadFeatureConfig();
});

// SEO
const { siteSettings } = useSiteSettings();

useHead(() => ({
  title: siteSettings.value.siteName || "Xone Algeria",
  meta: [
    {
      name: "description",
      content:
        siteSettings.value.defaultMetaDescription ||
        "E-commerce platform in Algeria",
    },
  ],
}));
</script>