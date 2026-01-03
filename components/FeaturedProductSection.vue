<template>
  <section v-if="section.is_active" class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {{ section.content_translations[currentLocale]?.title || fallback.title }}
        </h2>
        <div class="w-16 h-0.5 bg-primary mx-auto mb-4"></div>
        <p class="text-base text-gray-600 max-w-2xl mx-auto">
          {{ section.content_translations[currentLocale]?.subtitle || fallback.subtitle }}
        </p>
      </div>
      <div v-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
        <div class="order-1 md:order-1 flex justify-center">
          <NuxtImg v-if="productImage" :src="productImage.url" :alt="product.name" class="w-full max-w-md rounded-xl shadow-md object-cover" />
          <div v-else class="w-full max-w-md aspect-[4/3] rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
            {{ $t('common.noImage') || 'No image' }}
          </div>
        </div>
        <div class="order-2 md:order-2">
          <h3 class="text-2xl font-semibold mb-3">{{ product.name }}</h3>
          <p v-if="currentDescription" class="text-gray-600 mb-5">{{ currentDescription }}</p>
          <div class="flex items-center gap-4 mb-6">
            <div v-if="product.price != null" class="text-2xl font-bold text-primary">{{ formatPrice(product.price) }}</div>
          </div>
          <NuxtLink v-if="product.slug" :to="`/products/${product.slug}`" class="inline-flex items-center px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition">
            {{ $t('common.viewProduct') || 'View product' }}
          </NuxtLink>
        </div>
      </div>
      <slot />
    </div>
  </section>
</template>

<script setup>
const supabase = useSupabaseClient()
const { locale } = useI18n()

const SECTION_KEY = 'featured_product'

const currentLocale = computed(() => locale.value || 'fr')

const fallback = {
  title: 'Produits populaires',
  subtitle: "Découvrez notre sélection de produits les plus appréciés",
}

const section = ref({
  is_active: true,
  content_translations: {
    fr: { title: '', subtitle: '' },
    ar: { title: '', subtitle: '' },
    en: { title: '', subtitle: '' },
    meta: { selected_product_id: null }
  }
})

const loadSection = async () => {
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .select('is_active, content_translations')
      .eq('section_key', SECTION_KEY)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (data) {
      section.value = {
        is_active: data.is_active ?? false,
        content_translations: data.content_translations || section.value.content_translations,
      }
    }
  } catch (e) {
    console.error('Error loading featured_product section', e)
  }
}

const product = ref(null)
const productImage = computed(() => product.value?.images?.[0] || null) // { url }
const currentDescription = computed(() => section.value.content_translations?.[currentLocale.value]?.product_description || '')

const formatPrice = (price) => new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', minimumFractionDigits: 0 }).format(price)

const coerceId = (v) => {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isNaN(n) ? v : n
}

watchEffect(async () => {
  const rawId = section.value?.content_translations?.meta?.selected_product_id
  const id = coerceId(rawId)
  if (!id) { product.value = null; return }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, name_translations, price, images:product_images(url)')
      .eq('id', id)
      .single()
    if (error) throw error
    const loc = currentLocale.value
    product.value = {
      ...data,
      name: data.name_translations?.[loc] || data.name_translations?.['fr'] || ''
    }
  } catch (e) {
    console.error('Error loading featured product', e)
  }
})

onMounted(loadSection)
</script>
