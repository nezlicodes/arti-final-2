<template>
  <div class="min-h-screen bg-[#f1f1f1]">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/admin/website"
              class="text-gray-400 hover:text-gray-600"
            >
              <Icon name="ph:arrow-left-bold" class="w-5 h-5" />
            </NuxtLink>
            <div>
              <h1 class="text-lg font-semibold text-gray-900">
                {{ $t("admin.testimonials.title") }}
              </h1>
              <p class="text-xs text-gray-500">
                {{ $t("admin.testimonials.subtitle") }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="openConfigModal()"
              :disabled="isLoading"
              class="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="ph:gear-bold" class="w-4 h-4" />
              {{ $t("admin.testimonials.configure") }}
            </button>
            <button
              @click="openModal()"
              :disabled="isLoading"
              class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Icon name="ph:plus-bold" class="w-4 h-4" />
              {{ $t("admin.testimonials.addTestimonial") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Status Card -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6"
        v-if="configData"
      >
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-base font-semibold text-gray-900">
                {{ $t("admin.testimonials.sectionConfig") }}
              </h3>
              <div class="mt-1 text-sm text-gray-500">
                <p>
                  {{
                    configData.testimonials_enabled
                      ? $t("admin.testimonials.sectionEnabled")
                      : $t("admin.testimonials.sectionDisabled")
                  }}
                </p>
              </div>
            </div>
            <span
              :class="[
                configData.testimonials_enabled
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800',
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
              ]"
            >
              {{
                configData.testimonials_enabled
                  ? $t("admin.testimonials.enabled")
                  : $t("admin.testimonials.disabled")
              }}
            </span>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t("admin.testimonials.customer") }}
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t("admin.testimonials.contentFr") }}
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t("admin.testimonials.rating") }}
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t("admin.testimonials.status") }}
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t("admin.testimonials.languages") }}
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t("admin.testimonials.order") }}
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">{{
                    $t("admin.testimonials.actions")
                  }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="testimonial in testimonials"
                :key="testimonial.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td
                  class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
                >
                  {{ testimonial.customer_name }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs">
                  <div class="line-clamp-2">
                    {{
                      testimonial.content_translations?.fr ||
                      $t("admin.testimonials.noContent")
                    }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <div class="flex items-center gap-0.5">
                    <Icon
                      v-for="i in 5"
                      :key="i"
                      name="ph:star-fill"
                      :class="[
                        'w-4 h-4',
                        i <= testimonial.rating
                          ? 'text-yellow-400'
                          : 'text-gray-200',
                      ]"
                    />
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    :class="[
                      testimonial.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                    ]"
                  >
                    {{
                      testimonial.is_active
                        ? $t("admin.testimonials.active")
                        : $t("admin.testimonials.inactive")
                    }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <div class="flex gap-1">
                    <span
                      v-if="testimonial.content_translations?.fr"
                      class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-medium"
                      >FR</span
                    >
                    <span
                      v-if="testimonial.content_translations?.ar"
                      class="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-md font-medium"
                      >AR</span
                    >
                    <span
                      v-if="testimonial.content_translations?.en"
                      class="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md font-medium"
                      >EN</span
                    >
                  </div>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {{ testimonial.display_order || "-" }}
                </td>
                <td
                  class="relative whitespace-nowrap px-6 py-4 text-right text-sm font-medium"
                >
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="openModal(testimonial)"
                      :disabled="isLoading"
                      class="inline-flex items-center px-3 py-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon name="ph:pencil-bold" class="w-4 h-4 mr-1" />
                      {{ $t("admin.testimonials.edit") }}
                    </button>
                    <button
                      @click="deleteTestimonial(testimonial)"
                      :disabled="isLoading"
                      class="inline-flex items-center px-3 py-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon name="ph:trash-bold" class="w-4 h-4 mr-1" />
                      {{ $t("admin.testimonials.delete") }}
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="testimonials.length === 0">
                <td colspan="7" class="px-6 py-12 text-center">
                  <Icon
                    name="ph:chat-circle-text-bold"
                    class="w-12 h-12 text-gray-400 mx-auto mb-3"
                  />
                  <p class="text-sm text-gray-600">
                    {{ $t("admin.testimonials.noTestimonials") }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal avec Language Tabs -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-10 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="closeModal"
        ></div>

        <div
          class="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6 sm:align-middle"
        >
          <form @submit.prevent="saveTestimonial">
            <!-- Language Tabs -->
            <div class="border-b border-gray-200 mb-6">
              <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  type="button"
                  @click="currentLanguage = lang.code"
                  :class="[
                    currentLanguage === lang.code
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
                  ]"
                >
                  <span>{{ lang.flag }}</span>
                  <span>{{ lang.name }}</span>
                </button>
              </nav>
            </div>

            <div>
              <div class="space-y-6">
                <!-- Customer Name (shown on all tabs, but only editable on FR) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Nom du client
                  </label>
                  <input
                    v-model="localForm.customer_name"
                    type="text"
                    required
                    :disabled="isLoading || currentLanguage !== 'fr'"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p
                    v-if="currentLanguage !== 'fr'"
                    class="mt-1 text-xs text-gray-500"
                  >
                    Modifiable uniquement sur l'onglet Français
                  </p>
                </div>

                <!-- Customer Title (per language) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Titre du client ({{ getCurrentLanguageName() }})
                  </label>
                  <input
                    v-model="
                      localForm.customer_title_translations[currentLanguage]
                    "
                    type="text"
                    :disabled="isLoading"
                    :placeholder="getTitlePlaceholder()"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p class="mt-1 text-xs text-gray-500">
                    {{
                      currentLanguage === "fr"
                        ? "Optionnel"
                        : "Optionnel - laissez vide pour utiliser la version française"
                    }}
                  </p>
                </div>

                <!-- Content (per language) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Contenu du témoignage ({{ getCurrentLanguageName() }})
                  </label>
                  <textarea
                    v-model="localForm.content_translations[currentLanguage]"
                    rows="4"
                    :required="currentLanguage === 'fr'"
                    :disabled="isLoading"
                    :placeholder="getContentPlaceholder()"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  ></textarea>
                  <p class="mt-1 text-xs text-gray-500">
                    {{
                      currentLanguage === "fr"
                        ? "Requis"
                        : "Optionnel - laissez vide pour utiliser la version française"
                    }}
                  </p>
                </div>

                <!-- Settings (shown only on FR tab) -->
                <div
                  v-if="currentLanguage === 'fr'"
                  class="space-y-4 pt-4 border-t border-gray-200"
                >
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Note (1-5 étoiles)
                    </label>
                    <div class="flex items-center">
                      <button
                        v-for="i in 5"
                        :key="i"
                        type="button"
                        @click="localForm.rating = i"
                        class="focus:outline-none"
                        :disabled="isLoading"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          class="w-6 h-6"
                          :class="
                            i <= localForm.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-200'
                          "
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Ordre d'affichage
                    </label>
                    <input
                      v-model.number="localForm.display_order"
                      type="number"
                      min="0"
                      :disabled="isLoading"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label class="inline-flex items-center">
                      <input
                        v-model="localForm.is_active"
                        type="checkbox"
                        :disabled="isLoading"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed"
                      />
                      <span class="ml-2 text-sm text-gray-900">Actif</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
            >
              <button
                type="submit"
                :disabled="isLoading || !localForm.content_translations.fr"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{
                  localForm.id
                    ? "Enregistrer les modifications"
                    : "Créer le témoignage"
                }}
              </button>
              <button
                type="button"
                :disabled="isLoading"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                @click="closeModal"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de configuration -->
    <div
      v-if="showConfigModal"
      class="fixed inset-0 z-10 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="showConfigModal = false"
        ></div>

        <div
          class="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
        >
          <form @submit.prevent="saveConfig">
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
                Configuration de la section Témoignages
              </h3>
              <div class="space-y-6">
                <div>
                  <label class="inline-flex items-center">
                    <input
                      v-model="configForm.testimonials_enabled"
                      type="checkbox"
                      :disabled="isLoading"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed"
                    />
                    <span class="ml-2 text-sm font-medium text-gray-900"
                      >Activer la section témoignages</span
                    >
                  </label>
                  <p class="mt-1 text-xs text-gray-500 ml-6">
                    La section témoignages apparaîtra sur votre site
                  </p>
                </div>
              </div>
            </div>
            <div
              class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
            >
              <button
                type="submit"
                :disabled="isLoading"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enregistrer la configuration
              </button>
              <button
                type="button"
                :disabled="isLoading"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                @click="showConfigModal = false"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t: $t } = useI18n();
