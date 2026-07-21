<template>
  <div class="h-full overflow-y-auto p-1">
    <div class="mx-auto max-w-2xl">
      <div class="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl md:p-8">
        <h2 class="text-lg font-bold text-slate-800">تم رنگی</h2>
        <p class="mt-1 text-sm text-slate-500">
          رنگ اصلی سایت (بک‌گراند، دکمه‌ها، بج‌ها) رو انتخاب کن. انتخابت ذخیره می‌مونه.
        </p>

        <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
              v-for="option in themeOptions"
              :key="option.value"
              type="button"
              @click="setTheme(option.value)"
              class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-colors"
              :class="currentTheme === option.value
                ? 'border-primary-500 bg-primary-50'
                : 'border-slate-200 hover:border-slate-300'"
          >
            <span class="relative flex h-10 w-10 items-center justify-center">
              <span
                  class="h-10 w-10 rounded-full"
                  :style="{ backgroundColor: option.swatch }"
              />
              <Icon
                  v-if="currentTheme === option.value"
                  icon="mdi:check-bold"
                  class="absolute text-lg text-white"
              />
            </span>
            <span class="text-sm font-medium text-slate-700">{{ option.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useTheme } from '~/composables/useTheme'

definePageMeta({ layout: 'dashboard' })

const { currentTheme, setTheme, themeOptions } = useTheme()
</script>