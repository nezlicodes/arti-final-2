<template>
  <div class="preview-top-banner" :dir="isRtl ? 'rtl' : 'ltr'">
    <div class="preview-top-banner__shine" aria-hidden="true" />

    <div class="x-container">
      <div class="flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs sm:text-sm text-white/90 tracking-wide">
          <span class="text-white font-semibold">{{ $t('previewBanner.lead') }}</span>
          <span class="mx-2 text-white/40">•</span>
          <span>{{ $t('previewBanner.text') }}</span>
        </p>

        <div class="shrink-0 preview-switcher">
          <BusinessPreviewSwitcher />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isRtl } = useTranslation()
</script>

<style scoped>
.preview-top-banner {
  position: relative;
  background: linear-gradient(180deg, #0b0b0b, #050505);
}

.preview-top-banner__shine {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.55;
  background: linear-gradient(
    110deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 18%,
    transparent 36%
  );
  transform: translateX(-60%);
  transition: transform 900ms ease;
}

.preview-top-banner:hover .preview-top-banner__shine {
  transform: translateX(60%);
}

/* Ensure the switcher looks good on dark background without editing its internals */
.preview-switcher :deep(button) {
  @apply border-white/20 bg-transparent text-white/90;
}

.preview-switcher :deep(button:hover) {
  @apply bg-white/10;
}

.preview-switcher :deep(svg) {
  color: rgba(255, 255, 255, 0.9) !important;
}

.preview-switcher :deep(.text-primary) {
  color: rgba(255, 255, 255, 0.9) !important;
}

.preview-switcher :deep(.text-mgray-600),
.preview-switcher :deep(.text-mgray-700),
.preview-switcher :deep(.text-mgray-800),
.preview-switcher :deep(.text-mgray-950) {
  color: rgba(255, 255, 255, 0.92) !important;
}

/* Dropdown should remain readable (it is white by default) */
.preview-switcher :deep(.shadow-xl) {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}
</style>
