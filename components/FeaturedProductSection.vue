<template>
  <section v-if="section.is_active" class="x-section relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
    <div class="x-container relative">
      <div class="text-center mb-12">
        <div class="flex justify-center mb-4">
          <span class="x-eyebrow">
            <Icon name="ph:trend-up-bold" class="w-3.5 h-3.5 text-primary" />
            {{ $t('common.featured') || 'Featured' }}
          </span>
        </div>
        <h2 class="x-title">
          {{ section.content_translations[currentLocale]?.title || fallback.title }}
        </h2>
        <div class="x-divider mx-auto"></div>
        <p class="x-subtitle max-w-2xl mx-auto">
          {{ section.content_translations[currentLocale]?.subtitle || fallback.subtitle }}
        </p>
      </div>
      <div v-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
        <div class="order-1 flex justify-center">
          <div class="relative w-full max-w-lg">
            <div class="absolute -inset-4 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10 blur-2xl"></div>

            <NuxtImg
              v-if="productImage"
              :src="productImage.url"
              :alt="product.name"
              class="relative w-full aspect-[4/3] rounded-3xl shadow-2xl object-cover border border-mgray-200"
            />
            <div
              v-else
              class="relative w-full aspect-[4/3] rounded-3xl bg-background-100 border border-mgray-200 flex items-center justify-center text-mgray-500"
            >
              {{ $t('common.noImage') || 'No image' }}
            </div>
          </div>
        </div>
        <div class="order-2">
          <div class="x-surface-strong p-7 sm:p-9">
            <h3 class="text-2xl sm:text-3xl font-semibold tracking-tight text-mgray-950 mb-3">
              {{ product.name }}
            </h3>
            <p v-if="currentDescription" class="text-mgray-700 mb-6 leading-relaxed">
              {{ currentDescription }}
            </p>

            <div class="flex items-end justify-between gap-6 mb-8">
              <div>
                <p class="text-xs font-semibold tracking-wide text-mgray-500 uppercase">{{ $t('common.price') || 'Price' }}</p>
                <div v-if="product.price != null" class="text-3xl sm:text-4xl font-bold text-primary">
                  {{ formatPrice(product.price) }}
                </div>
              </div>
            </div>

            <NuxtLink v-if="product.slug" :to="`/products/${product.slug}`" class="x-btn-primary w-full sm:w-auto">
              {{ $t('common.viewProduct') || 'View product' }}
              <Icon name="ph:arrow-right-bold" class="w-4 h-4" />
            </NuxtLink>
          </div>
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
