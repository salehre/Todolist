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
          class="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px] md:hidden"
      />
    </Transition>
  </Teleport>

  <aside
      class="flex h-full shrink-0 flex-col overflow-hidden sm:rounded-2xl border border-slate-200/70 bg-white/80 shadow-lg shadow-slate-200/50 backdrop-blur-xl transition-[width] duration-300 ease-in-out"
      :class="asideClasses"
  >
    <!-- ─── Brand + دکمه‌ی جمع/باز شدن (دسکتاپ) یا بستن (موبایل) ────── -->
    <div
        class="flex h-16 w-64 shrink-0 items-center border-b border-slate-100 px-3"
        :class="iconOnly ? 'md:w-19 md:justify-center' : 'justify-between'"
    >
      <div class="flex items-center gap-2.5 overflow-hidden">
        <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary-600 to-primary-700 shadow-lg shadow-primary-200/60"
        >
          <Icon icon="mdi:view-dashboard-outline" class="text-lg text-white" />
        </div>
        <span
            class="whitespace-nowrap text-[15px] font-bold text-slate-800 transition-opacity duration-200"
            :class="showLabels ? 'w-auto opacity-100' : 'w-0 opacity-0'"
        >
          داشبورد
        </span>
      </div>
    </div>

    <!-- ─── آیتم‌های منو ──────────────────────────────────────────────
         TODO: این لیست الان استاتیکه. بعداً با یه API پرش کن.
    -->
    <nav
        ref="navEl"
        class="relative w-64 flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-4"
        :class="iconOnly ? 'md:w-19' : ''"
    >
      <!-- هایلایتِ حالت فعال: با اندازه‌گیری موقعیتِ آیتم فعال، یه پس‌زمینه‌ی
           مشترک بین top/height آیتم قبلی و جدید سُر می‌خوره (transition روی موقعیت) -->
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
        <!-- هاور: جنسِ حرکتش عمداً با هایلایتِ فعال (که موقعیتش سُر می‌خوره) فرق داره —
             اینجا از مرکز بزرگ می‌شه و محو می‌شه (transform-origin: center + scale/opacity) -->
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
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

interface NavItem {
  label: string
  icon: string
  to: string
}

// TODO: جایگزین با → GET /api/menu (یا مشابه)
const navItems: NavItem[] = [
  { label: 'داشبورد', icon: 'mdi:view-dashboard-outline', to: '/' },
  { label: 'تودولیست من', icon: 'mdi:format-list-checks', to: '/mainTodo' },
  { label: 'کار تیمی', icon: 'mdi:account-group-outline', to: '/workPlan' },
  { label: 'تودولیست شخصی', icon: 'mdi:notebook-outline', to: '/customTodo' },
  { label: 'تقویم', icon: 'mdi:calendar-month-outline', to: '#' },
  { label: 'تنظیمات', icon: 'mdi:cog-outline', to: '/settings' },
]

const route = useRoute()

function isActive(to: string): boolean {
  if (to === '#') return false
  return route.path === to
}

// ─── State ───────────────────────────────────────────────────────────
// حالت جمع/باز بودنِ سایدبار توی دسکتاپ (آیکون‌فقط یا کامل)
const desktopCollapsed = useState<boolean>('dashboard-sidebar-collapsed', () => false)
// حالت باز/بسته بودنِ درآور توی موبایل — کاملاً جدا از حالت بالا
// (shared state چون دکمه‌ی بازکردنش توی DashboardHeader.vue‌ـه)
const mobileOpen = useState<boolean>('dashboard-sidebar-mobile-open', () => false)

// تشخیص موبایل، دقیقاً همون الگوی خودِ پروژه (مثل TodoList.vue)
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

// آیکون‌فقط فقط توی دسکتاپِ جمع‌شده معنی داره؛ توی موبایل هیچ‌وقت
// حالت آیکون‌فقط نداریم (یا کاملاً بسته‌ست یا کاملاً باز با لیبل)
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

// روی موبایل، با زدن هر آیتم منو (رفتن به صفحه‌ی دیگه) درآور بسته بشه
function handleNavClick(): void {
  if (isMobile.value) mobileOpen.value = false
}

// ─── هایلایتِ شناور ──────────────────────────────────────────────────
// موقعیت (top/height) آیتمِ فعال رو اندازه می‌گیریم و یه بلاکِ مستقل رو به
// همون مختصات می‌بریم؛ چون CSS transition روی top/height گذاشتیم، این
// جابه‌جایی به‌صورت اسلاید نرم دیده می‌شه.
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

// هر چیزی که ممکنه موقعیت/سایز آیتم‌ها رو عوض کنه، باید هایلایت رو دوباره
// اندازه‌گیری کنه: عوض شدن مسیر، جمع/باز شدن سایدبار (دسکتاپ)، باز شدن موبایل
watch([activeIndex, desktopCollapsed, mobileOpen, isMobile], () => {
  nextTick(updateIndicator)
})

onMounted(() => {
  nextTick(updateIndicator)
})
</script>