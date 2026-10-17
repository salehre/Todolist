<template>
  <AuthCard
      :title="$t('auth.signupTitle')"
      :subtitle="$t('auth.signupSubtitle')"
      icon="mdi:account-plus-outline"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit" novalidate>

      <!-- نام و نام خانوادگی -->
      <AuthInput
          v-model="form.name"
          :label="$t('auth.fullName')"
          :placeholder="$t('auth.exampleName')"
          autocomplete="name"
          :error="errors.name"
          required
          @blur="validateField('name')"
      >
        <template #iconRight>
          <Icon icon="mdi:account-outline" />
        </template>
      </AuthInput>

      <!-- نام کاربری -->
      <AuthInput
          v-model="form.username"
          :label="$t('auth.username')"
          :placeholder="$t('auth.exampleUsername')"
          autocomplete="username"
          :error="errors.username"
          :hint="!errors.username && form.username ? $t('auth.usernameHint') : ''"
          required
          @blur="validateField('username')"
      >
        <template #iconRight>
          <Icon icon="mdi:at" />
        </template>
      </AuthInput>

      <!-- ایمیل -->
      <AuthInput
          v-model="form.email"
          :label="$t('auth.emailAddress')"
          type="email"
          placeholder="example@gmail.com"
          autocomplete="email"
          :error="errors.email"
          required
          @blur="validateField('email')"
      >
        <template #iconRight>
          <Icon icon="mdi:email-outline" />
        </template>
      </AuthInput>

      <!-- دکمه ارسال -->
      <button
          type="submit"
          :disabled="isLoading"
          class="w-full mt-2 py-3 px-4 rounded-xl bg-linear-to-l from-primary-600 to-primary-700
               text-white font-semibold text-sm transition-all duration-200
               hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-200
               active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
               flex items-center justify-center gap-2"
      >
        <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-lg" />
        <span>{{ isLoading ? $t('auth.sending') : $t('auth.continue') }}</span>
      </button>

    </form>

    <template #footer>
      <p class="text-sm text-white/70">
        {{ $t('auth.alreadyHaveAccount') }}
        <NuxtLink to="/auth/login" class="text-primary-300 font-semibold hover:text-primary-200 ms-1 transition-colors">
          {{ $t('auth.loginCta') }}
        </NuxtLink>
      </p>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

import { ref, reactive } from 'vue'
import { Icon } from '@iconify/vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import AuthInput from '@/components/auth/AuthInput.vue'
import { useAuth } from '@/composables/useAuth'

useHead(() => ({
  titleTemplate: `%s - Sign Up`
}))

const router = useRouter()
const { registerUser } = useAuth()
const { t } = useLocale()

const isLoading = ref(false)

const form = reactive({
  name: '',
  username: '',
  email: '',
})

const errors = reactive({
  name: '',
  username: '',
  email: '',
})

// ─── Validation ───────────────────────────────────────────────────────────────
function validateField(field: keyof typeof form) {
  errors[field] = ''

  if (field === 'name') {
    if (!form.name.trim()) errors.name = t('auth.nameRequired')
    else if (form.name.trim().length < 2) errors.name = t('auth.nameMinLength')
  }

  if (field === 'username') {
    if (!form.username.trim()) errors.username = t('auth.usernameRequired')
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username))
      errors.username = t('auth.usernameFormat')
  }

  if (field === 'email') {
    if (!form.email.trim()) errors.email = t('auth.emailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = t('auth.emailInvalid')
  }
}

function validateAll(): boolean {
  ;(['name', 'username', 'email'] as const).forEach(validateField)
  return !Object.values(errors).some(Boolean)
}

// ─── Submit ───────────────────────────────────────────────────────────────────
async function handleSubmit() {
  if (!validateAll()) return

  isLoading.value = true
  try {
    await registerUser({ name: form.name, username: form.username, email: form.email })
    router.push('/auth/verify-email')
  } catch (e) {
    errors.email = t('auth.signupFailed')
  } finally {
    isLoading.value = false
  }
}
</script>