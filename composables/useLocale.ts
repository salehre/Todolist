import en from '~/utils/locales/en.json'
import fa from '~/utils/locales/fa.json'

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

    function setLocale(value: AppLocale): void {
        locale.value = value
    }

    function t(key: string): string {
        return messages.value[key] || key
    }

    return { locale, direction, isRtl, messages, setLocale, t }
}