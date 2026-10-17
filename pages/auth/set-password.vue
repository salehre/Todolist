<template>
  <AuthCard
    :title="$t('auth.setPasswordTitle')"
    :subtitle="$t('auth.setPasswordSubtitle')"
    icon="mdi:lock-plus-outline"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit" novalidate>

      <!-- رمز عبور -->
      <div class="space-y-2">
        <AuthInput
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          :label="$t('auth.password')"
          :placeholder="$t('auth.enterPassword')"
          autocomplete="new-password"
          :error="errors.password"
          required
          @blur="validateField('password')"
        >
          <template #iconRight>
            <Icon icon="mdi:lock-outline" />
          </template>
          <template #iconLeft>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="text-slate-400 hover:text-slate-600 transition-colors"
              :aria-label="showPassword ? $t('auth.hidePassword') : $t('auth.showPassword')"
            >
              <Icon :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" />
            </button>
          </template>
        </AuthInput>

        <!-- قدرت‌سنج رمز -->
        <PasswordStrength v-if="form.password" :password="form.password" />
      </div>

      <!-- تکرار رمز عبور -->
      <AuthInput
        v-model="form.confirmPassword"
        :type="showConfirm ? 'text' : 'password'"
        :label="$t('auth.repeatPassword')"
        :placeholder="$t('auth.confirmPassword')"
        autocomplete="new-password"
        :error="errors.confirmPassword"
        required
        @blur="validateField('confirmPassword')"
      >
        <template #iconRight>
          <Icon icon="mdi:lock-check-outline" />
        </template>
        <template #iconLeft>
          <button
            type="button"
            @click="showConfirm = !showConfirm"
            class="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Icon :icon="showConfirm ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" />
          </button>
        </template>
      </AuthInput>

      <!-- نشانگر تطابق -->
      <Transition name="slide-down">
        <div
          v-if="form.password && form.confirmPassword"
          class="flex items-center gap-2 text-xs font-medium justify-end"
          :class="passwordsMatch ? 'text-emerald-300' : 'text-rose-300'"
        >
          <span>{{ passwordsMatch ? $t('auth.passwordsMatchIndicator') : $t('auth.passwordsMismatchIndicator') }}</span>
          <Icon :icon="passwordsMatch ? 'mdi:check-circle' : 'mdi:close-circle'" />
        </div>
      </Transition>

      <!-- دکمه ثبت‌نهایی -->
      <button
        type="submit"
        :disabled="isLoading || !canSubmit"
        class="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-l from-primary-600 to-primary-700
               text-white font-semibold text-sm transition-all duration-200
               hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-200
               active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
               flex items-center justify-center gap-2"
      >
        <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-lg" />
        <span>{{ isLoading ? $t('auth.registering') : $t('auth.completeSignup') }}</span>
        <Icon v-if="!isLoading" icon="mdi:check" class="text-lg" />
      </button>

    </form>
  </AuthCard>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

import { ref, reactive, computed } from 'vue'
import { Icon } from '@iconify/vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import AuthInput from '@/components/auth/AuthInput.vue'
import PasswordStrength from '@/components/auth/PasswordStrength.vue'
import { useAuth } from '@/composables/useAuth'

useHead(() => ({
  titleTemplate: `%s - Set Password`
}))

const router = useRouter()
const { setPassword } = useAuth()
const { t } = useLocale()

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirm = ref(false)

const form = reactive({
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  password: '',
  confirmPassword: '',
})

// ─── Computed ─────────────────────────────────────────────────────────────────
const passwordsMatch = computed(
  () => form.password === form.confirmPassword && form.confirmPassword !== ''
)

const canSubmit = computed(
  () => form.password.length >= 8 && passwordsMatch.value
)

// ─── Validation ───────────────────────────────────────────────────────────────
function validateField(field: 'password' | 'confirmPassword') {
  errors[field] = ''

  if (field === 'password') {
    if (!form.password) errors.password = t('auth.passwordRequired')
    else if (form.password.length < 8) errors.password = t('auth.passwordMinLength')
  }

  if (field === 'confirmPassword') {
    if (!form.confirmPassword) errors.confirmPassword = t('auth.confirmPasswordRequired')
    else if (form.password !== form.confirmPassword) errors.confirmPassword = t('auth.passwordsDoNotMatch')
  }
}

// ─── Submit ───────────────────────────────────────────────────────────────────
async function handleSubmit() {
  validateField('password')
  validateField('confirmPassword')
  if (Object.values(errors).some(Boolean)) return

  isLoading.value = true
  try {
    // TODO: جایگزین با → POST /api/auth/set-password
    const ok = await setPassword(form.password)
    if (ok) router.push('/auth/login?registered=true')
  } catch {
    errors.password = 'خطا در تنظیم رمز عبور. دوباره تلاش کن'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from,
.slide-down-leave-to { opacity: 0; transform: translateY(-4px); }
</style>