<template>
  <AuthCard
    :title="stepConfig.title"
    :subtitle="stepConfig.subtitle"
    :icon="stepConfig.icon"
  >
    <!-- نوار پیشرفت -->
    <div class="flex gap-2 mb-6" dir="ltr">
      <div
        v-for="s in 3"
        :key="s"
        class="h-1.5 flex-1 rounded-full transition-all duration-500"
        :class="s <= currentStep ? 'bg-primary-400 shadow-sm shadow-primary-400/50' : 'bg-white/15'"
      />
    </div>

    <!-- ─── مرحله ۱: ورود ایمیل ─────────────────────────────────────────── -->
    <Transition name="fade" mode="out-in">
      <form v-if="currentStep === 1" key="step1" class="space-y-4" @submit.prevent="sendCode" novalidate>

        <AuthInput
          v-model="email"
          label="آدرس ایمیل"
          type="email"
          :placeholder="$t('auth.emailPlaceholder')"
          autocomplete="email"
          :error="errors.email"
          required
          @blur="validateEmail"
        >
          <template #iconRight>
            <Icon icon="mdi:email-outline" />
          </template>
        </AuthInput>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 px-4 rounded-xl bg-linear-to-l from-primary-600 to-primary-700
                 text-white font-semibold text-sm transition-all duration-200
                 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-200
                 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2"
        >
          <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-lg" />
          <span>{{ isLoading ? $t('auth.sending') : $t('auth.sendCode') }}</span>
        </button>
      </form>

      <!-- ─── مرحله ۲: ورود کد OTP ──────────────────────────────────────── -->
      <div v-else-if="currentStep === 2" key="step2" class="space-y-5">

        <p class="text-center text-sm text-white/70">
          {{ $t('auth.codeSent') }} <span class="font-semibold text-white">{{ maskedEmail }}</span> {{ $t('auth.sent') }}
        </p>

        <!-- OTP inputs -->
        <div class="flex gap-2 justify-center" dir="ltr">
          <input
            v-for="(_, i) in 6"
            :key="i"
            :ref="el => (otpRefs[i] = el as HTMLInputElement)"
            v-model="otpDigits[i]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            :class="[
              'w-11 h-13 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200 bg-white',
              otpError ? 'border-rose-400 text-rose-600 bg-rose-50' :
              otpDigits[i] ? 'border-primary-500 text-primary-700' : 'border-slate-200 focus:border-primary-400',
            ]"
            @input="onDigitInput(i, $event)"
            @keydown="onKeyDown(i, $event)"
            @paste="onPaste($event)"
          />
        </div>

        <Transition name="slide-down">
          <p v-if="otpError" class="text-center text-sm text-rose-500 flex items-center justify-center gap-1">
            <Icon icon="mdi:alert-circle-outline" />
            {{ $t('auth.invalidCode') }}
          </p>
        </Transition>

        <!-- countdown -->
        <p class="text-center text-sm text-white/70">
          <span v-if="countdown > 0">{{ $t('auth.resendIn') }} <span class="font-bold text-primary-300 tabular-nums">{{ formatCountdown }}</span></span>
          <button v-else @click="resendCode" class="text-primary-300 font-semibold hover:text-primary-200 transition-colors">{{ $t('auth.resendCode') }}</button>
        </p>

        <button
          :disabled="!isCodeComplete || isLoading"
          @click="verifyCode"
          class="w-full py-3 px-4 rounded-xl bg-linear-to-l from-primary-600 to-primary-700
                 text-white font-semibold text-sm transition-all duration-200
                 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-200
                 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2"
        >
          <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-lg" />
          <span>{{ isLoading ? 'در حال بررسی...' : 'تأیید کد' }}</span>
        </button>
      </div>

      <!-- ─── مرحله ۳: رمز جدید ─────────────────────────────────────────── -->
      <form v-else-if="currentStep === 3" key="step3" class="space-y-4" @submit.prevent="submitNewPassword" novalidate>

        <div class="space-y-2">
          <AuthInput
            v-model="newPassword"
            :type="showPassword ? 'text' : 'password'"
            label="رمز عبور جدید"
            :placeholder="$t('auth.enterNewPassword')"
            autocomplete="new-password"
            :error="errors.newPassword"
            required
            @blur="validateNewPassword"
          >
            <template #iconRight><Icon icon="mdi:lock-outline" /></template>
            <template #iconLeft>
              <button type="button" @click="showPassword = !showPassword" class="text-slate-400 mt-2 hover:text-slate-600">
                <Icon :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" />
              </button>
            </template>
          </AuthInput>
          <PasswordStrength v-if="newPassword" :password="newPassword" />
        </div>

        <AuthInput
          v-model="confirmPassword"
          :type="showConfirm ? 'text' : 'password'"
          label="تکرار رمز عبور"
          :placeholder="$t('auth.confirmPassword')"
          autocomplete="new-password"
          :error="errors.confirmPassword"
          required
          @blur="validateConfirmPassword"
        >
          <template #iconRight><Icon icon="mdi:lock-check-outline" /></template>
          <template #iconLeft>
            <button type="button" @click="showConfirm = !showConfirm" class="text-slate-400 mt-2 hover:text-slate-600">
              <Icon :icon="showConfirm ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" />
            </button>
          </template>
        </AuthInput>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 px-4 rounded-xl bg-linear-to-l from-primary-600 to-primary-700
                 text-white font-semibold text-sm transition-all duration-200
                 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-200
                 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2"
        >
          <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-lg" />
          <span>{{ isLoading ? 'در حال ذخیره...' : 'ذخیره رمز جدید' }}</span>
          <Icon v-if="!isLoading" icon="mdi:check" />
        </button>

      </form>
    </Transition>

    <template #footer>
      <NuxtLink to="/auth/login" class="text-sm text-white/70 hover:text-white flex items-center gap-1 mx-auto transition-colors justify-center">
        {{ $t('auth.backToLogin') }}
      </NuxtLink>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
