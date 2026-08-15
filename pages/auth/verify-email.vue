<template>
  <AuthCard
    title="تأیید ایمیل"
    :subtitle="`کد ۶ رقمی به ${maskedEmail} ارسال شد`"
    icon="mdi:email-check-outline"
  >
    <div class="space-y-6">

      <!-- ورودی‌های کد OTP -->
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
            'w-11 h-13 text-center text-xl font-bold rounded-xl border-2 outline-none',
            'transition-all duration-200 bg-white',
            isError
              ? 'border-rose-400 text-rose-600 bg-rose-50 shake'
              : otpDigits[i]
                ? 'border-primary-500 text-primary-700 shadow-sm shadow-primary-100'
                : 'border-slate-200 text-slate-800 focus:border-primary-400 focus:shadow-sm focus:shadow-primary-100',
          ]"
          @input="onDigitInput(i, $event)"
          @keydown="onKeyDown(i, $event)"
          @paste="onPaste($event)"
          @focus="($event.target as HTMLInputElement).select()"
        />
      </div>

      <!-- پیام خطا -->
      <Transition name="slide-down">
        <p v-if="isError" class="text-center text-sm text-rose-500 flex items-center justify-center gap-1">
          <Icon icon="mdi:alert-circle-outline" />
          کد وارد شده اشتباه است. دوباره تلاش کن
        </p>
      </Transition>

      <!-- دکمه تأیید -->
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

      <!-- ارسال مجدد -->
      <div class="text-center text-sm">
        <span v-if="countdown > 0" class="text-white/70">
          ارسال مجدد تا
          <span class="font-bold text-primary-300 tabular-nums">{{ formatCountdown }}</span>
        </span>
        <button
          v-else
          :disabled="isResending"
          @click="resendCode"
          class="text-primary-300 font-semibold hover:text-primary-200 disabled:opacity-50 transition-colors"
        >
          {{ isResending ? 'در حال ارسال...' : 'ارسال مجدد کد' }}
        </button>
      </div>

    </div>

    <template #footer>
      <button @click="router.back()" class="text-sm text-white/70 hover:text-white flex items-center gap-1 mx-auto transition-colors">
        <Icon icon="mdi:arrow-right" />
        بازگشت
      </button>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import { useAuth } from '@/composables/useAuth'

useHead(() => ({
  titleTemplate: `%s - Verify Email`
}))

const router = useRouter()
const { authState, verifyEmailCode, resendVerificationCode } = useAuth()

// ─── OTP State ────────────────────────────────────────────────────────────────
const otpDigits = ref<string[]>(['', '', '', '', '', ''])
const otpRefs = ref<HTMLInputElement[]>([])
const isLoading = ref(false)
const isResending = ref(false)
const isError = ref(false)

// ─── Countdown ────────────────────────────────────────────────────────────────
const RESEND_SECONDS = 120
const countdown = ref(RESEND_SECONDS)
let timer: ReturnType<typeof setInterval> | null = null

const formatCountdown = computed(() => {
  const m = Math.floor(countdown.value / 60)
  const s = countdown.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

function startCountdown() {
  countdown.value = RESEND_SECONDS
  timer = setInterval(() => {
    if (countdown.value <= 0) {
      clearInterval(timer!)
    } else {
      countdown.value--
    }
  }, 1000)
}

onMounted(startCountdown)
onUnmounted(() => { if (timer) clearInterval(timer) })

// ─── Computed ─────────────────────────────────────────────────────────────────
const isCodeComplete = computed(() => otpDigits.value.every(d => d !== ''))

watch(isCodeComplete, (complete) => {
  if (complete && !isLoading.value) verifyCode()
})

const maskedEmail = computed(() => {
  const email = authState.pendingEmail || 'ایمیل شما'
  const [user, domain] = email.split('@')
  if (!domain) return email
  return user.slice(0, 2) + '***@' + domain
})

// ─── OTP Input Logic ──────────────────────────────────────────────────────────
function onDigitInput(index: number, event: Event) {
  const val = (event.target as HTMLInputElement).value.replace(/\D/g, '')
  otpDigits.value[index] = val.slice(-1)
  isError.value = false

  if (val && index < 5) {
    otpRefs.value[index + 1]?.focus()
  }
}

function onKeyDown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowRight' && index > 0) otpRefs.value[index - 1]?.focus()
  if (event.key === 'ArrowLeft' && index < 5) otpRefs.value[index + 1]?.focus()
}

function onPaste(event: ClipboardEvent) {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) || ''
  pasted.split('').forEach((char, i) => {
    if (i < 6) otpDigits.value[i] = char
  })
  otpRefs.value[Math.min(pasted.length, 5)]?.focus()
}

// ─── Actions ──────────────────────────────────────────────────────────────────
async function verifyCode() {
  if (!isCodeComplete.value) return
  isLoading.value = true
  isError.value = false

  try {
    const code = otpDigits.value.join('')
    const success = await verifyEmailCode(code)

    if (success) {
      router.push('/auth/set-password')
    } else {
      isError.value = true
      otpDigits.value = ['', '', '', '', '', '']
      setTimeout(() => otpRefs.value[0]?.focus(), 50)
    }
  } finally {
    isLoading.value = false
  }
}

async function resendCode() {
  isResending.value = true
  try {
    await resendVerificationCode()
    startCountdown()
    otpDigits.value = ['', '', '', '', '', '']
    isError.value = false
    setTimeout(() => otpRefs.value[0]?.focus(), 50)
  } finally {
    isResending.value = false
  }
}
</script>

<style scoped>
.shake {
  animation: shake 0.4s ease;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from,
.slide-down-leave-to { opacity: 0; transform: translateY(-4px); }
</style>