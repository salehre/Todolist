export default defineNuxtRouteMiddleware(async () => {
    const { authState, fetchSession } = useAuth()

    // اگه هنوز تو این session تشخیص داده نشده لاگینه یا نه (مثلاً بعد از رفرش
    // صفحه)، یه بار وضعیت واقعی رو از سرور می‌پرسیم قبل از رد کردن.
    if (!authState.isLoggedIn) {
        await fetchSession()
    }

    if (!authState.isLoggedIn) {
        return navigateTo('/auth/login')
    }
})