import {toast} from "vue-sonner";

definePageMeta({ layout: false })

import { ref, computed, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import AuthInput from '@/components/auth/AuthInput.vue'
import PasswordStrength from '@/components/auth/PasswordStrength.vue'
import { useAuth } from '@/composables/useAuth'
import api from '~/src/services/api'

useHead(() => ({
  titleTemplate: `%s - Forget Password`
}))

const router = useRouter()
const { sendResetCode, resetPassword } = useAuth()
const { t } = useLocale()

// ─── Steps ────────────────────────────────────────────────────────────────────
const currentStep = ref(1)

const stepConfig = computed(() => ({
  1: { title: t('auth.forgotTitle'), subtitle: t('auth.forgotSubtitle'), icon: 'mdi:lock-question' },
  2: { title: t('auth.confirmEmail'), subtitle: t('auth.enterCodeSubtitle'), icon: 'mdi:email-check-outline' },
  3: { title: t('auth.newPasswordTitle'), subtitle: t('auth.setNewPassword'), icon: 'mdi:lock-reset' },
}[currentStep.value]!))

// ─── State ────────────────────────────────────────────────────────────────────
const isLoading = ref(false)
const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const otpDigits = ref<string[]>(['', '', '', '', '', ''])
const otpRefs = ref<HTMLInputElement[]>([])
const otpError = ref(false)

const errors = reactive({
  email: '',
  newPassword: '',
  confirmPassword: '',
})

// ─── Countdown ────────────────────────────────────────────────────────────────
const countdown = ref(120)
let timer: ReturnType<typeof setInterval> | null = null

const formatCountdown = computed(() => {
  const m = Math.floor(countdown.value / 60)
  const s = countdown.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

function startCountdown() {
  if (timer) clearInterval(timer)
  countdown.value = 120
  timer = setInterval(() => { if (countdown.value > 0) countdown.value-- }, 1000)
}

onUnmounted(() => { if (timer) clearInterval(timer) })

// ─── Computed ─────────────────────────────────────────────────────────────────
const maskedEmail = computed(() => {
  const [user, domain] = email.value.split('@')
  if (!domain) return email.value
  return user.slice(0, 2) + '***@' + domain
})

const isCodeComplete = computed(() => otpDigits.value.every(d => d !== ''))

watch(isCodeComplete, (complete) => {
  if (complete && currentStep.value === 2 && !isLoading.value) verifyCode()
})

// ─── Validation ───────────────────────────────────────────────────────────────
function validateEmail() {
  errors.email = ''
  if (!email.value.trim()) errors.email = t('auth.emailRequired')
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) errors.email = t('auth.emailInvalid')
}

function validateNewPassword() {
  errors.newPassword = ''
  if (!newPassword.value) errors.newPassword = t('auth.passwordRequired')
  else if (newPassword.value.length < 8) errors.newPassword = t('auth.passwordMinEight')
}

function validateConfirmPassword() {
  errors.confirmPassword = ''
  if (newPassword.value !== confirmPassword.value) errors.confirmPassword = t('auth.passwordsDoNotMatch')
}

// ─── OTP handlers ─────────────────────────────────────────────────────────────
function onDigitInput(index: number, event: Event) {
  const val = (event.target as HTMLInputElement).value.replace(/\D/g, '')
  otpDigits.value[index] = val.slice(-1)
  otpError.value = false
  if (val && index < 5) otpRefs.value[index + 1]?.focus()
}

function onKeyDown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) otpRefs.value[index - 1]?.focus()
}

