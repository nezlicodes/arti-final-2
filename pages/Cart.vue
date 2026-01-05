<template>
  <div>
    <div class="x-container pt-8 pb-16">
      <div class="mb-8">
        <div class="x-eyebrow">{{ $t('cart.title') }}</div>
        <h1 class="mt-4 x-title">{{ $t('cart.title') }}</h1>
        <p class="x-subtitle">{{ $t('cart.startAdding') }}</p>
        <div class="x-divider"></div>
      </div>

      <h1 class="sr-only">
        {{ $t('cart.title') }}
      </h1>

      <div v-if="!cartItems.length" class="mt-10">
        <div class="x-surface-strong p-8 sm:p-10 text-center">
          <svg
          class="mx-auto h-12 w-12 text-mgray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-mgray-900">
          {{ $t('cart.empty') }}
        </h3>
        <p class="mt-1 text-sm text-mgray-500">
          {{ $t('cart.startAdding') }}
        </p>
        <div class="mt-8 flex items-center justify-center">
          <NuxtLink to="/products" class="x-btn-primary">
            {{ $t('cart.continueShopping') }}
          </NuxtLink>
        </div>
        </div>
      </div>

      <div v-else class="mt-10">
        <div
          class="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
        >
          <!-- Articles du panier -->
          <section aria-labelledby="cart-heading" class="lg:col-span-7">
            <h2 id="cart-heading" class="sr-only">
              {{ $t('cart.itemsInCart') }}
            </h2>

            <ul
              role="list"
              class="divide-y divide-mgray-200"
            >
              <li
                v-for="item in cartItems"
                :key="item.id"
                class="flex gap-4 sm:gap-6 py-6 sm:py-7"
              >
                <div class="flex-shrink-0">
                  <NuxtImg
                    :src="item.image || '/images/placeholders/placeholder-product.svg'"
                    :alt="item.name"
                    class="h-24 w-24 rounded-2xl object-cover object-center sm:h-32 sm:w-32 border border-mgray-200 bg-white"
                  />
                </div>

                <div class="flex flex-1 flex-col">
                  <div>
                    <div class="flex justify-between">
                      <div>
                        <h3 class="text-sm">
                          <NuxtLink
                            :to="'/products/' + item.slug"
                            class="font-semibold text-mgray-950 hover:text-primary transition-colors"
                          >
                            {{ item.name }}
                          </NuxtLink>
                        </h3>
                        <!-- Affichage des options de variante -->
                        <div v-if="item.is_variant" class="mt-1">
                          <div v-if="item.variant_name" class="text-sm text-mgray-500">
                            {{ formatVariantName(item) }}
                          </div>
                          <div v-if="item.options" class="mt-1 flex flex-wrap gap-1">
                            <span 
                              v-for="(value, name) in item.options" 
                              :key="name"
                              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-mgray-100 text-mgray-800"
                            >
                              {{ name }}: {{ value }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p class="ml-4 text-sm font-semibold text-mgray-950">
                        {{ formatCurrency(item.price * item.quantity) }}
                      </p>
                    </div>
                    <p class="mt-1 text-sm text-mgray-600">
                      {{ formatCurrency(item.price) }} {{ $t('cart.unitPrice') }}
                    </p>
                  </div>

                  <div class="mt-4 flex flex-1 items-end justify-between">
                    <div class="flex items-center space-x-2">
                      <label :for="'quantity-' + item.id" class="sr-only">{{ $t('cart.quantity') }}</label>
                      <button
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        class="w-10 h-10 rounded-xl border border-mgray-200 bg-white text-mgray-800 hover:bg-mgray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        :disabled="item.quantity <= 1"
                      >
                        -
                      </button>
                      <input
                        :id="'quantity-' + item.id"
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        class="w-16 rounded-xl border-mgray-300 text-center text-sm bg-white"
                        @change="updateQuantity(item.id, item.quantity)"
                      />
                      <button
                        @click="updateQuantity(item.id, item.quantity + 1)"
                        class="w-10 h-10 rounded-xl border border-mgray-200 bg-white text-mgray-800 hover:bg-mgray-50"
                      >
                        +
                      </button>
                    </div>
                    <button
                      @click="removeItem(item.id, item.is_variant)"
                      class="text-sm font-medium text-primary hover:opacity-80"
                    >
                      <span>{{ $t('cart.remove') }}</span>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </section>

          <!-- Récapitulatif de la commande -->
          <section
            aria-labelledby="summary-heading"
            class="mt-10 lg:col-span-5 lg:mt-0"
          >
            <div class="x-surface-strong p-5 sm:p-6 lg:p-8 sticky top-24" >
            <h2 id="summary-heading" class="text-lg font-semibold text-mgray-950">
              {{ $t('cart.orderSummary') }}
            </h2>

            <dl class="mt-6 space-y-4">
              <div class="flex items-center justify-between">
                <dt class="text-sm text-mgray-600">{{ $t('cart.subtotal') }}</dt>
                <dd class="text-sm font-medium text-mgray-900">
                  {{ subtotal.toFixed(2) }} DZD
                </dd>
              </div>
              <div
                class="flex items-center justify-between border-t border-mgray-200 pt-4"
              >
                <dt class="text-base font-medium text-mgray-900">{{ $t('cart.total') }}</dt>
                <dd class="text-base font-medium text-mgray-900">
                  {{ subtotal.toFixed(2) }} DZD
                </dd>
              </div>
            </dl>

            <div class="mt-6">
              <button
                type="button"
                class="x-btn-primary w-full"
                @click="proceedToCheckout"
              >
                {{ $t('cart.proceedToCheckout') }}
              </button>
            </div>

            <div class="mt-5 text-center text-sm text-mgray-600">
              <p>
                {{ $t('cart.or') }}
                <NuxtLink
                  to="/products"
                  class="font-medium text-primary hover:opacity-80"
                >
                  {{ $t('cart.continueShopping') }}
                  <span aria-hidden="true"> →</span>
                </NuxtLink>
              </p>
            </div>
          </div>
          </section>
        </div>

        <!-- Bouton vider le panier -->
        <div class="mt-8">
          <button
            type="button"
            class="text-sm font-semibold text-red-600 hover:text-red-500"
            @click="clearCart"
          >
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from 'vue-i18n';
import { useTranslation } from '~/composables/useTranslation';
import { useRouter } from "vue-router";

const { showConfirmation } = useConfirmationModal();
const { t } = useI18n();
const { formatCurrency } = useTranslation();

const router = useRouter();
const cartItems = ref([]);

// Calculer le sous-total
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});

