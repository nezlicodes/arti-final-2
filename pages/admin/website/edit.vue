<template>
  <div class="min-h-screen bg-[#f1f1f1]">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <NuxtLink to="/admin/website" class="text-gray-400 hover:text-gray-600">
              <Icon name="ph:arrow-left-bold" class="w-5 h-5" />
            </NuxtLink>
            <div>
              <h1 class="text-lg font-semibold text-gray-900">{{ $t('admin.editor.title') }}</h1>
              <p class="text-xs text-gray-500">{{ $t('admin.editor.subtitle') }}</p>
            </div>
          </div>
          
          <!-- Language Selector -->
          <div class="flex items-center gap-2">
            <Icon name="ph:translate-bold" class="w-4 h-4 text-gray-500" />
            <div class="flex gap-2">
              <button
                v-for="lang in languages"
                :key="lang.code"
                @click="setLanguage(lang.code)"
                type="button"
                :class="[
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  editorLanguage === lang.code
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                ]"
              >
                {{ lang.flag }} {{ lang.name }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Language Info Banner -->
        <div class="pb-3">
          <div class="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 flex items-center gap-2">
            <Icon name="ph:info-bold" class="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p class="text-xs text-blue-800">
              {{ $t('admin.editor.editingLanguage') }}: <strong>{{ languages.find((l) => l.code === editorLanguage)?.name }}</strong>
              <span class="text-blue-600 ml-1">{{ $t('admin.editor.languageHint') }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-6">
        <!-- Navigation Settings -->
        <AppbarEditor />
        
        <!-- Top Banner -->
        <BannerEditor />

        <!-- Hero Section -->
        <HeaderEditor />

        <!-- Featured Product Section -->
        <FeaturedProductEditor />

        <!-- Featured Categories Section -->
        <FeaturedCategoriesEditor />

        <!-- About Us Section -->
        <AboutUsEditor />

        <!-- FAQ Section -->
        <FAQEditor />

        <!-- Testimonials Section -->
        <TestimonialsEditor />

        <!-- Other sections will be updated progressively -->
        <!-- 
        <ContactEditor />
        <FeaturesEditor />
        -->

        <!-- Footer Section -->
        <FooterEditor />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t: $t } = useI18n()

// Import the editor components
import AppbarEditor from "~/components/settings/AppbarEditor.vue";
import BannerEditor from "~/components/settings/BannerEditor.vue";
import HeaderEditor from "~/components/settings/HeaderEditor.vue";
import FeaturesEditor from "~/components/settings/FeaturesEditor.vue";
import FeaturedCategoriesEditor from "~/components/settings/FeaturedCategoriesEditor.vue";
import FAQEditor from "~/components/settings/FAQEditor.vue";
import TestimonialsEditor from "~/components/settings/TestimonialsEditor.vue";
import FooterEditor from "~/components/settings/FooterEditor.vue";
import AboutUsEditor from "~/components/settings/AboutUsEditor.vue";
import FeaturedProductEditor from "~/components/settings/FeaturedProductEditor.vue";

const { editorLanguage, setLanguage } = useEditorLanguage();

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇩🇿" },
];

useHead(() => ({
  title: $t('admin.editor.pageTitle'),
  meta: [
    {
      name: "description",
      content: $t('admin.editor.pageDescription'),
    },
  ],
}));
</script>

<style scoped></style>
