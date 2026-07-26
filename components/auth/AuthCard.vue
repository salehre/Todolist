<template>
  <!-- بک‌گراند یکدست سایت -->
  <div
      class="relative min-h-screen flex items-center justify-center p-4 bg-cover bg-center transition-[background-image] duration-300"
      :style="{ backgroundImage: `url(/images/auth-bg/${currentTheme}.jpg)` }"
      dir="rtl"
  >
    <!-- لایه‌ی تیره‌ی نیم‌شفاف روی عکس تا فرم خوانا بمونه -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/50" />

    <!-- کارت اصلی -->
    <div class="relative z-10 w-full max-w-md animate-card-in">
      <div class="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/40 border border-white/20 p-8 sm:p-9">

        <!-- لوگو / آیکون -->
        <div class="flex flex-col items-center mb-7">
          <div
            v-if="icon"
            class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-900/30 ring-1 ring-white/30 flex items-center justify-center mb-4"
          >
            <Icon :icon="icon" class="text-3xl text-white" />
          </div>

          <!-- عنوان -->
          <h1 class="text-2xl font-bold text-white tracking-wide text-center">{{ title }}</h1>
          <p v-if="subtitle" class="text-sm text-white/70 mt-1.5 text-center leading-relaxed">{{ subtitle }}</p>
        </div>

        <!-- محتوا -->
        <slot />

        <!-- لینک زیر کارت (داخل همان کارت) -->
        <div v-if="$slots.footer" class="text-center mt-6 pt-5 border-t border-white/10">
          <slot name="footer" />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useTheme } from '@/composables/useTheme'

defineProps<{
  title: string
  subtitle?: string
  icon?: string
}>()

const { currentTheme } = useTheme()
</script>

<style scoped>
@keyframes card-in {
  from { opacity: 0; transform: translateY(10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-card-in {
  animation: card-in 0.35s ease-out;
}
</style>