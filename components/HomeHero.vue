<template>
  <div v-if="heroData.is_active" class="relative w-full overflow-hidden">
    <!-- Hero Section -->
    <section
      class="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[75vh] flex items-center"
    >
      <!-- Subtle grid + vignette -->
      <div class="absolute inset-0 x-grid-bg opacity-[0.25]"></div>
      <!-- Background Media Container -->
      <div class="absolute inset-0 w-full h-full">
        <!-- Video Background (Priority) -->
        <div
          v-if="currentContent.background_video"
          class="absolute inset-0 w-full h-full"
        >
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
          <div
            class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"
          ></div>
        </div>

        <!-- Image Background (Fallback) -->
        <div
          v-else-if="currentContent.background_image || videoError"
          class="absolute inset-0 w-full h-full"
        >
          <img
            :src="
              currentContent.background_image ||
              defaultHeroData.background_image
            "
            alt="Hero background"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"
          ></div>
        </div>

        <!-- Default Gradient Background -->
        <div
          v-else
          class="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        ></div>
      </div>

      <!-- Content Container -->
      <div class="relative w-full" data-aos="fade-up">
        <div class="x-container py-12 sm:py-16 lg:py-20">
          <!-- Loading state -->
          <div v-if="loading" class="max-w-3xl mx-auto text-center space-y-4">
            <div
              class="h-12 sm:h-14 bg-white/20 rounded-lg w-3/4 mx-auto animate-pulse"
            ></div>
            <div
              class="h-4 sm:h-6 bg-white/20 rounded-lg w-2/3 mx-auto animate-pulse"
            ></div>
            <div
              class="h-10 sm:h-12 bg-white/20 rounded-lg w-40 mx-auto animate-pulse"
            ></div>
          </div>

          <!-- Hero Content -->
          <div v-else class="max-w-5xl mx-auto text-center">
            <!-- Title -->
            <h1
              class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-5 leading-[1.05] animate-fade-in-up"
              style="text-shadow: 0 12px 40px rgba(0, 0, 0, 0.35)"
            >
              {{ currentContent.title || defaultHeroData.title }}
            </h1>

            <!-- Subtitle -->
            <p
              v-html="currentContent.subtitle || defaultHeroData.subtitle"
              class="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up"
              style="animation-delay: 0.1s"
            ></p>

            <!-- CTA Button -->
            <div
              class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 animate-fade-in-up"
              style="animation-delay: 0.2s"
            >
              <NuxtLink
                :to="currentContent.button_link || '/products'"
                class="x-btn-primary group px-7 sm:px-9 py-3.5 sm:py-4 text-sm sm:text-base shadow-2xl shadow-black/20"
              >
                {{ currentContent.button_text || defaultHeroData.button_text }}
                <Icon
                  name="ph:arrow-right-bold"
                  class="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1"
                />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { fetchSection } = useContentSections();
const supabase = useSupabaseClient();
const { locale } = useI18n();

const getCurrentLocale = () => {
  try {
    return locale.value;
  } catch {
    return "fr";
  }
};

const currentLocale = computed(() => getCurrentLocale());

const { businessId } = useBusinessPreview();

