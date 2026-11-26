import { watch } from 'vue'

export default defineNuxtPlugin(() => {
    const { authState } = useAuth()
    const push = usePushNotifications()

    push.init().then(() => {
        // بعد از init چون supported باید مشخص شده باشه
        watch(() => authState.isLoggedIn, (loggedIn) => {
            if (loggedIn) push.syncIfEnabled()
        }, { immediate: true })
    })

    // کلیک روی نوتیف وقتی اپ از قبل بازه: service worker پیام می‌فرسته
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data?.type === 'open-group' && event.data.groupId) {
                navigateTo({ path: '/workPlan', query: { group: String(event.data.groupId) } })
            }
        })
    }
})