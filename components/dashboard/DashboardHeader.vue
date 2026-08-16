<template>
  <header
      class="flex h-16 shrink-0 items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-5 shadow-lg shadow-slate-200/50 backdrop-blur-xl"
  >
    <div class="flex items-center gap-2 overflow-hidden">
      <button
          v-tooltip="'باز کردن منو'"
          @click="mobileSidebarOpen = !mobileSidebarOpen"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 md:hidden"
      >
        <Icon icon="mdi:menu" class="text-xl" />
      </button>
      <button
          v-tooltip="desktopCollapsed ? 'باز کردن منو' : 'جمع کردن منو'"
          @click="desktopCollapsed = !desktopCollapsed"
          class="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 md:flex"
      >
        <Icon :icon="desktopCollapsed ? 'mdi:menu' : 'mdi:menu-open'" class="text-xl" />
      </button>
      <h1 class="truncate text-base font-bold text-slate-800">
        {{ pageTitle }}
      </h1>
    </div>

    <div class="flex items-center gap-1.5">
      <div class="hidden items-center gap-1.5 md:flex">
        <!-- جستجو -->
        <button
            v-tooltip="isRtl ? 'English' : 'فارسی'"
            @click="toggleLocale"
            class="flex h-9 w-9  items-center pt-1 justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <span class="text-[11px] font-bold uppercase" dir="ltr">{{ locale }}</span>
        </button>

        <div class="relative" data-dropdown="notif-menu">
          <button
              v-tooltip="'اعلان‌ها'"
              ref="notifButtonRef"
              @click.stop="toggleNotifDropdown"
              class="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <Icon icon="mdi:bell-outline" class="text-lg" />
            <span
                class="absolute inset-e-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-primary-500"
                :class="hasUnread() ? '' : 'hidden'"
            />
          </button>
        </div>

        <Teleport to="body">
          <Transition name="dropdown">
            <div
                v-if="showNotifDropdown"
                ref="notifPanelRef"
                data-dropdown="notif-menu"
                data-dropdown-panel
                class="fixed max-h-96 w-80 overflow-y-auto rounded-xl bg-white/95 backdrop-blur-xl py-2 shadow-lg z-[9999]"
                :style="{ top: notifDropdownTop + 'px', left: notifDropdownLeft + 'px' }"
            >
              <div v-if="invites.length === 0 && messageNoticeList.length === 0" class="p-6 text-center text-sm text-slate-400">
                اعلانی نداری
              </div>

              <!-- دعوت‌نامه‌ها -->
              <div v-for="inv in invites" :key="'invite-' + inv.id" class="border-b relative z-9999 border-slate-100 p-3">
                <div class="flex items-center gap-2.5">
                  <img v-if="inv.groupAvatarUrl" :src="inv.groupAvatarUrl" class="h-9 w-9 rounded-full object-cover shrink-0" alt="" />
                  <div v-else class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 text-xs font-bold">
                    {{ inv.groupName?.[0] ?? '?' }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-semibold text-slate-800 truncate">{{ inv.groupName }}</p>
                    <p class="text-[11px] text-slate-400">{{ inv.invitedByName }} دعوتت کرده</p>
                  </div>
                </div>
                <div class="mt-2 flex gap-2">
                  <button
                      @click="handleAccept(inv.id)"
                      class="flex-1 rounded-lg bg-primary-500 py-1.5 text-xs font-medium text-white hover:bg-primary-600"
                  >
                    پذیرفتن
                  </button>
                  <button
                      @click="declineInvite(inv.id)"
                      class="flex-1 rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    رد کردن
                  </button>
                </div>
              </div>

              <!-- اعلان پیام جدید -->
              <button
                  v-for="notice in messageNoticeList"
                  :key="'notice-' + notice.groupId"
                  @click="openGroupFromNotice(notice.groupId)"
                  class="flex w-full items-center gap-2.5 border-b border-slate-100 p-3 text-start hover:bg-slate-50 transition-colors"
              >
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                  <Icon icon="solar:chat-round-dots-bold" class="text-base" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-semibold text-slate-800 truncate">{{ notice.groupName }}</p>
                  <p class="text-[11px] text-primary-500">پیام جدید</p>
                </div>
              </button>
            </div>
          </Transition>
        </Teleport>

        <button
            v-tooltip="'تغییر تم'"
            @click="toggleDark"
            class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <Icon :icon="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'" class="text-lg" />
        </button>
      </div>

      <button
          ref="moreButtonRef"
          @click="toggleMobileMenu"
          class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 md:hidden"
      >
        <Icon icon="mdi:dots-vertical" class="text-lg" />
        <span
            class="absolute inset-e-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-primary-500"
            :class="hasUnread() ? '' : 'hidden'"
        />
      </button>
    </div>
  </header>

  <Teleport to="body">
    <div
        v-if="mobileMenuOpen"
        @click="mobileMenuOpen = false"
        class="fixed inset-0 z-40"
    />

    <Transition name="dropdown">
      <div
          v-if="mobileMenuOpen"
          ref="dropdownPanelRef"
          class="fixed z-50 w-48 overflow-hidden rounded-xl border border-slate-200/70 bg-white py-1 shadow-lg shadow-slate-200/50"
          :style="{ top: dropdownTop + 'px', left: dropdownLeft + 'px' }"
      >
        <button
            data-dropdown="notif-menu"
            @click.stop="mobileMenuOpen = false; showNotifDropdown = true"
            class="relative flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Icon icon="mdi:bell-outline" class="text-lg text-slate-400" />
          اعلان‌ها
          <span
              class="absolute inset-e-3 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-primary-500"
              :class="hasUnread() ? '' : 'hidden'"
          />
        </button>
        <button
            @click="toggleDark(); mobileMenuOpen = false"
            class="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Icon :icon="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'" class="text-lg text-slate-400" />
          تغییر تم
        </button>
        <button
            @click="toggleLocale(); mobileMenuOpen = false"
            class="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Icon icon="mdi:translate" class="text-lg text-slate-400" />
          {{ isRtl ? 'English' : 'فارسی' }}
        </button>
      </div>
    </Transition>

    <!-- روی موبایل هم همون دراپ‌داون اعلان‌ها رو (تمام‌عرض‌تر) نشون بده -->
    <div
        v-if="showNotifDropdown"
        @click="showNotifDropdown = false"
        class="fixed inset-0 z-40 bg-black/20 md:bg-transparent"
    />
    <Transition name="dropdown">
      <div
          v-if="showNotifDropdown"
          data-dropdown="notif-menu"
          class="fixed inset-x-4 top-20 z-50 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-200/70 bg-white py-1 shadow-lg shadow-slate-200/50 md:hidden"
      >
        <div v-if="invites.length === 0 && messageNoticeList.length === 0" class="p-6 text-center text-sm text-slate-400">
          اعلانی نداری
        </div>
        <div v-for="inv in invites" :key="'m-invite-' + inv.id" class="border-b border-slate-100 p-3">
          <div class="flex items-center gap-2.5">
            <img v-if="inv.groupAvatarUrl" :src="inv.groupAvatarUrl" class="h-9 w-9 rounded-full object-cover shrink-0" alt="" />
            <div v-else class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 text-xs font-bold">
              {{ inv.groupName?.[0] ?? '?' }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-semibold text-slate-800 truncate">{{ inv.groupName }}</p>
              <p class="text-[11px] text-slate-400">{{ inv.invitedByName }} دعوتت کرده</p>
            </div>
          </div>
          <div class="mt-2 flex gap-2">
            <button @click="handleAccept(inv.id)" class="flex-1 rounded-lg bg-primary-500 py-1.5 text-xs font-medium text-white hover:bg-primary-600">
              پذیرفتن
            </button>
            <button @click="declineInvite(inv.id)" class="flex-1 rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
              رد کردن
            </button>
          </div>
        </div>
        <button
            v-for="notice in messageNoticeList"
            :key="'m-notice-' + notice.groupId"
            @click="openGroupFromNotice(notice.groupId)"
            class="flex w-full items-center gap-2.5 border-b border-slate-100 p-3 text-start hover:bg-slate-50 transition-colors"
        >
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <Icon icon="solar:chat-round-dots-bold" class="text-base" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold text-slate-800 truncate">{{ notice.groupName }}</p>
            <p class="text-[11px] text-primary-500">پیام جدید</p>
          </div>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'

const route = useRoute()
const router = useRouter()

const { isDark, toggleDark } = useTheme()
const { locale, isRtl, setLocale } = useLocale()
const { authState } = useAuth()
const {
  invites,
  messageNotices,
  fetchInvites,
  acceptInvite,
  declineInvite,
  addInviteFromEcho,
  addMessageNotice,
  clearMessageNotice,
  hasUnread,
} = useNotifications()

function toggleLocale(): void {
  setLocale(isRtl.value ? 'en' : 'fa')
}

// همون کلید useState که توی DashboardSidebar.vue استفاده شده، پس با هم sync‌ان
const mobileSidebarOpen = useState<boolean>('dashboard-sidebar-mobile-open', () => false)
const desktopCollapsed = useState<boolean>('dashboard-sidebar-collapsed', () => false)

// عنوان صفحه از روی مسیر فعلی؛ اگه دوست داشتی می‌تونی به‌جاش
// از route.meta.title استفاده کنی (توی definePageMeta هر صفحه ست کن)
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'خانه',
    '/mainTodo': 'تودولیست من',
    '/workPlan': 'کار تیمی',
    '/customTodo': 'تودولیست شخصی',
    '/aboutMe': 'درباره من',
    '/settings': 'تنظیمات',
  }
  return (route.meta.title as string) || titles[route.path] || 'داشبورد'
})

