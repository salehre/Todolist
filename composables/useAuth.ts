// ─── useAuth composable ────────────────────────────────────────────────────
// حالا به‌جای شبیه‌سازی، مستقیم با server/api/auth/*.ts که خودش با Sanity حرف می‌زنه کار می‌کنه.
// سشن لاگین با کوکی httpOnly نگه داشته می‌شه، نه با localStorage.
import api, {ensureCsrfCookie} from '~/src/services/api'
import { toast } from 'vue-sonner'

export interface AuthUser {
    name: string
    username: string
    email: string
    phone?: string | null
    gender?: 'male' | 'female' | 'company' | null
    theme?: string
    dark_mode?: boolean
    avatar_url?: string | null
    cover_url?: string | null
}

const authState = reactive({
    user: null as AuthUser | null,
    pendingEmail: '' as string,           // ایمیلی که در انتظار تأیید است
    pendingUser: null as AuthUser | null, // اطلاعات کاربر قبل از تأیید ایمیل
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
            toast.error(e?.response?.data?.message || 'ثبت‌نام ناموفق بود')
            throw e
        }
    }

    // ─── Signup Step 2: ارسال مجدد کد تأیید ──────────────────────────────
    async function resendVerificationCode(): Promise<void> {
        await api.post('/auth/resend-code', {email: authState.pendingEmail})

    }

    // ─── Signup Step 3: تأیید کد ─────────────────────────────────────────
    async function verifyEmailCode(code: string): Promise<boolean> {
        try {
            const res = await api.post('/auth/verify-email', {email: authState.pendingEmail, code})
            if (!res.data.success) toast.error('کد وارد شده اشتباهه')
            return res.data.success
        } catch {
            toast.error('کد وارد شده اشتباهه یا منقضی شده')
            return false
        }
    }

    // ─── Signup Step 4: تنظیم رمز عبور ──────────────────────────────────
    async function setPassword(password: string): Promise<void> {
        const res = await api.post('/auth/set-password', {email: authState.pendingEmail, password})
        authState.user = res.data.user
        authState.isLoggedIn = true
        authState.pendingUser = null
        authState.pendingEmail = ''
        useTheme().syncFromUser(res.data.user)
        cachedCoverUrl.value = res.data.user.cover_url ?? null
        toast.success(`خوش اومدی ${res.data.user.name}!`)
    }

    // ─── Login ────────────────────────────────────────────────────────────
    async function login(username: string, password: string): Promise<boolean> {
        try {
            await ensureCsrfCookie()
            const res = await api.post('/auth/login', {username, password})
            if (res.data.success && res.data.user) {
                authState.user = res.data.user
                authState.isLoggedIn = true
                useTheme().syncFromUser(res.data.user)
                cachedCoverUrl.value = res.data.user.cover_url ?? null
                toast.success('خوش برگشتی!')
                return true
            }
            toast.error('نام کاربری یا رمز عبور اشتباهه')
            return false
        } catch {
            toast.error('نام کاربری یا رمز عبور اشتباهه')
            return false
        }
    }

    // ─── Forgot Password Step 1: درخواست ریست ────────────────────────────
    async function sendResetCode(email: string): Promise<void> {
        await ensureCsrfCookie()
        await api.post('/auth/forgot-password', {email})
        authState.pendingEmail = email
    }

    // ─── Forgot Password Step 2: تأیید کد و تنظیم رمز جدید ──────────────
    async function resetPassword(code: string, newPassword: string): Promise<boolean> {
        const res = await api.post('/auth/reset-password', {email: authState.pendingEmail, code, password: newPassword})
        if (res.data.success) authState.pendingEmail = ''
        return res.data.success
    }

    // ─── بازیابی سشن موقع لود اپ (بعد از رفرش صفحه) ──────────────────────
    async function fetchSession(): Promise<void> {
        try {
            const res = await api.get('/auth/userInfo')
            if (res.data.user) {
                authState.user = res.data.user
                useTheme().syncFromUser(res.data.user)
                cachedCoverUrl.value = res.data.user.cover_url ?? null
                toast.success('خوش برگشتی!')
                authState.isLoggedIn = true
            }
        } catch {
            // سشن نامعتبره یا سرور در دسترس نیست؛ کاربر لاگین‌نشده در نظر گرفته می‌شه
        }
    }

    // ─── Logout ───────────────────────────────────────────────────────────
    async function logout() {
        await api.post('/auth/logout').catch(() => {
        })
        authState.user = null
        authState.isLoggedIn = false
        cachedCoverUrl.value = null
        toast.success('خارج شدی')
    }

    // ─── ویرایش اطلاعات پروفایل ─────────────────────────────────────────
    async function updateProfile(data: { name: string; username: string; email: string; phone?: string }): Promise<boolean> {
        try {
            const res = await api.put('/auth/profile', data)
            if (res.data.success) {
                authState.user = res.data.user
                toast.success('اطلاعات ذخیره شد')
                return true
            }
            return false
        } catch (e: any) {
            toast.error(e?.response?.data?.message || 'ذخیره نشد، دوباره امتحان کن')
            return false
        }

    }

    // ─── آپلود عکس پروفایل ───────────────────────────────────────────────
    async function uploadAvatar(file: File): Promise<boolean> {
        const formData = new FormData()
        formData.append('avatar', file)
        try {
            const res = await api.post('/auth/avatar', formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            })
            if (res.data.success) {
                authState.user = res.data.user
                toast.success('عکس پروفایل تغییر کرد')
                return true
            }
            return false
        } catch {
            toast.error('آپلود عکس ناموفق بود')
            return false
        }
    }

    async function uploadCover(file: File): Promise<boolean> {
        const formData = new FormData()
        formData.append('cover', file)
        try {
            const res = await api.post('/auth/cover', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            if (res.data.success) {
                authState.user = res.data.user
                cachedCoverUrl.value = res.data.user.cover_url ?? null
                toast.success('عکس کاور تغییر کرد')
                return true
            }
            return false
        } catch {
            toast.error('آپلود عکس کاور ناموفق بود')
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
