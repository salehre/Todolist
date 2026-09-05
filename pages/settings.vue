<template>
  <div class="h-full overflow-y-auto p-1">
    <div class="mx-auto max-w-5xl space-y-6 pb-10">

      <template v-if="isProfileLoading">
        <!-- اسکلت کارت پروفایل -->
        <div class="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
          <div class="h-56 animate-pulse bg-slate-200 sm:h-64" />
          <div class="relative px-6 pb-6 sm:px-8">
            <div class="-mt-12 flex flex-col items-center sm:-mt-14">
              <div class="h-24 w-24 shrink-0 animate-pulse rounded-full border-4 border-white bg-slate-300 shadow-lg sm:h-28 sm:w-28" />
              <div class="mt-3 h-5 w-32 animate-pulse rounded-md bg-slate-200" />
              <div class="mt-2 h-3.5 w-24 animate-pulse rounded-md bg-slate-200" />
            </div>
          </div>
        </div>

        <!-- اسکلت کارت اطلاعات پایه -->
        <div class="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl md:p-8">
          <div class="flex items-center justify-between">
            <div class="h-5 w-28 animate-pulse rounded-md bg-slate-200" />
            <div class="h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
          </div>
          <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div v-for="i in 5" :key="i" class="flex items-start gap-3">
              <div class="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-slate-100" />
              <div class="flex-1 space-y-2">
                <div class="h-2.5 w-16 animate-pulse rounded bg-slate-100" />
                <div class="h-3.5 w-28 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </div>

        <!-- اسکلت کارت تم رنگی -->
        <div class="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl md:p-8">
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <div class="h-5 w-24 animate-pulse rounded-md bg-slate-200" />
              <div class="h-3 w-48 animate-pulse rounded-md bg-slate-100" />
            </div>
            <div class="h-9 w-16 animate-pulse rounded-full bg-slate-100" />
          </div>
          <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div v-for="i in 6" :key="i" class="aspect-4/3 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
      </template>

      <template v-else>

        <div class="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
          <div
              class="group object-cover relative h-42 bg-cover bg-center sm:h-64"
              :style="{ backgroundImage: `url(${authState.user?.cover_url || cachedCoverUrl || '/images/auth-bg/' + currentTheme + '.jpg'})` }"

          >
            <div class="absolute inset-0 bg-linear-to-t from-primary-950/60 via-primary-900/20 to-transparent" />

            <button
                type="button"
                @click="coverInput?.click()"
                class="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-opacity"
            >
              <Icon icon="mdi:image-edit-outline" />
              تغییر کاور
            </button>
            <input ref="coverInput" type="file" accept="image/*" class="hidden" @change="onCoverChange" />
          </div>

          <!-- آواتار روی مرز بنر و بدنه -->
          <div class="relative px-6 pb-6 sm:px-8">
            <div class="-mt-12 flex flex-col items-center sm:-mt-14">
              <div class="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
                <img
                    v-if="authState.user?.avatar_url"
                    :src="authState.user.avatar_url"
                    class="h-full w-full rounded-full border-4 border-white object-cover shadow-lg"
                    alt="avatar profile"/>
                <div v-else class="flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-slate-200 text-3xl font-bold text-slate-500 shadow-lg">
                  {{ authState.user?.name?.[0] || '?' }}
                </div>
                <button
                    type="button"
                    @click="fileInput?.click()"
                    class="absolute bottom-0 left-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white shadow-md ring-2 ring-white transition-transform hover:scale-105"
                >
                  <Icon icon="mdi:camera-outline" class="text-base" />
                </button>
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
              </div>

              <h1 class="mt-3 text-lg font-bold text-slate-800">{{ authState.user?.name || '—' }}</h1>
              <p class="text-sm text-slate-400" dir="ltr">@{{ authState.user?.username }}</p>
            </div>
          </div>
        </div>

        <!-- ─── کارت اطلاعات پایه ───────────────────────────────────────────── -->
        <div class="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl md:p-8">
        <div class="flex mb-4 items-center justify-between">
          <h2 class="text-lg font-bold text-slate-800">اطلاعات پایه</h2>
          <button
              type="button"
              @click="openEditDialog"
              class="flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100"
          >
            <Icon icon="mdi:pencil-outline" />
            ویرایش
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon="mdi:account-outline" label="نام" :value="authState.user?.name" />
          <InfoRow icon="mdi:at" label="نام کاربری" :value="authState.user?.username" ltr />
          <InfoRow icon="mdi:email-outline" label="ایمیل" :value="authState.user?.email" ltr />
          <InfoRow icon="mdi:phone-outline" label="شماره موبایل" :value="authState.user?.phone || '—'" ltr />
          <InfoRow icon="mdi:gender-male-female" label="جنسیت" :value="genderLabel" />
          <InfoRow icon="mdi:biography" label="بیوگرافی" :value="authState.user?.bio" />
          <InfoRow icon="streamline-ultimate:corporate-social-media" label="فضای مجازی" :value="socialLinksLabel" />
        </div>
        </div>

        <ActivityChart />

        <!-- ─── کارت تم رنگی ───────────────────────────────────────────────── -->
        <div class="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl md:p-8">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-800">ظاهر برنامه</h2>
            </div>

            <!-- سوییچ حالت تاریک -->
            <button
                type="button"
                @click="toggleDark"
                class="flex h-9 w-16 shrink-0 items-center rounded-full p-1 transition-colors"
                :class="isDark ? 'bg-primary-500' : 'bg-slate-200'"
            >
          <span
            class="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md transition-transform"
            :class="isDark ? 'ltr:translate-x-7 rtl:-translate-x-7' : 'ltr:translate-x-0 rtl:translate-x-0'"
          >
                <Icon :icon="isDark ? 'mdi:weather-night' : 'mdi:white-balance-sunny'" class="text-sm text-primary-600" />
              </span>
            </button>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
            <button
                v-for="option in themeOptions"
                :key="option.value"
                type="button"
                @click="setTheme(option.value)"
                class="group relative aspect-3/2 overflow-hidden rounded-2xl border-2 bg-cover bg-center transition-all"
                :class="currentTheme === option.value
                  ? 'border-primary-500 shadow-md shadow-primary-100'
                  : 'border-slate-200 hover:border-slate-300'"
                :style="{ backgroundImage: `url(/images/auth-bg/${option.value}.jpg)` }"
            >
              <!-- لایه‌ی تیره برای خوانا موندن اسم تم -->
              <span class="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent transition-opacity group-hover:from-black/80" />

              <span class="absolute inset-x-0 bottom-0 p-3 text-sm font-medium text-white drop-shadow">
                {{ option.label }}
              </span>

              <span
                  v-if="currentTheme === option.value"
                  class="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white"
              >
                <Icon icon="mdi:check-bold" class="text-sm" />
              </span>
            </button>
          </div>
        </div>

      </template>

      <!-- ─── دیالوگ ویرایش اطلاعات پروفایل ────────────────────────────── -->
      <div
          v-if="isDialogOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      >
        <div class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
          <div class="sticky top-0 z-10 flex items-center justify-between border-b border-primary-100 bg-white p-6">
            <h3 class="flex items-center gap-1.5 text-xl font-bold text-primary-900">
              <Icon icon="mdi:account-edit-outline" class="text-lg" />
              ویرایش اطلاعات
            </h3>
            <button @click="closeEditDialog" class="text-2xl text-primary-400 hover:text-primary-600">✕</button>
          </div>

          <div class="space-y-4 p-6">
            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-primary-700">جنسیت :</label>
              <label
                  v-for="g in [{ value: 'male', label: 'مرد' }, { value: 'female', label: 'زن' }, { value: 'company', label: 'حقوقی' }]"
                  :key="g.value"
                  class="flex cursor-pointer items-center gap-1.5 text-sm text-slate-600"
              >
                <Icon
                    :icon="form.gender === g.value ? 'mdi:radiobox-marked' : 'mdi:radiobox-blank'"
                    class="text-lg"
                    :class="form.gender === g.value ? 'text-primary-500' : 'text-slate-300'"
                />
                <input type="radio" name="gender" :value="g.value" v-model="form.gender" class="hidden" />
                {{ g.label }}
              </label>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-primary-700">نام</label>
              <input
                  v-model="form.name"
                  type="text"
                  class="w-full rounded-xl border border-primary-200 px-4 py-2 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-primary-700">نام کاربری</label>
              <input
                  v-model="form.username"
                  type="text"
                  dir="ltr"
                  class="w-full rounded-xl border border-primary-200 px-4 py-2 text-left transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-primary-700">ایمیل</label>
              <input
                  v-model="form.email"
                  type="email"
                  dir="ltr"
                  class="w-full rounded-xl border border-primary-200 px-4 py-2 text-left transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-primary-700">شماره موبایل</label>
              <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="09xxxxxxxxx"
                  dir="ltr"
                  class="w-full rounded-xl border border-primary-200 px-4 py-2 text-left transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-primary-700">بیوگرافی</label>
              <textarea
                  v-model="form.bio"
                  rows="3"
                  maxlength="280"
                  placeholder="چند خط درباره‌ی خودت..."
                  class="w-full resize-none rounded-xl border border-primary-200 px-4 py-2 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
              <p class="mt-1 text-left text-xs text-slate-400" dir="ltr">{{ (form.bio || '').length }}/280</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-primary-700">لینک‌های شبکه‌های اجتماعی</label>
              <div class="space-y-2">
                <div v-for="(link, i) in form.socialLinks" :key="i" class="flex gap-2" data-social-dropdown>
                  <div class="relative shrink-0">
                    <button
                        type="button"
                        @click="toggleSocialDropdown(i)"
                        class="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-200 hover:bg-primary-50 transition-colors"
                    >
                      <Icon :icon="platformInfo(link.platform).icon" class="text-lg" :class="link.platform !== 'other' ? 'text-primary-600' : 'text-slate-400'" />
                    </button>

                    <div
                        v-if="openSocialDropdown === i"
                        class="absolute z-20 mt-1 grid grid-cols-4 gap-1 rounded-xl border border-primary-100 bg-white p-2 shadow-lg w-45"
                    >
                      <button
                          v-for="p in socialPlatforms"
                          :key="p.value"
                          type="button"
                          @click="selectPlatform(i, p.value)"
                          v-tooltip="p.label"
                          class="flex items-center justify-center rounded-lg p-2 hover:bg-primary-50 transition-colors"
                          :class="link.platform === p.value ? 'bg-primary-100' : ''"
                      >
                        <Icon :icon="p.icon" class="text-lg" />
                      </button>
                    </div>
                  </div>

                  <input
                      v-model="link.url"
                      type="url"
                      dir="ltr"
                      :placeholder="`لینک ${platformInfo(link.platform).label}`"
                      class="flex-1 rounded-xl border border-primary-200 px-4 py-2 text-left transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="sticky bottom-0 flex gap-3 rounded-b-2xl border-t border-primary-100 bg-white p-6">
            <button
                @click="closeEditDialog"
                class="flex-1 rounded-xl border border-primary-200 bg-white px-4 py-2 font-medium text-primary-700 transition-all hover:bg-primary-50"
            >
              انصراف
            </button>
            <button
                @click="saveProfile"
                :disabled="saving"
                class="flex-1 rounded-xl bg-linear-to-r from-primary-500 to-primary-600 px-4 py-2 font-medium text-white transition-all hover:from-primary-600 hover:to-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ saving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, reactive, computed, h, defineComponent, onMounted, onUnmounted } from 'vue'
