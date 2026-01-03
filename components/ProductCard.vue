<template>
  <NuxtLink
    :to="`/products/${product.slug}`"
    class="group relative block rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    :aria-label="product.name"
  >
    <!-- Media -->
    <div class="relative aspect-square bg-gray-100 overflow-hidden">
      <!-- Primary image -->
      <NuxtImg
        v-if="primaryImage"
        :src="primaryImage.url"
        :alt="primaryImage.alt_text || product.name"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
      />
      <!-- Secondary image (hover swap) -->
      <NuxtImg
        v-if="secondaryImage"
        :src="secondaryImage.url"
        :alt="secondaryImage.alt_text || product.name"
        class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        loading="lazy"
        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
      />

      <!-- Placeholder -->
      <div v-if="!primaryImage" class="absolute inset-0 w-full h-full flex items-center justify-center text-gray-400">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7l9-4 9 4m-18 0l9 4m-9-4v10l9 4m0-10l9-4m-9 4v10m9-14v10l-9 4"/>
        </svg>
      </div>

      <!-- Badges -->
      <div class="absolute top-3 left-3 flex gap-2">
        <span v-if="product.is_featured" class="px-2 py-1 rounded-full text-[10px] font-semibold bg-yellow-400 text-yellow-900 shadow">
          {{ $t('products.featured') }}
        </span>
      </div>
      <div class="absolute top-3 right-3">
        <span v-if="product.quantity === 0" class="px-2 py-1 rounded-full text-[10px] font-semibold bg-red-500 text-white shadow">
          {{ $t('products.outOfStock') }}
        </span>
        <span v-else-if="discountPercentage > 0" class="px-2 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow">
          -{{ discountPercentage }}%
        </span>
      </div>

      <!-- Hover overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>

    <!-- Info -->
    <div class="p-4">
      <p v-if="product.category?.name" class="text-[11px] tracking-wide text-gray-500 mb-1">
        {{ product.category.name }}
      </p>
      <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
        {{ product.name }}
      </h3>

      <div class="flex items-baseline gap-2">
        <span class="text-lg sm:text-xl font-bold text-purple-600">{{ formatPrice(product.price) }}</span>
        <span v-if="hasDiscount" class="text-xs text-gray-500 line-through">{{ formatPrice(product.compare_at_price) }}</span>
      </div>

      <div v-if="hasDiscount" class="mt-1">
        <span class="inline-block bg-green-100 text-green-700 text-[11px] font-semibold px-2 py-0.5 rounded">
          -{{ discountPercentage }}%
        </span>
      </div>
    </div>

    <!-- Bottom accent -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/60 to-transparent scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-500"></div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();

const primaryImage = computed(() => {
  return props.product.images?.find((img) => img.is_primary) || props.product.images?.[0];
});

const secondaryImage = computed(() => {
  if (!props.product.images || props.product.images.length < 2) return null;
  // Prefer the second image by position
  return props.product.images[1];
});

const hasDiscount = computed(() =>
  props.product.compare_at_price && props.product.compare_at_price > props.product.price
);

const discountPercentage = computed(() => {
  if (hasDiscount.value) {
    return Math.round(
      ((props.product.compare_at_price - props.product.price) / props.product.compare_at_price) * 100
    );
  }
  return 0;
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
  }).format(price);
};
</script>
