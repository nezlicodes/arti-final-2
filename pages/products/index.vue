<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <section class="relative overflow-hidden text-white">
      <!-- Premium hero background using existing theme tokens -->
      <div class="absolute inset-0 bg-gradient-to-br from-mgray-950 via-mgray-950 to-black"></div>
      <div class="absolute inset-0 opacity-[0.16] x-grid-bg"></div>
      <div class="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(var(--primary-color),0.35),transparent_55%),radial-gradient(900px_500px_at_90%_20%,rgba(var(--secondary-color),0.22),transparent_60%),linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.75))]"></div>
      <div class="relative x-container py-16 sm:py-20">
        <!-- Animated Background (kept subtle) -->
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute top-1/4 left-10 w-72 h-72 bg-primary/15 rounded-full blur-2xl animate-pulse"></div>
          <div class="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-2xl animate-pulse" style="animation-delay: 1s"></div>
          <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </div>

        <div class="relative max-w-5xl mx-auto text-center">
          <!-- Loading State -->
          <div v-if="heroLoading" class="space-y-4">
            <div class="h-16 bg-white/20 rounded w-3/4 mx-auto animate-pulse"></div>
            <div class="h-6 bg-white/20 rounded w-1/2 mx-auto animate-pulse"></div>
            <div class="flex justify-center items-center space-x-8 mt-8">
              <div class="h-12 w-16 bg-white/20 rounded animate-pulse"></div>
              <div class="h-12 w-16 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>

          <!-- Content -->
          <div v-else>
            <!-- Badge -->
            <div v-if="currentHeroContent.badge_text" class="x-eyebrow bg-white/10 border-white/20 text-white/90 mb-8">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              {{ currentHeroContent.badge_text }}
            </div>

            <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]" style="text-shadow: 0 16px 50px rgba(0,0,0,.45);">
              {{ currentHeroContent.title }}
              <span class="text-primary">{{ currentHeroContent.highlight_text }}</span>
              <br v-if="currentHeroContent.subtitle" />
              {{ currentHeroContent.subtitle }}
            </h1>
            <p class="text-base sm:text-lg md:text-2xl text-white/85 mb-10 max-w-3xl mx-auto leading-relaxed">
              {{ currentHeroContent.description }}
            </p>

            <!-- Stats -->
            <div class="mt-10 grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto">
              <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4">
                <p class="text-3xl font-bold text-white">{{ products.length }}+</p>
                <p class="mt-1 text-xs sm:text-sm text-white/70">
                  {{ currentHeroContent.stats?.products_label || "Produits" }}
                </p>
              </div>

              <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4">
                <p class="text-3xl font-bold text-white">{{ categories.length }}+</p>
                <p class="mt-1 text-xs sm:text-sm text-white/70">
                  {{ currentHeroContent.stats?.categories_label || "Catégories" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Main Content -->
    <section class="x-section">
      <div class="x-container">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <aside class="lg:w-72 flex-shrink-0">
          <div class="x-surface-strong sticky top-4">
            <!-- Filter Header -->
            <div
              class="p-5 border-b border-mgray-200 flex items-center justify-between"
            >
              <h3 class="font-semibold text-mgray-950 flex items-center gap-2">
                <Icon name="ph:funnel" class="w-5 h-5" />
                Filters
              </h3>
              <button
                v-if="activeFiltersCount > 0"
                @click="clearAllFilters"
                class="text-sm text-primary hover:opacity-80 font-semibold"
              >
                Clear all
              </button>
            </div>

            <div
              class="p-5 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto filters-scroll"
            >
              <!-- Search -->
              <div>
                <label class="block text-xs font-semibold tracking-wide text-mgray-700 mb-2 uppercase">Search</label>
                <div class="relative">
                  <Icon
                    name="ph:magnifying-glass"
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  />
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search products..."
                    class="w-full pl-10 pr-4 py-2.5 border border-mgray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white/80 shadow-sm"
                  />
                </div>
              </div>

              <!-- Categories -->
              <div>
                <h4 class="text-xs font-semibold tracking-wide text-mgray-800 mb-3 uppercase">Categories</h4>
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
                      class="w-4 h-4 rounded border-mgray-300 text-primary focus:ring-primary/30"
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
                <h4 class="text-xs font-semibold tracking-wide text-mgray-800 mb-3 uppercase">Price range</h4>
                <div class="space-y-3">
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="block text-[11px] font-semibold text-mgray-600 mb-1 uppercase tracking-wide">Min</label>
                      <input
                        v-model.number="priceRange.min"
                        type="number"
                        placeholder="0"
                        class="w-full px-3 py-2.5 text-sm border border-mgray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/70"
                      />
                    </div>
                    <div>
                      <label class="block text-[11px] font-semibold text-mgray-600 mb-1 uppercase tracking-wide">Max</label>
                      <input
                        v-model.number="priceRange.max"
                        type="number"
                        placeholder="10000"
                        class="w-full px-3 py-2.5 text-sm border border-mgray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/70"
                      />
                    </div>
                  </div>
                  <div
                    class="flex items-center justify-between text-xs text-mgray-600"
                  >
                    <span>{{ priceRange.min }} DZD</span>
                    <span>{{ priceRange.max }} DZD</span>
                  </div>
                </div>
              </div>

              <!-- Availability -->
              <div>
                <h4 class="text-xs font-semibold tracking-wide text-mgray-800 mb-3 uppercase">Availability</h4>
                <div class="space-y-2">
                  <label class="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      v-model="showInStockOnly"
                      class="w-4 h-4 rounded border-mgray-300 text-primary focus:ring-primary/30"
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
                      class="w-4 h-4 rounded border-mgray-300 text-primary focus:ring-primary/30"
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
                <h4 class="text-xs font-semibold tracking-wide text-mgray-800 mb-3 uppercase">Special</h4>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="filter in quickFilters"
                    :key="filter.id"
                    @click="toggleQuickFilter(filter)"
                    class="px-3 py-1.5 text-xs font-medium rounded-full transition-all"
                    :class="
                      filter.active
                        ? 'bg-primary text-contrast1'
                        : 'bg-mgray-100 text-mgray-800 hover:bg-mgray-200'
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
          <div class="x-surface p-4 sm:p-5 mb-6 sticky top-4 z-10">
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <!-- Results Count -->
              <div class="flex items-center gap-2 text-sm text-mgray-700">
                <span class="inline-flex items-center gap-2 rounded-full border border-mgray-200 bg-white/70 px-3 py-1 backdrop-blur">
                <span class="font-semibold text-mgray-950">{{
                  filteredProducts.length
                }}</span>
                {{
                  filteredProducts.length === 1 ? "product" : "products"
                }}
                found
                  </span>
              </div>

              <!-- Sort & View Options -->
              <div class="flex items-center gap-3">
                <select
                  v-model="sortBy"
                  class="px-4 py-2.5 border border-mgray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold bg-white/80 shadow-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="name_asc">Name: A-Z</option>
                  <option value="name_desc">Name: Z-A</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>

                <div class="hidden sm:flex items-center gap-1 border border-mgray-200 rounded-full p-1 bg-white/70 backdrop-blur shadow-sm">
                  <button
                    @click="viewMode = 'grid'"
                    :class="
                      viewMode === 'grid' ? 'bg-mgray-100' : 'hover:bg-white'
                    "
                    class="p-2 rounded transition-colors"
                  >
                    <Icon name="ph:grid-four" class="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    @click="viewMode = 'list'"
                    :class="
                      viewMode === 'list' ? 'bg-mgray-100' : 'hover:bg-white'
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
              class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-mgray-200"
            >
              <div
                v-for="(filter, index) in activeFiltersList"
                :key="index"
                class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                <span>{{ filter }}</span>
                <button
                  @click="removeFilter(filter)"
                  class="hover:opacity-80"
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
                class="group x-surface-strong overflow-hidden hover:border-mgray-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <!-- Image -->
                <div class="relative aspect-square overflow-hidden bg-mgray-50">
                  <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(900px_400px_at_50%_0%,rgba(var(--primary-color),0.18),transparent_60%)]"></div>
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

                  <!-- Badges + Wishlist (avoid overlap) -->
                  <div class="absolute top-3 left-3 flex flex-col items-start gap-2">
                    <span
                      v-if="product.sale_price && product.sale_price < product.price"
                      class="inline-flex items-center gap-1 rounded-full bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 shadow"
                    >
                      <Icon name="ph:tag" class="w-3.5 h-3.5" />
                      SALE
                    </span>

                    <span
                      v-if="getStockQuantity(product) <= 0"
                      class="inline-flex items-center gap-1 rounded-full bg-mgray-950 text-white text-[11px] font-bold px-2.5 py-1 shadow"
                    >
                      OUT OF STOCK
                    </span>
                  </div>

                  <button
                    class="absolute top-3 right-3 w-9 h-9 bg-white/85 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition"
                    aria-label="Add to wishlist"
                    @click.prevent
                  >
                    <Icon name="ph:heart" class="w-5 h-5 text-mgray-800 hover:text-red-500" />
                  </button>

                  <!-- Quick Actions -->
                  <div
                    class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <button
                      class="w-full rounded-2xl bg-white/95 hover:bg-mgray-950 text-mgray-950 hover:text-white font-semibold py-3 transition-colors duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
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

                  <!-- Wishlist handled above -->
                </div>

                <!-- Product Info -->
                <div class="p-4">
                  <div class="mb-2">
                    <p class="text-[11px] text-mgray-600 uppercase tracking-wide mb-1">
                      {{ getCategoryName(product.category) }}
                    </p>
                    <h3 class="font-semibold text-mgray-950 group-hover:text-primary transition-colors line-clamp-2">
                      <NuxtLink :to="`/products/${product.slug}`">
                        {{ getProductName(product) }}
                      </NuxtLink>
                    </h3>
                  </div>

                  <!-- Rating (decorative placeholder) -->
                  <div class="flex items-center gap-1.5 mb-3">
                    <div class="flex">
                      <Icon v-for="i in 5" :key="i" name="ph:star-fill" class="w-3 h-3 text-yellow-400" />
                    </div>
                    <span class="text-[11px] text-mgray-500">(24)</span>
                  </div>

                  <!-- Price -->
                  <div class="flex items-baseline gap-2">
                    <span class="text-lg font-bold text-mgray-950">
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
                  <div class="mt-4 flex items-center justify-between gap-3">
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
                      class="text-xs font-semibold"
                      :class="getStockQuantity(product) > 0 ? 'text-green-700' : 'text-red-700'"
                    >
                      {{
                        getStockQuantity(product) > 0
                          ? "In Stock"
                          : "Out of Stock"
                      }}
                    </span>
                    </div>

                    <NuxtLink
                      :to="`/products/${product.slug}`"
                      class="text-xs font-semibold text-primary hover:opacity-80"
                    >
                      View
                    </NuxtLink>
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
                        <p class="text-sm text-mgray-700 mb-4 line-clamp-2">
                          {{ getProductDescription(product) || 'High-quality product with premium features and excellent performance.' }}
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
                          class="w-10 h-10 flex items-center justify-center border border-mgray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Icon
                            name="ph:heart"
                            class="w-5 h-5 text-gray-600 hover:text-red-500"
                          />
                        </button>
                        <button
                          class="px-6 py-3 bg-mgray-950 hover:brightness-95 text-white font-semibold rounded-2xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          :disabled="getStockQuantity(product) <= 0"
                          @click.stop="addToCart(product)"
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
              <nav class="inline-flex items-center gap-2 x-surface p-2 rounded-full backdrop-blur">
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="px-4 py-2 border border-mgray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mgray-100"
                >
                  <Icon name="ph:caret-left" class="w-4 h-4" />
                </button>

                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :class="
                    currentPage === page
                      ? 'bg-primary text-contrast1'
                      : 'border border-mgray-200 text-mgray-800 hover:bg-mgray-100'
                  "
                  class="px-4 py-2 rounded-full font-semibold transition-colors"
                >
                  {{ page }}
                </button>

                <button
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="px-4 py-2 border border-mgray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mgray-100"
                >
                  <Icon name="ph:caret-right" class="w-4 h-4" />
                </button>
              </nav>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="x-surface-strong p-12 text-center"
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
                class="x-btn-primary"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </main>
      </div>
      </div>
    </section>
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
  const value = Number(price || 0);
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    maximumFractionDigits: 0,
  }).format(value);
};

