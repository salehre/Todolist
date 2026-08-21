<template>
  <div class="min-h-screen bg-primary-50 text-slate-800">

    <!-- ─── نوبار بالا ────────────────────────────────────────────────── -->
    <header class="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <div class="flex items-center gap-2">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200">
            <Icon icon="mdi:format-list-checks" class="text-xl" />
          </div>
          <span class="text-base font-black text-slate-800">تودولیست</span>
        </div>

        <nav class="hidden items-center gap-1 md:flex">
          <a
              v-for="link in navLinks"
              :key="link.label"
              :href="link.href"
              class="rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >{{ link.label }}</a>
        </nav>

        <div class="flex items-center gap-2">
          <button
              v-tooltip="'تغییر تم'"
              @click="toggleDark"
              class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <MorphIcon :icon="isDark ? heroMoon : heroSun" spring="smooth" class="text-lg" :size="18" />
          </button>

          <NuxtLink
              v-if="authState.isLoggedIn"
              to="/mainTodo"
              class="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-200 transition-all hover:from-primary-600 hover:to-primary-700"
          >
            <Icon icon="mdi:view-dashboard-outline" class="text-base" />
            <span class="hidden sm:inline">برو به داشبورد</span>
          </NuxtLink>
          <NuxtLink
              v-else
              to="/auth/login"
              class="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-200 transition-all hover:from-primary-600 hover:to-primary-700"
          >
            <Icon icon="mdi:login" class="text-base" />
            <span>ورود</span>
          </NuxtLink>
        </div>
      </div>
    </header>

    <main>
      <!-- ─── هیرو ──────────────────────────────────────────────────── -->
      <section class="relative overflow-hidden px-5 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div
            class="pointer-events-none absolute inset-0 opacity-[0.07]"
            style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 24px 24px;"
        ></div>
        <div class="pointer-events-none absolute -top-24 -end-24 h-72 w-72 rounded-full bg-primary-300/40 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -start-24 h-72 w-72 rounded-full bg-primary-200/50 blur-3xl"></div>

        <div class="relative mx-auto max-w-3xl text-center">
          <span class="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-white/80 px-3 py-1 text-xs font-semibold text-primary-700 shadow-sm">
            <Icon icon="mdi:sparkles-outline" class="text-sm" />
            کارها رو ساده‌تر انجام بده
          </span>

          <h1 class="mt-5 text-3xl font-black leading-tight text-slate-800 sm:text-5xl">
            کارهاتو بسپار به یه
            <span class="bg-linear-to-l from-primary-600 to-primary-400 bg-clip-text text-transparent">تودولیست هوشمند</span>
          </h1>

          <p class="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-500">
            وظایف روزانه، پروژه‌های تیمی و برنامه‌های شخصیت رو یک‌جا مدیریت کن؛
            با اولویت‌بندی، مراحل قابل پیگیری و یادآوری‌های ساده.
          </p>

          <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
            <NuxtLink
                v-for="btn in mainButtons"
                :key="btn.label"
                :to="btn.to"
                class="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary-700 shadow-lg shadow-primary-100 ring-1 ring-primary-100 transition-all hover:-translate-y-0.5 hover:bg-primary-600 hover:text-white hover:ring-primary-600"
            >
              <Icon :icon="btn.icon" class="text-lg" />
              {{ btn.label }}
            </NuxtLink>
          </div>

          <div class="mx-auto mt-10 flex max-w-lg flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <div v-for="stat in stats" :key="stat.label" class="text-center">
              <div class="text-xl font-black text-primary-700">{{ stat.value }}</div>
              <div class="text-xs text-slate-400">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── امکانات / راه‌های کار ─────────────────────────────────── -->
      <section id="features" class="px-5 py-16">
        <div class="mx-auto max-w-6xl">
          <div class="mx-auto max-w-xl text-center">
            <h2 class="text-2xl font-black text-slate-800 sm:text-3xl">هر جور دوست داری کار کن</h2>
            <p class="mt-3 text-sm leading-7 text-slate-500">
              سه فضای متفاوت برای سه نوع نیاز؛ هر کدوم رو که لازم داری انتخاب کن.
            </p>
          </div>

          <div class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <NuxtLink
                v-for="feature in features"
                :key="feature.title"
                :to="feature.to"
                class="group rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary-300 hover:shadow-primary-100"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                <Icon :icon="feature.icon" class="text-2xl" />
              </div>
              <h3 class="mt-5 text-base font-bold text-slate-800">{{ feature.title }}</h3>
              <p class="mt-2 text-sm leading-7 text-slate-500">{{ feature.description }}</p>
              <span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
                برو بریم
                <Icon icon="mdi:arrow-left" class="text-base transition-transform group-hover:-translate-x-1" />
              </span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- ─── چرا این تودولیست؟ ────────────────────────────────────── -->
      <section class="px-5 py-16">
        <div class="mx-auto max-w-6xl rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl md:p-10">
          <h2 class="text-center text-2xl font-black text-slate-800 sm:text-3xl">چرا این تودولیست؟</h2>

          <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="perk in perks" :key="perk.title" class="text-center">
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon :icon="perk.icon" class="text-2xl" />
              </div>
              <h3 class="mt-4 text-sm font-bold text-slate-700">{{ perk.title }}</h3>
              <p class="mt-2 text-xs leading-6 text-slate-500">{{ perk.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── آخرین اخبار ──────────────────────────────────────────── -->
      <section id="news" class="px-5 py-16">
        <div class="mx-auto max-w-6xl">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 class="text-2xl font-black text-slate-800 sm:text-3xl">آخرین اخبار</h2>
              <p class="mt-2 text-sm text-slate-500">تازه‌ترین تغییرات و به‌روزرسانی‌های پروژه</p>
            </div>
            <NuxtLink to="/aboutMe" class="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700">
              همه‌ی خبرها
              <Icon icon="mdi:arrow-left" class="text-base" />
            </NuxtLink>
          </div>

          <!-- در حال بارگذاری -->
          <div v-if="newsLoading" class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div
                v-for="i in 3"
                :key="i"
                class="h-40 animate-pulse rounded-2xl border border-slate-200/70 bg-white/60"
            ></div>
          </div>

          <!-- خطا در گرفتن اخبار -->
          <div
              v-else-if="newsError"
              class="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center"
          >
            <Icon icon="mdi:cloud-alert-outline" class="mx-auto text-3xl text-slate-300" />
            <p class="mt-3 text-sm text-slate-500">اخبار در حال حاضر در دسترس نیست.</p>
          </div>

          <!-- هیچ خبری موجود نیست -->
          <div
              v-else-if="!news.length"
              class="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center"
          >
            <Icon icon="mdi:newspaper-variant-outline" class="mx-auto text-3xl text-slate-300" />
            <p class="mt-3 text-sm text-slate-500">فعلاً خبری ثبت نشده.</p>
          </div>

          <div v-else class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article
                v-for="item in news"
                :key="item.id"
                class="flex flex-col rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary-300"
            >
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700">
                  <Icon :icon="item.icon" class="text-sm" />
                  {{ item.tag }}
                </span>
                <span class="text-xs text-slate-400">{{ item.date }}</span>
              </div>
              <h3 class="mt-4 text-sm font-bold text-slate-800">{{ item.title }}</h3>
              <p class="mt-2 flex-1 text-sm leading-7 text-slate-500">{{ item.excerpt }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- ─── دعوت به شروع ─────────────────────────────────────────── -->
      <section class="px-5 pb-16">
        <div class="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-linear-to-l from-primary-600 via-primary-500 to-primary-400 px-6 py-12 text-center shadow-lg shadow-primary-200 sm:px-12">
          <h2 class="text-2xl font-black text-white sm:text-3xl">همین امروز شروع کن</h2>
          <p class="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/90">
            ثبت‌نام رایگانه و کمتر از یک دقیقه طول می‌کشه تا اولین کارتو اضافه کنی.
          </p>
          <NuxtLink
              :to="authState.isLoggedIn ? '/mainTodo' : '/auth/signup'"
              class="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-lg transition-all hover:-translate-y-0.5"
          >
            <Icon icon="mdi:rocket-launch-outline" class="text-lg" />
            {{ authState.isLoggedIn ? 'برو به داشبورد' : 'شروع کن، رایگانه' }}
          </NuxtLink>
        </div>
      </section>
    </main>

    <!-- ─── فوتر ──────────────────────────────────────────────────── -->
    <footer id="contact" class="border-t border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div class="mx-auto max-w-6xl px-5 py-12">
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-4">

          <!-- درباره -->
          <div class="lg:col-span-1">
            <div class="flex items-center gap-2">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-600 text-white">
                <Icon icon="mdi:format-list-checks" class="text-xl" />
              </div>
              <span class="text-base font-black text-slate-800">تودولیست</span>
            </div>
            <p class="mt-4 text-sm leading-7 text-slate-500">
              ابزاری ساده و سریع برای مدیریت کارهای روزانه، پروژه‌های تیمی و برنامه‌های شخصی.
            </p>
            <div class="mt-5 flex flex-wrap gap-2">
              <a
                  v-for="link in socialLinks"
                  :key="link.label"
                  :href="link.href"
                  target="_blank"
                  rel="noopener"
                  class="flex h-9 w-9 items-center justify-center rounded-full text-primary-800 transition-colors hover:text-primary-600"
              >
                <Icon :icon="link.icon" class="text-lg" />
              </a>
            </div>
          </div>

          <!-- لینک‌های مهم -->
          <div>
            <h3 class="text-sm font-bold text-slate-800">صفحه‌های مهم</h3>
            <ul class="mt-4 space-y-2.5">
              <li v-for="link in siteLinks" :key="link.label">
                <NuxtLink :to="link.to" class="text-sm text-slate-500 transition-colors hover:text-primary-600">
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- حساب کاربری -->
          <div>
            <h3 class="text-sm font-bold text-slate-800">حساب کاربری</h3>
            <ul class="mt-4 space-y-2.5">
              <li>
                <NuxtLink to="/auth/login" class="text-sm text-slate-500 transition-colors hover:text-primary-600">ورود</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/auth/signup" class="text-sm text-slate-500 transition-colors hover:text-primary-600">ثبت‌نام</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/settings" class="text-sm text-slate-500 transition-colors hover:text-primary-600">تنظیمات پروفایل</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- پیام ناشناس / تماس -->
          <div>
            <ContactFeedback title="یه پیام برام بذار" />
          </div>
        </div>

        <div class="mt-10 flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-200/70 pt-6 sm:flex-row">
          <p class="text-xs text-slate-400">© {{ currentYear }} تودولیست. همه‌ی حقوق محفوظه.</p>
          <NuxtLink to="/aboutMe" class="text-xs font-medium text-slate-500 hover:text-primary-600">درباره‌ی این پروژه</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import ContactFeedback from '~/components/Contactfeedback.vue'
import api from '~/src/services/api'
import { useAuth } from '~/composables/useAuth'
import { useTheme } from '~/composables/useTheme'
import {MorphIcon} from "morphicons/vue";

const heroSun = "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
const heroMoon = "M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"


definePageMeta({ layout: false })

useHead(() => ({
  titleTemplate: `%s - خانه`
}))

const { authState } = useAuth()
const { isDark, toggleDark } = useTheme()

const currentYear = new Date().getFullYear()

const navLinks = [
  { label: 'امکانات', href: '#features' },
  { label: 'اخبار', href: '#news' },
  { label: 'تماس با ما', href: '#contact' },
]

const mainButtons = [
  { label: 'تودولیست من', to: '/mainTodo', icon: 'mdi:format-list-checks' },
  { label: 'کار تیمی', to: '/workPlan', icon: 'mdi:account-group-outline' },
  { label: 'تودولیست شخصی', to: '/customTodo', icon: 'mdi:notebook-outline' },
]

const stats = [
  { value: '+۱۲۰۰', label: 'کار انجام‌شده' },
  { value: '+۳۰۰', label: 'کاربر فعال' },
  { value: '۴.۸', label: 'رضایت کاربران' },
]

const features = [
  {
    title: 'تودولیست من',
    description: 'کارهای روزمره‌ت رو با اولویت‌بندی و مراحل قابل پیگیری مدیریت کن.',
    icon: 'mdi:format-list-checks',
    to: '/mainTodo',
  },
  {
    title: 'کار تیمی',
    description: 'با هم‌تیمی‌هات هماهنگ باش، وظایف رو تقسیم کن و پیشرفت رو دنبال کن.',
    icon: 'mdi:account-group-outline',
    to: '/workPlan',
  },
  {
    title: 'تودولیست شخصی',
    description: 'یه فضای جدا برای برنامه‌ها و یادداشت‌های شخصی خودت.',
    icon: 'mdi:notebook-outline',
    to: '/customTodo',
  },
]

const perks = [
  { title: 'سریع و ساده', description: 'بدون پیچیدگی اضافه، فقط تمرکز روی انجام کار.', icon: 'mdi:lightning-bolt-outline' },
  { title: 'اولویت‌بندی هوشمند', description: 'کارهای مهم‌تر رو راحت از بقیه جدا کن.', icon: 'mdi:flag-outline' },
  { title: 'پیگیری مراحل', description: 'هر کار رو به مرحله‌های کوچیک بشکن و پیش برو.', icon: 'mdi:checkbox-multiple-marked-outline' },
  { title: 'یادآوری با پیامک', description: 'قبل از موعد هر کار، یه پیامک یادآوری برات می‌فرستیم که چیزی از قلم نیفته.', icon: 'mdi:message-text-outline' },
]

// ─── آخرین اخبار ────────────────────────────────────────────────────────
// این بخش رو به اندپوینت واقعی بک‌اند وصل کن. اگه مسیر یا اسم فیلدهای
// پاسخ فرق داره، فقط همین‌جا (NEWS_ENDPOINT و mapNewsFromApi) رو عوض کن،
// بقیه‌ی صفحه دست نمی‌خوره.
const NEWS_ENDPOINT = '/news'

interface NewsItem {
  id: number | string
  title: string
  excerpt: string
  date: string
  tag: string
  icon: string
}

const news = ref<NewsItem[]>([])
const newsLoading = ref(true)
const newsError = ref(false)

function mapNewsFromApi(raw: any): NewsItem {
  const rawDate = raw.date ?? raw.published_at ?? raw.created_at
  return {
    id: raw.id,
    title: raw.title,
    excerpt: raw.excerpt ?? raw.summary ?? raw.body ?? '',
    date: rawDate
        ? new Date(rawDate).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
        : '',
    tag: raw.tag ?? raw.category ?? 'خبر',
    icon: raw.icon ?? 'mdi:newspaper-variant-outline',
  }
}

async function fetchNews() {
  newsLoading.value = true
  newsError.value = false
  try {
    const response = await api.get(NEWS_ENDPOINT)
    const list = Array.isArray(response.data) ? response.data : (response.data?.data ?? [])
    news.value = list.map(mapNewsFromApi)
  } catch (error) {
    console.error('خطا در گرفتن اخبار:', error)
    newsError.value = true
  } finally {
    newsLoading.value = false
  }
}

onMounted(fetchNews)

const socialLinks = [
  { label: 'GitHub', href: '#', icon: 'mdi:github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/saleh-rezaei-1985b5415/', icon: 'mdi:linkedin' },
  { label: 'Gmail', href: 'mailto:salehrezaeipoor123@gmail.com', icon: 'tabler:brand-gmail' },
  { label: 'Reddit', href: '#', icon: 'ic:outline-reddit' },
]

const siteLinks = [
  { label: 'تودولیست من', to: '/mainTodo' },
  { label: 'کار تیمی', to: '/workPlan' },
  { label: 'تودولیست شخصی', to: '/customTodo' },
  { label: 'درباره‌ی پروژه', to: '/aboutMe' },
]
</script>