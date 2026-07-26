import api from '~/src/services/api'

export type AppTheme = 'sky' | 'emerald' | 'orange' | 'rose'

export const themeOptions: { value: AppTheme; label: string; swatch: string }[] = [
    { value: 'sky', label: 'آبی آسمانی', swatch: '#0ea5e9' },
    { value: 'emerald', label: 'زمردی', swatch: '#10b981' },
    { value: 'orange', label: 'نارنجی', swatch: '#f97316' },
    { value: 'rose', label: 'رز', swatch: '#f43f5e' },
]

export function useTheme() {
    // useCookie هم سمت سرور (موقع SSR) هم سمت کلاینت خونده می‌شه،
    // برخلاف localStorage که فقط کلاینت در دسترسه.
    const currentTheme = useCookie<AppTheme>('app-theme', {
        default: () => 'sky',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
    })

    const isDark = useCookie<boolean>('app-dark-mode', {
        default: () => false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
    })

    function applyTheme(theme: AppTheme): void {
        currentTheme.value = theme
    }

    function applyDark(value: boolean): void {
        isDark.value = value
    }

    function syncFromUser(user: { theme?: string; dark_mode?: boolean } | null): void {
        if (!user) return
        if (user.theme) applyTheme(user.theme as AppTheme)
        if (typeof user.dark_mode === 'boolean') applyDark(user.dark_mode)
    }

    function setTheme(theme: AppTheme): void {
        applyTheme(theme)
        api.put('/auth/preferences', { theme }).catch(() => {})
    }

    function setDark(value: boolean): void {
        applyDark(value)
        api.put('/auth/preferences', { dark_mode: value }).catch(() => {})
    }

    function toggleDark(): void {
        setDark(!isDark.value)
    }

    return { currentTheme, setTheme, themeOptions, isDark, setDark, toggleDark, syncFromUser }
}