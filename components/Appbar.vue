<template>
  <nav class="w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm relative z-[10]">
    <!-- Top Banner -->
    <TopBanner v-if="!hideBanner" />

    <!-- Main navbar -->
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="relative">
            <Logo
              :src="siteSettings.siteLogo || '/images/placeholders/placeholder-logo.svg'"
              :alt="siteSettings.siteName || 'Logo'"
              class="w-10 h-10 transition-transform group-hover:scale-110"
            />
          </div>
          <div class="hidden sm:block">
            <h1 class="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
              {{ siteSettings.siteName || 'Store' }}
            </h1>
            <p class="text-xs text-gray-500">{{ siteSettings.tagline || 'Premium Store' }}</p>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div v-if="dataLoaded" class="hidden lg:flex items-center gap-1">
          <!-- Custom Navigation Links -->
          <NuxtLink
            v-for="(link, index) in visibleLinks"
            :key="`link-${index}`"
            :to="link.url"
            class="nav-link group"
            :class="{ 'active-link': isActivePath(link.url) }"
          >
            {{ link.label }}
            <span class="nav-underline"></span>
          </NuxtLink>
          
          <!-- Categories Dropdown -->
          <div class="relative group z-[10001]">
            <button class="nav-link flex items-center gap-2">
              <span>{{ $t('nav.categories') || 'Catégories' }}</span>
              <Icon name="ph:caret-down-bold" class="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>
            
            <!-- Minimal Dropdown List -->
            <div class="absolute top-full left-0 w-64 z-[10002] bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 mt-2">
              <div class="py-1 max-h-96 overflow-y-auto">
                <NuxtLink
                  v-for="category in allCategories"
                  :key="category.id"
                  :to="`/categories/${category.slug}`"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  {{ getCategoryName(category) }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-else class="hidden lg:flex items-center gap-2">
          <div v-for="i in 5" :key="i" class="w-20 h-8 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>

        <!-- Right section -->
        <div class="flex items-center gap-2">
          <!-- Language Switcher -->
          <LangSwitcher />
          
          <!-- Search Button -->
          <button class="nav-icon-button group">
            <Icon name="ph:magnifying-glass-bold" class="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" />
          </button>

          <!-- Cart -->
          <NuxtLink to="/cart" class="nav-icon-button group relative" aria-label="Shopping cart">
            <Icon name="ph:shopping-cart-bold" class="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" />
            <span
              v-if="cartItemCount > 0"
              class="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full px-1 animate-scale-in"
            >
              {{ cartItemCount }}
            </span>
          </NuxtLink>

          <!-- Mobile menu button -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden nav-icon-button"
          >
            <Icon :name="mobileMenuOpen ? 'ph:x-bold' : 'ph:list-bold'" class="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="lg:hidden bg-white border-t border-gray-200 shadow-lg transition-all duration-300">
        <div class="container mx-auto px-4 py-6 space-y-2 max-h-[80vh] overflow-y-auto">
          <NuxtLink 
            to="/" 
            @click="mobileMenuOpen = false" 
            class="mobile-link"
          >
            <Icon name="ph:house-bold" class="w-5 h-5" />
            <span>{{ $t('nav.home') || 'Accueil' }}</span>
          </NuxtLink>
          
          <!-- Categories Dropdown -->
          <div>
            <button 
              @click="showMobileCategories = !showMobileCategories" 
              class="mobile-link w-full"
            >
              <span class="flex-1 text-left">{{ $t('nav.categories') || 'Catégories' }}</span>
              <Icon 
                name="ph:caret-down-bold" 
                class="w-4 h-4 transition-transform" 
                :class="{ 'rotate-180': showMobileCategories }" 
              />
            </button>
            
            <div v-if="showMobileCategories" class="ml-8 mt-2 space-y-2 transition-all duration-300">
              <NuxtLink
                v-for="category in allCategories"
                :key="category.id"
                :to="`/categories/${category.slug}`"
                @click="mobileMenuOpen = false"
                class="block py-2 px-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-all"
              >
                {{ getCategoryName(category) }}
              </NuxtLink>
            </div>
          </div>
          
          <!-- Custom Navigation Links -->
          <NuxtLink
            v-for="(link, index) in visibleLinks"
            :key="`mobile-link-${index}`"
            :to="link.url"
            @click="mobileMenuOpen = false"
            class="mobile-link"
          >
            <Icon 
              :name="link.url === '/about' ? 'ph:info-bold' : 
                     link.url === '/contact' ? 'ph:envelope-bold' : 
                     link.url === '/products' ? 'ph:shopping-bag-bold' : 
                     'ph:link-bold'" 
              class="w-5 h-5" 
            />
            <span>{{ link.label }}</span>
          </NuxtLink>
        </div>
    </div>
  </nav>
</template>

<script setup>
const { fetchSection } = useContentSections()
const { cartItemCount: cartCount } = useCart()
const supabase = useSupabaseClient()
const route = useRoute()
const { siteSettings } = useSiteSettings()
const { locale } = useI18n()

const props = defineProps({
  hideBanner: {
    type: Boolean,
    default: false,
  },
})

const currentLocale = computed(() => locale.value)

const defaultContent = {
  links: [
    { label: "Produits", url: "/products", visible: true, type: "link" },
    { label: "À Propos", url: "/about", visible: true, type: "link" },
    { label: "Contact", url: "/contact", visible: true, type: "link" },
  ],
  show_featured_categories: true,
  show_categories_dropdown: true,
}

const categories = ref([])
const mobileMenuOpen = ref(false)
const showMobileCategories = ref(false)
const dataLoaded = ref(false)
const sectionData = ref({
  is_active: true,
  content_translations: {
    fr: { ...defaultContent },
    ar: { ...defaultContent },
    en: { ...defaultContent },
  },
})

const currentContent = computed(() => {
  return sectionData.value.content_translations?.[currentLocale.value] || defaultContent
})

const visibleLinks = computed(() => {
  return (currentContent.value.links || defaultContent.links).filter(link => link.visible)
})

const allCategories = computed(() => {
  return categories.value.filter(cat => cat.is_active)
})

const cartItemCount = computed(() => cartCount.value)

const getCategoryName = (category) => {
  if (!category?.name_translations) return category?.name || ""
  return (
    category.name_translations[currentLocale.value] ||
    category.name_translations.fr ||
    category.name_translations.en ||
    category.name ||
    ""
  )
}

const isActivePath = (url) => {
  if (url.startsWith("/#")) {
    return route.hash === url.substring(1)
  }
  return route.path === url
}

const loadSectionData = async () => {
  try {
    const { data, error } = await fetchSection("navbar")
    
    if (error) {
      console.warn("No navbar section found in database, using defaults")
      return
    }

    if (data) {
      sectionData.value = data
    }
  } catch (error) {
    console.error("Error loading navbar section:", error)
    // Use defaults on error
  }
}

const { fetchCategories } = useCategories()

const loadCategories = async () => {
  try {
    const data = await fetchCategories({ active: true })
    categories.value = data || []
  } catch (error) {
    console.error("Error fetching categories:", error)
  }
}

const fetchData = async () => {
  dataLoaded.value = false
  try {
    await Promise.all([loadSectionData(), loadCategories()])
  } catch (error) {
    console.error("Error fetching navbar data:", error)
  } finally {
    dataLoaded.value = true
  }
}

onMounted(async () => {
  await fetchData()
})
</script>

<style scoped>
/* Navigation Links */
.nav-link {
  position: relative;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(55 65 81);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: rgb(var(--color-primary));
  background-color: rgb(249 250 251);
}

.active-link {
  color: rgb(var(--color-primary));
  background-color: rgb(249 250 251);
}

/* Underline animation */
.nav-underline {
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  width: 0;
  height: 2px;
  background: rgb(var(--color-primary));
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover .nav-underline,
.active-link .nav-underline {
  width: 60%;
}

/* Icon buttons */
.nav-icon-button {
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.nav-icon-button:hover {
  background-color: rgb(249 250 251);
  transform: translateY(-2px);
}

/* Mobile links */
.mobile-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(55 65 81);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.mobile-link:hover {
  color: rgb(var(--color-primary));
  background-color: rgb(249 250 251);
}

/* Animations */
@keyframes scale-in {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease;
}

/* Mobile menu transitions - using CSS transitions instead of Vue transitions */
</style>