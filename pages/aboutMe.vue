<template>
  <div class="h-full overflow-y-auto p-1">
    <div class="mx-auto flex max-w-6xl gap-6 px-1 pb-24">

      <!-- ستون اصلی -->
      <div class="min-w-0 flex-1 space-y-6 lg:max-w-3xl">

        <!-- هدر صفحه -->
        <div
            class="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
          <div
              class="relative flex h-40 flex-col items-center justify-center bg-linear-to-l from-primary-600 via-primary-500 to-primary-400 px-6 text-center sm:h-48">
            <div
                class="pointer-events-none absolute inset-0 opacity-10"
                style="background-image: radial-gradient(white 1px, transparent 1px); background-size: 22px 22px;"
            ></div>
            <h1 class="relative mt-2 text-2xl font-black text-white sm:text-3xl">درباره پروژه</h1>
          </div>

          <div class="space-y-4 p-6 md:p-8">
            <p class="text-base leading-8 text-slate-600">
              این پروژه با هدف ساخت یک ابزار ساده، سریع و کاربردی برای کاربران ساخته شده.
              تمرکز اصلی روی تجربه کاربری خوب و حل یک نیاز واقعیه.
            </p>
            <p class="text-sm leading-7 text-slate-400">
              هدف نهایی اینه که این پروژه به‌مرور تبدیل به یک ابزار کامل‌تر و حرفه‌ای‌تر بشه.
            </p>
          </div>
        </div>

        <!-- مهارت‌ها -->
        <div
            class="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl md:p-8">
          <h2 class="mt-2 text-lg font-bold text-slate-800">چی می‌سازم</h2>

          <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div
                v-for="skill in skills"
                :key="skill.title"
                class="group rounded-xl border border-slate-200/70 p-5 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md hover:shadow-primary-100"
            >
              <div
                  class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                <Icon :icon="skill.icon" class="text-lg"></Icon>
              </div>
              <h3 class="mt-4 text-sm font-semibold text-slate-700">{{ skill.title }}</h3>
              <div class="mt-3 flex flex-wrap gap-1.5">
                <span
                    v-for="tag in skill.tags"
                    :key="tag"
                    class="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-500"
                >{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- کارت حمایت، نسخه موبایل -->
        <div
            class="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl lg:hidden">
          <h2 class="text-lg font-bold text-slate-800">حمایت از پروژه</h2>
          <p class="mt-3 text-sm leading-7 text-slate-600">
            اگر این پروژه برات مفید بوده، می‌تونی با یه حمایت کوچیک کمک کنی که توسعه‌اش ادامه پیدا کنه.
          </p>

          <a
              href="http://www.coffeete.ir/salehrezaei"
              target="_blank"
              class="mt-4 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary-500 to-primary-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-primary-200 transition-all hover:from-primary-600 hover:to-primary-700 hover:-translate-y-0.5"
          >
            <Icon icon="mdi:coffee-outline" class="text-lg"></Icon>
            حمایت مالی
          </a>
        </div>

        <!-- فوتر: لینک‌ها -->
        <div
            class="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl md:p-8">
          <h2 class="mt-2 text-lg font-bold text-slate-800">جایی که می‌تونی پیدام کنی</h2>

          <div class="mt-5 flex flex-wrap gap-3">
            <a
                v-for="link in links"
                :key="link.label"
                :href="link.href"
                target="_blank"
                rel="noopener"
                class="group inline-flex h-11 w-11 items-center justify-center rounded-full text-primary-800 transition-all hover:text-primary-600"
            >
              <Icon :icon="link.icon" class="text-xl h-8 w-8 text-current transition-colors"/>
            </a>
          </div>

          <!-- سمت ارتباط با من -->
          <div class="mt-6 flex flex-col gap-3">
            <h2 class="text-lg font-bold text-slate-800">ارتباط با من</h2>

            <template v-if="authState.isLoggedIn">
              <input
                  type="text"
                  placeholder="اسمت (اختیاری)"
                  v-model="feedback.name"
                  class="w-full rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <textarea
                  rows="4"
                  placeholder="برام بنویس"
                  v-model="feedback.message"
                  class="w-full resize-none rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <button
                  type="button"
                  @click="sendFeedback"
                  :disabled="sending || !feedback.message.trim()"
                  class="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary-500 to-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-200 transition-all hover:from-primary-600 hover:to-primary-700 hover:-translate-y-0.5"
                  :class="{ 'cursor-not-allowed opacity-50 hover:translate-y-0': sending || !feedback.message.trim() }"
              >
                <Icon icon="mdi:send-outline" class="text-base"></Icon>
                {{ sending ? 'در حال ارسال...' : 'ارسال پیام' }}
              </button>
            </template>

            <div v-else class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <p class="text-sm text-slate-500">برای ارسال پیام اول باید وارد حسابت بشی.</p>
              <NuxtLink
                  to="/auth/login"
                  class="mt-3 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary-500 to-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-200 transition-all hover:from-primary-600 hover:to-primary-700"
              >
                <Icon icon="mdi:login" class="text-base" />
                ورود / ثبت‌نام
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- سایدبار حمایت، فقط دسکتاپ -->
      <aside class="hidden pe-5 w-80 shrink-0 lg:block">
        <div class="sticky top-5">
          <div
              class="relative text-center items-center flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 pt-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl">

            <!--            <div-->
            <!--                class="mt-2 flex w-full flex-col items-center gap-4 rounded-2xl border border-slate-200/70 bg-white p-5">-->
            <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://www.coffeete.ir/salehrezaei"
                alt="کد QR حمایت مالی"
                class="h-48 w-48 m-0 rounded-lg"
            />
            <!--            </div>-->
            <a
                href="http://www.coffeete.ir/salehrezaei"
                target="_blank"
                class="inline-flex"
            >
              <img
                  src="/images/coffee-rtl.png"
                  alt="حمایت مالی"
                  class="w-50 h-30"
              />
            </a>
          </div>
        </div>
      </aside>
    </div>

    <!-- دکمه شناور حمایت، فقط موبایل -->
    <a
        href="http://www.coffeete.ir/salehrezaei"
        target="_blank"
        class="fixed bottom-6 left-6 z-50 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-primary-500 to-primary-600 px-5 py-3 text-white shadow-lg shadow-primary-300/50 transition-transform hover:scale-105 lg:hidden"
    >
      <span class="relative flex h-2 w-2">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70"></span>
        <span class="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
      </span>
      <Icon icon="mdi:heart-outline" class="text-base"></Icon>
      <span class="text-sm font-medium">حمایت</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { reactive, ref } from 'vue'
import api from '~/src/services/api'
import { toast } from 'vue-sonner'
import { useAuth } from '~/composables/useAuth'

useHead(() => ({
  titleTemplate: `%s - About Me`
}))

definePageMeta({ layout: 'dashboard' })

const { authState } = useAuth()

const feedback = reactive({ name: '', message: '' })
const sending = ref(false)

async function sendFeedback() {
  if (!feedback.message.trim()) return
  sending.value = true
  try {
    await api.post('/feedback', feedback)
    toast.success('پیامت ارسال شد')
    feedback.name = ''
    feedback.message = ''
  } catch (e: any) {
    if (e?.response?.status === 401) {
      toast.error('برای ارسال پیام باید ثبت نام کنی')
    } else {
      toast.error('ارسال پیام ناموفق بود')
    }
  } finally {
    sending.value = false
  }
}

const skills = [
  { title: 'Frontend', tags: ['Vue', 'Nuxt', 'Tailwind'], icon: 'mdi:code-tags' },
  { title: 'Backend', tags: ['Laravel', 'API Design'], icon: 'mdi:server-outline' },
  { title: 'Other', tags: ['UI/UX', 'AI Tools'], icon: 'mdi:creation-outline' },
]

const links = [
  { label: 'GitHub', href: '#', icon: 'mdi:github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/saleh-rezaei-1985b5415/', icon: 'mdi:linkedin' },
  { label: 'Gmail', href: 'mailto:salehrezaeipoor123@gmail.com', icon: 'tabler:brand-gmail' },
  { label: 'Reddit', href: '#', icon: 'ic:outline-reddit' },
]
</script>