<template>
  <AuthCard
    title="ورود به حساب"
    subtitle="خوش آمدی! اطلاعات خود را وارد کن"
    icon="mdi:login-variant"
  >
    <!-- پیام موفقیت ثبت‌نام -->
    <Transition name="slide-down">
      <div
        v-if="justRegistered"
        class="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2 text-sm text-emerald-700"
      >
        <Icon icon="mdi:check-circle-outline" class="text-lg flex-shrink-0" />
        ثبت‌نام با موفقیت انجام شد! حالا وارد شو
      </div>
    </Transition>

    <form class="space-y-4" @submit.prevent="handleLogin" novalidate>

      <!-- نام کاربری -->
      <AuthInput
        v-model="form.username"
        label="نام کاربری"
        placeholder="نام کاربری خود را وارد کن"
        autocomplete="username"
        :error="errors.username"
        required
        @blur="validateField('username')"
        @input="clearServerError"
      >
        <template #iconRight>
          <Icon icon="mdi:at" />
        </template>
      </AuthInput>

      <!-- رمز عبور -->
      <div>
        <div class="flex justify-between items-center mb-1.5">
          <NuxtLink to="/auth/forgot-password" class="text-xs text-primary-600 hover:text-primary-700 transition-colors">
            رمز عبور را فراموش کردی؟
          </NuxtLink>
          <label class="text-sm font-medium text-slate-700">رمز عبور <span class="text-rose-500">*</span></label>
        </div>
        <AuthInput
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="رمز عبور خود را وارد کن"
          autocomplete="current-password"
          :error="errors.password"
          @blur="validateField('password')"
          @input="clearServerError"
        >
          <template #iconRight>
            <Icon icon="mdi:lock-outline" />
          </template>
          <template #iconLeft>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Icon :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" />
            </button>
          </template>
        </AuthInput>
      </div>

      <!-- خطای سرور -->
      <Transition name="slide-down">
        <div
          v-if="serverError"
          class="rounded-xl bg-rose-50 border border-rose-200 p-3 flex items-center gap-2 text-sm text-rose-600"
        >
          <Icon icon="mdi:alert-circle-outline" class="text-lg flex-shrink-0" />
          {{ serverError }}
        </div>
      </Transition>

      <!-- دکمه ورود -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-l from-primary-600 to-primary-700
               text-white font-semibold text-sm transition-all duration-200
               hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-200
               active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
               flex items-center justify-center gap-2"
      >
        <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-lg" />
        <span>{{ isLoading ? 'در حال ورود...' : 'ورود' }}</span>
      </button>

      <!-- راهنمای شبیه‌سازی -->
      <div class="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 text-center">
        <Icon icon="mdi:information-outline" class="inline ml-1" />
        حالت آزمایشی: هر نام کاربری با رمز
        <span class="font-bold mx-1" dir="ltr">password123</span>
        وارد می‌شود
      </div>

    </form>

    <template #footer>
      <p class="text-sm text-slate-500">
        حساب نداری؟
        <NuxtLink to="/auth/signup" class="text-primary-600 font-medium hover:text-primary-700 mr-1">
          ثبت‌نام کن
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

const router = useRouter()
const route = useRoute()
const { login } = useAuth()

const isLoading = ref(false)
const showPassword = ref(false)
const serverError = ref('')
const justRegistered = ref(route.query.registered === 'true')

const form = reactive({ username: '', password: '' })
const errors = reactive({ username: '', password: '' })

function clearServerError() {
  serverError.value = ''
}

function validateField(field: 'username' | 'password') {
  errors[field] = ''
  if (field === 'username' && !form.username.trim()) errors.username = 'نام کاربری را وارد کن'
  if (field === 'password' && !form.password) errors.password = 'رمز عبور را وارد کن'
}

async function handleLogin() {
  validateField('username')
  validateField('password')
  if (Object.values(errors).some(Boolean)) return

  isLoading.value = true
  serverError.value = ''

  try {
    // TODO: جایگزین با → POST /api/auth/login
    const success = await login(form.username, form.password)

    if (success) {
      router.push('/mainTodo')
    } else {
      serverError.value = 'نام کاربری یا رمز عبور اشتباه است'
    }
  } catch {
    serverError.value = 'خطا در اتصال به سرور. دوباره تلاش کن'
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