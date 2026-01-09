<template>
  <div>
    <!-- Desktop Sidebar -->
    <aside
      dir="ltr"
      class="fixed inset-y-0 left-0 z-50 bg-[#f1f1f1] border-r border-gray-200 shadow-sm transition-all duration-300 hidden sm:block"
      :class="[isExpanded ? 'w-64' : 'w-20']"
    >
      <div class="flex flex-col h-full">
        <!-- Logo and Toggle -->
        <div
          class="flex items-center justify-between h-16 px-4 border-b border-gray-100 bg-[#1a1a1a]"
        >
          <NuxtLink to="/admin" class="flex items-center home">
            <div
              v-if="!isExpanded"
              class="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white font-bold text-xs"
            >
              <Icon name="ph:shopping-bag-bold" class="w-5 h-5" />
            </div>
            <div v-if="isExpanded" class="flex items-center gap-2">
              <div class="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
                <Icon name="ph:shopping-bag-bold" class="w-5 h-5 text-white" />
              </div>
              <span class="font-semibold text-white text-base">Store Admin</span>
            </div>
          </NuxtLink>

          <button
            @click="toggleSidebar"
            class="p-1.5 hover:bg-white/10 rounded transition-all duration-200 text-gray-400 hover:text-white"
            aria-label="Toggle sidebar"
          >
            <Icon
              name="ph:sidebar-bold"
              class="w-5 h-5"
            />
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4 px-3">
          <div class="space-y-0.5">
            <!-- Home -->
            <NuxtLink
              to="/admin"
              class="nav-button flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-white transition-all duration-200 text-sm font-medium"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:house-fill" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3">{{ $t('sidebar.home') }}</span>
            </NuxtLink>

            <!-- Sales Section Label -->
            <div v-if="isExpanded" class="px-3 pt-4 pb-2">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ $t('sidebar.sales') }}</p>
            </div>

            <!-- Orders with submenu and badge -->
            <div v-if="user && user.email">
              <button
                @click="toggleBoutiqueSubmenu"
                class="nav-button w-full flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-white transition-all duration-200 group text-sm font-medium"
                :class="{ 'justify-center': !isExpanded }"
              >
                <Icon name="ph:package-fill" class="w-5 h-5" />
                <span
                  v-if="isExpanded"
                  class="ml-3 flex-1 text-left"
                  >{{ $t('sidebar.orders') }}</span
                >
                <!-- Notification Badge -->
                <span
                  v-if="pendingOrdersCount > 0 && isExpanded"
                  class="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full"
                >
                  {{ pendingOrdersCount > 99 ? "99+" : pendingOrdersCount }}
                </span>
                <Icon
                  v-if="isExpanded"
                  :name="
                    isBoutiqueSubmenuOpen
                      ? 'ph:caret-down-bold'
                      : 'ph:caret-right-bold'
                  "
                  class="w-4 h-4 transition-transform duration-200"
                />
              </button>

              <!-- Orders Submenu -->
              <Transition
                name="submenu"
                @before-enter="beforeSubmenuEnter"
                @enter="enterSubmenu"
                @leave="leaveSubmenu"
              >
                <div
                  v-if="isExpanded && isBoutiqueSubmenuOpen"
                  class="ml-8 mt-0.5 space-y-0.5"
                >
                  <NuxtLink
                    to="/admin/orders"
                    class="submenu-link flex items-center px-3 py-1.5 rounded-md text-gray-600 hover:bg-white transition-all duration-200 text-sm"
                  >
                    <span class="ml-0">{{ $t('sidebar.allOrders') }}</span>
                    <span
                      v-if="pendingOrdersCount > 0"
                      class="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full"
                    >
                      {{ pendingOrdersCount > 99 ? "99+" : pendingOrdersCount }}
                    </span>
                  </NuxtLink>

                  <NuxtLink
                    to="/admin/orders/settings"
                    class="submenu-link flex items-center px-3 py-1.5 rounded-md text-gray-600 hover:bg-white transition-all duration-200 text-sm"
                  >
                    <span class="ml-0">{{ $t('sidebar.settings') }}</span>
                  </NuxtLink>
                </div>
              </Transition>
            </div>

            <!-- Products Section Label -->
            <div v-if="isExpanded" class="px-3 pt-4 pb-2">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ $t('sidebar.products') }}</p>
            </div>

            <!-- Products -->
            <NuxtLink
              to="/admin/products"
              class="nav-button flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-white transition-all duration-200 text-sm font-medium"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:cube-fill" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3">{{ $t('sidebar.products') }}</span>
            </NuxtLink>

            <!-- Collections (Categories) -->
            <NuxtLink
              to="/admin/categories"
              class="nav-button flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-white transition-all duration-200 text-sm font-medium"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:folders-fill" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3">{{ $t('sidebar.collections') }}</span>
            </NuxtLink>

            <!-- Content Section Label -->
            <div v-if="isExpanded" class="px-3 pt-4 pb-2">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ $t('sidebar.content') }}</p>
            </div>

            <!-- Media Library (Gallery) -->
            <NuxtLink
              to="/admin/gallery"
              class="nav-button flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-white transition-all duration-200 text-sm font-medium"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:image-fill" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3">{{ $t('sidebar.media') }}</span>
            </NuxtLink>

            <!-- Pages (FAQ) -->
            <NuxtLink
              to="/admin/faq"
              class="nav-button flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-white transition-all duration-200 text-sm font-medium"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:file-text-fill" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3">{{ $t('sidebar.pages') }}</span>
            </NuxtLink>

            <!-- Reviews (Testimonials) -->
            <NuxtLink
              to="/admin/testimonials"
              class="nav-button flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-white transition-all duration-200 text-sm font-medium"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:star-fill" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3">{{ $t('sidebar.reviews') }}</span>
            </NuxtLink>

            <!-- Settings Section Label -->
            <div v-if="isExpanded" class="px-3 pt-4 pb-2">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ $t('sidebar.settings') }}</p>
            </div>

            <!-- Store Settings -->
            <NuxtLink
              to="/admin/website/general"
              class="nav-button flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-white transition-all duration-200 text-sm font-medium"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:storefront-fill" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3">{{ $t('sidebar.storeDetails') }}</span>
            </NuxtLink>

            <!-- Theme (Colors) -->
            <NuxtLink
              to="/admin/website/colors"
              class="nav-button flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-white transition-all duration-200 text-sm font-medium"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:paint-brush-fill" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3">{{ $t('sidebar.theme') }}</span>
            </NuxtLink>

            <!-- Policies -->
            <NuxtLink
              to="/admin/policies"
              class="nav-button flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-white transition-all duration-200 text-sm font-medium"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:shield-check-fill" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3">{{ $t('sidebar.policies') }}</span>
            </NuxtLink>

            <!-- About Page -->
            <NuxtLink
              to="/admin/website/edit-about"
              class="nav-button flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-white transition-all duration-200 text-sm font-medium"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:info-fill" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3">{{ $t('sidebar.aboutUs') }}</span>
            </NuxtLink>

            <!-- Divider -->
            <div v-if="isExpanded" class="h-px bg-gray-300 my-3 mx-3"></div>

            <!-- Online Store -->
            <NuxtLink
              to="/"
              target="_blank"
              class="nav-button flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-white transition-all duration-200 text-sm font-medium"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:globe-fill" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3">{{ $t('sidebar.onlineStore') }}</span>
            </NuxtLink>
          </div>
        </nav>

        <!-- Language Selector -->
        <div class="border-t border-gray-300 p-3 bg-white">
          <div v-if="isExpanded" class="mb-3">
            <div class="relative">
              <button
                @click="showLanguageDropdown = !showLanguageDropdown"
                class="w-full flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-all duration-200 text-sm"
              >
                <div class="flex items-center gap-2">
                  <span class="text-lg">{{ currentLanguage.flag }}</span>
                  <span class="text-gray-700 font-medium">{{ currentLanguage.name }}</span>
                </div>
                <Icon name="ph:caret-down-bold" class="w-4 h-4 text-gray-500" />
              </button>
              
              <!-- Language Dropdown -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="showLanguageDropdown"
                  class="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50"
                >
                  <button
                    v-for="lang in languages"
                    :key="lang.code"
                    @click="changeLanguage(lang.code)"
                    class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                    :class="{ 'bg-gray-100 font-semibold': locale === lang.code }"
                  >
                    <span class="text-lg">{{ lang.flag }}</span>
                    <span class="text-gray-700">{{ lang.name }}</span>
                    <Icon
                      v-if="locale === lang.code"
                      name="ph:check-bold"
                      class="w-4 h-4 ml-auto text-emerald-500"
                    />
                  </button>
                </div>
              </Transition>
            </div>
          </div>
          <div v-else class="mb-3 flex justify-center">
            <button
              @click="showLanguageDropdown = !showLanguageDropdown"
              class="relative p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-200"
              :title="currentLanguage.name"
            >
              <span class="text-lg">{{ currentLanguage.flag }}</span>
              
              <!-- Mini Language Dropdown for Collapsed Sidebar -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="showLanguageDropdown"
                  class="absolute left-full ml-2 bottom-0 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50"
                >
                  <button
                    v-for="lang in languages"
                    :key="lang.code"
                    @click="changeLanguage(lang.code)"
                    class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
                    :class="{ 'bg-gray-100 font-semibold': locale === lang.code }"
                  >
                    <span class="text-lg">{{ lang.flag }}</span>
                    <span class="text-gray-700">{{ lang.name }}</span>
                    <Icon
                      v-if="locale === lang.code"
                      name="ph:check-bold"
                      class="w-4 h-4 ml-auto text-emerald-500"
                    />
                  </button>
                </div>
              </Transition>
            </button>
          </div>
        </div>

        <!-- User Section -->
        <div v-if="user" class="border-t border-gray-300 p-3 bg-white">
          <div v-if="isExpanded" class="space-y-2">
            <div
              class="flex items-center gap-3 px-3 py-2 bg-gray-100 rounded-md"
            >
              <div
                class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm"
              >
                {{ user.email.charAt(0).toUpperCase() }}
              </div>
              <span class="text-xs text-gray-700 truncate flex-1">{{
                user.email
              }}</span>
            </div>
            <button
              @click="handleSignOut"
              class="w-full px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Icon name="ph:sign-out-bold" class="w-4 h-4" />
              {{ $t('sidebar.signOut') }}
            </button>
          </div>
          <div v-else class="flex justify-center">
            <button
              @click="handleSignOut"
              class="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
              :title="$t('sidebar.signOut')"
            >
              <Icon name="ph:sign-out-bold" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Mobile Navbar -->
    <AdminNavbar class="sm:hidden" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useSupabaseClient, useSupabaseUser } from "#imports";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { locale, setLocale } = useI18n();

