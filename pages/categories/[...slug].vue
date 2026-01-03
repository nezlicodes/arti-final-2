<template>
  <div class="bg-white min-h-screen">
    <Head>
      <Title>{{ getCategoryName() || 'Catégorie' }}</Title>
      <Meta
        name="description"
        :content="getCategoryDescription() || 'Découvrez nos produits dans cette catégorie.'"
      />
    </Head>

    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h3 class="text-xl font-bold text-gray-900 mb-2">Catégorie introuvable</h3>
        <p class="text-gray-600 mb-6">La catégorie que vous recherchez n'existe pas.</p>
        <NuxtLink to="/products" class="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">
          Voir tous les produits
        </NuxtLink>
      </div>
    </div>

    <div v-if="!loading && !error">
      <!-- Hero Section Redesigned -->
      <section class="relative bg-gray-900 overflow-hidden">
        <!-- Background Media -->
        <div class="absolute inset-0 parallax-bg" ref="parallaxElement">
          <video
            v-if="category.video_url"
            :src="category.video_url"
            autoplay
            loop
            muted
            playsinline
            class="w-full h-full object-cover transform transition-transform duration-100 ease-out"
            ref="videoElement"
          ></video>
          <img
            v-else
            :src="category.image_url || '/images/placeholders/placeholder-category.jpg'"
            alt=""
            class="w-full h-full object-cover transform transition-transform duration-100 ease-out"
            ref="imageElement"
          />
          <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>
        </div>

        <!-- Content -->
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20" ref="contentElement">
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-2 text-sm mb-4 text-white/80 overflow-x-auto pb-2">
            <NuxtLink to="/" class="hover:text-white whitespace-nowrap">Accueil</NuxtLink>
            <span>/</span>
            <NuxtLink to="/products" class="hover:text-white whitespace-nowrap">Produits</NuxtLink>
            <span>/</span>
            <span class="text-white font-medium truncate">{{ getCategoryName() }}</span>
          </nav>

          <!-- Title + Description in Glass Card -->
          <div class="backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div class="flex-1">
                <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  {{ getCategoryName() }}
                </h1>
                <p
                  v-if="getCategoryDescription()"
                  v-html="getCategoryDescription()"
                  class="mt-3 max-w-2xl text-base sm:text-lg text-white/90"
                ></p>
              </div>
              <div class="shrink-0">
                <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white border border-white/20">
                  <span class="w-2 h-2 rounded-full bg-primary"></span>
                  <span class="font-semibold">{{ products.length }} produit{{ products.length > 1 ? 's' : '' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Content -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <!-- Controls Bar -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <span class="hidden sm:inline">Tous les produits</span>
            <span class="sm:hidden font-semibold">{{ products.length }} résultat{{ products.length > 1 ? 's' : '' }}</span>
          </div>
          <div class="flex items-center gap-3">
            <label for="sort" class="text-sm text-gray-600">Trier</label>
            <select
              id="sort"
              v-model="sortBy"
              class="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="created_at:desc">Nouveautés</option>
              <option value="price:asc">Prix: bas à haut</option>
              <option value="price:desc">Prix: haut à bas</option>
              <option value="name:asc">Nom A-Z</option>
              <option value="name:desc">Nom Z-A</option>
            </select>
          </div>
        </div>

        <div>
          <!-- Products Section -->
          <main class="flex-1">
            <!-- Products Grid -->
            <div v-if="paginatedProducts.length > 0" class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <NuxtLink
                v-for="product in paginatedProducts"
                :key="product.id"
                :to="`/products/${product.slug}`"
                class="product-card group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <!-- Product Image -->
                <div class="relative aspect-square overflow-hidden bg-gray-100">
                  <div class="w-full h-full overflow-hidden">
                    <img
                      :src="product.images?.[0]?.url || '/images/placeholders/placeholder-product.svg'"
                      :alt="getProductName(product.name_translations)"
                      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <!-- Hover Overlay -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <!-- Badges -->
                  <div class="absolute top-3 right-3">
                    <span
                      v-if="product.compare_at_price && product.compare_at_price > product.price"
                      class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                    >
                      -{{ Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100) }}%
                    </span>
                  </div>
                  <div class="absolute top-3 left-3">
                    <span
                      v-if="product.quantity > 0 || product.has_variants"
                      class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-green-500/90 backdrop-blur-sm text-white shadow-md"
                    >
                      <span class="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>
                      En stock
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-500/90 backdrop-blur-sm text-white shadow-md"
                    >
                      Épuisé
                    </span>
                  </div>
                </div>

                <!-- Product Info -->
                <div class="p-4 relative">
                  <h4 class="font-semibold text-gray-900 text-sm mb-2.5 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors duration-300">
                    {{ getProductName(product.name_translations) }}
                  </h4>
                  <div class="flex items-baseline gap-2 mb-1">
                    <p class="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                      {{ product.price.toFixed(2) }} DZD
                    </p>
                    <p
                      v-if="product.compare_at_price && product.compare_at_price > product.price"
                      class="text-sm text-gray-500 line-through"
                    >
                      {{ product.compare_at_price.toFixed(2) }} DZD
                    </p>
                  </div>
                  <p v-if="product.compare_at_price && product.compare_at_price > product.price" class="text-xs text-green-600 font-medium">
                    Économisez {{ (product.compare_at_price - product.price).toFixed(2) }} DZD
                  </p>
                  <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </NuxtLink>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-20">
              <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span class="text-4xl">📦</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Aucun produit disponible</h3>
              <p class="text-gray-600 mb-6">Aucun produit ne correspond à vos critères.</p>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-10 flex justify-center">
              <nav class="inline-flex items-center gap-2 bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
                <button
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                  class="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300',
                    currentPage === page ? 'bg-primary text-white shadow-lg scale-110' : 'text-gray-700 hover:bg-gray-100',
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                  class="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </nav>
            </div>
          </main>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { useSupabaseClient } from "#imports";
import { useRoute } from "vue-router";

const supabase = useSupabaseClient();
const route = useRoute();
const { locale } = useI18n();

const currentLocale = computed(() => locale.value);

// Resolve slug (support catch-all array)
const slugParam = computed(() => {
  const s = route.params.slug;
  return Array.isArray(s) ? s[s.length - 1] : s;
});

const getTranslation = (translations) => {
  if (!translations || typeof translations !== 'object') return '';
  return translations[currentLocale.value] || translations.fr || translations.en || translations.ar || '';
};

const getCategoryName = () => {
  return getTranslation(category.value?.name_translations);
};

const getCategoryDescription = () => {
  return getTranslation(category.value?.description_translations);
};

const getProductName = (translations) => {
  return getTranslation(translations);
};

const loading = ref(true);
const error = ref(null);
const category = ref(null);
const products = ref([]);

// Template refs for parallax
const parallaxElement = ref(null);
const contentElement = ref(null);
const imageElement = ref(null);
const videoElement = ref(null);
const currentPage = ref(1);
const itemsPerPage = 12;
const sortBy = ref("created_at:desc");
// filters removed

// filters removed
const filteredProducts = computed(() => products.value);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return products.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(products.value.length / itemsPerPage);
});

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slugParam.value)
      .eq("is_active", true)
      .single();

    if (categoryError) throw categoryError;
    if (!categoryData) {
      error.value = "Catégorie introuvable";
      return;
    }

    category.value = categoryData;

    const [field, direction] = sortBy.value.split(":");
    let orderField = field;
    if (field === 'name') {
      orderField = `name_translations->>fr`;
    }

    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("*, images:product_images(url, position)")
      .eq("category_id", categoryData.id)
      .eq("is_active", true)
      .order(orderField, { ascending: direction === "asc" });

    if (productsError) throw productsError;

    products.value = (productsData || []).map(product => ({
      ...product,
      images: product.images?.sort((a, b) => a.position - b.position)
    }));
  } catch (err) {
    console.error("Error:", err);
    error.value = "Impossible de charger la catégorie";
  } finally {
    loading.value = false;
  }
};