// ─── دراپ‌داون اعلان‌ها (دسکتاپ) ─────────────────────────────────────────
const showNotifDropdown = ref(false)
const notifAlign = ref<'left' | 'right'>('right')
const notifButtonRef = ref<HTMLElement | null>(null)
const notifPanelRef = ref<HTMLElement | null>(null)
const notifDropdownTop = ref(0)
const notifDropdownLeft = ref(0)
const messageNoticeList = computed(() => Object.values(messageNotices))

function positionNotifDropdown(): void {
  if (!notifButtonRef.value) return
  const rect = notifButtonRef.value.getBoundingClientRect()
  const margin = 8
  const menuWidth = notifPanelRef.value?.offsetWidth || 320 // w-80

  let left = rect.right - menuWidth // پیش‌فرض: لبه‌ی راست پنل رو لبه‌ی راست دکمه
  if (left < margin) left = margin
  if (left + menuWidth > window.innerWidth - margin) left = window.innerWidth - menuWidth - margin

  notifDropdownTop.value = rect.bottom + margin
  notifDropdownLeft.value = left
}

function toggleNotifDropdown(): void {
  showNotifDropdown.value = !showNotifDropdown.value
  if (showNotifDropdown.value) {
    positionNotifDropdown()
    nextTick(positionNotifDropdown)
  }
}

