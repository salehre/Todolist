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

        <button
            v-tooltip="'اعلان‌ها'"
            class="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <Icon icon="mdi:bell-outline" class="text-lg" />
          <span
              class="absolute inset-e-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-primary-500"
          />
        </button>

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
            @click="mobileMenuOpen = false"
            class="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Icon icon="mdi:bell-outline" class="text-lg text-slate-400" />
          اعلان‌ها
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
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'

const route = useRoute()

const { isDark, toggleDark } = useTheme()
const { locale, isRtl, setLocale } = useLocale()

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

// ─── دراپ‌داون موبایل ────────────────────────────────────────────────────
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