// filters removed

watch([slugParam, sortBy], () => {
  currentPage.value = 1;
  fetchData();
}, { immediate: true });

// filters removed

// Parallax scroll handler
const handleScroll = () => {
  if (!process.client) return;
  
  const scrolled = window.pageYOffset;
  const parallaxSpeed = 0.4;
  const contentSpeed = 0.2;
  
  // Apply parallax to background
  if (imageElement.value) {
    imageElement.value.style.transform = `translateY(${scrolled * parallaxSpeed}px) scale(1.05)`;
  }
  if (videoElement.value) {
    videoElement.value.style.transform = `translateY(${scrolled * parallaxSpeed}px) scale(1.05)`;
  }
  
  // Apply subtle parallax to content
  if (contentElement.value) {
    contentElement.value.style.transform = `translateY(${scrolled * contentSpeed}px)`;
  }
};

onMounted(() => {
  if (process.client) {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', handleScroll);
  }
});

definePageMeta({
  pageTransition: {
    name: "page",
  },
});
</script>

<style scoped>
.product-card {
  position: relative;
}

.product-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  padding: 2px;
  background: linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}

.product-card:hover::before {
  opacity: 1;
}

/* Parallax container */
.parallax-bg {
  will-change: transform;
}

/* Performance optimizations */
.parallax-bg * {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

/* Smooth transitions for parallax */
.transform {
  transition: transform 0.1s ease-out;
}

/* Enhanced gradients */
.bg-gradient-to-br {
  background: linear-gradient(
    to bottom right,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.bg-gradient-to-t {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.6) 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.2) 100%
  );
}

/* Mobile optimizations - disable parallax on mobile */
@media (max-width: 768px) {
  .parallax-bg {
    transform: none !important;
  }
  
  .parallax-bg * {
    transform: none !important;
  }
}
</style>
