<template>
  <div class="min-h-screen bg-[#f1f1f1]">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <NuxtLink to="/admin/policies" class="text-gray-400 hover:text-gray-600">
              <Icon name="ph:arrow-left-bold" class="w-5 h-5" />
            </NuxtLink>
            <div>
              <h1 class="text-lg font-semibold text-gray-900">{{ $t('admin.policies.editPolicy') }}</h1>
              <p class="text-xs text-gray-500">{{ $t('admin.policies.editSubtitle') }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="reset"
              type="button"
              class="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              {{ $t('admin.policies.reset') }}
            </button>
            <button
              @click="save"
              :disabled="saving"
              type="button"
              class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Icon v-if="!saving" name="ph:check-bold" class="w-4 h-4" />
              <Icon v-else name="ph:spinner-bold" class="w-4 h-4 animate-spin" />
              {{ saving ? $t('admin.policies.saving') : $t('admin.policies.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-6">
        <!-- Language Selector -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center gap-2">
              <Icon name="ph:translate-bold" class="w-5 h-5 text-gray-700" />
              <h2 class="text-base font-semibold text-gray-900">{{ $t('admin.policies.editingLanguage') }}</h2>
            </div>
            <p class="mt-1 text-sm text-gray-500">{{ $t('admin.policies.languageHint') }}</p>
          </div>
          <div class="p-6">
            <div class="flex gap-2">
              <button
                v-for="lang in languages"
                :key="lang.code"
                @click="setLanguage(lang.code)"
                :class="[
                  'px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                  editorLanguage === lang.code
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ lang.flag }} {{ lang.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Editor Section -->
        <div v-if="loaded" class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-base font-semibold text-gray-900">{{ $t('admin.policies.policyContent') }}</h2>
            <p class="mt-1 text-sm text-gray-500">{{ $t('admin.policies.contentDesc', { lang: currentLangName }) }}</p>
          </div>
          <div class="p-6 space-y-6">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                {{ $t('admin.policies.policyTitle') }} ({{ currentLangName }})
              </label>
              <input
                v-model="localTitle"
                type="text"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                :placeholder="$t('admin.policies.titlePlaceholder')"
              />
            </div>

            <!-- Content -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                {{ $t('admin.policies.content') }} ({{ currentLangName }})
              </label>
              <PluginsRichText v-model:content="localContent" />
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div class="flex flex-col items-center justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-3 border-gray-300 border-t-gray-900"></div>
            <p class="mt-4 text-sm text-gray-600">{{ $t('admin.policies.loadingPolicy') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t: $t } = useI18n()
const route = useRoute()
const supabase = useSupabaseClient()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()
const { editorLanguage, setLanguage } = useEditorLanguage()

const policyId = computed(() => Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇩🇿' },
]

const currentLangName = computed(() => ({ fr: 'Français', en: 'English', ar: 'العربية' })[editorLanguage.value])

const loaded = ref(false)
const saving = ref(false)
const policy = ref(null)

// Local fields for current language only
const localTitle = ref('')
const localContent = ref('')

const applyFromPolicy = () => {
  const t = policy.value?.title_translations || {}
  const simple = policy.value?.simple_content_translations || {}
  const short = policy.value?.short_description_translations || {}
  const lang = editorLanguage.value
  localTitle.value = t[lang] || ''
  // Prefer simple_content if present; otherwise fall back to short_description
  const fromSimple = (simple && typeof simple === 'object') ? (simple[lang] || '') : ''
  const fromShort = (short && typeof short === 'object') ? (short[lang] || '') : ''
  localContent.value = fromSimple && fromSimple.trim() !== '' ? fromSimple : fromShort
}

const loadPolicy = async () => {
  loaded.value = false
  try {
    const { data, error } = await supabase.from('policies').select('*').eq('id', policyId.value).single()
    if (error) throw error
    policy.value = data
    applyFromPolicy()
  } catch (e) {
    console.error(e)
    showError($t('admin.policies.errorLoadingPolicy'))
  } finally {
    loaded.value = true
  }
}

const reset = () => applyFromPolicy()

const save = async () => {
  if (!policy.value) return
  saving.value = true
  try {
    const newTitles = { ...(policy.value.title_translations || {}) }
    const newContents = { ...(policy.value.simple_content_translations || {}) }
    newTitles[editorLanguage.value] = localTitle.value
    newContents[editorLanguage.value] = localContent.value

    const updates = {
      title_translations: newTitles,
      simple_content_translations: newContents,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase.from('policies').update(updates).eq('id', policyId.value).select('*').single()
    if (error) throw error
    policy.value = data
    showSuccess($t('admin.policies.policySaved'))
  } catch (e) {
    console.error(e)
    showError($t('admin.policies.errorSavingPolicy'))
  } finally {
    saving.value = false
  }
}

onMounted(loadPolicy)
watch(() => editorLanguage.value, () => {
  if (policy.value) applyFromPolicy()
})

definePageMeta({ layout: 'default', middleware: ['auth'] })

// SEO
const pageTitle = computed(() => {
  if (!policy.value) return $t('admin.policies.editPageTitle');
  const title = policy.value.title_translations?.fr || 
                policy.value.title_translations?.en || 
                $t('admin.policies.policy');
  return `${$t('admin.policies.edit')} ${title}`;
});

useHead(() => ({
  title: pageTitle.value,
  meta: [
    {
      name: 'description',
      content: $t('admin.policies.editPageDescription'),
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
}));
</script>
