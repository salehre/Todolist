import { ref } from 'vue'
import { toast } from 'vue-sonner'
import api, { getErrorMessage } from '~/src/services/api'

// این دستگاه نوتیف می‌خواد یا نه (بعد از لاگ‌اوت/لاگین مجدد هم حفظ می‌شه)
const STORAGE_KEY = 'push-enabled'

const supported = ref(false)
const permission = ref<NotificationPermission>('default')
const enabled = ref(false)
const busy = ref(false)

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
    const padded = (base64 + '='.repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/')
    const raw = atob(padded)
    const out = new Uint8Array(new ArrayBuffer(raw.length))
    for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
    return out
}

function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
    return a.length === b.length && a.every((v, i) => v === b[i])
}

// اگه service worker ثبت نشده باشه ready هیچ‌وقت resolve نمی‌شه؛ پس timeout می‌ذاریم
async function getRegistration(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) return null
    return Promise.race([
        navigator.serviceWorker.ready,
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
    ])
}

async function subscribeAndRegister(): Promise<void> {
    const reg = await getRegistration()
    if (!reg) throw new Error('service worker آماده نیست؛ صفحه رو رفرش کن و دوباره امتحان کن')

    const { data } = await api.get('/push/public-key')
    if (!data.key) throw new Error('کلید VAPID روی سرور تنظیم نشده')
    const serverKey = urlBase64ToUint8Array(data.key)

    let sub = await reg.pushManager.getSubscription()
    if (sub?.options.applicationServerKey) {
        // اگه کلید VAPID عوض شده، اشتراک قبلی بی‌استفاده‌ست
        if (!sameBytes(new Uint8Array(sub.options.applicationServerKey), serverKey)) {
            await sub.unsubscribe()
            sub = null
        }
    }
    if (!sub) {
        sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: serverKey })
    }

    const json = sub.toJSON()
    const encodings: string[] = (PushManager as any).supportedContentEncodings ?? []
    await api.post('/push/subscribe', {
        endpoint: json.endpoint,
        keys: json.keys,
        contentEncoding: encodings.includes('aes128gcm') ? 'aes128gcm' : 'aesgcm',
    })
}

// اشتراک این دستگاه رو از سرور و مرورگر پاک می‌کنه (بدون دست زدن به STORAGE_KEY)
async function removeSubscription(): Promise<void> {
    const reg = await getRegistration()
    const sub = await reg?.pushManager.getSubscription()
    if (!sub) return
    await api.post('/push/unsubscribe', { endpoint: sub.endpoint }).catch(() => {})
    await sub.unsubscribe().catch(() => {})
}

export function usePushNotifications() {
    async function init(): Promise<void> {
        supported.value = typeof window !== 'undefined'
            && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
        if (!supported.value) return

        permission.value = Notification.permission
        const reg = await getRegistration()
        const sub = await reg?.pushManager.getSubscription()
        enabled.value = !!sub && permission.value === 'granted' && localStorage.getItem(STORAGE_KEY) === '1'
    }

    async function enable(): Promise<boolean> {
        if (!supported.value || busy.value) return false
        busy.value = true
        try {
            permission.value = await Notification.requestPermission()
            if (permission.value !== 'granted') {
                toast.error('اجازه‌ی نوتیفیکیشن داده نشد')
                return false
            }
            await subscribeAndRegister()
            localStorage.setItem(STORAGE_KEY, '1')
            enabled.value = true
            toast.success('نوتیفیکیشن فعال شد')
            return true
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'فعال‌سازی نوتیفیکیشن ناموفق بود'))
            return false
        } finally {
            busy.value = false
        }
    }

    async function disable(): Promise<void> {
        if (busy.value) return
        busy.value = true
        try {
            await removeSubscription()
            localStorage.setItem(STORAGE_KEY, '0')
            enabled.value = false
            toast.success('نوتیفیکیشن خاموش شد')
        } finally {
            busy.value = false
        }
    }

    // بعد از لاگین: اگه قبلاً روی این دستگاه فعال کرده بود، اشتراک برای کاربر فعلی ثبت می‌شه
    async function syncIfEnabled(): Promise<void> {
        if (!supported.value || Notification.permission !== 'granted') return
        if (localStorage.getItem(STORAGE_KEY) !== '1') return
        try {
            await subscribeAndRegister()
            enabled.value = true
        } catch {
            // بی‌صدا؛ دفعه‌ی بعد دوباره امتحان می‌شه
        }
    }

    // موقع لاگ‌اوت: نوتیف‌های این کاربر نباید روی این دستگاه بیاد
    async function removeForLogout(): Promise<void> {
        await removeSubscription()
        enabled.value = false
    }

    return { supported, permission, enabled, busy, init, enable, disable, syncIfEnabled, removeForLogout }
}