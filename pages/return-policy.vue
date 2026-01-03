
<template>
  <div>
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-12 text-center">
        <h1 class="text-3xl font-bold tracking-tight text-mgray-900">
          Politique de Retour
        </h1>
        <p class="mt-2 text-lg text-mgray-600">
          Tout savoir sur nos conditions de retour
        </p>
      </div>

      <!-- Content -->
      <div class="prose prose-lg prose-primary mx-auto">
        <div
          v-if="settings?.return_policy"
          v-html="settings.return_policy"
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
import { ref, onMounted } from "vue";
import { useSupabaseClient } from "#imports";

const config = useRuntimeConfig();
const user = config.public.user;
const supabase = useSupabaseClient();
const settings = ref(null);
const defaultData = ref({
  return_policy: `
  Nous acceptons les retours dans un délai de 30 jours suivant la réception de votre commande.
  Les articles doivent être retournés dans leur état d'origine, non utilisés et avec toutes les étiquettes attachées.
  Veuillez contacter notre service client pour initier une demande de retour.
  Les frais de retour sont à la charge du client, sauf en cas de produit défectueux ou erreur de notre part.
`,
});

// Fetch settings
const fetchSettings = async () => {
  try {
    let siteSettings;

    if (user) {
      const { data } = await supabase
        .from("website_settings")
        .select("key, value")
        .eq("user_id", user)
        .eq("key", "return_policy")
        .single();

      siteSettings = data;
    } else {
      siteSettings = { value: defaultData.value.return_policy };
    }

    if (siteSettings) {
      settings.value = { return_policy: siteSettings.value };
    }
  } catch (error) {
    console.error("Error fetching return policy:", error);
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