const { showConfirmation } = useConfirmationModal();
const { showError } = useErrorModal();
const { showSuccess } = useSuccessSnackbar();

const supabase = useSupabaseClient();

// Language management
const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇩🇿" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

const currentLanguage = ref("fr");

// State
const testimonials = ref([]);
const configData = ref(null);
const showModal = ref(false);
const showConfigModal = ref(false);
const isLoading = ref(false);

// Local form with translation structure
const localForm = ref({
  id: null,
  customer_name: "",
  customer_title_translations: { fr: "", ar: "", en: "" },
  content_translations: { fr: "", ar: "", en: "" },
  rating: 5,
  is_active: true,
  display_order: 0,
  image_url: null,
});

const configForm = ref({
  testimonials_enabled: true,
});

// Helper functions
const getCurrentLanguageName = () => {
  return languages.find((l) => l.code === currentLanguage.value)?.name || "";
};

const getTitlePlaceholder = () => {
  if (currentLanguage.value === "fr") return "Ex: Client Fidèle, Designer...";

  const frValue = localForm.value.customer_title_translations.fr;
  return frValue || `Entrez le titre en ${getCurrentLanguageName()}`;
};

const getContentPlaceholder = () => {
  if (currentLanguage.value === "fr") return "Entrez le témoignage en français";

  const frValue = localForm.value.content_translations.fr;
  return frValue || `Entrez le témoignage en ${getCurrentLanguageName()}`;
};

