<template>
  <div v-if="heroData.is_active" class="relative pt-6 w-full overflow-hidden">
    <!-- Hero Section -->
    <section class="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[82vh] flex items-center">
      <!-- Subtle grid + vignette -->
      <div class="absolute inset-0 x-grid-bg opacity-[0.25]"></div>
      <!-- Background Media Container -->
      <div class="absolute inset-0 w-full h-full">
        <!-- Video Background (Priority) -->
        <div v-if="currentContent.background_video" class="absolute inset-0 w-full h-full">
          <video
            ref="videoElement"
            :key="currentContent.background_video"
            :src="currentContent.background_video"
            autoplay
            loop
            muted
            playsinline
            preload="auto"
            class="w-full h-full object-cover"
            @loadeddata="onVideoLoaded"
            @error="onVideoError"
          />
          <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        <!-- Image Background (Fallback) -->
        <div v-else-if="currentContent.background_image || videoError" class="absolute inset-0 w-full h-full">
          <img
            :src="currentContent.background_image || defaultHeroData.background_image"
            alt="Hero background"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        <!-- Default Gradient Background -->
        <div v-else class="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      </div>

      <!-- Content Container -->
      <div class="relative w-full">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <!-- Loading state -->
          <div v-if="loading" class="max-w-3xl mx-auto text-center space-y-4">
            <div class="h-12 sm:h-14 bg-white/20 rounded-lg w-3/4 mx-auto animate-pulse"></div>
            <div class="h-4 sm:h-6 bg-white/20 rounded-lg w-2/3 mx-auto animate-pulse"></div>
            <div class="h-10 sm:h-12 bg-white/20 rounded-lg w-40 mx-auto animate-pulse"></div>
          </div>

          <!-- Hero Content -->
          <div v-else class="max-w-5xl mx-auto text-center">
            <div class="flex justify-center mb-6 animate-fade-in-up">
              <span class="x-eyebrow bg-white/10 border-white/15 text-white/90">
                <Icon name="ph:sparkle-fill" class="w-3.5 h-3.5" />
                {{ $t('common.shop') || 'Shop' }}
              </span>
            </div>
            <!-- Title -->
            <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-5 leading-[1.05] animate-fade-in-up" style="text-shadow: 0 12px 40px rgba(0,0,0,.35);">
              {{ currentContent.title || defaultHeroData.title }}
            </h1>

            <!-- Subtitle -->
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style="animation-delay: 0.1s;">
              {{ currentContent.subtitle || defaultHeroData.subtitle }}
            </p>

            <!-- CTA Button -->
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 animate-fade-in-up" style="animation-delay: 0.2s;">
              <NuxtLink
                to="/products"
                class="x-btn-primary group px-7 sm:px-9 py-3.5 sm:py-4 text-sm sm:text-base shadow-2xl shadow-black/20"
              >
                {{ currentContent.button_text || defaultHeroData.button_text }}
                <Icon name="ph:arrow-right-bold" class="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </NuxtLink>

            </div>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { fetchSection } = useContentSections()
const supabase = useSupabaseClient()
const { locale } = useI18n()

const getCurrentLocale = () => {
  try {
    return locale.value
  } catch {
    return 'fr'
  }
}

const currentLocale = computed(() => getCurrentLocale())

const defaultHeroData = {
  title: "Bienvenue dans notre magasin",
  subtitle: "Découvrez des produits incroyables à des prix avantageux",
  button_text: "Voir les produits",
  background_image: "",
  background_video: "",
}

const loading = ref(true)
const videoError = ref(false)
const videoElement = ref(null)

const heroData = ref({
  is_active: true,
  content_translations: {
    en: { ...defaultHeroData },
    fr: { ...defaultHeroData },
    ar: { ...defaultHeroData }
  }
})

const currentContent = computed(() => {
  const content = heroData.value.content_translations?.[currentLocale.value]
  return content || defaultHeroData
})

// Video event handlers
const onVideoLoaded = () => {
  videoError.value = false
  if (videoElement.value) {
    videoElement.value.play().catch(err => {
      console.warn('Video autoplay failed:', err)
      document.addEventListener('click', () => {
        if (videoElement.value) {
          videoElement.value.play().catch(e => console.error('Video play failed:', e))
        }
      }, { once: true })
    })
  }
}

const onVideoError = (event) => {
  console.error('Video failed to load:', event)
  videoError.value = true
}

const loadHeroData = async () => {
  loading.value = true
  try {
    const { data, error } = await fetchSection('hero')
    if (error) throw error
    if (data) {
      heroData.value = data
    } else {
      const { data: directData } = await supabase
        .from('content_sections')
        .select('*')
        .eq('section_key', 'hero')
        .single()
      if (directData) {
        heroData.value = directData
      }
    }
  } catch (error) {
    console.error('Error loading hero data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadHeroData()
})

watch(() => currentContent.value.background_video, (newVideo) => {
  if (newVideo) {
    videoError.value = false
  }
})
</script>

<style scoped>
/* Video styling */
video {
  pointer-events: none;
}

/* Fade in up animation */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
  opacity: 0;
}

/* Button hover effect */
.group:hover {
  transform: translateY(-2px);
}
</style>