const isExpanded = ref(true);
const isBoutiqueSubmenuOpen = ref(true);
const isOrdersSubmenuOpen = ref(true);
const pendingOrdersCount = ref(0);
const showLanguageDropdown = ref(false);

const emit = defineEmits(["sidebar-state"]);

// Available languages
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇩🇿' }
];

const currentLanguage = computed(() => {
  return languages.find(lang => lang.code === locale.value) || languages[0];
});

// Change language and save to localStorage
const changeLanguage = (langCode) => {
  setLocale(langCode);
  if (process.client) {
    localStorage.setItem('admin-language', langCode);
  }
  showLanguageDropdown.value = false;
};

// Get pending orders count
const { getPendingOrdersCount } = useOrders();

const loadPendingOrdersCount = async () => {
  pendingOrdersCount.value = await getPendingOrdersCount();
};

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
  if (!isExpanded.value) {
    isBoutiqueSubmenuOpen.value = false;
    isOrdersSubmenuOpen.value = false;
  }
  emit("sidebar-state", isExpanded.value);
};

const toggleBoutiqueSubmenu = () => {
  if (isExpanded.value) {
    isBoutiqueSubmenuOpen.value = !isBoutiqueSubmenuOpen.value;
  } else {
    isExpanded.value = true;
    isBoutiqueSubmenuOpen.value = true;
    emit("sidebar-state", isExpanded.value);
  }
};

