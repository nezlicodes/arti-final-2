<template>
  <div class="floating-button-wrapper" ref="rootEl">
    <button class="floating-action-button" @click="isOpen = !isOpen">
      <span class="floating-action-button__glow"></span>
      <span class="floating-action-button__icon">✨</span>
      <span class="floating-action-button__text">
        {{ $t('floatingButton.text') || 'Try Demo' }}
      </span>
    </button>

    <!-- Dropdown positioned above the button -->
    <Transition name="dropdown">
      <div v-if="isOpen" class="floating-dropdown">
        <div class="dropdown-header">
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
            @click="isOpen = false"
            aria-label="Close"
          >
            <Icon name="ph:x-bold" class="w-4 h-4" />
          </button>
        </div>

        <div class="h-px bg-gray-200" />

        <div class="dropdown-body">
          <!-- Business type -->
          <div class="form-section">
            <label class="form-label">
              <Icon name="ph:briefcase-bold" class="w-4 h-4" />
              Business Type
            </label>
            <div class="select-wrapper">
              <select
                class="custom-select"
                :value="businessId"
                @change="onBusinessChange"
              >
                <option v-for="b in businessOptions" :key="b.id" :value="b.id">{{ b.label }}</option>
              </select>
              <Icon name="ph:caret-down-bold" class="select-arrow" />
            </div>
            <p class="form-description">{{ preset.description }}</p>
          </div>

          <div class="divider" />

          <!-- Colors -->
          <div class="form-section">
            <div class="section-header">
              <label class="form-label">
                <Icon name="ph:palette-bold" class="w-4 h-4" />
                Color Palette
              </label>
              <div class="color-preview">
                <div class="color-swatch" :style="{ backgroundColor: primaryHex }" :title="'Primary: ' + primaryHex" />
                <div class="color-swatch" :style="{ backgroundColor: secondaryHex }" :title="'Secondary: ' + secondaryHex" />
              </div>
            </div>

            <div class="color-grid">
              <div class="color-input-group">
                <label class="color-label">Primary Color</label>
                <div class="color-input-wrapper">
                  <input
                    type="color"
                    class="color-input"
                    :value="primaryHex"
                    @input="onPrimaryHex"
                  />
                  <span class="color-hex">{{ primaryHex }}</span>
                </div>
              </div>
              <div class="color-input-group">
                <label class="color-label">Secondary Color</label>
                <div class="color-input-wrapper">
                  <input
                    type="color"
                    class="color-input"
                    :value="secondaryHex"
                    @input="onSecondaryHex"
                  />
                  <span class="color-hex">{{ secondaryHex }}</span>
                </div>
              </div>
            </div>

            <button
              class="reset-button"
              @click="reset()"
            >
              <Icon name="ph:arrow-counter-clockwise-bold" class="w-4 h-4" />
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { BUSINESS_PRESETS, type BusinessId } from '~/utils/business-presets'

const isOpen = ref(false)
const rootEl = ref<HTMLElement | null>(null)

const { businessId, preset, effectiveColors, setBusiness, setColorOverrides, reset } = useBusinessPreview()

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
  if (!isOpen.value) return
  const el = rootEl.value
  if (!el) return
  if (evt.target instanceof Node && !el.contains(evt.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
.floating-button-wrapper {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
}

.floating-action-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 3rem;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: float-bounce 3s ease-in-out infinite;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.floating-action-button:hover {
  transform: translateY(-4px) scale(1.08);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.3);
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
}

.floating-action-button:active {
  transform: translateY(-2px) scale(1.02);
}

.floating-action-button__glow {
  position: absolute;
  inset: -3px;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  animation: glow-rotate 2.5s linear infinite;
  border-radius: 3rem;
}

.floating-action-button__icon {
  position: relative;
  z-index: 1;
  font-size: 1.5rem;
  animation: sparkle-pulse 2s ease-in-out infinite;
}

.floating-action-button__text {
  position: relative;
  z-index: 1;
  white-space: nowrap;
}

@keyframes float-bounce {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes glow-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sparkle-pulse {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.2) rotate(-10deg);
  }
  50% {
    transform: scale(1) rotate(0deg);
  }
  75% {
    transform: scale(1.2) rotate(10deg);
  }
}