import { useTheme } from '~/composables/useTheme'
import { useAuth } from '~/composables/useAuth'
import { socialPlatforms, platformInfo } from '~/utils/socialPlatforms'
import ActivityChart from '~/components/ActivityChart.vue'

useHead(() => ({
  titleTemplate: `%s - Setting`
}))

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const { currentTheme, setTheme, themeOptions, isDark, toggleDark } = useTheme()
const { authState, updateProfile, uploadAvatar, uploadCover, cachedCoverUrl } = useAuth()

const isProfileLoading = computed(() => !authState.user)

const fileInput = ref<HTMLInputElement | null>(null)
const coverInput = ref<HTMLInputElement | null>(null)
const saving = ref(false)
const isDialogOpen = ref(false)

const form = reactive({
  name: '',
  username: '',
  email: '',
  phone: '',
  gender: '' as '' | 'male' | 'female' | 'company',
  bio: '',
  socialLinks: [
    { platform: 'other', url: '' },
    { platform: 'other', url: '' },
    { platform: 'other', url: '' },
  ] as { platform: string; url: string }[],
})

const socialLinksLabel = computed(() => {
  const links = authState.user?.social_links ?? []
  if (links.length === 0) return ''
  return links.map(l => l.platform === 'other' ? ' ' : platformInfo(l.platform).label).join(' - ')

})

