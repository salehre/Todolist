<template>
  <div>
    <Toaster rich-colors position="bottom-left" :dir="'rtl'" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
const { currentTheme, isDark } = useTheme()

        useHead({
              htmlAttrs: {
      'data-theme': currentTheme,
          class: computed(() => (isDark.value ? 'dark' : '')),
        },
})
</script>
