<template>
  <section class="py-24 md:py-40 bg-secondary-200 text-gray-900 overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
      
      <div v-if="loading" class="animate-pulse flex flex-col items-start px-4 md:px-0">
        <div class="h-20 bg-gray-200 rounded-none w-1/2 mb-10"></div>
        <div class="h-6 bg-gray-200 rounded-none w-full mb-4"></div>
        <div class="h-6 bg-gray-200 rounded-none w-11/12 mb-4"></div>
        <div class="h-6 bg-gray-200 rounded-none w-4/5"></div>
      </div>

      <div v-else class="grid lg:grid-cols-12 gap-12">
        
        <div class="lg:col-span-5 relative">
          <h2 class="text-7xl font-light leading-snug tracking-tighter text-gray-900 mb-6 lg:sticky lg:top-12">
            {{ section?.title }}
          </h2>
          
          <div class="absolute top-0 right-0 w-1 h-full bg-primary hidden lg:block"></div>
        </div>

        <div class="lg:col-span-7">
          <div
            class="text-xl leading-relaxed max-w-2xl px-6 py-8 border-l-8 border-primary bg-white shadow-xl prose prose-xl"
            v-html="section?.content"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>
  
<script setup>
// Script section remains identical to preserve function and content logic
const props = defineProps({
  section: Object,
  loading: Boolean,
});
</script>

<style>
/* Prose styles are updated to reflect a more spacious, high-contrast, editorial/magazine-style look. 
  The existing styles are heavily modified using the new color palette.
*/
.prose.prose-xl {
  /* Increase max-width slightly for the new content box */
  max-width: 70ch; 
  color: #000000; /* Ensuring text is black/very dark */
}

.prose.prose-xl p {
  margin-top: 1.5em; /* Increased spacing */
  margin-bottom: 1.5em; /* Increased spacing */
  line-height: 1.7; /* Increased line height */
}

.prose.prose-xl h1,
.prose.prose-xl h2,
.prose.prose-xl h3,
.prose.prose-xl h4 {
  margin-top: 1.8em; /* Increased spacing */
  margin-bottom: 0.9em; /* Increased spacing */
  font-weight: 800; /* Extra bold headings */
  color: rgba(var(--primary-color), 1); /* Headings use the primary color */
  text-transform: uppercase;
}

.prose.prose-xl ul,
.prose.prose-xl ol {
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  padding-left: 2em; /* Slightly more padding */
  border-left: 2px solid rgba(var(--secondary-color), 0.3); /* Subtle secondary border for lists */
}

.prose.prose-xl li {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  padding-left: 0.5em;
}

.prose.prose-xl strong {
  font-weight: 900; /* Ultra bold emphasis */
  color: rgba(var(--primary-color), 1); /* Primary color emphasis */
}

.prose.prose-xl em {
  font-style: italic;
  color: #000000;
}

.prose.prose-xl blockquote {
  font-style: italic;
  border-left: 8px solid #000000; /* Thicker black blockquote border */
  padding-left: 1.5em;
  margin: 2em 0;
  background-color: #F8F8F8; /* Subtle off-white background */
  padding-top: 1em;
  padding-bottom: 1em;
}

.prose.prose-xl code {
  background-color: rgba(0, 0, 0, 0.05); /* Lighter background for code */
  color: #000000;
  padding: 0.3em 0.5em;
  border-radius: 0; /* Square corners for modernist feel */
  font-size: 0.9em;
  font-family: monospace;
}

.prose.prose-xl a {
  color: inherit;
  text-decoration: none;
  border-bottom: 2px solid rgba(var(--primary-color), 1); /* Underline links with primary color */
  padding-bottom: 1px;
}

.prose.prose-xl a:hover {
  opacity: 1;
  background-color: rgba(var(--primary-color), 0.1); /* Subtle primary background on hover */
}
</style>