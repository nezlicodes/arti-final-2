<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">
          All Categories
        </h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Browse through our complete collection of carefully curated categories. Find exactly what you're looking for.
        </p>
      </div>
    </section>

    <!-- Categories Component -->
    <ModernCategories />
  </div>
</template>

<script setup>
// SEO
useHead({
  title: 'All Categories - Xone Algeria',
  meta: [
    {
      name: 'description',
      content: 'Browse all product categories at Xone Algeria. Find premium products across all our collections.'
    }
  ]
})
</script>