const { fetchSection } = useContentSections();
const { locale } = useI18n();
const { fetchProducts } = useProducts();
const { fetchCategories } = useCategories();

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
    product.name_translations.ar ||
    product.name ||
    ""
  );
};

const getProductDescription = (product) => {
  const t = product?.description_translations;
  if (t && typeof t === 'object') {
    return (
      t[currentLocale.value] ||
      t.en ||
      t.fr ||
      t.ar ||
      ""
    );
  }
  return product?.description || "";
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
    const data = await fetchCategories({ active: true });
    categories.value = data || [];
  } catch (error) {
    console.error("Error loading categories:", error);
  }
};

const loadProducts = async () => {
  try {
    const data = await fetchProducts({ active: true });
    products.value = data || [];
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
/* Custom scrollbar for the filters scroll container */
.filters-scroll::-webkit-scrollbar {
  width: 8px;
}

.filters-scroll::-webkit-scrollbar-track {
  background: rgba(var(--body-bg), 1);
  border-radius: 999px;
}

.filters-scroll::-webkit-scrollbar-thumb {
  background: rgba(var(--text-color), 0.22);
  border-radius: 999px;
}

.filters-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--text-color), 0.32);
}

/* Smooth transitions (scoped to avoid affecting every nested element) */
.x-surface,
.x-surface-strong,
button,
a,
input,
select {
  transition-property: color, background-color, border-color, transform, opacity, box-shadow, filter;
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