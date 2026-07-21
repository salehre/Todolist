// ─── useAuth composable ────────────────────────────────────────────────────
// مدیریت state احراز هویت در کل اپ
// وقتی API آماده شد، توابع simulate رو با axios واقعی جایگزین کن

export interface AuthUser {
  name: string
  username: string
  email: string
}

const authState = reactive({
  user: null as AuthUser | null,
  pendingEmail: '' as string,     // ایمیلی که در انتظار تأیید است
  pendingUser: null as AuthUser | null, // اطلاعات کاربر قبل از تأیید ایمیل
  token: null as string | null,
  isLoggedIn: false,
})

export function useAuth() {

  // ─── Signup Step 1: ثبت اطلاعات اولیه ─────────────────────────────────
  // TODO: جایگزین با → POST /api/auth/register
  async function registerUser(data: AuthUser): Promise<void> {
    await simulateDelay(800)
    // شبیه‌سازی: ذخیره موقت اطلاعات
    authState.pendingUser = data
    authState.pendingEmail = data.email
  }

  // ─── Signup Step 2: ارسال مجدد کد تأیید ──────────────────────────────
  // TODO: جایگزین با → POST /api/auth/resend-code
  async function resendVerificationCode(): Promise<void> {
    await simulateDelay(600)
    console.log('[SIMULATE] کد جدید به', authState.pendingEmail, 'ارسال شد')
  }

  // ─── Signup Step 3: تأیید کد ─────────────────────────────────────────
  // TODO: جایگزین با → POST /api/auth/verify-email  { email, code }
  async function verifyEmailCode(code: string): Promise<boolean> {
    await simulateDelay(700)
    // شبیه‌سازی: کد صحیح = 123456
    return code === '123456'
  }

  // ─── Signup Step 4: تنظیم رمز عبور ──────────────────────────────────
  // TODO: جایگزین با → POST /api/auth/set-password  { email, password }
  async function setPassword(password: string): Promise<void> {
    await simulateDelay(800)
    authState.user = authState.pendingUser
    authState.isLoggedIn = true
    authState.token = 'simulated-token-' + Date.now()
    // پاک‌سازی state موقت
    authState.pendingUser = null
    authState.pendingEmail = ''
  }

  // ─── Login ────────────────────────────────────────────────────────────
  // TODO: جایگزین با → POST /api/auth/login  { username, password }
  async function login(username: string, password: string): Promise<boolean> {
    await simulateDelay(800)
    // شبیه‌سازی: هر کاربری با رمز "password123" می‌تواند وارد شود
    if (password === 'password123') {
      authState.user = { name: 'کاربر', username, email: username + '@example.com' }
      authState.isLoggedIn = true
      authState.token = 'simulated-token-' + Date.now()
      return true
    }
    return false
  }

  // ─── Forgot Password Step 1: درخواست ریست ────────────────────────────
  // TODO: جایگزین با → POST /api/auth/forgot-password  { email }
  async function sendResetCode(email: string): Promise<void> {
    await simulateDelay(700)
    authState.pendingEmail = email
    console.log('[SIMULATE] کد ریست به', email, 'ارسال شد')
  }

  // ─── Forgot Password Step 2: تأیید کد و تنظیم رمز جدید ──────────────
  // TODO: جایگزین با → POST /api/auth/reset-password  { email, code, password }
  async function resetPassword(code: string, newPassword: string): Promise<boolean> {
    await simulateDelay(800)
    // شبیه‌سازی: کد صحیح = 123456
    if (code === '123456') {
      authState.pendingEmail = ''
      return true
    }
    return false
  }

  // ─── Logout ───────────────────────────────────────────────────────────
  function logout() {
    authState.user = null
    authState.isLoggedIn = false
    authState.token = null
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
    logout,
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function simulateDelay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
