<template>
  <div>
    <Toaster rich-colors position="bottom-left" :dir="direction" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
const { currentTheme, isDark } = useTheme()
const { locale, direction } = useLocale()

useHead({
  htmlAttrs: {
    lang: locale,
    dir: direction,
    'data-theme': currentTheme,
    class: computed(() => (isDark.value ? 'dark' : '')),
  },
})
</script>