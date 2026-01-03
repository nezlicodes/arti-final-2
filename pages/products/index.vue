<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-20 overflow-hidden"
    >
      <!-- Animated Background -->
      <div class="absolute inset-0">
        <div
          class="absolute top-1/4 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-xl animate-pulse"
        ></div>
        <div
          class="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-xl animate-pulse"
          style="animation-delay: 1s"
        ></div>
        <div
          class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"
        ></div>
      </div>

      <div class="relative container mx-auto px-4 text-center">
        <div class="max-w-4xl mx-auto">
          <!-- Loading State -->
          <div v-if="heroLoading" class="space-y-4">
            <div
              class="h-16 bg-white/20 rounded w-3/4 mx-auto animate-pulse"
            ></div>
            <div
              class="h-6 bg-white/20 rounded w-1/2 mx-auto animate-pulse"
            ></div>
            <div class="flex justify-center items-center space-x-8 mt-8">
              <div class="h-12 w-16 bg-white/20 rounded animate-pulse"></div>
              <div class="h-12 w-16 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>

          <!-- Content -->
          <div v-else>
            <!-- Badge -->
            <div
              v-if="currentHeroContent.badge_text"
              class="inline-flex items-center px-4 py-2 mb-8 text-sm font-medium text-blue-300 bg-blue-500/10 backdrop-blur-sm rounded-full border border-blue-500/20"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              {{ currentHeroContent.badge_text }}
            </div>

            <h1
              class="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              {{ currentHeroContent.title }}
              <span
                class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                {{ currentHeroContent.highlight_text }}
              </span>
              <br v-if="currentHeroContent.subtitle" />
              {{ currentHeroContent.subtitle }}
            </h1>
            <p
              class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              {{ currentHeroContent.description }}
            </p>

            <!-- Stats -->
            <div
              class="flex justify-center items-center space-x-8 text-gray-300"
            >
              <div class="text-center">
                <p class="text-3xl font-bold text-white">
                  {{ products.length }}+
                </p>
                <p class="text-sm">
                  {{ currentHeroContent.stats?.products_label || "Produits" }}
                </p>
              </div>
              <div class="w-px h-12 bg-gray-600"></div>
              <div class="text-center">
                <p class="text-3xl font-bold text-white">
                  {{ categories.length }}+
                </p>
                <p class="text-sm">
                  {{
                    currentHeroContent.stats?.categories_label || "Catégories"
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <aside class="lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-lg border border-gray-200 sticky top-4">
            <!-- Filter Header -->
            <div
              class="p-4 border-b border-gray-200 flex items-center justify-between"
            >
              <h3 class="font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="ph:funnel" class="w-5 h-5" />
                Filters
              </h3>
              <button
                v-if="activeFiltersCount > 0"
                @click="clearAllFilters"
                class="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            </div>

            <div
              class="p-4 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              <!-- Search -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Search</label
                >
                <div class="relative">
                  <Icon
                    name="ph:magnifying-glass"
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  />
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search products..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <!-- Categories -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">
                  Categories
                </h4>
                <div class="space-y-2">
                  <label
                    v-for="category in categories"
                    :key="category.id"
                    class="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      v-model="selectedCategories"
                      :value="category.id"
                      class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      class="text-sm text-gray-700 group-hover:text-gray-900"
                    >
                      {{ getCategoryName(category) }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Price Range -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">
                  Price Range
                </h4>
                <div class="space-y-3">
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="block text-xs text-gray-600 mb-1"
                        >Min</label
                      >
                      <input
                        v-model.number="priceRange.min"
                        type="number"
                        placeholder="0"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1"
                        >Max</label
                      >
                      <input
                        v-model.number="priceRange.max"
                        type="number"
                        placeholder="10000"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div
                    class="flex items-center justify-between text-xs text-gray-500"
                  >
                    <span>{{ priceRange.min }} DZD</span>
                    <span>{{ priceRange.max }} DZD</span>
                  </div>
                </div>
              </div>

              <!-- Availability -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">
                  Availability
                </h4>
                <div class="space-y-2">
                  <label class="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      v-model="showInStockOnly"
                      class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      class="text-sm text-gray-700 group-hover:text-gray-900"
                      >In Stock</span
                    >
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      v-model="showOnSaleOnly"
                      class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      class="text-sm text-gray-700 group-hover:text-gray-900"
                      >On Sale</span
                    >
                  </label>
                </div>
              </div>

              <!-- Special Filters -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">Special</h4>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="filter in quickFilters"
                    :key="filter.id"
                    @click="toggleQuickFilter(filter)"
                    class="px-3 py-1.5 text-xs font-medium rounded-full transition-all"
                    :class="
                      filter.active
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    "
                  >
                    {{ filter.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Products Section -->
        <main class="flex-1 min-w-0">
          <!-- Toolbar -->
          <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <!-- Results Count -->
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <span class="font-medium text-gray-900">{{
                  filteredProducts.length
                }}</span>
                {{
                  filteredProducts.length === 1 ? "product" : "products"
                }}
                found
              </div>

              <!-- Sort & View Options -->
              <div class="flex items-center gap-3">
                <select
                  v-model="sortBy"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                >
                  <option value="newest">Newest</option>
                  <option value="name_asc">Name: A-Z</option>
                  <option value="name_desc">Name: Z-A</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>

                <div
                  class="hidden sm:flex items-center gap-1 border border-gray-300 rounded-lg p-1"
                >
                  <button
                    @click="viewMode = 'grid'"
                    :class="
                      viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    "
                    class="p-2 rounded transition-colors"
                  >
                    <Icon name="ph:grid-four" class="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    @click="viewMode = 'list'"
                    :class="
                      viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    "
                    class="p-2 rounded transition-colors"
                  >
                    <Icon name="ph:list" class="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Active Filters Pills -->
            <div
              v-if="activeFiltersList.length > 0"
              class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200"
            >
              <div
                v-for="(filter, index) in activeFiltersList"
                :key="index"
                class="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
              >
                <span>{{ filter }}</span>
                <button
                  @click="removeFilter(filter)"
                  class="hover:text-blue-900"
                >
                  <Icon name="ph:x" class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div
            v-if="loading || dataLoading"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <div v-for="i in 12" :key="i" class="animate-pulse">
              <div
                class="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div class="aspect-square bg-gray-200"></div>
                <div class="p-4 space-y-3">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div class="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div v-else-if="filteredProducts.length > 0">
            <!-- Grid View -->
            <div
              v-if="viewMode === 'grid'"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <div
                v-for="product in paginatedProducts"
                :key="product.id"
                class="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <!-- Image -->
                <div class="relative aspect-square overflow-hidden bg-gray-100">
                  <NuxtLink :to="`/products/${product.slug}`" class="block">
                    <img
                      :src="
                        getPrimaryImageUrl(product) ||
                        '/images/placeholders/placeholder-product.svg'
                      "
                      :alt="getProductName(product)"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </NuxtLink>

                  <!-- Sale Badge -->
                  <div
                    v-if="
                      product.sale_price && product.sale_price < product.price
                    "
                    class="absolute top-3 left-3"
                  >
                    <span
                      class="inline-block bg-red-600 text-white text-xs font-bold px-2 py-1 rounded"
                    >
                      SALE
                    </span>
                  </div>

                  <!-- Stock Badge -->
                  <div
                    v-if="getStockQuantity(product) <= 0"
                    class="absolute top-3 right-3"
                  >
                    <span
                      class="inline-block bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded"
                    >
                      OUT OF STOCK
                    </span>
                  </div>

                  <!-- Quick Actions -->
                  <div
                    class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <button
                      class="w-full bg-white hover:bg-gray-900 text-gray-900 hover:text-white font-semibold py-3 rounded-lg transition-colors duration-300 shadow-lg"
                      :disabled="getStockQuantity(product) <= 0"
                      @click.stop="addToCart(product)"
                    >
                      <Icon
                        name="ph:shopping-cart-simple"
                        class="w-4 h-4 inline mr-2"
                      />
                      {{
                        getStockQuantity(product) > 0
                          ? "Add to Cart"
                          : "Out of Stock"
                      }}
                    </button>
                  </div>

                  <!-- Wishlist Button -->
                  <button
                    class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50"
                  >
                    <Icon
                      name="ph:heart"
                      class="w-5 h-5 text-gray-700 hover:text-red-500"
                    />
                  </button>
                </div>

                <!-- Product Info -->
                <div class="p-4">
                  <div class="mb-2">
                    <p
                      class="text-xs text-gray-500 uppercase tracking-wide mb-1"
                    >
                      {{ getCategoryName(product.category) }}
                    </p>
                    <h3
                      class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2"
                    >
                      <NuxtLink :to="`/products/${product.slug}`">
                        {{ getProductName(product) }}
                      </NuxtLink>
                    </h3>
                  </div>

                  <!-- Rating (placeholder) -->
                  <div class="flex items-center gap-1 mb-2">
                    <div class="flex">
                      <Icon
                        v-for="i in 5"
                        :key="i"
                        name="ph:star-fill"
                        class="w-3 h-3 text-yellow-400"
                      />
                    </div>
                    <span class="text-xs text-gray-500">(24)</span>
                  </div>

                  <!-- Price -->
                  <div class="flex items-baseline gap-2">
                    <span class="text-lg font-bold text-gray-900">
                      {{ formatPrice(product.sale_price || product.price) }}
                    </span>
                    <span
                      v-if="
                        product.sale_price && product.sale_price < product.price
                      "
                      class="text-sm text-gray-500 line-through"
                    >
                      {{ formatPrice(product.price) }}
                    </span>
                  </div>

                  <!-- Stock Indicator -->
                  <div class="mt-3 flex items-center gap-1.5">
                    <div
                      class="w-2 h-2 rounded-full"
                      :class="
                        getStockQuantity(product) > 0
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      "
                    ></div>
                    <span
                      class="text-xs font-medium"
                      :class="
                        getStockQuantity(product) > 0
                          ? 'text-green-700'
                          : 'text-red-700'
                      "
                    >
                      {{
                        getStockQuantity(product) > 0
                          ? "In Stock"
                          : "Out of Stock"
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- List View -->
            <div v-else class="space-y-4">
              <div
                v-for="product in paginatedProducts"
                :key="product.id"
                class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div class="flex flex-col sm:flex-row">
                  <!-- Image -->
                  <div
                    class="sm:w-48 aspect-square sm:aspect-auto flex-shrink-0 bg-gray-100"
                  >
                    <img
                      :src="
                        getPrimaryImageUrl(product) ||
                        '/images/placeholders/placeholder-product.svg'
                      "
                      :alt="getProductName(product)"
                      class="w-full h-full object-cover"
                    />
                  </div>

                  <!-- Info -->
                  <div class="flex-1 p-6">
                    <div class="flex justify-between items-start">
                      <div class="flex-1">
                        <p
                          class="text-xs text-gray-500 uppercase tracking-wide mb-1"
                        >
                          {{ getCategoryName(product.category) }}
                        </p>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">
                          {{ getProductName(product) }}
                        </h3>

                        <!-- Rating -->
                        <div class="flex items-center gap-2 mb-3">
                          <div class="flex">
                            <Icon
                              v-for="i in 5"
                              :key="i"
                              name="ph:star-fill"
                              class="w-4 h-4 text-yellow-400"
                            />
                          </div>
                          <span class="text-sm text-gray-500"
                            >(24 reviews)</span
                          >
                        </div>

                        <!-- Description (truncated) -->
                        <p class="text-sm text-gray-600 mb-4 line-clamp-2">
                          High-quality product with premium features and
                          excellent performance.
                        </p>

                        <!-- Stock & Price -->
                        <div class="flex items-center gap-4">
                          <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-bold text-gray-900">
                              {{
                                formatPrice(product.sale_price || product.price)
                              }}
                            </span>
                            <span
                              v-if="
                                product.sale_price &&
                                product.sale_price < product.price
                              "
                              class="text-sm text-gray-500 line-through"
                            >
                              {{ formatPrice(product.price) }}
                            </span>
                          </div>

                          <div class="flex items-center gap-1.5">
                            <div
                              class="w-2 h-2 rounded-full"
                              :class="
                                getStockQuantity(product) > 0
                                  ? 'bg-green-500'
                                  : 'bg-red-500'
                              "
                            ></div>
                            <span
                              class="text-sm font-medium"
                              :class="
                                getStockQuantity(product) > 0
                                  ? 'text-green-700'
                                  : 'text-red-700'
                              "
                            >
                              {{
                                getStockQuantity(product) > 0
                                  ? "In Stock"
                                  : "Out of Stock"
                              }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- Actions -->
                      <div class="flex flex-col gap-2 ml-4">
                        <button
                          class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Icon
                            name="ph:heart"
                            class="w-5 h-5 text-gray-600 hover:text-red-500"
                          />
                        </button>
                        <button
                          class="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
                          :disabled="getStockQuantity(product) <= 0"
                        >
                          <Icon
                            name="ph:shopping-cart-simple"
                            class="w-4 h-4 inline mr-2"
                          />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-8 flex justify-center">
              <nav class="flex items-center gap-2">
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <Icon name="ph:caret-left" class="w-4 h-4" />
                </button>

                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :class="
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  "
                  class="px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {{ page }}
                </button>

                <button
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <Icon name="ph:caret-right" class="w-4 h-4" />
                </button>
              </nav>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="bg-white rounded-lg border border-gray-200 p-12 text-center"
          >
            <div class="max-w-md mx-auto">
              <div
                class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Icon
                  name="ph:magnifying-glass"
                  class="w-10 h-10 text-gray-400"
                />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">
                No products found
              </h3>
              <p class="text-gray-600 mb-6">
                We couldn't find any products matching your filters. Try
                adjusting your search or filters.
              </p>
              <button
                @click="clearAllFilters"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
// Helpers
const getPrimaryImageUrl = (product) => {
  const imgs = product?.images || [];
  if (Array.isArray(imgs) && imgs.length) {
    const primary = imgs.find((i) => i?.is_primary) || imgs[0];
    return primary?.url || null;
  }
  return product?.image_url || null;
};

const getStockQuantity = (product) => {
  if (typeof product?.stock_quantity === "number")
    return product.stock_quantity;
  if (typeof product?.quantity === "number") return product.quantity;
  return 0;
};

const formatPrice = (price) => {
  return `${price?.toLocaleString()} DZD`;
};

const { fetchSection } = useContentSections();
const { locale } = useI18n();
const supabase = useSupabaseClient();

// Current locale
const currentLocale = computed(() => locale.value);

// Default hero content
const defaultHeroContent = {
  title: "Shop All",
  highlight_text: "Products",
  description:
    "Discover our complete collection of premium products. Quality, innovation and style combined in every item.",
  badge_text: "Complete Collection",
};

// State
const heroLoading = ref(true);
const loading = ref(false);
const dataLoading = ref(true);
const viewMode = ref("grid");
const currentPage = ref(1);
const itemsPerPage = ref(12);

const heroData = ref({
  is_active: true,
  content_translations: {
    fr: { ...defaultHeroContent },
    ar: { ...defaultHeroContent },
    en: { ...defaultHeroContent },
  },
});

// Search and filters
const searchQuery = ref("");
const sortBy = ref("newest");
const selectedCategories = ref([]);
const priceRange = ref({ min: 0, max: 10000 });
const showInStockOnly = ref(false);
const showOnSaleOnly = ref(false);

// Quick filters
const quickFilters = ref([
  { id: "sale", label: "On Sale", active: false },
  { id: "new", label: "New", active: false },
  { id: "popular", label: "Popular", active: false },
  { id: "premium", label: "Premium", active: false },
]);

// Backend data
const categories = ref([]);
const products = ref([]);

// Computed
const currentHeroContent = computed(() => {
  const content = heroData.value.content_translations?.[currentLocale.value];
  return content || defaultHeroContent;
});

// Helper functions
const getCategoryName = (category) => {
  if (!category?.name_translations) return category?.name || "";
  return (
    category.name_translations[currentLocale.value] ||
    category.name_translations.fr ||
    category.name_translations.en ||
    category.name ||
    ""
  );
};

const getProductName = (product) => {
  if (!product?.name_translations) return product?.name || "";
  return (
    product.name_translations[currentLocale.value] ||
    product.name_translations.fr ||
    product.name_translations.en ||
    product.name ||
    ""
  );
};

// Filtered products
const filteredProducts = computed(() => {
  let filtered = [...products.value];

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter((p) => {
      const productName = getProductName(p).toLowerCase();
      const categoryName = getCategoryName(p.category || {}).toLowerCase();
      const searchTerm = searchQuery.value.toLowerCase();

      return (
        productName.includes(searchTerm) || categoryName.includes(searchTerm)
      );
    });
  }

  // Category filter
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter((p) =>
      selectedCategories.value.includes(p.category_id)
    );
  }

  // Price filter
  filtered = filtered.filter((p) => {
    const price = p.sale_price || p.price || 0;
    return price >= priceRange.value.min && price <= priceRange.value.max;
  });

  // Availability filters
  if (showInStockOnly.value) {
    filtered = filtered.filter((p) => getStockQuantity(p) > 0);
  }

  if (showOnSaleOnly.value) {
    filtered = filtered.filter((p) => p.sale_price && p.sale_price < p.price);
  }

  // Quick filters
  quickFilters.value.forEach((filter) => {
    if (filter.active) {
      switch (filter.id) {
        case "sale":
          filtered = filtered.filter(
            (p) => p.sale_price && p.sale_price < p.price
          );
          break;
        case "new":
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          filtered = filtered.filter((p) => {
            const createdDate = new Date(p.created_at);
            return createdDate >= thirtyDaysAgo;
          });
          break;
        case "popular":
          filtered = filtered.filter((p) => p.is_featured);
          break;
        case "premium":
          filtered = filtered.filter((p) => (p.sale_price || p.price) >= 1000);
          break;
      }
    }
  });

  // Sort products
  switch (sortBy.value) {
    case "name_asc":
      filtered.sort((a, b) =>
        getProductName(a).localeCompare(getProductName(b))
      );
      break;
    case "name_desc":
      filtered.sort((a, b) =>
        getProductName(b).localeCompare(getProductName(a))
      );
      break;
    case "price_low":
      filtered.sort(
        (a, b) => (a.sale_price || a.price) - (b.sale_price || b.price)
      );
      break;
    case "price_high":
      filtered.sort(
        (a, b) => (b.sale_price || b.price) - (a.sale_price || a.price)
      );
      break;
    default: // newest
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return filtered;
});

// Pagination
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage.value)
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProducts.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Active filters
const activeFiltersCount = computed(() => {
  let count = 0;
  if (selectedCategories.value.length > 0)
    count += selectedCategories.value.length;
  if (priceRange.value.min > 0 || priceRange.value.max < 10000) count += 1;
  if (showInStockOnly.value) count += 1;
  if (showOnSaleOnly.value) count += 1;
  count += quickFilters.value.filter((f) => f.active).length;
  return count;
});

const activeFiltersList = computed(() => {
  const filters = [];
  quickFilters.value.forEach((f) => {
    if (f.active) filters.push(f.label);
  });
  if (showInStockOnly.value) filters.push("In Stock");
  if (showOnSaleOnly.value) filters.push("On Sale");
  selectedCategories.value.forEach((catId) => {
    const cat = categories.value.find((c) => c.id === catId);
    if (cat) filters.push(getCategoryName(cat));
  });
  return filters;
});

// Methods
const toggleQuickFilter = (filter) => {
  filter.active = !filter.active;
  currentPage.value = 1;
};

const removeFilter = (filterName) => {
  // Remove quick filters
  const quickFilter = quickFilters.value.find((f) => f.label === filterName);
  if (quickFilter) {
    quickFilter.active = false;
    return;
  }

  // Remove availability filters
  if (filterName === "In Stock") showInStockOnly.value = false;
  if (filterName === "On Sale") showOnSaleOnly.value = false;

  // Remove category filter
  const category = categories.value.find(
    (c) => getCategoryName(c) === filterName
  );
  if (category) {
    selectedCategories.value = selectedCategories.value.filter(
      (id) => id !== category.id
    );
  }
};

const clearAllFilters = () => {
  searchQuery.value = "";
  selectedCategories.value = [];
  priceRange.value = { min: 0, max: 10000 };
  showInStockOnly.value = false;
  showOnSaleOnly.value = false;
  quickFilters.value.forEach((f) => (f.active = false));
  sortBy.value = "newest";
  currentPage.value = 1;
};

// Load data
const loadHeroData = async () => {
  heroLoading.value = true;
  try {
    const { data, error } = await fetchSection("products_hero");
    if (error) throw error;
    if (data) heroData.value = data;
  } catch (error) {
    console.error("Error loading products hero data:", error);
  } finally {
    heroLoading.value = false;
  }
};

const loadCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name_translations, slug, is_active, display_order")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    if (data) categories.value = data;
  } catch (error) {
    console.error("Error loading categories:", error);
  }
};

const loadProducts = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(id, name_translations, slug),
        images:product_images(id, url, is_primary)
      `
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (data) products.value = data;
  } catch (error) {
    console.error("Error loading products:", error);
  }
};

const loadData = async () => {
  dataLoading.value = true;
  try {
    await Promise.all([loadCategories(), loadProducts()]);
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    dataLoading.value = false;
  }
};

// Watch for filter changes to reset page
watch(
  [
    searchQuery,
    selectedCategories,
    priceRange,
    showInStockOnly,
    showOnSaleOnly,
    sortBy,
  ],
  () => {
    currentPage.value = 1;
  }
);

// Initialize
onMounted(async () => {
  await Promise.all([loadHeroData(), loadData()]);
});

// SEO
useHead({
  title: "All Products - Premium Shop",
  meta: [
    {
      name: "description",
      content:
        "Discover our complete collection of premium products. Quality, innovation and style combined in every item.",
    },
  ],
});
// Add to cart: add simple item to localStorage cart
const addToCart = (product) => {
  if (!product) return
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const item = {
    id: product.id,
    is_variant: false,
    name: getProductName(product),
    slug: product.slug,
    price: Number(product.sale_price || product.price) || 0,
    quantity: 1,
    image: getPrimaryImageUrl(product),
  }
  const existingIdx = cart.findIndex(p => p.id === item.id && !p.is_variant)
  if (existingIdx !== -1) {
    cart[existingIdx].quantity += 1
  } else {
    cart.push(item)
  }
  localStorage.setItem('cart', JSON.stringify(cart))
}

</script>

<style scoped>
/* Custom scrollbar for filters */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: #f1f5f9;
}

aside::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, transform, opacity;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Line clamp utilities */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>