const toggleOrdersSubmenu = () => {
  if (isExpanded.value) {
    isOrdersSubmenuOpen.value = !isOrdersSubmenuOpen.value;
  } else {
    isExpanded.value = true;
    isOrdersSubmenuOpen.value = true;
    emit("sidebar-state", isExpanded.value);
  }
};

// Submenu animation hooks
const beforeSubmenuEnter = (el) => {
  el.style.opacity = "0";
  el.style.maxHeight = "0";
};

const enterSubmenu = (el, done) => {
  el.offsetHeight;
  el.style.transition = "opacity 0.3s ease, max-height 0.3s ease";
  el.style.opacity = "1";
  el.style.maxHeight = el.scrollHeight + "px";
  done();
};

const leaveSubmenu = (el, done) => {
  el.style.transition = "opacity 0.3s ease, max-height 0.3s ease";
  el.style.opacity = "0";
  el.style.maxHeight = "0";
  done();
};

watch(isExpanded, (newValue) => {
  emit("sidebar-state", newValue);
});

const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return navigateTo("/");
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
};

onMounted(() => {
  emit("sidebar-state", isExpanded.value);
  loadPendingOrdersCount();

  // Load saved language preference
  if (process.client) {
    const savedLang = localStorage.getItem('admin-language');
    if (savedLang && languages.some(lang => lang.code === savedLang)) {
      setLocale(savedLang);
    }
  }

  // Refresh count every 30 seconds
  setInterval(loadPendingOrdersCount, 30000);
});
</script>

<style scoped>
/* Active link styling - Shopify style */
.router-link-active.router-link-exact-active:not(.home) {
  @apply bg-[#E3E5E7] text-gray-900 font-semibold;
}

.router-link-active.router-link-exact-active:not(.home) .submenu-link {
  @apply bg-[#E3E5E7] text-gray-900 font-semibold;
}

/* Hover effects - subtle */
.nav-button:hover {
  @apply bg-white;
}

.submenu-link:hover {
  @apply bg-white;
}

/* Submenu transitions */
.submenu-enter-active,
.submenu-leave-active {
  overflow: hidden;
}

/* Custom scrollbar for sidebar */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
