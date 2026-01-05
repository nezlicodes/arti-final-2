<template>
  <div class="min-h-screen bg-background pt-4">
    <Head>
      <Title>{{ getMetaTitle() }}</Title>
      <Meta name="description" :content="getMetaDescription()" />
    </Head>

    <!-- Loading State -->
    <div v-if="loading" class="min-h-[80vh] flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="x-container py-6">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs sm:text-sm mb-6 overflow-x-auto pb-2" aria-label="Breadcrumb">
        <NuxtLink to="/" class="text-mgray-600 hover:text-primary whitespace-nowrap">Accueil</NuxtLink>
        <span class="text-gray-400">/</span>
        <NuxtLink to="/products" class="text-mgray-600 hover:text-primary whitespace-nowrap">Produits</NuxtLink>
        <template v-if="product.category && categoriesEnabled">
          <span class="text-gray-400">/</span>
          <NuxtLink :to="`/categories/${product.category.slug}`" class="text-mgray-600 hover:text-primary whitespace-nowrap">
            {{ getCategoryName(product.category.name_translations) }}
          </NuxtLink>
        </template>
        <span class="text-gray-400">/</span>
        <span class="text-mgray-950 font-semibold truncate">{{ getProductName() }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <!-- Media Gallery -->
        <div class="lg:sticky lg:top-24 self-start">
          <!-- Main Media Display -->
          <div class="aspect-square rounded-3xl overflow-hidden bg-mgray-50 border border-mgray-200 shadow-sm mb-4">
            <!-- Image Display -->
            <img
              v-if="currentMediaType === 'image'"
              :src="mainMedia.url"
              :alt="getProductName()"
              class="w-full h-full object-cover"
            />
            <!-- Video Display -->
            <video
              v-else-if="currentMediaType === 'video'"
              :src="mainMedia.url"
              controls
              class="w-full h-full object-cover"
              preload="metadata"
            >
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </div>

          <!-- Media Thumbnails - Horizontal Scroll -->
          <div v-if="allMedia.length > 1" class="media-scroll flex gap-2 overflow-x-auto pb-2">
            <!-- Image Thumbnails -->
            <button
              v-for="(image, idx) in product.images"
              :key="'img-' + idx"
              @click="selectMedia('image', image)"
              class="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border transition-all relative shadow-sm"
              :class="currentMediaType === 'image' && mainMedia.url === image.url ? 'border-primary ring-2 ring-primary/20' : 'border-mgray-200 hover:border-mgray-300'"
            >
              <img :src="image.url" :alt="getProductName()" class="w-full h-full object-cover" />
              <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-0.5 text-center">
                📸
              </div>
            </button>
            
            <!-- Video Thumbnails -->
            <button
              v-for="(video, idx) in product.videos"
              :key="'vid-' + idx"
              @click="selectMedia('video', video)"
              class="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border transition-all relative shadow-sm"
              :class="currentMediaType === 'video' && mainMedia.url === video.url ? 'border-primary ring-2 ring-primary/20' : 'border-mgray-200 hover:border-mgray-300'"
            >
              <!-- Video thumbnail preview -->
              <video :src="video.url" class="w-full h-full object-cover" preload="metadata"></video>
              <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                </svg>
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-0.5 text-center">
                {{ formatVideoDuration(video.duration) }}
              </div>
            </button>
          </div>

          <!-- Media Type Indicator -->
          <div v-if="allMedia.length > 0" class="mt-3 text-center text-xs text-mgray-600">
            {{ product.images?.length || 0 }} image{{ (product.images?.length || 0) > 1 ? 's' : '' }}
            <span v-if="product.videos && product.videos.length > 0">
              • {{ product.videos.length }} vidéo{{ product.videos.length > 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <!-- Product Info (Buy box) -->
        <div class="x-surface-strong p-5 sm:p-7 lg:sticky lg:top-24 self-start">
          <!-- Category -->
          <div v-if="product.category && categoriesEnabled" class="mb-3">
            <NuxtLink
              :to="`/categories/${product.category.slug}`"
              class="x-eyebrow bg-mgray-50 border-mgray-200 text-mgray-700 hover:bg-white"
            >
              {{ getCategoryName(product.category.name_translations) }}
            </NuxtLink>
          </div>

          <!-- Title -->
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-mgray-950 mb-4 leading-tight">
            {{ getProductName() }}
          </h1>

          <!-- Price & Stock -->
          <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-mgray-200 mb-6">
            <div class="flex items-baseline gap-2">
              <p class="text-3xl font-bold text-primary">{{ formatPrice(currentPrice) }}</p>
              <p v-if="currentComparePrice" class="text-lg text-mgray-500 line-through">
                {{ formatPrice(currentComparePrice) }}
              </p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
:class="currentStock > 0 ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'"
            >
              {{ currentStock > 0 ? "En stock" : "Rupture de stock" }}
            </span>
          </div>

          <!-- Variants -->
          <div v-if="product.has_variants && productOptions.length > 0" class="space-y-6 mb-8">
            <div v-for="option in productOptions" :key="option.id">
              <h3 class="text-sm font-semibold text-mgray-950 mb-3">
                {{ getOptionName(option.name_translations) }}
              </h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  v-for="value in option.values"
                  :key="value.id"
                  @click="selectOptionValue(option.id, value.id)"
                  class="px-4 py-2.5 text-sm font-semibold border rounded-2xl transition-all"
                  :class="[
                    selectedOptions[option.id] === value.id
                      ? 'border-primary bg-primary/10 text-primary shadow-sm'
                      : 'border-mgray-200 hover:border-mgray-300 bg-white',
                    !isOptionValueAvailable(option.id, value.id) && 'opacity-40 cursor-not-allowed'
                  ]"
                  :disabled="!isOptionValueAvailable(option.id, value.id)"
                >
                  {{ getOptionValue(value.value_translations) }}
                </button>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div v-if="getProductDescription()" class="mb-8 pb-8 border-b border-mgray-200">
            <h3 class="text-sm font-semibold text-mgray-950 mb-3">Description</h3>
            <div v-html="getProductDescription()" class="prose prose-sm text-mgray-700"></div>
          </div>

          <!-- Add to Cart -->
          <div class="space-y-4">
            <!-- Warning -->
            <div
              v-if="product.has_variants && !isVariantSelected && productOptions.length > 0"
              class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-900 text-sm"
            >
              Veuillez sélectionner toutes les options
            </div>

            <!-- Form -->
            <form @submit.prevent="addToCart" class="space-y-4">
              <div class="flex gap-3">
                <!-- Quantity -->
                <div class="w-32">
                  <label class="block text-sm font-semibold text-mgray-700 mb-2">Quantité</label>
                  <div class="flex items-center border border-mgray-200 rounded-2xl bg-white">
                    <button
                      type="button"
                      @click="quantity > 1 && quantity--"
                      class="w-10 h-10 flex items-center justify-center hover:bg-mgray-50"
                    >
                      <span class="text-xl">−</span>
                    </button>
                    <input
                      type="number"
                      v-model.number="quantity"
                      min="1"
                      :max="currentStock"
                      class="flex-1 text-center border-0 focus:ring-0 font-semibold bg-transparent"
                    />
                    <button
                      type="button"
                      @click="quantity < currentStock && quantity++"
                      class="w-10 h-10 flex items-center justify-center hover:bg-mgray-50"
                    >
                      <span class="text-xl">+</span>
                    </button>
                  </div>
                </div>

                <!-- Add Button -->
                <div class="flex-1">
                  <label class="block text-sm font-semibold text-mgray-700 mb-2">&nbsp;</label>
                  <button
                    type="submit"
                    :disabled="(product.has_variants && !isVariantSelected) || !currentStock"
                    class="w-full h-11 rounded-2xl bg-primary text-contrast1 font-semibold hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/10"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>

              <p v-if="currentStock > 0" class="text-sm text-mgray-600 text-center">
                {{ currentStock }} article{{ currentStock > 1 ? 's' : '' }} disponible{{ currentStock > 1 ? 's' : '' }}
              </p>
            </form>
          </div>

          <!-- Details -->
          <div class="mt-8 pt-8 border-t border-mgray-200">
            <h3 class="text-sm font-semibold text-mgray-950 mb-4">Détails</h3>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-mgray-600">Référence</dt>
                <dd class="font-medium">{{ currentSku }}</dd>
              </div>
              <div v-if="product.category && categoriesEnabled" class="flex justify-between">
                <dt class="text-mgray-600">Catégorie</dt>
                <dd>
                  <NuxtLink :to="`/categories/${product.category.slug}`" class="text-primary hover:opacity-80">
                    {{ getCategoryName(product.category.name_translations) }}
                  </NuxtLink>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="min-h-[80vh] flex items-center justify-center">
      <div class="text-center">
        <h3 class="text-xl font-semibold text-mgray-950 mb-2">Produit introuvable</h3>
        <p class="text-mgray-700 mb-6">Le produit que vous recherchez n'existe pas.</p>
        <NuxtLink to="/products" class="x-btn-primary">
          Retour aux produits
        </NuxtLink>
      </div>
    </div>

    <!-- Notification -->
    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="showNotification"
        class="fixed bottom-4 right-4 x-surface-strong p-4 max-w-sm z-50"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
            <span class="text-green-600 text-xl">✓</span>
          </div>
          <div>
            <p class="font-semibold text-mgray-950">Ajouté au panier</p>
            <p class="text-sm text-mgray-600">Produit ajouté avec succès</p>
          </div>
          <button @click="showNotification = false" class="ml-auto text-mgray-400 hover:text-mgray-700">
            <span class="text-xl">×</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const { fetchProduct: fetchProductData } = useProducts();
const supabase = useSupabaseClient(); // kept for variants/videos if needed
const route = useRoute();
const { locale } = useI18n();

const currentLocale = computed(() => locale.value);

const loading = ref(true);
const product = ref(null);
const quantity = ref(1);
const showNotification = ref(false);
const categoriesEnabled = ref(true);

// Media state
const currentMediaType = ref('image'); // 'image' or 'video'
const mainMedia = ref({ url: null, type: 'image' });

const variants = ref([]);
const productOptions = ref([]);
const selectedOptions = ref({});

const getProductName = () => {
  if (!product.value?.name_translations) return "";
  const t = product.value.name_translations;
  return t[currentLocale.value] || t.en || t.fr || t.ar || "";
};

const getProductDescription = () => {
  if (!product.value?.description_translations) return "";
  const t = product.value.description_translations;
  return t[currentLocale.value] || t.en || t.fr || t.ar || "";
};

const getCategoryName = (translations) => {
  if (!translations || typeof translations !== "object") return "";
  return translations[currentLocale.value] || translations.en || translations.fr || translations.ar || "";
};

const getOptionName = (translations) => {
  if (!translations || typeof translations !== "object") return "";
  return translations[currentLocale.value] || translations.en || translations.fr || translations.ar || "";
};

const getOptionValue = (translations) => {
  if (!translations || typeof translations !== "object") return "";
  return translations[currentLocale.value] || translations.en || translations.fr || translations.ar || "";
};

const getVariantName = (translations) => {
  if (!translations || typeof translations !== "object") return "";
  return translations[currentLocale.value] || translations.en || translations.fr || translations.ar || "";
};

const getMetaTitle = () => {
  if (!product.value) return "Produit";
  const t = product.value.meta_title_translations;
  if (t && typeof t === "object") {
    return t[currentLocale.value] || t.en || t.fr || getProductName() || "Produit";
  }
  return getProductName() || "Produit";
};

const getMetaDescription = () => {
  if (!product.value) return "";
  const t = product.value.meta_description_translations;
  if (t && typeof t === "object") {
    return t[currentLocale.value] || t.en || t.fr || "";
  }
  return "";
};

const formatVideoDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Computed property for all media combined
const allMedia = computed(() => {
  const media = [];
  
  if (product.value?.images) {
    product.value.images.forEach(image => {
      media.push({ ...image, type: 'image' });
    });
  }
  
  if (product.value?.videos) {
    product.value.videos.forEach(video => {
      media.push({ ...video, type: 'video' });
    });
  }
  
  return media;
});

const selectMedia = (type, mediaItem) => {
  currentMediaType.value = type;
  mainMedia.value = { url: mediaItem.url, type };
};

const currentVariant = computed(() => {
  if (!product.value?.has_variants || variants.value.length === 0) return null;
  
  // Need all options selected
  if (Object.keys(selectedOptions.value).length !== productOptions.value.length) {
    return null;
  }
  
  // Find matching variant
  return variants.value.find((variant) => {
    return Object.entries(selectedOptions.value).every(([optionTypeId, optionValueId]) => {
      return variant.option_values.some((ov) => 
        String(ov.option_type_id) === String(optionTypeId) && 
        String(ov.id) === String(optionValueId)
      );
    });
  });
});

const isVariantSelected = computed(() => {
  if (!product.value?.has_variants) return true;
  if (productOptions.value.length === 0) return true;
  return Object.keys(selectedOptions.value).length === productOptions.value.length;
});

const currentPrice = computed(() => {
  if (currentVariant.value) {
    return parseFloat(currentVariant.value.price) || 0;
  }
  return parseFloat(product.value?.price) || 0;
});

const currentComparePrice = computed(() => {
  if (currentVariant.value) {
    return currentVariant.value.compare_at_price ? parseFloat(currentVariant.value.compare_at_price) : null;
  }
  return product.value?.compare_at_price ? parseFloat(product.value.compare_at_price) : null;
});

const currentStock = computed(() => {
  if (currentVariant.value) {
    return parseInt(currentVariant.value.quantity) || 0;
  }
  return parseInt(product.value?.quantity) || 0;
});

const currentSku = computed(() => {
  if (currentVariant.value) {
    return currentVariant.value.sku || "";
  }
  return product.value?.sku || "";
});

const fetchProductDetails = async () => {
  loading.value = true;
  try {
    const productResult = await fetchProductData(String(route.params.slug));

    if (!productResult) {
      return;
    }

    product.value = productResult;

    // Sort images
    const images = productResult.images?.sort((a, b) => {
      if (a.is_primary) return -1;
      if (b.is_primary) return 1;
      return (a.position || 0) - (b.position || 0);
    }) || [];

    // Sort videos by position
    const videos = (productResult.videos || [])?.sort?.((a, b) => (a.position || 0) - (b.position || 0)) || [];

    // Set main media
    if (images.length > 0) {
      mainMedia.value = { url: images[0].url, type: 'image' };
      currentMediaType.value = 'image';
    } else if (videos.length > 0) {
      mainMedia.value = { url: videos[0].url, type: 'video' };
      currentMediaType.value = 'video';
    } else {
      mainMedia.value = { url: "/images/placeholders/placeholder-product.svg", type: 'image' };
      currentMediaType.value = 'image';
    }

    if (productResult.has_variants) {
      await fetchVariants(productResult.id);
    }
  } catch (err) {
    console.error("Error fetching product:", err);
  } finally {
    loading.value = false;
  }
};

const fetchVariants = async (productId) => {
  try {
    // Fetch option types with their values
    const { data: optionTypes, error: optionsError } = await supabase
      .from("product_option_types")
      .select(`
        id, 
        name_translations, 
        display_order,
        values:product_option_values(
          id, 
          value_translations, 
          option_type_id, 
          display_order
        )
      `)
      .eq("product_id", productId)
      .order("display_order");

    if (optionsError) throw optionsError;

    // Sort values by display_order
    if (optionTypes) {
      optionTypes.forEach((optionType) => {
        if (optionType.values) {
          optionType.values.sort((a, b) => a.display_order - b.display_order);
        }
      });
    }

    productOptions.value = optionTypes || [];

    // Fetch variants
    const { data: variantsData, error: variantsError } = await supabase
      .from("product_variants")
      .select(`
        id, 
        name_translations, 
        sku, 
        price, 
        compare_at_price, 
        quantity, 
        is_active
      `)
      .eq("product_id", productId)
      .eq("is_active", true);

    if (variantsError) throw variantsError;

    if (!variantsData || variantsData.length === 0) {
      variants.value = [];
      return;
    }

    // Fetch variant option values
    const variantIds = variantsData.map((v) => v.id);
    const { data: allVariantOptions, error: variantOptionsError } = await supabase
      .from("product_variant_option_values")
      .select(`
        variant_id, 
        option_value_id, 
        option_value:product_option_values(
          id, 
          value_translations, 
          option_type_id
        )
      `)
      .in("variant_id", variantIds);

    if (variantOptionsError) throw variantOptionsError;

    // Map option values to variants
    const variantOptionsMap = {};
    if (allVariantOptions) {
      allVariantOptions.forEach((vo) => {
        if (!variantOptionsMap[vo.variant_id]) {
          variantOptionsMap[vo.variant_id] = [];
        }
        variantOptionsMap[vo.variant_id].push({
          id: vo.option_value.id,
          value_translations: vo.option_value.value_translations,
          option_type_id: vo.option_value.option_type_id,
        });
      });
    }

    // Attach option values to each variant
    variantsData.forEach((variant) => {
      variant.option_values = variantOptionsMap[variant.id] || [];
    });

    variants.value = variantsData;

    console.log("Loaded variants:", variants.value.length);
    console.log("Product options:", productOptions.value);
  } catch (err) {
    console.error("Error fetching variants:", err);
  }
};

const fetchFeaturesConfig = async () => {
  try {
    const { data } = await supabase
      .from("features_config")
      .select("categories_enabled")
      .single();

    if (data) {
      categoriesEnabled.value = data.categories_enabled;
    }
  } catch (err) {
    console.error("Error fetching features config:", err);
  }
};

watch(
  () => route.params.slug,
  async () => {
    // reset selection state
    selectedOptions.value = {}
    variants.value = []
    productOptions.value = []
    await fetchProductDetails()
  },
  { immediate: true }
)

onMounted(() => {
  fetchFeaturesConfig()
})

const selectOptionValue = (optionTypeId, optionValueId) => {
  console.log("Selecting option:", optionTypeId, optionValueId);
  selectedOptions.value = { ...selectedOptions.value, [optionTypeId]: optionValueId };
  console.log("Selected options:", selectedOptions.value);
};

const isOptionValueAvailable = (optionTypeId, optionValueId) => {
  // Always return true for now - let user select any option
  // We'll show "out of stock" after they select all options if needed
  return true;
};

const addToCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  
  // Use first image for cart thumbnail
  const cartImage = product.value.images?.[0]?.url || mainMedia.value.url;
  
  let itemToAdd;
  if (product.value.has_variants && currentVariant.value) {
    itemToAdd = {
      id: currentVariant.value.id,
      product_id: product.value.id,
      name: getProductName(),
      variant_name: getVariantName(currentVariant.value.name_translations),
      price: currentVariant.value.price,
      image: cartImage,
      quantity: quantity.value,
      slug: route.params.slug,
      is_variant: true,
    };
  } else {
    itemToAdd = {
      id: product.value.id,
      product_id: product.value.id,
      name: getProductName(),
      price: product.value.price,
      image: cartImage,
      quantity: quantity.value,
      slug: route.params.slug,
      is_variant: false,
    };
  }

  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex((item) => {
    if (product.value.has_variants && currentVariant.value) {
      return item.id === currentVariant.value.id && item.is_variant;
    } else {
      return item.id === product.value.id && !item.is_variant;
    }
  });

  if (existingItemIndex !== -1) {
    // Update quantity of existing item
    cart[existingItemIndex].quantity += quantity.value;
  } else {
    // Add new item
    cart.push(itemToAdd);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  
  // Show notification
  showNotification.value = true;
  setTimeout(() => { 
    showNotification.value = false; 
  }, 3000);
  
  // Reset quantity
  quantity.value = 1;
};

const formatPrice = (price) => {
  const value = Number(price || 0);
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    maximumFractionDigits: 0,
  }).format(value);
};

onMounted(async () => {
  await fetchFeaturesConfig();
  await fetchProduct();
});

useHead({
  title: getMetaTitle(),
  meta: [{ name: "description", content: getMetaDescription() }],
});
</script>

<style scoped>
.prose {
  max-width: none;
}

/* Hide horizontal scrollbar (still scrollable) for media thumbs */
.media-scroll::-webkit-scrollbar {
  height: 8px;
}
.media-scroll::-webkit-scrollbar-track {
  background: rgba(var(--body-bg), 1);
}
.media-scroll::-webkit-scrollbar-thumb {
  background: rgba(var(--text-color), 0.18);
  border-radius: 999px;
}
.media-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--text-color), 0.28);
}
</style>