// Fetch testimonials
const fetchTestimonials = async () => {
  isLoading.value = true;

  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order");

    if (error) throw error;
    testimonials.value = data || [];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    showError($t("admin.testimonials.errorLoading"));
  } finally {
    isLoading.value = false;
  }
};

// Fetch configuration
const fetchConfig = async () => {
  try {
    const { data, error } = await supabase
      .from("features_config")
      .select("testimonials_enabled")
      .single();

    if (error && error.code !== "PGRST116") throw error;

    if (data) {
      configData.value = data;
      configForm.value.testimonials_enabled = data.testimonials_enabled ?? true;
    }
  } catch (error) {
    console.error("Error fetching config:", error);
    showError($t("admin.testimonials.errorLoadingConfig"));
  }
};

// Open modal
const openModal = (testimonial = null) => {
  if (testimonial) {
    localForm.value = {
      id: testimonial.id,
      customer_name: testimonial.customer_name,
      customer_title_translations: testimonial.customer_title_translations || {
        fr: "",
        ar: "",
        en: "",
      },
      content_translations: testimonial.content_translations || {
        fr: "",
        ar: "",
        en: "",
      },
      rating: testimonial.rating || 5,
      is_active: testimonial.is_active ?? true,
      display_order: testimonial.display_order || 0,
      image_url: testimonial.image_url || null,
    };
  } else {
    localForm.value = {
      id: null,
      customer_name: "",
      customer_title_translations: { fr: "", ar: "", en: "" },
      content_translations: { fr: "", ar: "", en: "" },
      rating: 5,
      is_active: true,
      display_order: 0,
      image_url: null,
    };
  }
  currentLanguage.value = "fr";
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentLanguage.value = "fr";
};

// Open config modal
const openConfigModal = () => {
  if (configData.value) {
    configForm.value.testimonials_enabled =
      configData.value.testimonials_enabled ?? true;
  }
  showConfigModal.value = true;
};

// Save testimonial
const saveTestimonial = async () => {
  isLoading.value = true;
  try {
    const testimonialData = {
      customer_name: localForm.value.customer_name,
      customer_title_translations: localForm.value.customer_title_translations,
      content_translations: localForm.value.content_translations,
      rating: localForm.value.rating,
      is_active: localForm.value.is_active,
      display_order: localForm.value.display_order,
      image_url: localForm.value.image_url,
    };

    const { error } = localForm.value.id
      ? await supabase
          .from("testimonials")
          .update(testimonialData)
          .eq("id", localForm.value.id)
      : await supabase.from("testimonials").insert(testimonialData);

    if (error) throw error;

    showModal.value = false;
    await fetchTestimonials();
    showSuccess(
      localForm.value.id
        ? $t("admin.testimonials.updateSuccess")
        : $t("admin.testimonials.createSuccess")
    );
  } catch (error) {
    console.error("Error saving testimonial:", error);
    showError($t("admin.testimonials.errorSaving"));
  } finally {
    isLoading.value = false;
  }
};

// Save configuration
const saveConfig = async () => {
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("features_config")
      .update({
        testimonials_enabled: configForm.value.testimonials_enabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", configData.value.id);

    if (error) throw error;

    await fetchConfig();
    showConfigModal.value = false;
    showSuccess($t("admin.testimonials.configSaved"));
  } catch (error) {
    console.error("Error saving config:", error);
    showError($t("admin.testimonials.errorSavingConfig"));
  } finally {
    isLoading.value = false;
  }
};

// Delete testimonial
const deleteTestimonial = async (testimonial) => {
  const confirmed = await showConfirmation(
    $t("admin.testimonials.deleteTitle"),
    $t("admin.testimonials.deleteMessage")
  );

  if (!confirmed) return;

  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", testimonial.id);

    if (error) throw error;

    await fetchTestimonials();
    showSuccess($t("admin.testimonials.deleteSuccess"));
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    showError($t("admin.testimonials.errorDelete"));
  } finally {
    isLoading.value = false;
  }
};

// Initial fetch
onMounted(async () => {
  await fetchConfig();
  await fetchTestimonials();
});

useHead(() => ({
  title: $t("admin.testimonials.pageTitle"),
  meta: [
    {
      name: "description",
      content: $t("admin.testimonials.pageDescription"),
    },
  ],
}));
</script>