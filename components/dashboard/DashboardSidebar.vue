<template>
  <Teleport to="body">
    <Transition
        enter-active-class="transition-opacity duration-300 ease-in-out"
        leave-active-class="transition-opacity duration-300 ease-in-out"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
    >
      <div
          v-if="isMobile && mobileOpen"
          @click="mobileOpen = false"
          class="fixed inset-0 z-40 backdrop-blur-[1px] md:hidden"
      />
    </Transition>
  </Teleport>

  <aside
      class="flex h-full shrink-0 flex-col overflow-hidden sm:rounded-2xl border border-primary-200/70 backdrop-blur-xl transition-[width] duration-300 ease-in-out"
      :class="asideClasses"
  >
    <div
        class="flex h-16 w-full shrink-0 items-center border-b border-slate-100 px-3"
        :class="iconOnly ? 'md:w-19 md:justify-center' : 'justify-between'"
    >
      <NuxtLink
          to="/settings"
          v-tooltip="!showLabels ? (authState.user?.name || authState.user?.username) : undefined"
          class="flex min-w-0 items-center gap-2.5 overflow-hidden rounded-xl py-1 transition-opacity hover:opacity-80"
      >
        <img
            v-if="authState.user?.avatar_url"
            :src="authState.user.avatar_url"
            class="h-9 w-9 shrink-0 rounded-full object-cover"
         alt="avatar profile"/>
        <div
            v-else
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        >
          {{ userInitial }}
        </div>
        <div
            class="min-w-0 overflow-hidden text-start transition-opacity duration-200"
            :class="showLabels ? 'w-auto opacity-100' : 'w-0 opacity-0'"
        >
          <p class="truncate whitespace-nowrap text-[13px] font-bold text-slate-800">
            {{ authState.user?.name || 'کاربر مهمان' }}
          </p>
          <p class="truncate whitespace-nowrap text-[11px] text-slate-400 text-center">
            {{ authState.user?.username }}
          </p>
        </div>
      </NuxtLink>

      <button
          v-if="showLabels && authState.isLoggedIn"
          v-tooltip="'خروج از حساب'"
          @click="showLogoutDialog = true"
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
      >
        <Icon icon="mdi:logout" class="text-base" />
      </button>
    </div>

    <nav
        ref="navEl"
        class="relative w-full flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-4"
        :class="iconOnly ? 'md:w-19' : ''"
    >
      <div
          v-show="activeIndex !== -1"
          class="pointer-events-none absolute inset-x-3 z-0 rounded-e-3xl bg-primary-50 transition-[top,height] duration-300 ease-in-out"
          :style="{ top: `${indicatorTop}px`, height: `${indicatorHeight}px` }"
      />
      <div
          v-show="activeIndex !== -1"
          class="pointer-events-none absolute inset-s-3 z-10 w-0.75 bg-primary-600 transition-[top,height] duration-300 ease-in-out"
          :style="{ top: `${indicatorTop + 1}px`, height: `${indicatorHeight - 2}px` }"
      />

      <NuxtLink
          v-for="(item, index) in navItems"
          :key="item.to"
          :ref="(el) => setItemRef(el, index)"
          :to="item.to"
          :title="!showLabels ? item.label : undefined"
          @click="handleNavClick"
          class="group relative z-10 flex rounded-xl px-4.5 py-2.5 text-sm font-medium transition-colors duration-200"
          :class="[
          iconOnly ? 'md:justify-center' : 'gap-3',
          isActive(item.to) ? 'text-primary-700' : 'text-slate-500 hover:text-slate-800',
        ]"
      >
        <span
            v-if="!isActive(item.to)"
            class="pointer-events-none absolute inset-0 -z-10 scale-75 rounded-e-3xl bg-slate-100 opacity-0 transition-[transform,opacity] duration-200 ease-out group-hover:scale-100 group-hover:opacity-100"
        />
        <Icon
            :icon="item.icon"
            class="relative shrink-0 text-lg transition-transform duration-200 ease-out group-hover:scale-110"
        />
        <span
            class="relative overflow-hidden whitespace-nowrap transition-opacity duration-200"
            :class="showLabels ? 'w-auto opacity-100' : 'w-0 opacity-0'"
        >
          {{ item.label }}
        </span>
      </NuxtLink>

      <!-- دکمه‌ی ورود، فقط وقتی لاگین نیستی و فقط تو نمای موبایل -->
      <NuxtLink
          v-if="!authState.isLoggedIn"
          to="/auth/login"
          class="mx-1.5 mt-4 flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-primary-500 to-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-200 transition-all hover:from-primary-600 hover:to-primary-700 md:hidden"
      >
        <Icon icon="mdi:login" class="text-base" />
        ورود به حساب
      </NuxtLink>
    </nav>

    <NuxtLink
        dir="ltr"
        to="/aboutMe"
        @click="handleNavClick"
        class="flex h-22 shrink-0 justify-center transition-colors items-center px-4 text-slate-400"
    >
      <!-- حالت collapsed: نمایش آیکون -->
      <div v-if="!showLabels" class="flex items-center justify-center">
        <Icon icon="stash:user-cog-light" class="text-2xl transition-colors text-primary-900" />
      </div>

      <!-- حالت expanded: نمایش متن -->
      <div v-else class="flex items-baseline gap-1">
    <span class="whitespace-nowrap tracking-wider text-[12px] text-center transition-opacity duration-200">
      Powered by
    </span>
        <span class="font-medium tracking-wide ps-0.5 text-[14px] hover:text-primary-600 transition-colors text-primary-400">
      Saleh Rezaei
    </span>
      </div>
    </NuxtLink>
  </aside>

  <Teleport to="body">
    <div
        v-if="showLogoutDialog"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showLogoutDialog = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
        <div class="flex flex-col items-center p-6 text-center">
          <div class="text-6xl mb-2">
            <Icon class="text-primary-900" icon="mdi:logout" />
          </div>
          <h3 class="text-xl font-bold text-primary-900 mb-2">خروج از حساب کاربری</h3>
          <p class="text-primary-600 text-sm mb-2">آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟</p>
        </div>
        <div
            class="flex gap-3 p-6 border-t border-primary-100 bg-primary-50/50 rounded-b-2xl"
        >
          <button
              @click="showLogoutDialog = false"
              class="flex-1 px-4 py-2 bg-white border border-primary-200 text-primary-700 rounded-xl font-medium hover:bg-primary-50 transition-all"
          >
            انصراف
          </button>
          <button
              @click="confirmLogout"
              class="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-all"
          >
            خروج
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuth } from '@/composables/useAuth'

