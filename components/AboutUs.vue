<template>
  <section v-if="section.is_active" id="about" class="x-section relative overflow-hidden" :dir="isRtl ? 'rtl' : 'ltr'">
    <div class="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
    <div class="x-container relative">
      <!-- Title - Debut Style -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-4">
          <span class="x-eyebrow">
            <Icon name="ph:book-open-text-fill" class="w-3.5 h-3.5 text-primary" />
            {{ $t('about.title') || 'About' }}
          </span>
        </div>
        <h2 class="x-title">
          {{ section.content_translations?.[currentLocale]?.title || 'Notre Histoire' }}
        </h2>
        <div class="x-divider mx-auto"></div>
      </div>

      <!-- Content Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-14" :class="isRtl ? 'lg:[direction:rtl]' : ''">
        <!-- Image -->
        <div v-if="section.image_url" class="w-full">
          <div class="relative overflow-hidden rounded-3xl border border-mgray-200 shadow-xl">
            <NuxtImg
              :src="section.image_url"
              :alt="section.content_translations?.[currentLocale]?.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Text Content -->
        <div class="w-full">
          <div
            v-if="section.content_translations?.[currentLocale]?.content"
            class="prose prose-gray max-w-none text-mgray-800 leading-relaxed"
            v-html="section.content_translations?.[currentLocale]?.content"
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