<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center relative gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      :aria-label="$t('common.changeLanguage')"
    >
      <!-- Current Language Flag/Icon -->
      <svg
        v-if="currentLocale === 'fr'"
        class="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
      >
        <rect width="24" height="24" fill="#002395" />
        <rect x="8" width="8" height="24" fill="#FFFFFF" />
        <rect x="16" width="8" height="24" fill="#ED2939" />
      </svg>

      <span v-else-if="currentLocale === 'ar'" class="text-xl leading-none">🇩🇿</span>

      <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" fill="#012169" />
        <path d="M0 0 L24 16 M24 0 L0 16" stroke="#FFFFFF" stroke-width="3" />
        <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" stroke-width="1.5" />
        <path d="M12 0 V24 M0 12 H24" stroke="#FFFFFF" stroke-width="5" />
        <path d="M12 0 V24 M0 12 H24" stroke="#C8102E" stroke-width="3" />
      </svg>

      <span class="text-sm font-medium uppercase">{{ currentLocale }}</span>

      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
      class="relati"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200"
      >
        <button
          v-for="lang in availableLocales"
          :key="lang.code"
          @click="changeLanguage(lang.code)"
          class="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
          :class="{ 'bg-gray-100 font-semibold': currentLocale === lang.code }"
        >
          <span class="text-2xl">{{ lang.flag }}</span>
          <span>{{ lang.name }}</span>
          <svg
            v-if="currentLocale === lang.code"
            class="w-4 h-4 ml-auto text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </transition>
  </div>
</template>
  
  <script setup>
const { locale, setLocale, locales } = useI18n();
const isOpen = ref(false);
const dropdownRef = ref(null);

const currentLocale = computed(() => locale.value);

const availableLocales = computed(() => [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇩🇿" },
  { code: "en", name: "English", flag: "🇬🇧" },
]);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const changeLanguage = async (langCode) => {
  await setLocale(langCode);
  isOpen.value = false;

  // Reload page to fetch new translations
  if (process.client) {
    window.location.reload();
  }
};

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
      isOpen.value = false;
    }
  };

  document.addEventListener("click", handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>