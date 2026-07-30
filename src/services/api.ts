import axios from 'axios'
import type { AxiosInstance } from 'axios'

// مستقیم به API لاراول وصل می‌شیم (Sanctum SPA - کوکی‌محور).
// withCredentials لازمه چون سشن با کوکی httpOnly نگه داشته می‌شه.

let realApi: AxiosInstance | null = null

function createApi(): AxiosInstance {
    const config = useRuntimeConfig()
    return axios.create({
        baseURL: config.public.apiBase,
        withCredentials: true,
        withXSRFToken: true,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
    })
}

// یه Proxy که axios instance رو فقط موقع اولین استفاده‌ی واقعی می‌سازه،
// نه موقع import شدن فایل (تا useRuntimeConfig بیرون از context صدا زده نشه)
const api = new Proxy({} as AxiosInstance, {
    get(_target, prop) {
        if (!realApi) realApi = createApi()
        const value = (realApi as any)[prop]
        return typeof value === 'function' ? value.bind(realApi) : value
    },
})

export async function ensureCsrfCookie(): Promise<void> {
    const config = useRuntimeConfig()
    const base = config.public.apiBase.replace(/\/api\/?$/, '')
    await axios.get(`${base}/sanctum/csrf-cookie`, { withCredentials: true })
}

// در انتهای src/services/api.ts
export function getErrorMessage(e: any, fallback: string): string {
    if (!e?.response) {
        return 'اتصال به سرور برقرار نشد. اینترنتت رو چک کن'
    }
    const status = e.response.status
    const data = e.response.data

    if (status === 419) return 'نشست شما منقضی شده؛ صفحه رو رفرش کن'
    if (status === 401) return 'برای این کار باید وارد حسابت بشی'
    if (status === 422) {
        // اگه لاراول یه خطای validation فیلد-به-فیلد فرستاده، همون رو نشون بده
        if (data?.errors) {
            const firstError = Object.values(data.errors)[0]
            if (Array.isArray(firstError) && firstError[0]) return firstError[0] as string
        }
        return data?.message || fallback
    }
    if (status >= 500) return 'مشکلی سمت سرور پیش اومد؛ بعداً دوباره امتحان کن'
    return data?.message || fallback
}

export default api