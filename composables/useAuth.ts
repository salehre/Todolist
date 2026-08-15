// ─── useAuth composable ────────────────────────────────────────────────────
import api, { ensureCsrfCookie, getErrorMessage } from '~/src/services/api'
import { toast } from 'vue-sonner'
import { useLocale } from '~/composables/useLocale'

export interface AuthUser {
    id: number
    name: string
    username: string
    email: string
    phone?: string | null
    gender?: 'male' | 'female' | 'company' | null
    bio?: string | null
    theme?: string
    dark_mode?: boolean
    language?: 'fa' | 'en'
    avatar_url?: string | null
    cover_url?: string | null
    social_links?: { platform: string; url: string }[]
}

const authState = reactive({
    user: null as AuthUser | null,
    pendingEmail: '' as string,
    pendingUser: null as AuthUser | null,
    isLoggedIn: false,
})

export function useAuth() {

    const cachedCoverUrl = useCookie<string | null>('app-cover-url', {
        default: () => null,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
    })

    // ─── Signup Step 1: ثبت اطلاعات اولیه ─────────────────────────────────
    async function registerUser(data: AuthUser): Promise<void> {
        try {
            await ensureCsrfCookie()
            await api.post('/auth/register', data)
            authState.pendingUser = data
            authState.pendingEmail = data.email
            toast.success('کد تأیید برای ایمیلت ارسال شد')
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'ثبت‌نام ناموفق بود'))
            throw e
        }
    }

    // ─── Signup Step 2: ارسال مجدد کد تأیید ──────────────────────────────
    async function resendVerificationCode(): Promise<void> {
        try {
            await api.post('/auth/resend-code', { email: authState.pendingEmail })
            toast.success('کد جدید ارسال شد')
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'ارسال دوباره‌ی کد ناموفق بود'))
        }
    }

    // ─── Signup Step 3: تأیید کد ─────────────────────────────────────────
    async function verifyEmailCode(code: string): Promise<boolean> {
        try {
            const res = await api.post('/auth/verify-email', { email: authState.pendingEmail, code })
            return res.data.success
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'کد وارد شده اشتباهه یا منقضی شده'))
            return false
        }
    }

    // ─── Signup Step 4: تنظیم رمز عبور ──────────────────────────────────
    async function setPassword(password: string): Promise<boolean> {
        try {
            const res = await api.post('/auth/set-password', { email: authState.pendingEmail, password })
            authState.user = res.data.user
            authState.isLoggedIn = true
            authState.pendingUser = null
            authState.pendingEmail = ''
            useTheme().syncFromUser(res.data.user)
            useLocale().syncFromUser(res.data.user)
            cachedCoverUrl.value = res.data.user.cover_url ?? null
            toast.success(`خوش اومدی ${res.data.user.name}!`)
            return true
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'تنظیم رمز عبور ناموفق بود'))
            return false
        }
    }

    // ─── Login ────────────────────────────────────────────────────────────
    async function login(username: string, password: string, remember = false): Promise<boolean> {
        try {
            await ensureCsrfCookie()
            const res = await api.post('/auth/login', { username, password, remember })
            authState.user = res.data.user
            authState.isLoggedIn = true
            useTheme().syncFromUser(res.data.user)
            useLocale().syncFromUser(res.data.user)
            cachedCoverUrl.value = res.data.user.cover_url ?? null
            toast.success('خوش برگشتی!')
            return true
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'نام کاربری یا رمز عبور اشتباهه'))
            return false
        }
    }

    // ─── Forgot Password Step 1: درخواست ریست ────────────────────────────
    async function sendResetCode(email: string): Promise<void> {
        try {
            await ensureCsrfCookie()
            await api.post('/auth/forgot-password', { email })
            authState.pendingEmail = email
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'ارسال کد ناموفق بود؛ ایمیل رو چک کن'))
            throw e
        }
    }

    // ─── Forgot Password Step 2: تأیید کد و تنظیم رمز جدید ──────────────
    async function resetPassword(code: string, newPassword: string): Promise<boolean> {
        try {
            await api.post('/auth/reset-password', { email: authState.pendingEmail, code, password: newPassword })
            authState.pendingEmail = ''
            return true
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'کد وارد شده اشتباهه یا منقضی شده'))
            return false
        }
    }

    // ─── بازیابی سشن موقع لود اپ (بعد از رفرش صفحه) ──────────────────────
    async function fetchSession(): Promise<void> {
        try {
            const res = await api.get('/auth/userInfo')
            if (res.data.user) {
                authState.user = res.data.user
                useTheme().syncFromUser(res.data.user)
                useLocale().syncFromUser(res.data.user)
                cachedCoverUrl.value = res.data.user.cover_url ?? null
                authState.isLoggedIn = true
            }
        } catch {
            // سشن نامعتبره یا سرور در دسترس نیست؛ کاربر لاگین‌نشده در نظر گرفته می‌شه
            // (عمداً toast نداره — این تابع silent چک می‌شه، هر رفرش نباید پیام بده)
        }
    }

    // ─── Logout ───────────────────────────────────────────────────────────
    async function logout() {
        await api.post('/auth/logout').catch(() => {})
        authState.user = null
        authState.isLoggedIn = false
        cachedCoverUrl.value = null
        toast.success('خارج شدی')
    }

    // ─── ویرایش اطلاعات پروفایل ─────────────────────────────────────────
    async function updateProfile(data: { name: string; username: string; email: string; phone?: string; gender?: string; bio?: string; social_links?: { platform: string; url: string }[] }): Promise<boolean> {
        try {
            const res = await api.put('/auth/profile', data)
            authState.user = res.data.user
            toast.success('اطلاعات ذخیره شد')
            return true
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'ذخیره نشد، دوباره امتحان کن'))
            return false
        }
    }

    // ─────────────── آپلود عکس پروفایل ─────────────
    async function uploadAvatar(file: File): Promise<boolean> {
        const formData = new FormData()
        formData.append('avatar', file)
        try {
            const res = await api.post('/auth/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            authState.user = res.data.user
            toast.success('عکس پروفایل تغییر کرد')
            return true
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'آپلود عکس ناموفق بود'))
            return false
        }
    }

    // ────────────────── آپلود عکس کاور ───────────────
    async function uploadCover(file: File): Promise<boolean> {
        const formData = new FormData()
        formData.append('cover', file)
        try {
            const res = await api.post('/auth/cover', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            authState.user = res.data.user
            cachedCoverUrl.value = res.data.user.cover_url ?? null
            toast.success('عکس کاور تغییر کرد')
            return true
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'آپلود عکس کاور ناموفق بود'))
            return false
        }
    }

    return {
        authState: readonly(authState),
        registerUser,
        resendVerificationCode,
        verifyEmailCode,
        setPassword,
        login,
        sendResetCode,
        resetPassword,
        fetchSession,
        logout,
        updateProfile,
        uploadAvatar,
        uploadCover,
        cachedCoverUrl,
    }
}