<template>
  <div v-if="heroData.is_active" class="relative pt-6 w-full overflow-hidden">
    <!-- Hero Section -->
    <section class="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center bg-gray-50">
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
          <div v-else class="max-w-4xl mx-auto text-center">
            <!-- Title -->
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4 leading-tight animate-fade-in-up">
              {{ currentContent.title || defaultHeroData.title }}
            </h1>

            <!-- Subtitle -->
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-8 leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style="animation-delay: 0.1s;">
              {{ currentContent.subtitle || defaultHeroData.subtitle }}
            </p>

            <!-- CTA Button -->
            <div class="flex justify-center mb-16 animate-fade-in-up" style="animation-delay: 0.2s;">
              <NuxtLink
                to="/products"
                class="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white bg-primary rounded-full hover:bg-primary/90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                {{ currentContent.button_text || defaultHeroData.button_text }}
                <Icon name="ph:arrow-right-bold" class="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </NuxtLink>
            </div>

            <!-- Features -->
            <div v-if="!loading && !featuresLoading && currentFeatures.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in-up" style="animation-delay: 0.3s;">
              <div
                v-for="(feature, index) in currentFeatures"
                :key="index"
                class="text-center text-white group"
              >
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-all duration-300">
                  <Icon :name="feature.icon" class="w-6 h-6 text-white" />
                </div>
                <h3 class="font-bold text-white mb-1">{{ feature.title }}</h3>
                <p class="text-sm text-white/80">{{ feature.description }}</p>
              </div>
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

const defaultFeatures = [
  {
    icon: "ph:users-three-fill",
    title: "100M+",
    description: "produits vendus"
  },
  {
    icon: "ph:globe-hemisphere-west-fill",
    title: "60+ pays",
    description: "couverts"
  },
  {
    icon: "ph:package-fill",
    title: "Livraison DZ",
    description: "rapide & sécurisée"
  },
  {
    icon: "ph:headset-fill",
    title: "Support 24/7",
    description: "toujours disponible"
  }
]

const loading = ref(true)
const featuresLoading = ref(true)
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

const featuresData = ref({
  is_active: true,
  content_translations: {
    fr: { features: defaultFeatures },
    ar: { features: defaultFeatures },
    en: { features: defaultFeatures }
  }
})

const currentContent = computed(() => {
  const content = heroData.value.content_translations?.[currentLocale.value]
  return content || defaultHeroData
})

const currentFeatures = computed(() => {
  const content = featuresData.value.content_translations?.[currentLocale.value]
  return content?.features || defaultFeatures
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

const loadFeaturesData = async () => {
  featuresLoading.value = true
  try {
    const { data, error } = await fetchSection('features')
    if (error) throw error
    if (data) {
      featuresData.value = data
    }
  } catch (error) {
    console.error('Error loading features section:', error)
  } finally {
    featuresLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadHeroData(), loadFeaturesData()])
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