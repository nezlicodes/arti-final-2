<template>
  <div class="space-y-3">
    <!-- About Section Preview with Inline Editing - WYSIWYG -->
    <div class="bg-white shadow overflow-hidden relative rounded-xl">
      
      <!-- Floating Control Bar -->
      <div class="absolute top-4 right-4 z-50 flex items-center gap-2">
        <!-- Visibility Toggle -->
        <button
          @click="toggleVisibility"
          class="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-300"
          :title="sectionData.is_active ? 'Hide Section' : 'Show Section'"
        >
          <Icon
            :name="sectionData.is_active ? 'heroicons-outline:eye' : 'heroicons-outline:eye-off'"
            class="h-5 w-5 text-gray-700"
          />
        </button>

        <!-- Image Manager -->
        <button
          @click="openImageEditor"
          class="px-3 py-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium text-gray-700 transition-all duration-300"
        >
          <Icon name="heroicons-outline:photograph" class="w-4 h-4" />
          {{ sectionData.image_url ? 'Change' : 'Add' }} Image
        </button>
      </div>

      <!-- Collapsed State -->
      <div
        v-if="!sectionData.is_active"
        class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg"
      >
        <div class="text-center">
          <Icon name="heroicons-outline:information-circle" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">About Section Hidden</h3>
          <p class="mt-1 text-sm text-gray-500">Click the eye icon to show the section</p>
        </div>
      </div>

      <!-- WYSIWYG Section Preview - Matches Front-End Exactly -->
      <section
        v-if="sectionData.is_active"
        id="about"
        class="py-16"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <!-- Title - Debut Style -->
          <div class="text-center mb-12">
            <div class="relative inline-block group">
              <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {{ currentTitle || 'Click to add title' }}
              </h2>
              <button
                @click="openFieldEditor('title')"
                class="absolute -top-2 -right-10 bg-primary p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                title="Edit title"
              >
                <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
              </button>
            </div>
            <div class="w-16 h-0.5 bg-primary mx-auto mb-6"></div>
          </div>

          <!-- Content Layout -->
          <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <!-- Image -->
            <div v-if="sectionData.image_url || uploadingImage" class="w-full lg:w-1/2 group relative">
              <!-- Loading State -->
              <div v-if="uploadingImage" class="overflow-hidden rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center" style="min-height: 400px;">
                <div class="text-center">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-3"></div>
                  <p class="text-gray-700 font-medium">Uploading image...</p>
                  <p class="text-sm text-gray-500 mt-1">{{ uploadProgress }}%</p>
                </div>
              </div>

              <!-- Image Display -->
              <div v-else class="overflow-hidden rounded-lg border border-gray-200 relative">
                <img
                  :src="sectionData.image_url"
                  :alt="currentTitle"
                  class="w-full h-full object-cover"
                />
                
                <!-- Edit/Remove Overlay -->
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div class="flex gap-2">
                    <button
                      @click="openImageEditor"
                      class="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Change image"
                    >
                      <Icon name="heroicons-outline:pencil" class="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      @click="removeImage"
                      class="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      title="Remove image"
                    >
                      <Icon name="heroicons-outline:trash" class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Image Placeholder -->
            <div v-else class="w-full lg:w-1/2">
              <button
                @click="openImageEditor"
                class="w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 hover:border-primary transition-all duration-300 group hover:bg-primary/5 p-12"
              >
                <div class="text-center">
                  <Icon name="heroicons-outline:photograph" class="w-16 h-16 mx-auto mb-4 text-gray-400 group-hover:text-primary transition-colors" />
                  <p class="text-lg font-semibold text-gray-700 group-hover:text-primary transition-colors">Add Image</p>
                  <p class="text-sm text-gray-500 mt-2">Click to upload an image</p>
                </div>
              </button>
            </div>

            <!-- Text Content -->
            <div class="w-full" :class="sectionData.image_url ? 'lg:w-1/2' : ''">
              <div class="relative group">
                <div
                  v-if="currentContent"
                  class="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                  v-html="currentContent"
                ></div>
                <div v-else class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors">
                  <Icon name="heroicons-outline:document-text" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p class="text-gray-500 mb-4">No content yet</p>
                  <button
                    @click="openFieldEditor('content')"
                    class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Add Content
                  </button>
                </div>

                <!-- Edit Button Overlay -->
                <button
                  v-if="currentContent"
                  @click="openFieldEditor('content')"
                  class="absolute -top-3 -right-3 bg-primary p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  title="Edit content"
                >
                  <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Field Editor Modal -->
    <div v-if="editingField !== null" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" @click.self="closeFieldEditor">
      <div class="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">
            {{ getModalTitle() }}
          </h3>
          <button
            @click="closeFieldEditor"
            class="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Icon name="heroicons-outline:x" class="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <!-- Title Editor -->
        <AdminFormField
          v-if="editingField === 'title'"
          v-model="editData.content_translations[editorLanguage].title"
          type="text"
          label="Section Title"
          placeholder="Notre Histoire"
          :language-code="editorLanguage"
          :language-name="getCurrentLanguageName()"
        />
        
        <!-- Content Editor (Rich Text) -->
        <div v-else-if="editingField === 'content'" class="space-y-4">
          <label class="block text-sm font-medium text-gray-700">
            Section Content ({{ getCurrentLanguageName() }})
          </label>
          <ClientOnly>
            <QuillEditor
              v-model:content="editData.content_translations[editorLanguage].content"
              content-type="html"
              theme="snow"
              :toolbar="editorToolbar"
              class="min-h-[300px]"
            />
          </ClientOnly>
          <p class="text-xs text-gray-500">
            Use the editor above to format your content with headings, lists, bold text, etc.
          </p>
        </div>

        <!-- Image Editor -->
        <div v-else-if="editingField === 'image'" class="space-y-4">
          <label class="block text-sm font-medium text-gray-700">Section Image</label>
          
          <!-- Loading State -->
          <div v-if="uploadingImage" class="border-2 border-primary/20 rounded-lg p-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div class="text-center">
              <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
              <p class="text-gray-700 font-medium text-lg">Uploading image...</p>
              <p class="text-sm text-gray-500 mt-2">{{ uploadProgress }}%</p>
            </div>
          </div>

          <!-- Current Image Preview -->
          <div v-else-if="tempImageUrl" class="relative group">
            <img
              :src="tempImageUrl"
              alt="Section image"
              class="w-full h-64 object-cover rounded-lg"
            />
            <button
              @click="tempImageUrl = ''"
              class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
            >
              <Icon name="heroicons-outline:trash" class="w-4 h-4" />
            </button>
          </div>

          <!-- Upload Area -->
          <div v-if="!uploadingImage" class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="hidden"
              id="image-upload"
            />
            <label for="image-upload" class="cursor-pointer flex flex-col items-center space-y-2">
              <Icon name="heroicons-outline:cloud-upload" class="w-8 h-8 text-gray-400" />
              <span class="text-sm text-gray-600">Click to upload image</span>
              <span class="text-xs text-gray-400">PNG, JPG, WebP up to 10MB</span>
            </label>
          </div>

          <!-- URL Input -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Or paste image URL</label>
            <input
              v-model="tempImageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="closeFieldEditor"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            :disabled="uploadingImage"
          >
            Cancel
          </button>
          <button
            @click="saveField"
            class="px-4 py-2 bg-primary text-contrast1 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="uploadingImage"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const { editorLanguage } = useEditorLanguage()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()
