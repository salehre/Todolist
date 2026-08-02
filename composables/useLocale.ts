import en from '~/utils/locales/en.json'
import fa from '~/utils/locales/fa.json'
import api from '~/src/services/api'

export type AppLocale = 'fa' | 'en'
export type AppDirection = 'rtl' | 'ltr'

const MESSAGES: Record<AppLocale, Record<string, string>> = { fa, en }

export function useLocale() {

    const locale = useCookie<AppLocale>('app-locale', {
        default: () => 'fa',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
    })

    const messages = computed<Record<string, string>>(() => MESSAGES[locale.value])

    const direction = computed<AppDirection>(() => (messages.value.direction as AppDirection) || 'ltr')
    const isRtl = computed<boolean>(() => direction.value === 'rtl')

    function applyLocale(value: AppLocale): void {
        locale.value = value
    }

    function setLocale(value: AppLocale): void {
        applyLocale(value)
        api.put('/auth/preferences', { language: value }).catch(() => {})
    }

    function syncFromUser(user: { language?: string } | null): void {
        if (!user?.language) return
        applyLocale(user.language as AppLocale)
    }

    function t(key: string): string {
        return messages.value[key] || key
    }

    return { locale, direction, isRtl, messages, syncFromUser, setLocale, t }
}