function onPaste(event: ClipboardEvent) {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) || ''
  pasted.split('').forEach((char, i) => { if (i < 6) otpDigits.value[i] = char })
  otpRefs.value[Math.min(pasted.length, 5)]?.focus()
}

// ─── Actions ──────────────────────────────────────────────────────────────────
async function sendCode() {
  validateEmail()
  if (errors.email) return

  isLoading.value = true
  try {
    // TODO: جایگزین با → POST /api/auth/forgot-password
    await sendResetCode(email.value)
    currentStep.value = 2
    startCountdown()
    setTimeout(() => otpRefs.value[0]?.focus(), 200)
  } finally {
    isLoading.value = false
  }
}

async function verifyCode() {
  isLoading.value = true
  otpError.value = false
  try {
    const res = await api.post('/auth/verify-reset-code', { email: email.value, code: otpDigits.value.join('') })
    if (res.data.success) {
      currentStep.value = 3
    } else {
      otpError.value = true
      otpDigits.value = ['', '', '', '', '', '']
      setTimeout(() => otpRefs.value[0]?.focus(), 50)
    }
  } finally {
    toast.error('code is not correct')
    isLoading.value = false
  }
}

async function resendCode() {
  await sendResetCode(email.value)
  startCountdown()
  otpDigits.value = ['', '', '', '', '', '']
}

async function submitNewPassword() {
  validateNewPassword()
  validateConfirmPassword()
  if (Object.values(errors).some(Boolean)) return

  isLoading.value = true
  try {
        const ok = await resetPassword(otpDigits.value.join(''), newPassword.value)
            if (ok) {
            router.push('/auth/login?reset=true')
          } else {
            // کد اشتباه/منقضیه؛ برگرد مرحله‌ی ۲ و پیام خطا رو اونجا نشون بده
                currentStep.value = 2
            otpError.value = true
            otpDigits.value = ['', '', '', '', '', '']
                setTimeout(() => otpRefs.value[0]?.focus(), 50)
              }
  } catch {
    errors.newPassword = 'خطا در ذخیره رمز. دوباره تلاش کن'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.25s ease; }
.fade-enter-from { opacity: 0; transform: translateX(-12px); }
.fade-leave-to { opacity: 0; transform: translateX(12px); }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-4px); }
</style>