const HERO_PRESETS: Record<string, any> = {
  ecommerce: {
    title: "Shop smarter, live better",
    subtitle: "Browse trending products and discover great deals.",
    button_text: "Shop now",
    button_link: "/products",
    background_image: "/images/placeholders/ready-to-wear/hero.jpg",
    background_video: "",
  },
  restaurant: {
    title: "Fresh food, warm atmosphere",
    subtitle: "Explore our menu and discover today’s best dishes.",
    button_text: "See the menu",
    button_link: "/products",
    background_image: "/images/placeholders/reataurant/hero.jpg",
    background_video: "",
  },
  artisan: {
    title: "Handmade with care",
    subtitle: "Unique creations crafted locally, just for you.",
    button_text: "Discover creations",
    button_link: "/products",
    background_image: "/images/placeholders/artisan/hero.jpg",
    background_video: "",
  },
  patisserie: {
    title: "Sweet moments, baked daily",
    subtitle: "Explore cakes, pastries and fresh treats.",
    button_text: "See treats",
    button_link: "/products",
    background_image: "/images/placeholders/patisserie/hero.jpg",
    background_video: "",
  },
  leather: {
    title: "Leather goods that last",
    subtitle: "Premium craftsmanship, timeless pieces.",
    button_text: "Explore collection",
    button_link: "/products",
    background_image: "/images/placeholders/leather/hero.jpg",
    background_video: "",
  },
  jewellery: {
    title: "Shine every day",
    subtitle: "Rings, necklaces and elegant details.",
    button_text: "Browse jewellery",
    button_link: "/products",
    background_image: "/images/placeholders/jewellery/hero.jpg",
    background_video: "",
  },
  "home-decor": {
    title: "Make your home feel like you",
    subtitle: "Decor pieces for every room and mood.",
    button_text: "Discover decor",
    button_link: "/products",
    background_image:
      "/images/placeholders/home-decor/spacejoy-IH7wPsjwomc-unsplash.jpg",
    background_video: "",
  },
  "ready-to-wear": {
    title: "New looks, curated for you",
    subtitle: "Trendy pieces and everyday essentials.",
    button_text: "Shop fashion",
    button_link: "/products",
    background_image: "/images/placeholders/ready-to-wear/hero.jpg",
    background_video: "",
  },
};

const defaultHeroData = {
  title: "Bienvenue dans notre magasin",
  subtitle: "Découvrez des produits incroyables à des prix avantageux",
  button_text: "Voir les produits",
  button_link: "/products",
  background_image: "",
  background_video: "",
};

// Empty translations ensure business presets can show until (and unless) the DB has real hero content.
// Previously we initialized translations with default copy, which prevented preset switching.
const emptyHeroData = {
  title: "",
  subtitle: "",
  button_text: "",
  button_link: "",
  background_image: "",
  background_video: "",
};

const loading = ref(true);
const videoError = ref(false);
const videoElement = ref(null);

const heroData = ref({
  is_active: true,
  content_translations: {
    en: { ...emptyHeroData },
    fr: { ...emptyHeroData },
    ar: { ...emptyHeroData },
  },
});

const currentContent = computed(() => {
  const content = heroData.value.content_translations?.[currentLocale.value];

  const b = String(businessId.value);
  const preset = HERO_PRESETS[b] || HERO_PRESETS.ecommerce;

  // Base hero = DB content (if present), otherwise defaults
  const base = {
    ...defaultHeroData,
    ...(content || {}),
  };

  // Always ensure we have a nice background even if DB content is missing media
  const withMediaFallback = {
    ...base,
    background_image: base.background_image || preset.background_image,
    background_video: base.background_video || preset.background_video,
    button_link:
      base.button_link || preset.button_link || defaultHeroData.button_link,
    button_text: base.button_text || preset.button_text,
  };

  // IMPORTANT: When previewing a non-default business type, force hero content to match the business preset.
  // This guarantees the hero switches when changing business type, even if the DB has hero content.
  if (b && b !== "ecommerce") {
    return {
      ...withMediaFallback,
      ...preset,
    };
  }

  return withMediaFallback;
});

// Video event handlers
const onVideoLoaded = () => {
  videoError.value = false;
  if (videoElement.value) {
    videoElement.value.play().catch((err) => {
      console.warn("Video autoplay failed:", err);
      document.addEventListener(
        "click",
        () => {
          if (videoElement.value) {
            videoElement.value
              .play()
              .catch((e) => console.error("Video play failed:", e));
          }
        },
        { once: true }
      );
    });
  }
};

const onVideoError = (event) => {
  console.error("Video failed to load:", event);
  videoError.value = true;
};

const loadHeroData = async () => {
  loading.value = true;
  try {
    const { data, error } = await fetchSection("hero");
    if (error) throw error;
    if (data) {
      heroData.value = data;
    } else {
      const { data: directData } = await supabase
        .from("content_sections")
        .select("*")
        .eq("section_key", "hero")
        .single();
      if (directData) {
        heroData.value = directData;
      }
    }
  } catch (error) {
    console.error("Error loading hero data:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadHeroData();
});

watch(
  () => currentContent.value.background_video,
  (newVideo) => {
    if (newVideo) {
      videoError.value = false;
    }
  }
);
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