const genderLabel = computed(() => {
  if (authState.user?.gender === 'male') return 'مرد'
  if (authState.user?.gender === 'female') return 'زن'
  if (authState.user?.gender === 'company') return 'حقوقی'
  return '—'
})

function openEditDialog() {
  form.name = authState.user?.name || ''
  form.username = authState.user?.username || ''
  form.email = authState.user?.email || ''
  form.phone = authState.user?.phone || ''
  form.gender = authState.user?.gender || ''
  form.bio = authState.user?.bio || ''
  const existing = authState.user?.social_links || []
  form.socialLinks = [0, 1, 2].map(i => ({
        platform: existing[i]?.platform || 'other',
        url: existing[i]?.url || '',
  }))
  isDialogOpen.value = true
}

function closeEditDialog() {
  isDialogOpen.value = false
}

async function saveProfile() {
  saving.value = true
  try {
    const ok = await updateProfile({
      ...form,
      social_links: form.socialLinks.filter(l => l.url.trim() !== ''),
    })
    if (ok) isDialogOpen.value = false
  } finally {
    saving.value = false
  }
}

const openSocialDropdown = ref<number | null>(null)

function toggleSocialDropdown(i: number): void {
  openSocialDropdown.value = openSocialDropdown.value === i ? null : i
}

