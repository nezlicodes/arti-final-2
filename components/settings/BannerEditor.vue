<template>
  <div class="bg-white shadow overflow-hidden relative">
    <!-- Toggle visibility button -->
    <button
      @click="toggleVisibility"
      class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all"
      :title="section.is_active ? 'Masquer' : 'Afficher'"
    >
      <Icon
        :name="section.is_active ? 'heroicons-outline:eye' : 'heroicons-outline:eye-off'"
        class="h-5 w-5 text-gray-700"
      />
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="px-6 py-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-purple-100 border-t-purple-600"></div>
    </div>

    <!-- Hidden placeholder -->
    <div v-else-if="!section.is_active" class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
      <div class="text-center">
        <Icon name="heroicons-outline:speakerphone" class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Bannière masquée</h3>
        <p class="mt-1 text-sm text-gray-500">Cliquez sur l'icône d'œil pour afficher</p>
      </div>
    </div>

    <!-- Banner Preview (editable) -->
    <div v-else class="relative">
      <!-- Actual banner as it appears on site -->
      <div class="bg-primary text-contrast1 text-center py-4 px-4">
        <div class="relative group inline-block border-2 border-transparent rounded transition-all hover:border-white/50 px-4 py-2 cursor-pointer" @click="openEditor">
          <p class="text-sm font-medium transition-all duration-300 group-hover:ring-2 group-hover:ring-white/30 rounded px-2 py-1" 
             v-text="section.content_translations[editorLanguage].text || 'Click to edit banner text...'" />
          <button
            class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100"
          >
            <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
          </button>
          <div class="text-xs text-white/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to edit</div>
        </div>
      </div>
    </div>

    <!-- Loading/Saving indicator -->
    <div v-if="saving" class="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
      <Icon name="heroicons-outline:refresh" class="w-4 h-4 animate-spin" />
      <span class="text-sm">Enregistrement...</span>
    </div>

    <!-- Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Modifier la bannière</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-500">
            <Icon name="heroicons-outline:x" class="h-5 w-5" />
          </button>
        </div>
        <input
          v-model="tempText"
          type="text"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Ex: Profitez de -20% avec le code PROMO"
          @keyup.enter="saveText"
          ref="textInput"
        />
        <div class="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            @click="showModal = false"
          >
            <Icon name="heroicons-outline:x" class="mr-1.5 h-4 w-4" />
            Annuler
          </button>
          <button
            type="button"
            :disabled="saving"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            @click="saveText"
          >
            <Icon :name="saving ? 'heroicons-outline:refresh' : 'heroicons-outline:check'" class="mr-1.5 h-4 w-4" :class="{ 'animate-spin': saving }" />
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()
const { editorLanguage } = useEditorLanguage()

const SECTION_KEY = 'top_banner'

const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const tempText = ref('')
const textInput = ref(null)

const section = ref({
  id: null,
  section_key: SECTION_KEY,
  is_active: true,
  content_translations: {
    fr: { text: '' },
    ar: { text: '' },
    en: { text: '' }
  }
})

const loadSection = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .eq('section_key', SECTION_KEY)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (data) {
      section.value = {
        id: data.id,
        section_key: data.section_key,
        is_active: data.is_active ?? true,
        content_translations: data.content_translations || {
          fr: { text: '' },
          ar: { text: '' },
          en: { text: '' }
        }
      }
    } else {
      await createDefaultSection()
    }
  } catch (error) {
    console.error('Error loading banner:', error)
    showError('Impossible de charger la bannière')
  } finally {
    loading.value = false
  }
}

const createDefaultSection = async () => {
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .insert({
        section_key: SECTION_KEY,
        section_type: 'banner',
        is_active: true,
        display_order: 0,
        content_translations: {
          fr: { text: 'Profitez de -20% avec le code PROMO' },
          ar: { text: 'استمتع بخصم 20٪' },
          en: { text: 'Enjoy 20% off with code PROMO' }
        }
      })
      .select()
      .single()

    if (error) throw error
    section.value = data
  } catch (error) {
    console.error('Error creating banner:', error)
  }
}

const toggleVisibility = async () => {
  section.value.is_active = !section.value.is_active
  await saveSection()
}

const openEditor = () => {
  tempText.value = section.value.content_translations[editorLanguage.value].text
  showModal.value = true
  nextTick(() => {
    if (textInput.value) {
      textInput.value.focus()
      if (textInput.value.select) textInput.value.select()
    }
  })
}

const saveText = async () => {
  section.value.content_translations[editorLanguage.value].text = tempText.value
  showModal.value = false
  await saveSection()
}

const saveSection = async () => {
  saving.value = true
  try {
    const { error } = await supabase
      .from('content_sections')
      .update({
        is_active: section.value.is_active,
        content_translations: section.value.content_translations,
        updated_at: new Date().toISOString()
      })
      .eq('id', section.value.id)

    if (error) throw error
    showSuccess('Bannière enregistrée')
  } catch (error) {
    console.error('Error saving banner:', error)
    showError('Erreur')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadSection()
})
</script>