/* Floating Dropdown */
.floating-dropdown {
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  width: 420px;
  max-width: calc(100vw - 4rem);
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 1.25rem;
  box-shadow: 
    0 24px 48px -12px rgba(0, 0, 0, 0.12),
    0 16px 32px -8px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  z-index: 9998;
  max-height: calc(100vh - 10rem);
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.dropdown-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 50%, #ffffff 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.dropdown-header .flex {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}

.dropdown-header .inline-flex {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, var(--primary-rgb) 0%, var(--secondary-rgb) 100%);
  border-radius: 1rem;
  color: white;
  flex-shrink: 0;
  box-shadow: 
    0 8px 16px rgba(var(--primary-rgb-values), 0.3),
    0 4px 8px rgba(0, 0, 0, 0.1),
    inset 0 2px 0 rgba(255, 255, 255, 0.25);
}

.dropdown-header .inline-flex::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 100%);
  border-radius: 1rem;
}

.dropdown-header .text-sm {
  font-size: 1.125rem;
  font-weight: 700;
  background: linear-gradient(135deg, #111827 0%, #374151 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.dropdown-header .text-xs {
  font-size: 0.8125rem;
  color: #6b7280;
  margin-top: 0.375rem;
  line-height: 1.5;
}

.dropdown-header .rounded-lg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.dropdown-header .rounded-lg:hover {
  background: #f3f4f6;
  color: #111827;
}

.dropdown-body {
  padding: 1.25rem;
  overflow-y: auto;
  max-height: calc(100vh - 12rem);
}

/* Dropdown Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Form Sections (matching BusinessPreviewSwitcher) */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.form-label svg {
  color: var(--primary-rgb);
}

.select-wrapper {
  position: relative;
}

.custom-select {
  width: 100%;
  appearance: none;
  padding: 0.875rem 2.75rem 0.875rem 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  background: linear-gradient(to bottom, #ffffff, #f9fafb);
  border: 2px solid #e5e7eb;
  border-radius: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.custom-select:hover {
  border-color: #d1d5db;
  background: white;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.custom-select:focus {
  outline: none;
  border-color: var(--primary-rgb);
  background: white;
  box-shadow: 
    0 0 0 4px rgba(var(--primary-rgb-values), 0.1),
    0 2px 8px rgba(var(--primary-rgb-values), 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.select-arrow {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
  pointer-events: none;
}

.form-description {
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.6;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%);
  border-radius: 0.75rem;
  border-left: 3px solid var(--primary-rgb);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e5e7eb, transparent);
  margin: 1.25rem 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.color-preview {
  display: flex;
  gap: 0.5rem;
}

.color-swatch {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #e5e7eb, 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.875rem;
}

.color-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
}

.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  background: linear-gradient(to bottom, #ffffff, #f9fafb);
  border: 2px solid #e5e7eb;
  border-radius: 0.875rem;
  transition: all 0.3s ease;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.color-input-wrapper:hover {
  border-color: #d1d5db;
  background: white;
}

.color-input-wrapper:focus-within {
  border-color: var(--primary-rgb);
  background: white;
  box-shadow: 
    0 0 0 4px rgba(var(--primary-rgb-values), 0.1),
    0 2px 8px rgba(var(--primary-rgb-values), 0.12);
}

.color-input {
  width: 3.25rem;
  height: 3.25rem;
  border: none;
  border-radius: 0.625rem;
  cursor: pointer;
  box-shadow: 
    0 0 0 2px white,
    0 0 0 3px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.color-input:hover {
  transform: scale(1.05);
}

.color-hex {
  flex: 1;
  font-size: 0.8125rem;
  font-weight: 700;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #374151 0%, #6b7280 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.reset-button {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.25rem;
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  background: linear-gradient(to bottom, #ffffff, #f9fafb);
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.reset-button:hover {
  color: #111827;
  border-color: #d1d5db;
  background: white;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  transform: translateY(-1px);
}

.reset-button:active {
  transform: translateY(0);
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Mobile responsive */
@media (max-width: 640px) {
  .floating-button-wrapper {
    bottom: 1rem;
    right: 1rem;
  }

  .floating-action-button {
    padding: 0.875rem 1.25rem;
    font-size: 0.875rem;
  }
  
  .floating-action-button__icon {
    font-size: 1.25rem;
  }
  
  .floating-action-button__text {
    display: none;
  }

  .floating-dropdown {
    bottom: 4.5rem;
    right: 1rem;
    width: calc(100vw - 2rem);
    max-height: calc(100vh - 6rem);
  }

  .color-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  .floating-button-wrapper {
    bottom: 1.5rem;
    right: 1.5rem;
  }

  .floating-dropdown {
    bottom: 5.5rem;
    right: 1.5rem;
  }
}

</style>