function selectPlatform(i: number, value: string): void {
  form.socialLinks[i].platform = value
  openSocialDropdown.value = null
}

function handleClickOutsideSocial(e: MouseEvent): void {
  if (openSocialDropdown.value !== null && !(e.target as HTMLElement).closest('[data-social-dropdown]')) {
    openSocialDropdown.value = null
  }
}

onMounted(() => document.addEventListener('click', handleClickOutsideSocial))
onUnmounted(() => document.removeEventListener('click', handleClickOutsideSocial))

async function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  await uploadAvatar(file)
}

async function onCoverChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  await uploadCover(file)
}

// یه کامپوننت کوچیک محلی برای ردیف‌های نمایش اطلاعات (حالت غیر ویرایش)
const InfoRow = defineComponent({
  props: { icon: String, label: String, value: String, ltr: Boolean },
  setup(props) {
    return () =>
        h('div', { class: 'flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-lg shadow-slate-200/50 backdrop-blur-xl' }, [
          h('div', { class: 'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600' }, [
            h(Icon, { icon: props.icon }),
          ]),
          h('div', {}, [
            h('p', { class: 'text-xs text-slate-400' }, props.label),
            h('p', { class: 'mt-0.5 text-sm font-medium text-slate-700', dir: props.ltr ? 'ltr' : undefined }, props.value || '—'),
          ]),
        ])
  },
})
</script>