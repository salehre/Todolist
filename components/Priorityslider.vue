<template>
  <div>
    <!-- لیبل بالای اسلایدر: کلمه‌ی سطح با رنگ مخصوص همون سطح -->
    <p class="mb-2 text-start text-base font-semibold text-primary-900">
      <span :class="currentOption.textClass">{{ currentOption.label }}</span> priority
    </p>

    <div class="relative h-7">
      <!-- ریل خالی -->
      <div class="absolute inset-0 rounded-full bg-white shadow-inner ring-1 ring-slate-200" />

      <div
          class="absolute inset-y-0 inset-s-0 rounded-full transition-[width,background-color] duration-200 ease-out"
          :class="currentOption.bgClass"
          :style="{ width: `calc((100% - 24px) * ${fraction} + 28px)` }"
      />

      <!-- نقطه‌های نشانه‌ی پله‌ها -->
      <span
          v-for="(opt, index) in options"
          :key="opt.value"
          class="pointer-events-none absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full transition-colors"
          :class="index <= modelIndex ? 'bg-white/70' : 'bg-slate-300'"
          :style="{ insetInlineStart: `calc((100% - 24px) * ${index / (options.length - 1)} + 12px)` }"
      />

      <div
          class="pointer-events-none absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition-[inset-inline-start] duration-200 ease-out"
          :style="{ insetInlineStart: `calc((100% - 24px) * ${fraction} + 2px)` }"
      />

      <input
          type="range"
          min="0"
          max="2"
          step="1"
          :value="modelIndex"
          @input="onInput"
          class="priority-range absolute inset-0 z-10 w-full cursor-pointer appearance-none bg-transparent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Priority = 'low' | 'medium' | 'high'

const props = defineProps<{ modelValue: Priority }>()
const emit = defineEmits<{ 'update:modelValue': [Priority] }>()

const options: { value: Priority; label: string; bgClass: string; textClass: string }[] = [
  { value: 'low', label: 'Low', bgClass: 'bg-emerald-500', textClass: 'text-emerald-600' },
  { value: 'medium', label: 'Medium', bgClass: 'bg-orange-500', textClass: 'text-orange-600' },
  { value: 'high', label: 'High', bgClass: 'bg-red-500', textClass: 'text-red-600' },
]

const modelIndex = computed(() => Math.max(0, options.findIndex((o) => o.value === props.modelValue)))
const fraction = computed(() => modelIndex.value / (options.length - 1))
const currentOption = computed(() => options[modelIndex.value] ?? options[0])

function onInput(e: Event): void {
  const index = Number((e.target as HTMLInputElement).value)
  emit('update:modelValue', options[index].value)
}
</script>

<style scoped>
.priority-range::-webkit-slider-runnable-track {
  background: transparent;
  height: 1.75rem;
}
.priority-range::-webkit-slider-thumb {
  appearance: none;
  width: 1.5rem;
  height: 1.5rem;
  opacity: 0;
}
.priority-range::-moz-range-track {
  background: transparent;
  height: 1.75rem;
}
.priority-range::-moz-range-thumb {
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  opacity: 0;
}
</style>