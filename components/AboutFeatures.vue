<template>
  <section class="py-32 bg-white overflow-hidden">
    <div class="max-w-screen-2xl mx-auto">
      
      <div v-if="loading" class="grid lg:grid-cols-3 gap-12 items-start animate-pulse px-6 sm:px-8">
        <div class="lg:col-span-2 bg-gray-200 rounded-none h-[700px] border-4 border-gray-300"></div>
        <div class="grid grid-cols-1 gap-12 pt-16">
          <div v-for="i in 4" :key="i" class="bg-white rounded-none h-40 border-l-4 border-gray-300 pl-6"></div>
        </div>
      </div>

      <div v-else-if="features.length > 0" class="grid lg:grid-cols-3 items-start gap-16">
        
        <div class="lg:col-span-2 relative h-[700px] pl-6 sm:pl-8 lg:pl-16">
          <div 
            class="relative w-full h-full border-8 border-secondary-300 overflow-hidden"
            style="clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);"
          >
            <NuxtImg
              :src="featureImage || 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=80'"
              alt="Xone Algeria Features"
              class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          <h2 class="absolute bottom-10 right-10 text-8xl font-black text-white mix-blend-difference z-10" style="text-shadow: 2px 2px 0px rgba(0,0,0,0.8);">
            FEATURES
          </h2>
        </div>

        <div class="grid grid-cols-1 gap-y-12 pr-6 sm:pr-8 lg:pr-16 pt-16">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="flex flex-col border-b border-gray-200 pb-6 transition-all duration-300 hover:border-primary"
          >
            <div class="text-7xl font-light text-primary mb-3 leading-none tracking-tighter">
              {{ feature.number }}
            </div>

            <h3 class="text-xl font-extrabold text-gray-900 mb-2 uppercase tracking-wide">
              {{ getFeatureTitle(feature) }}
            </h3>

            <div 
              class="text-gray-600 text-sm leading-relaxed prose prose-sm font-mono"
              v-html="getFeatureDescription(feature)"
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

const features = computed(() => {
  return props.section?.additionalData?.features || []
})

// Get image_url from section root, not from additionalData
const featureImage = computed(() => {
  return props.section?.imageUrl || props.section?.image_url || ''
})

const getFeatureTitle = (feature) => {
  const locale = getCurrentLocale()
  return feature[`title_${locale}`] || feature.title_fr || feature.title_en || ''
}

const getFeatureDescription = (feature) => {
  const locale = getCurrentLocale()
  return feature[`description_${locale}`] || feature.description_fr || feature.description_en || ''
}
</script>

<style>
/* Style Preservation: Keep existing prose styles, but add the monospaced font to all prose children 
  for the new aesthetic.
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
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose strong {
  font-weight: 600;
}

.prose em {
  font-style: italic;
}

.prose ul,
.prose ol {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding-left: 1.5em;
}

.prose li {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}
</style>