<template>
  <section v-if="section.is_active" id="about" class="py-16" :dir="isRtl ? 'rtl' : 'ltr'">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Title - Debut Style -->
      <div class="text-center mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {{ section.content_translations[currentLocale]?.title || 'Notre Histoire' }}
        </h2>
        <div class="w-16 h-0.5 bg-primary mx-auto mb-6"></div>
      </div>

      <!-- Content Layout -->
      <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12" :class="isRtl ? 'lg:flex-row-reverse' : ''">
        <!-- Image -->
        <div v-if="section.image_url" class="w-full lg:w-1/2">
          <div class="overflow-hidden rounded-lg border border-gray-200">
            <NuxtImg
              :src="section.image_url"
              :alt="section.content_translations[currentLocale]?.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Text Content -->
        <div class="w-full" :class="section.image_url ? 'lg:w-1/2' : ''">
          <div
            v-if="section.content_translations[currentLocale]?.content"
            class="prose prose-gray max-w-none text-gray-700 leading-relaxed"
            v-html="section.content_translations[currentLocale].content"
          ></div>
          <div v-else class="text-center py-8">
            <Icon name="ph:info-circle" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p class="text-gray-500">{{ $t('about.noContent') || 'Aucun contenu disponible' }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const supabase = useSupabaseClient()
const { locale } = useI18n()

const SECTION_KEY = 'about_us'

// Current locale
const currentLocale = computed(() => locale.value || 'fr')
const isRtl = computed(() => currentLocale.value === 'ar')

// Section data
const section = ref({
  is_active: false,
  content_translations: {
    fr: { title: '', content: '' },
    ar: { title: '', content: '' },
    en: { title: '', content: '' }
  },
  image_url: ''
})

// Load section
const loadSection = async () => {
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .select('is_active, content_translations, image_url')
      .eq('section_key', SECTION_KEY)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (data) {
      section.value = {
        is_active: data.is_active ?? false,
        content_translations: data.content_translations || {
          fr: { title: '', content: '' },
          ar: { title: '', content: '' },
          en: { title: '', content: '' }
        },
        image_url: data.image_url || ''
      }
    }
  } catch (error) {
    console.error('Error loading about section:', error)
  }
}

onMounted(async () => {
  await loadSection()
})
</script>

<style scoped>


.prose p {
  @apply mb-4;
}

.prose h3 {
  @apply text-xl font-semibold mb-3 ;
}

.prose ul,
.prose ol {
  @apply ml-6 mb-4;
}

.prose ul {
  @apply list-disc;
}

.prose ol {
  @apply list-decimal;
}

.prose li {
  @apply mb-2;
}

.prose strong {
  @apply font-semibold;
}

.prose a {
  @apply text-primary hover:underline;
}
</style>