<!-- pages/shipping.vue -->
<template>
  <div>
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-12 text-center">
        <h1 class="text-3xl font-bold tracking-tight text-mgray-900">
          Politique de Livraison
        </h1>
        <p class="mt-2 text-lg text-mgray-600">
          Découvrez nos modalités de livraison
        </p>
      </div>

      <!-- Content -->
      <div class="prose prose-lg prose-primary mx-auto">
        <div
          v-if="settings?.shipping_policy"
          v-html="settings.shipping_policy"
        ></div>
        <div v-else class="animate-pulse">
          <div class="h-4 bg-mgray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-mgray-200 rounded w-1/2 mb-4"></div>
          <div class="h-4 bg-mgray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
</template>
    
    <script setup>
const config = useRuntimeConfig();
const user = config.public.user;
const supabase = useSupabaseClient();
const settings = ref(null);

const defaultShippingPolicy = `
  Nous expédions dans le monde entier. Les frais de livraison sont calculés en fonction du poids et de la destination de votre commande.
  Les commandes sont généralement expédiées dans les 2 jours ouvrables suivant la réception du paiement.
  Vous recevrez un e-mail de confirmation une fois que votre commande a été expédiée.
`;

// Fetch settings
const fetchSettings = async () => {
  try {
    let siteSettings;

    if (user) {
      const { data } = await supabase
        .from("website_settings")
        .select("key, value")
        .eq("user_id", user)
        .eq("key", "shipping_policy")
        .single();

      siteSettings = data;
    } else {
      siteSettings = { value: defaultShippingPolicy };
    }

    if (siteSettings) {
      settings.value = { shipping_policy: siteSettings.value };
    }
  } catch (error) {
    console.error("Error fetching shipping policy:", error);
  }
};

// Initialize
onMounted(fetchSettings);

definePageMeta({
  pageTransition: {
    name: "page",
  },
});
</script>