// Formater le nom de la variante pour l'affichage
const formatVariantName = (item) => {
  if (!item.options) return item.variant_name || '';
  
  return Object.values(item.options).join(' / ');
};

// Charger le panier depuis localStorage
const loadCart = () => {
  if (process.client) {
    const cart = localStorage.getItem("cart");
    cartItems.value = cart ? JSON.parse(cart) : [];
  }
};

// Mettre à jour le panier dans localStorage
const updateLocalStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cartItems.value));
};

// Mettre à jour la quantité
const updateQuantity = (itemId, newQuantity) => {
  if (newQuantity < 1) return;

  const item = cartItems.value.find((item) => item.id === itemId);
  if (item) {
    item.quantity = newQuantity;
    updateLocalStorage();
  }
};

// Supprimer un article
const removeItem = (itemId, isVariant) => {
  cartItems.value = cartItems.value.filter((item) => {
    // Pour les variantes, vérifier id et is_variant
    if (isVariant) {
      return !(item.id === itemId && item.is_variant);
    }
    // Pour les produits simples, vérifier seulement id
    return item.id !== itemId;
  });
  updateLocalStorage();
};

// Vider le panier
const clearCart = () => {
  showConfirmation({
    title: t('cart.clearCart'),
    message: t('cart.clearCartMessage'),
    confirmText: t('cart.clearCartConfirm'),
    cancelText: t('common.cancel'),
    onConfirm: async () => {
      cartItems.value = [];
      updateLocalStorage();
    },
  });
};

// Passer à la commande
const proceedToCheckout = () => {
  // Sauvegarder l'état du panier si nécessaire
  router.push("/checkout");
};

// Initialisation
onMounted(() => {
  loadCart();
});

useHead({
  title: t('cart.title'),
  meta: [
    {
      name: "description",
      content: t('cart.metaDescription'),
    },
  ],
});

definePageMeta({
  pageTransition: {
    name: "page",
  },
});
</script>