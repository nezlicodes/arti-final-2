<template>
  <div class="space-y-3">
    <div class="bg-white shadow overflow-hidden relative">
      <button
        @click="toggleVisibility"
        class="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all"
        :title="sectionData.is_active ? 'Masquer' : 'Afficher'"
      >
        <Icon
          :name="
            sectionData.is_active
              ? 'heroicons-outline:eye'
              : 'heroicons-outline:eye-off'
          "
          class="h-5 w-5 text-gray-700"
        />
      </button>

      <div
        v-if="!sectionData.is_active"
        class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg"
      >
        <div class="text-center">
          <Icon
            name="heroicons-outline:document-text"
            class="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Hero masqué</h3>
          <p class="mt-1 text-sm text-gray-500">
            Cliquez sur l'icône d'œil pour afficher
          </p>
        </div>
      </div>

      <div
        v-if="sectionData.is_active"
        class="relative min-h-[70vh] bg-white overflow-hidden py-32"
      >
        <div
          class="absolute top-0 left-0 right-0 h-48 bg-[#C4E7F3] transform -skew-y-3 origin-top-left -mt-24"
        ></div>

        <div class="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 text-left">
          <div
            class="relative mb-6 border-2 border-transparent rounded-lg transition-all hover:border-gray-300 px-4 py-2"
          >
            <h1
              class="text-6xl sm:text-7xl lg:text-9xl font-thin text-gray-900 tracking-tighter"
              style="line-height: 0.9; font-weight: 200"
              v-text="currentContent.title || 'Titre'"
            />
            <button
              @click="openFieldEditor('title')"
              class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all transform hover:scale-110"
            >
              <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
            </button>
            <div class="text-xs text-gray-500 mt-1">
              Cliquez pour modifier le titre
            </div>
          </div>

          <div
            class="relative border-2 border-transparent rounded-lg transition-all hover:border-gray-300 px-4 py-2 mt-8 max-w-xl"
          >
            <p
              class="text-lg md:text-xl text-gray-600 font-mono border-l-4 border-[#C4E7F3] pl-4 py-2"
              v-text="currentContent.content || 'Sous-titre'"
            />
            <button
              @click="openFieldEditor('content')"
              class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all transform hover:scale-110"
            >
              <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
            </button>
            <div class="text-xs text-gray-500 mt-1">
              Cliquez pour modifier le sous-titre
            </div>
          </div>

          <div
            class="flex flex-col sm:flex-row gap-6 justify-start items-start mt-16"
          >
            <div class="relative group">
              <span
                class="inline-flex items-center justify-center text-xl font-bold tracking-widest text-gray-900 transition-all duration-300 relative"
              >
                <span class="relative z-10">{{
                  currentCta.cta1_label || "CTA Principal"
                }}</span>
                <div
                  class="absolute bottom-0 left-0 w-full h-1 bg-[#C4E7F3] transform scale-x-75 group-hover:scale-x-100 transition-transform origin-left"
                ></div>
                <Icon
                  class="ml-3 w-6 h-6 transform translate-x-1 group-hover:translate-x-3 transition-transform text-red-600 opacity-80"
                  name="heroicons-outline:arrow-right"
                />
              </span>

              <div
                class="absolute -top-6 -right-12 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  @click="openFieldEditor('cta1_label')"
                  class="bg-blue-600 hover:bg-blue-700 p-1 rounded-full text-white shadow-lg transition-all transform hover:scale-110"
                  title="Modifier le texte CTA 1"
                >
                  <Icon class="w-3 h-3" name="heroicons-outline:tag" />
                </button>
                <button
                  @click="openFieldEditor('cta1_link')"
                  class="bg-green-600 hover:bg-green-700 p-1 rounded-full text-white shadow-lg transition-all transform hover:scale-110"
                  title="Modifier le lien CTA 1"
                >
                  <Icon class="w-3 h-3" name="heroicons-outline:link" />
                </button>
              </div>
            </div>
          </div>
          <div class="text-xs text-gray-500 mt-2">
            Passez la souris sur les boutons pour éditer les labels et liens.
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="loading || saving"
      class="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
    >
      <Icon name="heroicons-outline:refresh" class="w-4 h-4 animate-spin" />
      <span class="text-sm">{{
        loading ? "Chargement..." : "Enregistrement..."
      }}</span>
    </div>

    <div
      v-if="showFieldModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showFieldModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Modifier {{ getFieldLabel(currentField) }}
          </h3>
          <button
            @click="showFieldModal = false"
            class="text-gray-400 hover:text-gray-500"
          >
            <Icon name="heroicons-outline:x" class="h-5 w-5" />
          </button>
        </div>

        <input
          v-model="tempFieldValue"
          type="text"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          @keyup.enter="saveFieldValue"
          ref="fieldInput"
        />

        <div class="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            @click="showFieldModal = false"
          >
            <Icon name="heroicons-outline:x" class="mr-1.5 h-4 w-4" />Annuler
          </button>
          <button
            type="button"
            :disabled="saving"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            @click="saveFieldValue"
          >
            <Icon
              :name="
                saving ? 'heroicons-outline:refresh' : 'heroicons-outline:check'
              "
              class="mr-1.5 h-4 w-4"
              :class="{ 'animate-spin': saving }"
            />{{ saving ? "Enregistrement..." : "Enregistrer" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { fetchSectionByKey } = useAboutUs();
const { editorLanguage } = useEditorLanguage();
const { showError } = useErrorModal();
const { showSuccess } = useSuccessSnackbar();
const supabase = useSupabaseClient();

const loading = ref(true);
const saving = ref(false);
const showFieldModal = ref(false);
const currentField = ref("");
const tempFieldValue = ref("");
const fieldInput = ref(null);

const sectionData = ref({
  section_key: "about_hero",
  is_active: true,
  title_translations: {},
  content_translations: {},
  additional_data: {}, // Initialize additional_data
});

const currentContent = computed(() => ({
  title: sectionData.value.title_translations?.[editorLanguage.value] || "",
  content: sectionData.value.content_translations?.[editorLanguage.value] || "",
}));

// NEW: Computed property for CTA data
const currentCta = computed(() => ({
  cta1_label:
    sectionData.value.additional_data?.cta1_label?.[editorLanguage.value] || "",
  cta1_link: sectionData.value.additional_data?.cta1_link || "",
}));

const loadData = async () => {
  loading.value = true;
  try {
    const { data } = await fetchSectionByKey("about_hero");
    if (data) {
      // Ensure additional_data is properly initialized
      sectionData.value = {
        section_key: data.section_key,
        is_active: data.is_active,
        title_translations: data.title_translations,
        content_translations: data.content_translations,
        additional_data: data.additional_data || {}, // Use data or default to empty object
      };
    }
  } catch (error) {
    console.error(error);
    showError("Erreur lors du chargement");
  } finally {
    loading.value = false;
  }
};

const save = async () => {
  saving.value = true;
  try {
    // Update the database call to include additional_data
    const { error } = await supabase
      .from("about_us_sections")
      .update({
        title_translations: sectionData.value.title_translations,
        content_translations: sectionData.value.content_translations,
        is_active: sectionData.value.is_active,
        additional_data: sectionData.value.additional_data, // Save CTA data
      })
      .eq("section_key", "about_hero");
    if (error) throw error;
    showSuccess("Enregistré");
  } catch (error) {
    console.error(error);
    showError("Erreur");
  } finally {
    saving.value = false;
  }
};

const toggleVisibility = async () => {
  sectionData.value.is_active = !sectionData.value.is_active;
  await save();
};

const openFieldEditor = (field) => {
  currentField.value = field;

  // Determine initial value based on field type
  if (field === "title") {
    tempFieldValue.value = currentContent.value.title;
  } else if (field === "content") {
    tempFieldValue.value = currentContent.value.content;
  } else if (field.endsWith("_label")) {
    // CTA Labels are translated
    tempFieldValue.value = currentCta.value[field];
  } else if (field.endsWith("_link")) {
    // CTA Links are not translated (simple string)
    tempFieldValue.value = sectionData.value.additional_data[field] || "";
  }

  showFieldModal.value = true;
  nextTick(() => {
    if (fieldInput.value) {
      fieldInput.value.focus();
      if (fieldInput.value.select) fieldInput.value.select();
    }
  });
};

const saveFieldValue = async () => {
  const field = currentField.value;

  if (field === "title") {
    sectionData.value.title_translations[editorLanguage.value] =
      tempFieldValue.value;
  } else if (field === "content") {
    sectionData.value.content_translations[editorLanguage.value] =
      tempFieldValue.value;
  } else if (field.endsWith("_label")) {
    // Save translated label
    const labelKey = field;
    if (!sectionData.value.additional_data[labelKey]) {
      sectionData.value.additional_data[labelKey] = {};
    }
    sectionData.value.additional_data[labelKey][editorLanguage.value] =
      tempFieldValue.value;
  } else if (field.endsWith("_link")) {
    // Save untranslated link
    sectionData.value.additional_data[field] = tempFieldValue.value;
  }

  showFieldModal.value = false;
  await save();
};

const getFieldLabel = (field) => {
  const map = {
    title: "le titre",
    content: "le sous-titre",
    cta1_label: "le texte CTA principal",
    cta1_link: "le lien CTA principal",
  };
  return map[field] || field;
};

onMounted(loadData);
watch(editorLanguage, loadData);
</script>