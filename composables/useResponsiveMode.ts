// وقتی سایدبار داشبورد بازه (w-64) فضای کمتری برای محتوا می‌مونه، پس باید زودتر
// (توی عرض‌های بزرگ‌تر) وارد حالت موبایل بشیم. وقتی جمع‌شده‌ست (w-[76px]) فضای
// بیشتری هست، پس آستانه‌ی مود موبایل کوچیک‌تره.
const DASHBOARD_OPEN_MOBILE_BREAKPOINT = 1300
const DASHBOARD_COLLAPSED_MOBILE_BREAKPOINT = 1000

export function useResponsiveMode() {
    // همون کلید shared state ای که DashboardSidebar.vue استفاده می‌کنه؛ اینجا
    // فقط می‌خونیمش، نه ست می‌کنیم.
    const desktopCollapsed = useState<boolean>('dashboard-sidebar-collapsed', () => false)

    const windowWidth = ref<number>(0)

    function updateWidth(): void {
        windowWidth.value = window.innerWidth
    }

    onMounted(() => {
        updateWidth()
        window.addEventListener('resize', updateWidth)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', updateWidth)
    })

    const isMobile = computed<boolean>(() => {
        const breakpoint = desktopCollapsed.value
            ? DASHBOARD_COLLAPSED_MOBILE_BREAKPOINT
            : DASHBOARD_OPEN_MOBILE_BREAKPOINT
        return windowWidth.value < breakpoint
    })

    return { isMobile }
}