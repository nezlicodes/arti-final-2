<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform opacity-0 scale-95"
    enter-to-class="transform opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="transform opacity-100 scale-100"
    leave-to-class="transform opacity-0 scale-95"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="$emit('close')"
      ></div>

      <!-- Modal Panel -->
      <div
        class="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
          @click.stop
        >
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3
                class="text-lg font-semibold leading-6 text-gray-900"
                id="modal-title"
              >
                {{ localForm.id ? 'Modifier la politique' : 'Ajouter une politique' }}
              </h3>
              <div class="mt-6 space-y-4">
                <!-- Policy Type -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Type de politique</label>
                  <select
                    v-model="localForm.policy_type"
                    :disabled="!!localForm.id"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="shipping">Livraison</option>
                    <option value="return">Retour</option>
                    <option value="privacy">Confidentialité</option>
                    <option value="terms">Conditions</option>
                  </select>
                </div>

                <!-- Slug -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Slug (URL)</label>
                  <input
                    v-model="localForm.slug"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="politique-de-livraison"
                  />
                </div>

                <!-- Titles -->
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Titre (FR)</label>
                    <input
                      v-model="localForm.title_translations.fr"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Titre (EN)</label>
                    <input
                      v-model="localForm.title_translations.en"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Titre (AR)</label>
                    <input
                      v-model="localForm.title_translations.ar"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      dir="rtl"
                    />
                  </div>
                </div>

                <!-- Contents -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Contenu (FR)</label>
                    <textarea
                      v-model="localForm.content_translations.fr"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Contenu (EN)</label>
                    <textarea
                      v-model="localForm.content_translations.en"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Contenu (AR)</label>
                    <textarea
                      v-model="localForm.content_translations.ar"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      dir="rtl"
                    ></textarea>
                  </div>
                </div>

                <!-- Active Status -->
                <div class="flex items-center">
                  <input
                    v-model="localForm.is_active"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label class="ml-2 block text-sm text-gray-900">Politique active</label>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="button"
              @click="handleSave"
              :disabled="isLoading || !canSave"
              class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button
              type="button"
              @click="$emit('close')"
              :disabled="isLoading"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  isLoading: Boolean,
  form: Object,
});

const emit = defineEmits(['close', 'save']);

const localForm = ref({
  id: null,
  policy_type: '',
  title_translations: { fr: '', ar: '', en: '' },
  content_translations: { fr: '', ar: '', en: '' },
  slug: '',
  is_active: true,
});

// Watch form prop changes
watch(() => props.form, (newForm) => {
  if (newForm) {
    localForm.value = { ...newForm };
  }
}, { deep: true, immediate: true });

const canSave = computed(() => {
  return localForm.value.policy_type && 
         localForm.value.slug && 
         (localForm.value.title_translations.fr || 
          localForm.value.title_translations.en || 
          localForm.value.title_translations.ar);
});

const handleSave = () => {
  if (canSave.value) {
    emit('save', localForm.value);
  }
};
</script>
