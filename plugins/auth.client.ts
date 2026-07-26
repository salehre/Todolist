export default defineNuxtPlugin(async () => {
  const { fetchSession } = useAuth()
  await fetchSession()
})
