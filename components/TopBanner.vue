<template>
  <div
    v-if="section.is_active && section.content_translations?.[currentLocale]?.text"
    class="bg-primary  text-contrast1 text-center py-3 text-sm font-medium relative overflow-hidden group"
  >
    <!-- Animated gradient overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
    ></div>
    
    <!-- Banner text -->
    <span class="relative z-10">
      {{ section.content_translations?.[currentLocale]?.text }}
    </span>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const { locale } = useI18n()

const SECTION_KEY = 'top_banner'

// Current locale
const currentLocale = computed(() => locale.value || 'fr')

// Section data
const section = ref({
  is_active: false,
  content_translations: {
    fr: { text: '' },
    ar: { text: '' },
    en: { text: '' }
  }
})

// Load section
const loadSection = async () => {
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .select('is_active, content_translations')
      .eq('section_key', SECTION_KEY)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (data) {
      section.value = {
        is_active: data.is_active ?? false,
        content_translations: data.content_translations || {
          fr: { text: '' },
          ar: { text: '' },
          en: { text: '' }
        }
      }
    }
  } catch (error) {
    console.error('Error loading banner:', error)
  }
}

onMounted(async () => {
  await loadSection()
})
</script>

<style scoped>
/* Smooth animations */
.group:hover {
  @apply cursor-default;
}
</style>