const { authState, logout } = useAuth()
const router = useRouter()

const userInitial = computed(() => {
  const name = authState.user?.name || authState.user?.username || ''
  return name.trim().charAt(0).toUpperCase() || ''
})

function handleLogout(): void {
  logout()
  router.push('/auth/login')
}

const showLogoutDialog = ref(false)
function confirmLogout(): void {
  showLogoutDialog.value = false
  handleLogout()
}

interface NavItem {
  label: string
  icon: string
  to: string
}

const navItems: NavItem[] = [
  { label: 'داشبورد', icon: 'mdi:view-dashboard-outline', to: '/' },
  { label: 'تودولیست من', icon: 'mdi:format-list-checks', to: '/mainTodo' },
  { label: 'کار تیمی', icon: 'mdi:account-group-outline', to: '/workPlan' },
  { label: 'تودولیست شخصی', icon: 'mdi:notebook-outline', to: '/customTodo' },
  { label: 'پروفایل', icon: 'weui:me-filled', to: '/settings' },
]

const route = useRoute()

function isActive(to: string): boolean {
  if (to === '#') return false
  return route.path === to
}

// ─── State ───────────────────────────────────────────────────────────
const desktopCollapsed = useState<boolean>('dashboard-sidebar-collapsed', () => false)
const mobileOpen = useState<boolean>('dashboard-sidebar-mobile-open', () => false)

const isMobile = ref(false)
function checkMobile(): void {
  isMobile.value = window.innerWidth < 768
}
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('resize', updateIndicator)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('resize', updateIndicator)
})

const iconOnly = computed(() => !isMobile.value && desktopCollapsed.value)
const showLabels = computed(() => isMobile.value ? mobileOpen.value : !desktopCollapsed.value)

const asideClasses = computed(() => {
  if (isMobile.value) {
    return [
      'fixed inset-y-0 start-0 z-50',
      mobileOpen.value ? 'w-72' : 'w-0 border-0 shadow-none',
    ]
  }
  return ['static', desktopCollapsed.value ? 'w-[76px]' : 'w-64']
})

function toggleSidebar(): void {
  if (isMobile.value) {
    mobileOpen.value = !mobileOpen.value
  } else {
    desktopCollapsed.value = !desktopCollapsed.value
  }
}

function handleNavClick(): void {
  if (isMobile.value) mobileOpen.value = false
}

const navEl = ref<HTMLElement | null>(null)
const itemRefs = ref<(HTMLElement | null)[]>([])

function setItemRef(el: unknown, index: number): void {
  itemRefs.value[index] = (el as { $el?: HTMLElement })?.$el ?? (el as HTMLElement | null)
}

const activeIndex = computed(() => navItems.findIndex((item) => isActive(item.to)))

const indicatorTop = ref(0)
const indicatorHeight = ref(0)

function updateIndicator(): void {
  const index = activeIndex.value
  const el = index !== -1 ? itemRefs.value[index] : null
  if (!el) return
  indicatorTop.value = el.offsetTop
  indicatorHeight.value = el.offsetHeight
}

watch([activeIndex, desktopCollapsed, mobileOpen, isMobile], () => {
  nextTick(updateIndicator)
})

onMounted(() => {
  nextTick(updateIndicator)
})
</script>