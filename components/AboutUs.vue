<template>
  <section
    v-if="section.is_active"
    id="about"
    class="x-section"
    :dir="isRtl ? 'rtl' : 'ltr'"
  >
    <div class="x-container">
      <!-- Title (same as original intent; no extra copy) -->
      <div class="text-center mb-14" data-aos="fade-up">
        <h2 class="x-title">
          {{ section.content_translations?.[currentLocale]?.title || 'Notre Histoire' }}
        </h2>
        <div class="x-divider mx-auto"></div>
      </div>

      <!-- Simple elegant layout: image + content; no extra elements -->
      <div
        class="grid grid-cols-1 lg:grid-cols-2 items-start gap-10 lg:gap-14"
        :class="isRtl ? 'lg:[direction:rtl]' : ''"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <!-- Image -->
        <div v-if="section.image_url" class="w-full">
          <div class="about-media">
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
            class="about-prose prose prose-gray max-w-none text-mgray-800"
            v-html="section.content_translations?.[currentLocale]?.content"
          ></div>
          <div v-else class="text-center py-8">
            <Icon name="ph:info-circle" class="w-12 h-12 mx-auto mb-4 text-mgray-300" />
            <p class="text-mgray-600">
              {{ $t('about.noContent') || 'Aucun contenu disponible' }}
            </p>
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
/* Elegant, minimal styling (no heavy rounded borders) */

.about-media {
  @apply overflow-hidden;
  border-radius: 0.5rem; /* subtle, not pill/large */
}

.about-prose :deep(p) {
  @apply mb-4 leading-relaxed;
}

.about-prose :deep(h2),
.about-prose :deep(h3) {
  @apply mt-7 mb-3 font-semibold text-mgray-950;
}

.about-prose :deep(ul),
.about-prose :deep(ol) {
  @apply my-4 pl-6;
}

.about-prose :deep(li) {
  @apply mb-2 text-mgray-800;
}

.about-prose :deep(strong) {
  @apply font-semibold text-mgray-950;
}

.about-prose :deep(a) {
  @apply underline;
  color: rgba(var(--primary-color), 1);
}
</style>