<template>
  <!-- بک‌گراند یکدست سایت -->
  <div class="min-h-screen bg-pink-50 flex items-center justify-center p-4" dir="rtl">

    <!-- کارت اصلی -->
    <div class="relative w-full max-w-md">
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-violet-100/50 border border-white/60 p-8">

        <!-- لوگو / آیکون -->
        <div class="flex flex-col items-center mb-8">
          <div class="w-14 h-14 rounded-2xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-200">
<!--            <Icon :icon="icon" class="text-white text-2xl" />-->
          </div>
          <h1 class="text-2xl font-bold text-slate-800">{{ title }}</h1>
          <p v-if="subtitle" class="text-sm text-slate-500 mt-1 text-center">{{ subtitle }}</p>
        </div>

        <!-- محتوا -->
        <slot />

      </div>

      <!-- لینک زیر کارت -->
      <div v-if="$slots.footer" class="text-center mt-5">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  title: string
  subtitle?: string
  icon?: string
}>()
</script>