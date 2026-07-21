<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="inputId"
      class="text-sm font-medium text-slate-700 text-right"
    >
      {{ label }}
      <span v-if="required" class="text-rose-500 mr-0.5">*</span>
    </label>

    <div class="relative">
      <!-- آیکون سمت راست -->
      <div
        v-if="$slots.iconRight"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      >
        <slot name="iconRight" />
      </div>

      <input
        :id="inputId"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :class="[
          'w-full rounded-xl border px-4 py-3 text-sm text-slate-800 bg-white',
          'placeholder:text-slate-400 outline-none transition-all duration-200',
          'focus:ring-2 focus:ring-primary-300 focus:border-primary-500',
          $slots.iconRight ? 'pr-10' : '',
          $slots.iconLeft ? 'pl-10' : '',
          error
            ? 'border-rose-400 bg-rose-50/30'
            : 'border-slate-200 hover:border-slate-300',
          disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : '',
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
      />

      <!-- آیکون سمت چپ (مثلاً نمایش/مخفی رمز) -->
      <div
        v-if="$slots.iconLeft"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
      >
        <slot name="iconLeft" />
      </div>
    </div>

    <!-- پیام خطا -->
    <Transition name="slide-down">
      <p v-if="error" class="text-xs text-rose-500 text-right flex items-center gap-1 justify-end">
        <Icon icon="mdi:alert-circle-outline" class="text-sm shrink-0" />
        {{ error }}
      </p>
    </Transition>

    <!-- راهنما -->
    <p v-if="hint && !error" class="text-xs text-slate-400 text-right">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = withDefaults(defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  autocomplete?: string
  id?: string
}>(), {
  type: 'text',
  required: false,
  disabled: false,
})

defineEmits<{
  'update:modelValue': [value: string]
  'blur': []
}>()

const inputId = computed(() => props.id || 'input-' + Math.random().toString(36).slice(2))
const inputType = computed(() => props.type)
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>