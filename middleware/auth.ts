export default defineNuxtRouteMiddleware(async () => {
    const { authState, fetchSession } = useAuth()
    if (!authState.isLoggedIn) {
        await fetchSession()
    }
    if (!authState.isLoggedIn) {
        return navigateTo('/auth/login')
    }
})