function handleDropdownClickOutside(e: MouseEvent): void {
  const target = e.target as HTMLElement
  if (showNotifDropdown.value && !target.closest('[data-dropdown="notif-menu"]')) {
    showNotifDropdown.value = false
  }
}

async function handleAccept(inviteId: number): Promise<void> {
  const groupId = await acceptInvite(inviteId)
  if (groupId) {
    showNotifDropdown.value = false
    router.push('/workPlan')
  }
}

function openGroupFromNotice(groupId: number): void {
  clearMessageNotice(groupId)
  showNotifDropdown.value = false
  router.push('/workPlan')
}

onMounted(() => {
  fetchInvites()
  document.addEventListener('click', handleDropdownClickOutside)

  if (authState.user?.id) {
    const { $echo } = useNuxtApp()
    $echo.private(`user.${authState.user.id}`)
        .listen('.invite.sent', (e: any) => addInviteFromEcho(e))
        .listen('.message.notification', (e: { groupId: number; groupName: string }) => {
          addMessageNotice(e.groupId, e.groupName)
        })
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleDropdownClickOutside)
  if (authState.user?.id) {
    useNuxtApp().$echo.leave(`user.${authState.user.id}`)
  }
})

// ─── دراپ‌داون موبایل (منوی سه‌نقطه) ──────────────────────────────────────
const mobileMenuOpen = ref(false)
const moreButtonRef = ref<HTMLElement | null>(null)
const dropdownPanelRef = ref<HTMLElement | null>(null)
const dropdownTop = ref(0)
const dropdownLeft = ref(0)

const dropdownWidthFallback = 192 // w-48، قبل از اولین رندر پنل مقدار واقعیش رو نداریم

// همون منطق computeMenuAlign تو TodoList.vue: اول جای سمت مقابل (چپ دکمه) رو
// امتحان کن، اگه جا نبود سمت راست، اگه هیچ‌کدوم کامل جا نشد سمتی که جای بیشتری داره
function positionDropdown(): void {
  if (!moreButtonRef.value) return
  const rect = moreButtonRef.value.getBoundingClientRect()
  const margin = 8
  const menuWidth = dropdownPanelRef.value?.offsetWidth || dropdownWidthFallback

  const spaceRight = window.innerWidth - rect.left - margin
  const spaceLeft = rect.right - margin

  // سمت پیش‌فرض بر اساس جهت واقعی صفحه (rtl/ltr)، نه چپ ثابت
  const isRtl = getComputedStyle(moreButtonRef.value).direction === 'rtl'
  const preferLeft = !isRtl

  const trySide = (side: 'left' | 'right') =>
      side === 'left' ? spaceLeft >= menuWidth : spaceRight >= menuWidth
  const applySide = (side: 'left' | 'right') => {
    dropdownLeft.value = side === 'left' ? rect.right - menuWidth : rect.left
  }

  const first = preferLeft ? 'left' : 'right'
  const second = preferLeft ? 'right' : 'left'

  if (trySide(first)) applySide(first)
  else if (trySide(second)) applySide(second)
  else applySide(spaceRight >= spaceLeft ? 'right' : 'left')

  dropdownTop.value = rect.bottom + margin
}

function toggleMobileMenu(): void {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    positionDropdown() // تخمین اولیه با عرض فرضی
    nextTick(positionDropdown) // اصلاح دقیق بعد از رندر واقعی پنل
  }
}
</script>

<style scoped>
/* همون انیمیشن دراپ‌داون‌های TodoList.vue (Status / Sort / Priority) */
.dropdown-enter-active {
  transition: opacity 0.16s ease-out, transform 0.16s ease-out;
}
.dropdown-leave-active {
  transition: opacity 0.12s ease-in, transform 0.12s ease-in;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}
.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>