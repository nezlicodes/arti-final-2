<template>
  <div class="min-h-screen bg-[#f1f1f1]">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/admin/website"
              class="text-gray-400 hover:text-gray-600"
            >
              <Icon name="ph:arrow-left-bold" class="w-5 h-5" />
            </NuxtLink>
            <div>
              <h1 class="text-lg font-semibold text-gray-900">
                {{ $t("admin.policies.title") }}
              </h1>
              <p class="text-xs text-gray-500">
                {{ $t("admin.policies.subtitle") }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="openModal()"
              :disabled="isLoading"
              class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Icon name="ph:plus-bold" class="w-4 h-4" />
              {{ $t("admin.policies.addPolicy") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
      >
        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <div class="flex-1">
            <div class="relative">
              <Icon
                name="ph:magnifying-glass-bold"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('admin.policies.searchPlaceholder')"
                class="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div class="w-full sm:w-48">
            <select
              v-model="filterStatus"
              class="block w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            >
              <option value="">{{ $t("admin.policies.allStatuses") }}</option>
              <option value="true">{{ $t("admin.policies.active") }}</option>
              <option value="false">{{ $t("admin.policies.inactive") }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t("admin.policies.type") }}
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t("admin.policies.titleFr") }}
                </th>
               
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t("admin.policies.status") }}
                </th>
               

                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">{{
                    $t("admin.policies.actions")
                  }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-if="isLoading">
                <td colspan="7" class="px-6 py-12 text-center">
                  <div class="flex justify-center">
                    <div
                      class="animate-spin rounded-full h-8 w-8 border-3 border-gray-300 border-t-gray-900"
                    ></div>
                  </div>
                  <p class="mt-3 text-sm text-gray-600">
                    {{ $t("admin.policies.loading") }}
                  </p>
                </td>
              </tr>
              <tr v-else-if="filteredPolicies.length === 0">
                <td colspan="7" class="px-6 py-12 text-center">
                  <Icon
                    name="ph:file-text-bold"
                    class="w-12 h-12 text-gray-400 mx-auto mb-3"
                  />
                  <p class="text-sm text-gray-600">
                    {{ $t("admin.policies.noPolicies") }}
                  </p>
                </td>
              </tr>
              <tr
                v-else
                v-for="policy in filteredPolicies"
                :key="policy.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="getPolicyTypeColor(policy.policy_type)"
                  >
                    {{ getPolicyTypeLabel(policy.policy_type) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 max-w-md">
                  <div class="font-medium">
                    {{
                      policy.title_translations?.fr ||
                      policy.title_translations?.en ||
                      $t("admin.policies.noTitle")
                    }}
                  </div>
                </td>
               
                <td class="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    :class="[
                      policy.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                    ]"
                  >
                    {{
                      policy.is_active
                        ? $t("admin.policies.active")
                        : $t("admin.policies.inactive")
                    }}
                  </span>
                </td>
               

                <td
                  class="relative whitespace-nowrap px-6 py-4 text-right text-sm font-medium"
                >
                  <div class="flex items-center justify-end gap-2">
                    <NuxtLink
                      :to="`/admin/policies/${policy.id}/edit`"
                      class="inline-flex items-center px-3 py-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Icon name="ph:pencil-bold" class="w-4 h-4 mr-1" />
                      {{ $t("admin.policies.edit") }}
                    </NuxtLink>

                    <button
                      @click="deletePolicy(policy)"
                      :disabled="isLoading"
                      class="inline-flex items-center px-3 py-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon name="ph:trash-bold" class="w-4 h-4 mr-1" />
                      {{ $t("admin.policies.delete") }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <AdminPoliciesModal
    :show="showModal"
    :isLoading="isLoading"
    :form="form"
    @close="closeModal"
    @save="savePolicy"
  />
</template>

<script setup>
const { t: $t } = useI18n();
const { showConfirmation } = useConfirmationModal();
const { showError } = useErrorModal();
const { showSuccess } = useSuccessSnackbar();
const { fetchAllPolicies } = usePolicies();
const supabase = useSupabaseClient();

// State
const policies = ref([]);
const showModal = ref(false);
const isLoading = ref(false);
const searchQuery = ref("");
const filterStatus = ref("");
const form = ref({
  id: null,
  policy_type: "",
  title_translations: { fr: "", ar: "", en: "" },
  content_translations: { fr: "", ar: "", en: "" },
  slug: "",
  is_active: true,
});

// Policy type options
const policyTypes = [
  { value: "shipping", label: "Livraison", color: "bg-blue-100 text-blue-800" },
  { value: "return", label: "Retour", color: "bg-green-100 text-green-800" },
  {
    value: "privacy",
    label: "Confidentialité",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "terms",
    label: "Conditions",
    color: "bg-yellow-100 text-yellow-800",
  },
];

// Get policy type label
const getPolicyTypeLabel = (type) => {
  const policy = policyTypes.find((p) => p.value === type);
  return policy ? policy.label : type;
};

// Get policy type color
const getPolicyTypeColor = (type) => {
  const policy = policyTypes.find((p) => p.value === type);
  return policy ? policy.color : "bg-gray-100 text-gray-800";
};

// Fetch policies
const fetchPolicies = async () => {
  isLoading.value = true;
  try {
    const data = await fetchAllPolicies();
    policies.value = data;
  } catch (error) {
    console.error("Error fetching policies:", error);
    showError($t("admin.policies.errorLoading"));
  } finally {
    isLoading.value = false;
  }
};

// Filtered policies
const filteredPolicies = computed(() => {
  let filtered = policies.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((policy) => {
      const titleFr = policy.title_translations?.fr?.toLowerCase() || "";
      const titleEn = policy.title_translations?.en?.toLowerCase() || "";
      const titleAr = policy.title_translations?.ar?.toLowerCase() || "";
      const type = policy.policy_type?.toLowerCase() || "";
      const slug = policy.slug?.toLowerCase() || "";

      return (
        titleFr.includes(query) ||
        titleEn.includes(query) ||
        titleAr.includes(query) ||
        type.includes(query) ||
        slug.includes(query)
      );
    });
  }

  // Filter by status
  if (filterStatus.value !== "") {
    const isActive = filterStatus.value === "true";
    filtered = filtered.filter((policy) => policy.is_active === isActive);
  }

  return filtered;
});

// Format date
const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Open modal
const openModal = (policy = null) => {
  if (policy) {
    form.value = {
      id: policy.id,
      policy_type: policy.policy_type,
      title_translations: { ...policy.title_translations },
      content_translations: { ...policy.content_translations },
      slug: policy.slug,
      is_active: policy.is_active,
    };
  } else {
    form.value = {
      id: null,
      policy_type: "",
      title_translations: { fr: "", ar: "", en: "" },
      content_translations: { fr: "", ar: "", en: "" },
      slug: "",
      is_active: true,
    };
  }
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  form.value = {
    id: null,
    policy_type: "",
    title_translations: { fr: "", ar: "", en: "" },
    content_translations: { fr: "", ar: "", en: "" },
    slug: "",
    is_active: true,
  };
};

// Save policy
const savePolicy = async (formData) => {
  isLoading.value = true;
  try {
    const policyData = {
      policy_type: formData.policy_type,
      title_translations: formData.title_translations,
      content_translations: formData.content_translations,
      slug: formData.slug,
      is_active: formData.is_active,
      updated_at: new Date().toISOString(),
    };

    if (formData.id) {
      // Update existing policy
      const { error } = await supabase
        .from("policies")
        .update(policyData)
        .eq("id", formData.id);

      if (error) throw error;
      showSuccess($t("admin.policies.updateSuccess"));
    } else {
      // Create new policy
      const { error } = await supabase.from("policies").insert(policyData);

      if (error) throw error;
      showSuccess($t("admin.policies.createSuccess"));
    }

    closeModal();
    await fetchPolicies();
  } catch (error) {
    console.error("Error saving policy:", error);
    showError(error.message || $t("admin.policies.errorSaving"));
  } finally {
    isLoading.value = false;
  }
};

// Delete policy
const deletePolicy = async (policy) => {
  const confirmed = await showConfirmation(
    $t("admin.policies.deleteTitle"),
    $t("admin.policies.deleteMessage", {
      title: policy.title_translations?.fr || policy.policy_type,
    })
  );

  if (!confirmed) return;

  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("policies")
      .delete()
      .eq("id", policy.id);

    if (error) throw error;

    showSuccess($t("admin.policies.deleteSuccess"));
    await fetchPolicies();
  } catch (error) {
    console.error("Error deleting policy:", error);
    showError($t("admin.policies.errorDelete"));
  } finally {
    isLoading.value = false;
  }
};

// Initialize
onMounted(fetchPolicies);

// Page meta
definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

// SEO
useHead(() => ({
  title: $t("admin.policies.pageTitle"),
  meta: [
    {
      name: "description",
      content: $t("admin.policies.pageDescription"),
    },
    {
      name: "robots",
      content: "noindex, nofollow",
    },
  ],
}));
</script>
