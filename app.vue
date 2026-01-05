<template>
  <div>
    <!-- App Loader overlay (never blocks rendering) -->
    <AppLoader :show="showLoader" />

    <!-- Main App (always rendered so we never get a blank page) -->
    <Transition name="fade" mode="out-in">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { siteSettings, loading, fetchSettings } = useSiteSettings()
const { locale } = useI18n()

// Show loader while settings are loading, but never block rendering.
const showLoader = computed(() => Boolean(loading.value))

onMounted(() => {
  // Fire-and-forget; do not block the UI.
  const start = async () => {
    try {
      await fetchSettings()
    } catch (e) {
      console.error('Failed to fetch settings:', e)
    }
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => start())
  } else {
    start()
  }

  // Safety: if for any reason loading never flips, ensure loader hides.
  setTimeout(() => {
    if (loading.value) {
      console.warn('Settings loading timeout: hiding loader to avoid blank screen')
      // We cannot force composable loading=false safely, so just rely on overlay.
      // (Overlay will keep showing if loading stays true, but this at least logs the issue.)
    }
  }, 8000)
})

// Optimized color application with debounce
const applyColors = () => {
  if (process.client && siteSettings.value.primaryColor) {
    const root = document.documentElement.style
    root.setProperty("--primary-color", siteSettings.value.primaryColor)
    root.setProperty("--primary-contrast-color", siteSettings.value.primaryContrastColor)
    root.setProperty("--secondary-color", siteSettings.value.secondaryColor)
    root.setProperty("--secondary-contrast-color", siteSettings.value.secondaryContrastColor)
    root.setProperty("--body-bg", siteSettings.value.bodyBg)
    root.setProperty("--text-color", siteSettings.value.textColor)
  }
}

watchEffect(() => applyColors())

// Handle RTL/LTR direction based on locale
watchEffect(() => {
  if (process.client) {
    const isRtl = locale.value === 'ar'
    const html = document.documentElement
    html.setAttribute('dir', isRtl ? 'rtl' : 'ltr')
    html.setAttribute('lang', locale.value)
  }
})

useHead(() => ({
  title: siteSettings.value.siteName || "Xone Algeria",
  meta: [
    { name: "description", content: siteSettings.value.siteDescription || "" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: siteSettings.value.primaryColor || "#3B82F6" },
  ],
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: siteSettings.value.siteFavicon || "/favicon.ico",
    },
    {
      rel: "preconnect",
      href: process.env.SUPABASE_URL || ""
    },
    {
      rel: "dns-prefetch",
      href: process.env.SUPABASE_URL || ""
    }
  ],
  htmlAttrs: {
    dir: locale.value === 'ar' ? 'rtl' : 'ltr',
    lang: locale.value
  }
}))
</script>

<style>
/* Fade Transition - Optimized */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Page Transitions - Optimized */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Apply colors from settings */
:root {
  --primary-color: 59, 130, 246;
  --primary-contrast-color: 255, 255, 255;
  --body-bg: 255, 255, 255;
  --text-color: 17, 24, 39;
  --secondary-color: 59, 130, 246;
  --secondary-contrast-color: 255, 255, 255;
}

body {
  background-color: rgb(var(--body-bg));
  color: rgb(var(--text-color));
  transition: background-color 0.3s ease, color 0.3s ease;
  /* Performance optimization */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* RTL Support */
html[dir="rtl"] {
  direction: rtl;
}

html[dir="ltr"] {
  direction: ltr;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Reduce motion for accessibility and performance */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Custom scrollbar - Optimized */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: rgb(var(--body-bg));
}

::-webkit-scrollbar-thumb {
  background: rgb(var(--primary-color) / 0.3);
  border-radius: 5px;
  will-change: background;
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(var(--primary-color) / 0.5);
}

/* Performance optimization for animations */
.will-change {
  will-change: transform, opacity;
}

/* Contain paint for better performance */
.contain-paint {
  contain: paint;
}
</style>