const supabase = useSupabaseClient()

const SECTION_KEY = 'about_us'

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'en', name: 'English' }
]

const editingField = ref(null)
const editData = ref({})
const uploadingImage = ref(false)
const uploadProgress = ref(0)
const tempImageUrl = ref('')

const sectionData = ref({
  section_key: SECTION_KEY,
  is_active: true,
  content_translations: {
    fr: { title: '', content: '' },
    ar: { title: '', content: '' },
    en: { title: '', content: '' }
  },
  image_url: ''
})

// Quill editor toolbar configuration
const editorToolbar = [
  [{ header: [3, 4, false] }],
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link'],
  ['clean']
]

const currentTitle = computed(() => {
  return sectionData.value.content_translations?.[editorLanguage.value]?.title || ''
})

const currentContent = computed(() => {
  return sectionData.value.content_translations?.[editorLanguage.value]?.content || ''
})

const getCurrentLanguageName = () => languages.find(l => l.code === editorLanguage.value)?.name || ''

const getModalTitle = () => {
  if (editingField.value === 'title') return 'Edit Section Title'
  if (editingField.value === 'content') return 'Edit Section Content'
  if (editingField.value === 'image') return 'Edit Section Image'
  return 'Edit'
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showError('Please select an image file')
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    showError('Image must be less than 10MB')
    return
  }

  uploadingImage.value = true
  uploadProgress.value = 0

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `about/section-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('site')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('site')
      .getPublicUrl(fileName)

    tempImageUrl.value = publicUrl
    uploadProgress.value = 100
  } catch (error) {
    console.error('Upload error:', error)
    showError('Failed to upload image')
  } finally {
    uploadingImage.value = false
    uploadProgress.value = 0
  }
}

const removeImage = async () => {
  if (!confirm('Are you sure you want to remove this image?')) return
  sectionData.value.image_url = ''
  await saveSection()
}

const openImageEditor = () => {
  editingField.value = 'image'
  tempImageUrl.value = sectionData.value.image_url
}

const loadData = async () => {
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .eq('section_key', SECTION_KEY)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (data) {
      sectionData.value = {
        ...sectionData.value,
        id: data.id,
        is_active: data.is_active ?? true,
        content_translations: data.content_translations || {
          fr: { title: '', content: '' },
          ar: { title: '', content: '' },
          en: { title: '', content: '' }
        },
        image_url: data.image_url || ''
      }
    }
  } catch (error) {
    console.error('Error loading section:', error)
  }
}

const toggleVisibility = async () => {
  sectionData.value.is_active = !sectionData.value.is_active
  await saveSection()
}

const openFieldEditor = (field) => {
  editingField.value = field
  editData.value = JSON.parse(JSON.stringify(sectionData.value))
}

const closeFieldEditor = () => {
  editingField.value = null
  editData.value = {}
  tempImageUrl.value = ''
}

const saveField = async () => {
  if (uploadingImage.value) return
  
  if (editingField.value === 'image') {
    sectionData.value.image_url = tempImageUrl.value
  } else {
    sectionData.value = JSON.parse(JSON.stringify(editData.value))
  }
  
  await saveSection()
  closeFieldEditor()
}

const saveSection = async (showNotification = true) => {
  try {
    const dataToSave = {
      section_key: SECTION_KEY,
      is_active: sectionData.value.is_active,
      content_translations: sectionData.value.content_translations,
      image_url: sectionData.value.image_url || null
    }

    if (sectionData.value.id) {
      const { error } = await supabase
        .from('content_sections')
        .update(dataToSave)
        .eq('id', sectionData.value.id)
      
      if (error) throw error
    } else {
      const { data, error } = await supabase
        .from('content_sections')
        .insert(dataToSave)
        .select()
        .single()
      
      if (error) throw error
      if (data) sectionData.value.id = data.id
    }
    
    if (showNotification) {
      showSuccess('Saved successfully')
    }
  } catch (error) {
    console.error('Save error:', error)
    showError(`Failed to save: ${error.message}`)
  }
}

onMounted(loadData)
</script>

<style scoped>
/* Prose styles matching the front-end */
.prose :deep(p) {
  @apply mb-4;
}

.prose :deep(h3) {
  @apply text-xl font-semibold mb-3;
}

.prose :deep(ul),
.prose :deep(ol) {
  @apply ml-6 mb-4;
}

.prose :deep(ul) {
  @apply list-disc;
}

.prose :deep(ol) {
  @apply list-decimal;
}

.prose :deep(li) {
  @apply mb-2;
}

.prose :deep(strong) {
  @apply font-semibold;
}

.prose :deep(a) {
  @apply text-primary hover:underline;
}

/* Quill editor custom styling */
:deep(.ql-toolbar) {
  @apply border-2 border-gray-200 rounded-t-lg;
}

:deep(.ql-container) {
  @apply border-2 border-t-0 border-gray-200 rounded-b-lg min-h-[300px];
}

:deep(.ql-editor) {
  @apply min-h-[300px] text-base;
}
</style>