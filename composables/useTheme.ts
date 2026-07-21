export type AppTheme = 'lime' | 'sky' | 'emerald'

export const themeOptions: { value: AppTheme; label: string; swatch: string }[] = [
    { value: 'lime', label: 'لیمویی', swatch: '#84cc16' },
    { value: 'sky', label: 'آبی آسمانی', swatch: '#0ea5e9' },
    { value: 'emerald', label: 'زمردی', swatch: '#10b981' },
]

// همون کلیدهایی که plugins/theme.client.ts موقع بوت شدن اپ استفاده
// می‌کنه، پس هر دو با هم sync‌ان
export function useTheme() {
    const currentTheme = useState<AppTheme>('app-theme', () => 'lime')
    const isDark = useState<boolean>('app-dark-mode', () => false)

    // اولین باری که این کامپوزبل تو کلاینت استفاده می‌شه، مقدار واقعی رو از
    // localStorage/attribute فعلی بخون تا با چیزی که پلاگین ست کرده sync بشه
    if (import.meta.client) {
        const attr = document.documentElement.getAttribute('data-theme') as AppTheme | null
        if (attr) currentTheme.value = attr
        isDark.value = document.documentElement.classList.contains('dark')
    }

    function setTheme(theme: AppTheme): void {
        currentTheme.value = theme
        if (import.meta.client) {
            document.documentElement.setAttribute('data-theme', theme)
            localStorage.setItem('app-theme', theme)
        }
    }

    function setDark(value: boolean): void {
        isDark.value = value
        if (import.meta.client) {
            document.documentElement.classList.toggle('dark', value)
            localStorage.setItem('app-dark-mode', String(value))
        }
    }

    function toggleDark(): void {
        setDark(!isDark.value)
    }

    return { currentTheme, setTheme, themeOptions, isDark, setDark, toggleDark }
}