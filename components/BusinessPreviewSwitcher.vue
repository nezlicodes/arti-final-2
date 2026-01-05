<template>
  <div class="relative" ref="rootEl">
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-full border border-mgray-200 bg-white/80 px-3 py-2 text-sm font-semibold text-mgray-800 hover:bg-white backdrop-blur"
      @click="open = !open"
    >
      <Icon name="ph:storefront-bold" class="w-4 h-4 text-primary" />
      <span class="hidden sm:inline">Preview:</span>
      <span>{{ preset.label }}</span>
      <Icon name="ph:caret-down-bold" class="w-3.5 h-3.5 text-mgray-600" />
    </button>

    <div
      v-if="open"
      class="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-mgray-200 bg-white shadow-xl p-4 z-[200]"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-sm font-bold text-mgray-950">Business preview</p>
          <p class="text-xs text-mgray-600 mt-0.5">Choose a business type and colors to preview.</p>
        </div>
        <button class="text-mgray-500 hover:text-mgray-800" @click="open = false" aria-label="Close">
          <Icon name="ph:x-bold" class="w-4 h-4" />
        </button>
      </div>

      <div class="mt-4 space-y-3">
        <label class="text-xs font-semibold text-mgray-700">Business type</label>
        <select
          class="w-full px-3 py-2.5 text-sm border border-mgray-300 rounded-xl bg-white"
          :value="businessId"
          @change="onBusinessChange"
        >
          <option v-for="b in businessOptions" :key="b.id" :value="b.id">{{ b.label }}</option>
        </select>
        <p class="text-xs text-mgray-600">{{ preset.description }}</p>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-semibold text-mgray-700">Primary</label>
          <input type="color" class="mt-1 h-10 w-full rounded-xl border border-mgray-300" :value="primaryHex" @input="onPrimaryHex" />
        </div>
        <div>
          <label class="text-xs font-semibold text-mgray-700">Secondary</label>
          <input type="color" class="mt-1 h-10 w-full rounded-xl border border-mgray-300" :value="secondaryHex" @input="onSecondaryHex" />
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between gap-3">
        <button
          class="text-xs font-semibold text-mgray-700 hover:text-mgray-950"
          @click="reset()"
        >
          Reset
        </button>

        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-full" :style="{ backgroundColor: primaryHex }" />
          <div class="h-8 w-8 rounded-full" :style="{ backgroundColor: secondaryHex }" />
        </div>
      </div>

      <p class="mt-4 text-[11px] text-mgray-500">
        Tip: This is only a preview for visitors. Admin settings still come from the backend.
      </p>
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
