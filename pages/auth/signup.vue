<template>
  <AuthCard
    title="ایجاد حساب کاربری"
    subtitle="برای شروع، اطلاعات خود را وارد کنید"
    icon="mdi:account-plus-outline"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit" novalidate>

      <!-- نام و نام خانوادگی -->
      <AuthInput
        v-model="form.name"
        label="نام و نام خانوادگی"
        placeholder="مثال: علی رضایی"
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
        label="نام کاربری"
        placeholder="مثال: ali_rezaei"
        autocomplete="username"
        :error="errors.username"
        :hint="!errors.username && form.username ? 'فقط حروف انگلیسی، عدد و آندرلاین مجاز است' : ''"
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
        label="آدرس ایمیل"
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
        class="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-l from-violet-600 to-indigo-600
               text-white font-semibold text-sm transition-all duration-200
               hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-violet-200
               active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
               flex items-center justify-center gap-2"
      >
        <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-lg" />
        <span>{{ isLoading ? 'در حال ارسال...' : 'ادامه' }}</span>
        <Icon v-if="!isLoading" icon="mdi:arrow-left" class="text-lg" />
      </button>

    </form>

    <template #footer>
      <p class="text-sm text-slate-500">
        قبلاً حساب داری؟
        <NuxtLink to="/auth/login" class="text-violet-600 font-medium hover:text-violet-700 mr-1">
          وارد شو
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
const { registerUser } = useAuth()

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
    if (!form.name.trim()) errors.name = 'نام الزامی است'
    else if (form.name.trim().length < 2) errors.name = 'نام باید حداقل ۲ کاراکتر باشد'
  }

  if (field === 'username') {
    if (!form.username.trim()) errors.username = 'نام کاربری الزامی است'
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username))
      errors.username = 'نام کاربری: ۳ تا ۲۰ کاراکتر، فقط انگلیسی، عدد و _'
  }

  if (field === 'email') {
    if (!form.email.trim()) errors.email = 'ایمیل الزامی است'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = 'فرمت ایمیل صحیح نیست'
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
    // TODO: جایگزین با → POST /api/auth/register
    await registerUser({ name: form.name, username: form.username, email: form.email })
    router.push('/auth/verify-email')
  } catch (e) {
    errors.email = 'خطا در ارسال اطلاعات. دوباره تلاش کن'
  } finally {
    isLoading.value = false
  }
}
</script>
