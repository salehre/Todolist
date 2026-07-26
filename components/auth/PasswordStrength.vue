<template>
  <div class="space-y-2" dir="rtl">
    <!-- نوارهای قدرت -->
    <div class="flex gap-1.5">
      <div
        v-for="i in 4"
        :key="i"
        class="h-1.5 flex-1 rounded-full transition-all duration-300"
        :class="barColor(i)"
      />
    </div>
    <!-- برچسب -->
    <p class="text-xs text-right font-medium transition-colors duration-300" :class="labelColor">
      {{ label }}
    </p>
    <!-- راهنماهای کمبود -->
    <ul v-if="hints.length" class="space-y-1">
      <li
        v-for="hint in hints"
        :key="hint.text"
        class="text-xs flex items-center gap-1.5 justify-end"
        :class="hint.passed ? 'text-emerald-300' : 'text-white/45'"
      >
        <span>{{ hint.text }}</span>
        <Icon
          :icon="hint.passed ? 'mdi:check-circle' : 'mdi:circle-outline'"
          class="shrink-0 text-sm"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps<{ password: string }>()

const hints = computed(() => [
  { text: 'حداقل ۸ کاراکتر',     passed: props.password.length >= 8 },
  { text: 'حداقل یک عدد',        passed: /\d/.test(props.password) },
  { text: 'حروف بزرگ و کوچک',    passed: /[a-z]/.test(props.password) && /[A-Z]/.test(props.password) },
  { text: 'یک کاراکتر خاص',      passed: /[^a-zA-Z0-9]/.test(props.password) },
])

const score = computed(() => hints.value.filter(h => h.passed).length)

const label = computed(() => {
  if (!props.password) return ''
  return ['خیلی ضعیف', 'ضعیف', 'متوسط', 'قوی', 'عالی'][score.value]
})

const labelColor = computed(() => {
  if (!props.password) return 'text-white/40'
  return ['text-rose-300', 'text-orange-300', 'text-amber-300', 'text-emerald-300', 'text-emerald-300'][score.value]
})

function barColor(i: number) {
  if (!props.password || score.value === 0) return 'bg-white/15'
  const colors = ['bg-rose-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-400']
  return i <= score.value ? colors[score.value - 1] || 'bg-white/15' : 'bg-white/15'
}
</script>
