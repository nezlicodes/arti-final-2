<template>
  <section v-if="section.is_active" class="py-20 lg:py-28 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center mb-16 lg:mb-20">
       
        <h2 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
          {{ section.content_translations?.[currentLocale]?.title || fallbackTitle }}
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {{ section.content_translations?.[currentLocale]?.subtitle || fallbackSubtitle }}
        </p>
      </div>

      <!-- Featured Product Card -->
      <div v-if="product" class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div class="grid lg:grid-cols-2 gap-0">
          
          <!-- Product Image -->
          <div class="relative aspect-square lg:aspect-auto bg-gray-50">
            <NuxtImg
              v-if="productImage"
              :src="productImage.url"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <div class="text-center space-y-4">
                <Icon name="ph:package" class="w-20 h-20 text-gray-300 mx-auto" />
                <p class="text-gray-400 font-medium">Product Image</p>
              </div>
            </div>
            
            <!-- Product Badge -->
            <div class="absolute top-6 left-6">
              <span class="inline-flex items-center px-3 py-1.5 bg-black/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                <Icon name="ph:lightning-fill" class="w-3 h-3 mr-1" />
                Featured
              </span>
            </div>
          </div>

          <!-- Product Details -->
          <div class="p-8 lg:p-12 flex flex-col justify-center">
            
            <!-- Product Name -->
            <h3 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {{ product.name }}
            </h3>

            <!-- Price -->
            <div class="flex items-baseline space-x-4 mb-8">
              <span v-if="product.price != null" class="text-4xl lg:text-5xl font-bold text-gray-900">
                {{ formatPrice(product.price) }}
              </span>
              <span v-if="product.original_price && product.original_price > product.price" 
                    class="text-xl text-gray-400 line-through">
                {{ formatPrice(product.original_price) }}
              </span>
              <span v-if="product.original_price && product.original_price > product.price"
                    class="inline-flex items-center px-2.5 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
                {{ Math.round(((product.original_price - product.price) / product.original_price) * 100) }}% OFF
              </span>
            </div>

            <!-- Description -->
            <div v-if="product.description || currentDescription" class="mb-8">
              <p class="text-lg text-gray-600 leading-relaxed">
                {{ product.description || currentDescription }}
              </p>
            </div>

            <!-- Features -->
            <div v-if="product.features && product.features.length" class="mb-10">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">What's included:</h4>
              <div class="grid grid-cols-1 gap-3">
                <div v-for="feature in product.features.slice(0, 4)" :key="feature" 
                     class="flex items-center">
                  <div class="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span class="text-gray-700">{{ feature }}</span>
                </div>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 mb-8">
              <NuxtLink
                v-if="product.slug"
                :to="`/products/${product.slug}`"
                class="flex-1 inline-flex items-center justify-center px-8 py-4 bg-primary text-contrast1 text-lg font-semibold rounded-2xl hover:bg-gray-800 transition-all duration-200 group"
              >
                {{ $t("common.viewProduct") || "View Product" }}
                <Icon name="ph:arrow-right-bold" class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </NuxtLink>
              
            </div>

           <Features/>

          </div>
        </div>
      </div>

      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const { locale } = useI18n();

const SECTION_KEY = "featured_product";

const currentLocale = computed(() => locale.value || "fr");

const { businessId } = useBusinessPreview();

const FALLBACK_BY_BUSINESS: Record<
  string,
  { title: string; subtitle: string }
> = {
  ecommerce: {
    title: "Produits en vedette",
    subtitle: "Les meilleures offres et nouveautés du moment.",
  },
  restaurant: {
    title: "Plat du jour",
    subtitle: "Découvrez notre suggestion du chef.",
  },
  artisan: {
    title: "Création en vedette",
    subtitle: "Une pièce unique, fabriquée à la main.",
  },
};

const fallback = computed(() => {
  const key = String(businessId.value);
  return FALLBACK_BY_BUSINESS[key] || FALLBACK_BY_BUSINESS.ecommerce;
});

const fallbackTitle = computed(() => fallback.value?.title || "Featured");
const fallbackSubtitle = computed(() => fallback.value?.subtitle || "");

const section = ref({
  is_active: true,
  content_translations: {
    fr: { title: "", subtitle: "" },
    ar: { title: "", subtitle: "" },
    en: { title: "", subtitle: "" },
    meta: { selected_product_id: null },
  },
});

const loadSection = async () => {
  try {
    const { data, error } = await supabase
      .from("content_sections")
      .select("is_active, content_translations")
      .eq("section_key", SECTION_KEY)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    if (data) {
      section.value = {
        is_active: data.is_active ?? false,
        content_translations:
          data.content_translations || section.value.content_translations,
      };
    }
  } catch (e) {
    console.error("Error loading featured_product section", e);
  }
};

const product = ref(null);

const pickPreviewFeaturedProduct = async () => {
  try {
    const { getCatalogForBusiness } = await import("~/utils/business-catalogs");
    const catalog = getCatalogForBusiness(businessId.value as any);
    const featured =
      catalog.products.find((p) => p.is_featured) || catalog.products[0];
    if (!featured) return null;
    return {
      ...featured,
      images: featured.images || [],
    };
  } catch {
    return null;
  }
};
const productImage = computed(() => product.value?.images?.[0] || null); // { url }
const currentDescription = computed(
  () =>
    section.value.content_translations?.[currentLocale.value]
      ?.product_description || ""
);

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
  }).format(price);

const coerceId = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? v : n;
};

watchEffect(async () => {
  const rawId = section.value?.content_translations?.meta?.selected_product_id;
  const id = coerceId(rawId);
  const currentBusinessId = businessId.value; // Explicit dependency on businessId

  // IMPORTANT: For business preview, always show the business catalog product
  // even if there's a DB-configured product. This ensures switching business type
  // immediately updates the featured product.
  if (currentBusinessId && currentBusinessId !== "ecommerce") {
    product.value = await pickPreviewFeaturedProduct();
    return;
  }

  // If not configured in DB, show a preview featured product
  if (!id) {
    product.value = await pickPreviewFeaturedProduct();
    return;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, slug, name_translations, price, images:product_images(url)")
      .eq("id", id)
      .single();
    if (error) throw error;
    const loc = currentLocale.value;
    product.value = {
      ...data,
      name:
        data.name_translations?.[loc] || data.name_translations?.["fr"] || "",
    };
  } catch (e) {
    console.error("Error loading featured product", e);
    product.value = await pickPreviewFeaturedProduct();
  }
});

onMounted(loadSection);
</script>
