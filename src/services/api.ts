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

export default api