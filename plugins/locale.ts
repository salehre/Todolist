export default defineNuxtPlugin((nuxtApp) => {
  const { t } = useLocale()
  nuxtApp.vueApp.config.globalProperties.$t = t
})
