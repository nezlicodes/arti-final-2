<template>
  <section class="py-32 bg-white overflow-hidden">
    <div class="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-16">
      
      <div class="mb-20 grid lg:grid-cols-4 items-end gap-8">
        <h2 class="text-6xl font-light tracking-tighter text-gray-900 leading-none lg:col-span-1">
          {{ section?.title?.toUpperCase() }}
        </h2>
        <p class="text-lg text-gray-600 max-w-lg lg:col-span-3 font-mono border-l-4 border-secondary-300 pl-6">
          {{ section?.content }}
        </p>
      </div>

      <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 animate-pulse">
        <div v-for="i in 4" :key="i" class="h-64 bg-gray-100 rounded-none border-4 border-gray-200"></div>
      </div>

      <div 
        v-else-if="values.length > 0" 
        :class="['grid gap-12', templateVariant === 'grid-4' ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2']"
      >
        <div 
          v-for="(value, index) in values" 
          :key="index"
          class="group relative p-10 border-4 border-gray-200 bg-white transition-all duration-500 hover:border-secondary"
        >
          <div 
            class="absolute top-4 right-4 opacity-10 text-secondary transform scale-[2.5] transition-transform duration-500 group-hover:scale-[3] group-hover:opacity-15"
          >
            <component 
              :is="getIconComponent(value.icon)" 
              class="w-24 h-24" 
            />
          </div>

          <div class="flex-1 relative z-10">
            <h3 class="text-3xl font-extrabold text-gray-900 mb-4 uppercase tracking-widest">
              {{ getValueTitle(value) }}
            </h3>

            <div 
              class="text-gray-600 text-sm leading-relaxed prose prose-sm font-mono" 
              v-html="getValueDescription(value)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
  
<script setup>
// Script section remains identical to preserve function and content logic
const props = defineProps({
  section: Object,
  loading: Boolean
})

const getCurrentLocale = () => {
  try {
    const { locale } = useI18n()
    return locale.value
  } catch {
    return 'fr'
  }
}

const values = computed(() => {
  return props.section?.additionalData?.values || []
})

const getValueTitle = (value) => {
  const locale = getCurrentLocale()
  return value[`title_${locale}`] || value.title_fr || value.title_en || ''
}

const getValueDescription = (value) => {
  const locale = getCurrentLocale()
  return value[`description_${locale}`] || value.description_fr || value.description_en || ''
}

// Icon component logic is preserved exactly as it contains the original SVGs
const getIconComponent = (iconName) => {
  const iconMap = {
    trust: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      `
    },
    innovation: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      `
    },
    quality: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
        </svg>
      `
    },
    customer: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      `
    }
  }
  
  return iconMap[iconName] || iconMap.trust
}
const templateVariant = computed(() => {
  return props.section?.additionalData?.template || props.section?.template || 'grid-2'
})

</script>

<style>
/* Custom styles for prose to match the monospaced, high-contrast aesthetic. 
  Prose text is generally smaller and uses monospaced styling.
*/
.prose.font-mono p,
.prose.font-mono strong,
.prose.font-mono em,
.prose.font-mono ul,
.prose.font-mono ol,
.prose.font-mono li {
  font-family: monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", sans-serif;
}

.prose p {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

.prose strong {
  font-weight: 800;
  color: rgba(var(--secondary-color), 1); /* Strong text uses secondary color */
}

.prose em {
  font-style: italic;
}

.prose ul,
.prose ol {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  padding-left: 1.5em;
}

.prose li {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}
</style>