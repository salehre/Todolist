<template>
  <div class="flex flex-col gap-1.5">
    <label
        v-if="label"
        :for="inputId"
        class="text-[13px] font-semibold text-white/85 text-start tracking-wide"
    >
      {{ label }}
      <span v-if="required" class="text-rose-300 ms-0.5">*</span>
    </label>

    <div class="relative">
      <!-- آیکون سمت شروعِ خط (سمت راست تو RTL) -->
      <div
          v-if="$slots.iconRight"
          class="absolute inset-s-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
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
          'w-full rounded-xl border px-4 py-3 text-sm text-slate-800 bg-white shadow-sm',
          'placeholder:text-slate-400 outline-none transition-all duration-200',
          'focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:shadow-md',
          $slots.iconRight ? 'ps-10' : '',
          $slots.iconLeft ? 'pe-10' : '',
          error
            ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-100 focus:border-rose-400'
            : 'border-slate-200 hover:border-slate-300',
          disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 shadow-none' : '',
        ]"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @blur="$emit('blur')"
      />

      <!-- آیکون سمت پایانِ خط (سمت چپ تو RTL، مثلاً نمایش/مخفی رمز) -->
      <div
          v-if="$slots.iconLeft"
          class="absolute inset-e-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
      >
        <slot name="iconLeft" />
      </div>
    </div>

    <!-- پیام خطا -->
    <Transition name="slide-down">
      <p v-if="error" class="text-xs text-rose-300 text-start flex items-center gap-1 justify-end">
        <Icon icon="mdi:alert-circle-outline" class="text-sm shrink-0" />
        {{ error }}
      </p>
    </Transition>

    <!-- راهنما -->
    <p v-if="hint && !error" class="text-xs text-white/50 text-start">
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