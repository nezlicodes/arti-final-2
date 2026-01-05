<template>
  <div class="relative" ref="rootEl">
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-white backdrop-blur"
      @click="open = !open"
    >
      <Icon name="ph:storefront-bold" class="w-4 h-4 text-primary" />
      <span class="hidden sm:inline">Preview:</span>
      <span>{{ preset.label }}</span>
      <Icon name="ph:caret-down-bold" class="w-3.5 h-3.5 text-gray-600" />
    </button>

    <div
      v-if="open"
      class="absolute  right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl z-[20050]"
    >
      <!-- Header -->
      <div class="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div class="flex items-start gap-3">
          <span class="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Icon name="ph:storefront-bold" class="w-4 h-4 text-primary" />
          </span>
          <div>
            <p class="text-sm font-bold text-gray-950">Business preview</p>
            <p class="text-xs text-gray-600 mt-0.5">Switch the preset and tweak colors.</p>
          </div>
        </div>
        <button
          class="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          @click="open = false"
          aria-label="Close"
        >
          <Icon name="ph:x-bold" class="w-4 h-4" />
        </button>
      </div>

      <div class="h-px bg-gray-200" />

      <div class="p-4">
        <!-- Business type -->
        <div class="space-y-2">
          <label class="text-xs font-semibold text-gray-700">Business type</label>
          <div class="relative">
            <select
              class="w-full appearance-none px-3 py-2.5 pr-9 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              :value="businessId"
              @change="onBusinessChange"
            >
              <option v-for="b in businessOptions" :key="b.id" :value="b.id">{{ b.label }}</option>
            </select>
            <Icon name="ph:caret-down-bold" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          </div>
          <p class="text-xs text-gray-600 leading-relaxed">{{ preset.description }}</p>
        </div>

        <div class="my-4 h-px bg-gray-200" />

        <!-- Colors -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold text-gray-700">Colors</p>
            <div class="flex items-center gap-2">
              <div class="h-4 w-4 rounded-full border border-gray-200" :style="{ backgroundColor: primaryHex }" />
              <div class="h-4 w-4 rounded-full border border-gray-200" :style="{ backgroundColor: secondaryHex }" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-gray-700">Primary</label>
              <div class="relative">
                <input
                  type="color"
                  class="h-10 w-full rounded-xl border border-gray-300 bg-white"
                  :value="primaryHex"
                  @input="onPrimaryHex"
                />
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-gray-700">Secondary</label>
              <input
                type="color"
                class="h-10 w-full rounded-xl border border-gray-300 bg-white"
                :value="secondaryHex"
                @input="onSecondaryHex"
              />
            </div>
          </div>

          <button
            class="mt-1 inline-flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-gray-950"
            @click="reset()"
          >
            <Icon name="ph:arrow-counter-clockwise-bold" class="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

       
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BUSINESS_PRESETS, type BusinessId } from '~/utils/business-presets'

const { businessId, preset, effectiveColors, setBusiness, setColorOverrides, reset } = useBusinessPreview()

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)

const businessOptions = computed(() => Object.values(BUSINESS_PRESETS))

const rgbToHex = (rgb: string) => {
  const parts = rgb.split(',').map(s => Number(s.trim()))
  const [r, g, b] = [parts[0] || 0, parts[1] || 0, parts[2] || 0]
  const to = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase()
}

const hexToRgb = (hex: string) => {
  const v = hex.replace('#', '')
  const r = parseInt(v.substring(0, 2), 16)
  const g = parseInt(v.substring(2, 4), 16)
  const b = parseInt(v.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

const primaryHex = computed(() => rgbToHex(effectiveColors.value.primaryColor))
const secondaryHex = computed(() => rgbToHex(effectiveColors.value.secondaryColor))

const onBusinessChange = (e: Event) => {
  const id = (e.target as HTMLSelectElement).value as BusinessId
  setBusiness(id)
}

const onPrimaryHex = (e: Event) => {
  const hex = (e.target as HTMLInputElement).value
  setColorOverrides({ primaryColor: hexToRgb(hex) })
}

const onSecondaryHex = (e: Event) => {
  const hex = (e.target as HTMLInputElement).value
  setColorOverrides({ secondaryColor: hexToRgb(hex) })
}

const onClickOutside = (evt: MouseEvent) => {
  if (!open.value) return
  const el = rootEl.value
  if (!el) return
  if (evt.target instanceof Node && !el.contains(evt.target)) {
    open.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', onClickOutside)
})
</script>
