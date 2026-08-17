<template>
  <!-- Collapsed Bar (desktop only) -->
  <div
      v-if="isCollapsed"
      :class="['hidden sm:flex flex-col rounded-2xl items-center w-14 h-full border border-primary-200/50 bg-white/30 shadow-lg shadow-primary-200/40 backdrop-blur-sm shrink-0 pt-5 gap-3',
       isWorkplan ? 'rounded-se-2xl' : 'md:rounded-se-none'
      ]">
    <button
        @click="isCollapsed = false"
        v-tooltip:end="'Show Tasks'"
        class="w-9 h-9 flex items-center justify-center rounded-xl text-primary-600 hover:bg-primary-100/70 transition-all cursor-e-resize!"
    >
      <Icon icon="mingcute:layout-left-fill" class="text-lg" />
    </button>
    <button
        @click="emit('add-todo')"
        v-tooltip:end="'Add Task'"
        class="w-9 h-9 flex items-center justify-center rounded-xl text-primary-600 hover:bg-primary-100/70 transition-all"
    >
      <Icon icon="mingcute:add-line" class="text-lg" />
    </button>
    <button
        @click="swTheme = !swTheme"
        v-tooltip:end="swTheme ? 'light' : 'dark'"
        class="w-9 h-9 flex items-center justify-center rounded-xl text-primary-600 hover:bg-primary-100/70 transition-all"
    >
      <Icon :icon="swTheme ? 'material-symbols:sunny-outline-rounded' : 'material-symbols:mode-night-outline' " class="text-lg" />
    </button>
  </div>

  <div v-else ref="listPanelRef" :class="[
    'relative border border-primary-200/50 bg-white/30 shadow-lg shadow-primary-200/40 backdrop-blur-sm flex flex-col h-full overflow-visible',
    'rounded-ss-2xl rounded-es-2xl rounded-ee-2xl rounded-se-2xl',
    isWorkplan ? 'rounded-se-2xl' : 'md:rounded-se-none',
    isMobile ? 'w-full' : 'w-1/3',
    isMobile && !showOnMobile ? 'hidden' : 'flex'
  ]">
    <!-- Header Section -->
    <div class="@container relative z-20 ps-4 py-5 border-b border-white/20 shrink-0 backdrop-blur-xl bg-white/5">
      <!-- Sidebar Title Row -->
      <div class="flex items-center justify-between pe-4 mb-3">
        <h2 class="text-lg font-bold text-primary-900">Tasks</h2>

        <div class="flex items-center gap-2">
          <!-- Status Filter icon button -->
          <div class="relative inline-block" data-dropdown="status-menu">
            <button
                @click.stop="toggleMenu('status', $event)"
                v-tooltip="'status'"
                :class="[
                  'w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300',
                  currentFilter !== 'all'
                    ? 'bg-white/30 backdrop-blur-xl border border-white/40 text-primary-600 shadow-[0_8px_16px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.4)]'
                    : 'text-primary-500 hover:bg-primary-100/70 hover:text-primary-700'
                ]"
            >
              <Icon icon="mingcute:check-circle-line" class="text-lg" />
            </button>

            <Transition name="dropdown">
              <div
                  v-if="openMenu === 'status'"
                  data-dropdown="status-menu"
                  data-dropdown-panel
                  :class="[
                    'absolute top-full mt-1 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg py-2 min-w-40 z-[9999]',
                    menuAlign.status === 'right' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
                  ]"
              >
                <button
                    v-for="filter in statusFilters"
                    :key="filter.value"
                    @click.stop="selectStatusFilter(filter.value)"
                    :class="[
                      'w-full px-4 py-2 text-left text-xs hover:bg-primary-50 transition-all flex items-center gap-2',
                      currentFilter === filter.value ? 'text-primary-600 font-medium bg-primary-50' : 'text-primary-700'
                    ]"
                >
                  {{ filter.label }}
                  <Icon v-if="currentFilter === filter.value" icon="mingcute:check-fill" class="ms-auto text-primary-600" />
                </button>
              </div>
            </Transition>
          </div>

          <!-- Sort icon button -->
          <div class="relative inline-block" data-dropdown="sort-menu">
            <button
                @click.stop="toggleMenu('sort', $event)"
                v-tooltip="'Sort'"
                :class="[
                  'w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300',
                  currentTimeSort !== 'date-desc'
                    ? 'bg-white/30 backdrop-blur-xl border border-white/40 text-primary-600 shadow-[0_8px_16px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.4)]'
                    : 'text-primary-500 hover:bg-primary-100/70 hover:text-primary-700'
                ]"
            >
              <Icon icon="solar:sort-broken" class="text-lg" />
            </button>

            <Transition name="dropdown">
              <div
                  v-if="openMenu === 'sort'"
                  data-dropdown="sort-menu"
                  data-dropdown-panel
                  :class="[
                    'absolute top-full mt-1 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg py-2 min-w-40 z-[9999]',
                    menuAlign.sort === 'right' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
                  ]"
              >
                <button
                    v-for="sort in allSortOptions"
                    :key="sort.value"
                    @click.stop="selectTimeSort(sort.value)"
                    :class="[
                      'w-full px-4 py-2 text-left text-xs hover:bg-primary-50 transition-all flex items-center gap-2',
                      currentTimeSort === sort.value ? 'text-primary-600 font-medium bg-primary-50' : 'text-primary-700'
                    ]"
                >
                  <Icon :icon="sort.icon" class="text-sm" />
                  {{ sort.label }}
                  <Icon v-if="currentTimeSort === sort.value" icon="mingcute:check-fill" class="ms-auto text-primary-600" />
                </button>
              </div>
            </Transition>
          </div>

          <!-- Priority Filter icon button -->
          <div class="relative inline-block" data-dropdown="priority-menu">
            <button
                @click.stop="toggleMenu('priority', $event)"
                v-tooltip="'Priority'"
                :class="[
                  'w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300',
                  currentPriorityFilter !== 'all'
                    ? 'bg-white/30 backdrop-blur-xl border border-white/40 text-primary-600 shadow-[0_8px_16px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.4)]'
                    : 'text-primary-500 hover:bg-primary-100/70 hover:text-primary-700'
                ]"
            >
              <Icon icon="solar:flag-linear" class="text-lg" />
            </button>

            <Transition name="dropdown">
              <div
                  v-if="openMenu === 'priority'"
                  data-dropdown="priority-menu"
                  data-dropdown-panel
                  :class="[
                    'absolute top-full mt-1 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg py-2 min-w-40 z-[9999]',
                    menuAlign.priority === 'right' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
                  ]"
              >
                <button
                    v-for="priority in priorityFilters"
                    :key="priority.value"
                    @click.stop="selectPriorityFilter(priority.value)"
                    :class="[
                      'w-full px-4 py-2 text-left text-xs hover:bg-primary-50 transition-all flex items-center gap-2',
                      currentPriorityFilter === priority.value ? 'text-primary-600 font-medium bg-primary-50' : 'text-primary-700'
                    ]"
                >
                  {{ priority.label }}
                  <Icon v-if="currentPriorityFilter === priority.value" icon="mingcute:check-fill" class="ms-auto text-primary-600" />
                </button>
              </div>
            </Transition>
          </div>

          <button
              @click="isCollapsed = true"
              v-tooltip="'Hide Tasks'"
              class="hidden @min-[360px]:flex w-8 h-8 items-center justify-center rounded-lg text-primary-500 hover:bg-primary-100/70 hover:text-primary-700 transition-all cursor-e-resize!"
          >
            <Icon icon="mingcute:layout-left-line" class="text-lg" />
          </button>
          <button
              v-if="hideChatButton"
              @click="closeMobile"
              v-tooltip="'Back to Chats'"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-primary-500 hover:bg-primary-100/70 hover:text-primary-700 transition-all"
          >
            <Icon icon="carbon:chat" class="text-lg" />
          </button>
        </div>
      </div>

      <!-- Selection Actions -->
      <div class="flex gap-2 mb-3" v-if="selectedIds.size > 0">
        <button @click="deleteSelected" class="flex-1 px-3 py-2 bg-primary-500/80 backdrop-blur-md text-white rounded-xl text-xs hover:bg-primary-600/90 transition-all flex items-center justify-center gap-2 shadow-[0_4px_6px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)] transform hover:scale-105 active:scale-95">
          <Icon icon="mingcute:delete-line" /> Delete ({{ selectedIds.size }})
        </button>
      </div>
    </div>

    <!-- Todo List with Scroll -->
    <div class="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0 pb-24 md:pb-24">
      <!-- اسکلت لودر: در حال گرفتن اولین دسته از تسک‌ها -->
      <div v-if="isLoading && todos.length === 0" class="space-y-2">
        <div
            v-for="i in 6"
            :key="i"
            class="bg-white rounded-md p-3 mb-2 border-s-4 border-s-primary-100 animate-pulse"
        >
          <div class="flex items-start gap-2">
            <div class="shrink-0 pt-0.5 h-4 w-4 rounded bg-primary-100"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3.5 w-3/4 rounded bg-primary-100"></div>
              <div class="h-2.5 w-1/2 rounded bg-primary-100/70"></div>
            </div>
            <div class="flex gap-1 shrink-0">
              <div class="h-7 w-7 rounded-full bg-primary-100"></div>
              <div class="h-7 w-7 rounded-full bg-primary-100"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="filteredTodos.length === 0" class="text-center justify-center flex py-10 text-primary-300 text-sm">
        <Icon icon="mingcute:empty-box-line" class="text-lg relative bottom-0.5 me-0.5" />
        No tasks yet.
      </div>
      <div
          v-else
          v-for="todo in filteredTodos"
          :key="todo.id"
          :class="[
          'bg-white rounded-md p-3 mb-2 cursor-pointer transition-all border-s-4',
          selectedTodo?.id === todo.id
            ? 'border-primary-500 shadow-lg bg-primary-50'
            : 'hover:shadow-md',
          todo.completed ? 'opacity-75' : '',
          priorityBorderColors[todo.priority]
        ]"
      >
        <div class="flex items-start gap-2">
          <!-- Checkbox -->
          <div class="shrink-0 pt-0.5" @click.stop>
            <input
                type="checkbox"
                :checked="todo.completed"
                @change="emit('toggle-complete', todo.id)"
                class="w-4 h-4 accent-primary-600 cursor-pointer rounded"
            />
          </div>

          <div class="flex-1" @click="selectTodo(todo)">
            <p :class="['text-sm font-medium line-clamp-1 wrap-break-word', todo.completed ? 'line-through text-primary-300' : 'text-purple-950']">
              {{ todo.text }}
            </p>
            <p v-if="todo.description" class="text-xs text-primary-400 mt-1 line-clamp-2 wrap-break-word">
              {{ todo.description }}
            </p>
            <!-- Steps progress indicator -->
            <div v-if="todo.steps.length > 0" class="mt-2">
              <div class="flex items-center gap-1">
                <div class="flex gap-0.5 flex-1">
                  <div
                      v-for="step in todo.steps"
                      :key="step.id"
                      :class="['h-1 flex-1 rounded-full transition-all', step.completed ? 'bg-primary-500' : 'bg-primary-200']"
                  ></div>
                </div>
                <span class="text-xs text-primary-500 font-medium">
                  {{ getCompletedStepsCount(todo) }}/{{ todo.steps.length }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex gap-1 shrink-0" @click.stop>
            <button
                @click="emit('edit-todo', todo.id)"
                class="px-2 py-2 bg-primary-50 text-primary-700 rounded-full text-xs hover:bg-primary-100"
                :disabled="todo.completed"
            >
              <Icon icon="mi:edit" />
            </button>
            <button
                @click="emit('delete-todo', todo.id)"
                class="px-2 py-2 bg-primary-50 text-primary-600 rounded-full text-xs hover:bg-primary-600 hover:text-white transition-all duration-200"
            >
              <Icon icon="mingcute:delete-line" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Footer Section -->
    <div class="absolute bottom-0 inset-s-0 inset-e-0 z-10">
      <!-- Stats Card -->
      <div class="mx-4 rounded-4xl px-7 py-3 flex justify-between text-xs backdrop-blur-xl border border-white/30
          text-primary-700 bg-white/25
          [box-shadow:0_-8px_32px_rgba(0,0,0,0.1),0_4px_6px_rgba(255,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.1)]
          [backdrop-filter:blur(20px)_saturate(180%)] [-webkit-backdrop-filter:blur(20px)_saturate(180%)]">
        <div>Total: <span class="font-bold text-primary-900">{{ totalCount }}</span></div>
        <div>Completed: <span class="font-bold text-primary-900">{{ completedCount }}</span></div>
        <div>Remaining: <span class="font-bold text-primary-900">{{ pendingCount }}</span></div>
      </div>
      <div class="p-4">
        <button
            @click="emit('add-todo')"
            class="w-full px-4 py-3 bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-4xl font-medium shadow-lg transition-all flex items-center justify-center gap-2"
        >
          Add New Task
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import type {
  Todo,
  Step,
  FilterValue,
  SortValue,
  PriorityFilterValue,
  StatusFilterOption,
  PriorityFilterOption,
  SortOption,
} from '~/types/todoType'

// ─── Props ────────────────────────────────────────────────────────────────────
const props = withDefaults(defineProps<{
  todos: Todo[]
  selectedTodo: Todo | null
  mobileOpen?: boolean
  hideChatButton?: boolean
  isLoading?: boolean
}>(), {
  hideChatButton: true,
  isLoading: false
})

// ─── Emits ───────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  'select-todo': [todo: Todo]
  'toggle-complete': [id: number]
  'edit-todo': [id: number]
  'delete-todo': [id: number | number[]]
  'add-todo': []
  'close-mobile': []
}>()

// ─── Local State ──────────────────────────────────────────────────────────────
const currentFilter        = ref<FilterValue>('all')
const currentPriorityFilter = ref<PriorityFilterValue>('all')
const currentTimeSort      = ref<SortValue>('date-desc')
const selectedIds          = ref<Set<number>>(new Set())
const { isMobile }         = useResponsiveMode()
const isCollapsed          = ref<boolean>(false)
const swTheme               = ref<boolean>(false)
const listPanelRef          = ref<HTMLElement | null>(null)

// ─── Filter / Sort menus (سه دکمه‌ی مستقل) ────────────────────────────────────
type MenuType = 'status' | 'sort' | 'priority' | null
const openMenu = ref<MenuType>(null)

// جهت باز شدن هر دراپ‌داون (پروژه LTR است):
// 'right' یعنی لبه‌ی چپ منو روی لبه‌ی چپ دکمه بشینه و منو به سمت راست باز شود (حالت پیش‌فرض)
// 'left'  یعنی لبه‌ی راست منو روی لبه‌ی راست دکمه بشینه و منو به سمت چپ باز شود
const menuAlign = ref<Record<Exclude<MenuType, null>, 'left' | 'right'>>({
  status: 'right',
  sort: 'right',
  priority: 'right',
})

function computeMenuAlign(triggerEl: HTMLElement): 'left' | 'right' {
  const wrapper = triggerEl.closest('[data-dropdown]') as HTMLElement | null
  if (!wrapper) return 'right'

  const rect = wrapper.getBoundingClientRect()
  const menuEl = wrapper.querySelector('[data-dropdown-panel]') as HTMLElement | null
  const menuWidth = menuEl?.offsetWidth || 160 // fallback ~ min-w-40
  const margin = 8

  // مرز واقعیِ خودِ پنل TodoList، نه کل عرض صفحه. تو موبایل این پنل تقریباً
  // هم‌عرض کل صفحه‌ست پس فرقی نمی‌کرد، ولی تو دسکتاپ فقط ۱/۳ عرض صفحه‌ست —
  // با window.innerWidth محاسبه می‌شد که همیشه فضای زیادی نشون می‌داد و
  // دراپ‌داون از پنل بیرون می‌زد، هیچ‌وقت به سمت مقابل flip نمی‌شد.
  const panelRect = listPanelRef.value?.getBoundingClientRect()
  const rightBound = panelRect ? panelRect.right : window.innerWidth
  const leftBound = panelRect ? panelRect.left : 0

  const spaceRight = rightBound - rect.left - margin
  const spaceLeft = rect.right - leftBound - margin

  // سمت پیش‌فرض بر اساس جهت واقعی صفحه (rtl/ltr)، نه چپ/راست ثابت
  const isRtl = getComputedStyle(wrapper).direction === 'rtl'
  const preferred: 'left' | 'right' = isRtl ? 'left' : 'right'
  const fallback: 'left' | 'right' = isRtl ? 'right' : 'left'
  const spaceOf = (side: 'left' | 'right') => (side === 'right' ? spaceRight : spaceLeft)

  if (spaceOf(preferred) >= menuWidth) return preferred
  if (spaceOf(fallback) >= menuWidth) return fallback
  return spaceRight >= spaceLeft ? 'right' : 'left'
}

function toggleMenu(type: Exclude<MenuType, null>, event: MouseEvent): void {
  const isOpening = openMenu.value !== type
  openMenu.value = isOpening ? type : null

  if (isOpening) {
    const target = event.currentTarget as HTMLElement
    // تخمین اولیه قبل از رندر پنل، سپس اصلاح دقیق بعد از رندر واقعی
    menuAlign.value[type] = computeMenuAlign(target)
    nextTick(() => {
      menuAlign.value[type] = computeMenuAlign(target)
    })
  }
}

function closeAllMenus(): void {
  openMenu.value = null
}

// نمایش لیست در حالت موبایل به‌صورت داخلی مدیریت می‌شه، نه فقط با تکیه به prop والد.
const showOnMobile = ref<boolean>(props.mobileOpen ?? false)

watch(
    () => props.mobileOpen,
    (val) => {
      if (val !== undefined) showOnMobile.value = val
    }
)

watch(
    () => props.selectedTodo,
    (newVal, oldVal) => {
      if (isMobile.value && oldVal && !newVal) showOnMobile.value = true
    }
)

// ─── Constants ────────────────────────────────────────────────────────────────
const statusFilters: StatusFilterOption[] = [
  { label: 'All',       value: 'all' },
  { label: 'Active',    value: 'active' },
  { label: 'Completed', value: 'completed' },
]

const priorityFilters: PriorityFilterOption[] = [
  { label: 'All Priorities', value: 'all' },
  { label: 'High Priority',  value: 'high' },
  { label: 'Medium Priority',value: 'medium' },
  { label: 'Low Priority',   value: 'low' },
]

const timeSortOptions: SortOption[] = [
  { label: 'Newest', value: 'date-desc',     icon: 'solar:sort-from-bottom-to-top-broken' },
  { label: 'Oldest', value: 'date-asc',      icon: 'solar:sort-from-top-to-bottom-broken' },
]

const prioritySortOptions: SortOption[] = [
  { label: 'Priority', value: 'priority-high', icon: 'solar:flag-linear' },
]

const allSortOptions = computed<SortOption[]>(() => [...timeSortOptions, ...prioritySortOptions])

const priorityBorderColors: Record<Todo['priority'], string> = {
  high:   'border-s-rose-500',
  medium: 'border-s-orange-400',
  low:    'border-s-emerald-400',
}

const priorityWeight: Record<Todo['priority'], number> = { high: 3, medium: 2, low: 1 }

// ─── Computed ─────────────────────────────────────────────────────────────────
const filteredTodos = computed<Todo[]>(() => {
  let result: Todo[] = [...props.todos]

  if (currentFilter.value === 'active')    result = result.filter(t => !t.completed)
  if (currentFilter.value === 'completed') result = result.filter(t =>  t.completed)

  if (currentPriorityFilter.value !== 'all') {
    result = result.filter(t => t.priority === currentPriorityFilter.value)
  }

  switch (currentTimeSort.value) {
    case 'date-desc':
      result.sort((a, b) => b.id - a.id)
      break
    case 'date-asc':
      result.sort((a, b) => a.id - b.id)
      break
    case 'priority-high':
      result.sort((a, b) =>
          priorityWeight[b.priority] - priorityWeight[a.priority] || b.id - a.id
      )
      break
  }

  return result
})

const totalCount     = computed<number>(() => props.todos.length)
const completedCount = computed<number>(() => props.todos.filter(t => t.completed).length)
const pendingCount   = computed<number>(() => totalCount.value - completedCount.value)
const route = useRoute()
const isWorkplan = computed(() => route.name === 'work-plan')

// ─── Mobile visibility helpers ─────────────────────────────────────────────────
function selectTodo(todo: Todo): void {
  emit('select-todo', todo)
  if (isMobile.value) showOnMobile.value = false
}

function closeMobile(): void {
  emit('close-mobile')
  showOnMobile.value = false
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getCompletedStepsCount(todo: Todo): number {
  return todo.steps.filter((s: Step) => s.completed).length
}

// ─── Selection handlers ─────────────────────────────────────────────────────────
function selectStatusFilter(value: FilterValue): void {
  currentFilter.value = value
  closeAllMenus()
}

function selectTimeSort(value: SortValue): void {
  currentTimeSort.value = value
  closeAllMenus()
}

function selectPriorityFilter(value: PriorityFilterValue): void {
  currentPriorityFilter.value = value
  closeAllMenus()
}

function deleteSelected(): void {
  if (selectedIds.value.size === 0) return
  emit('delete-todo', [...selectedIds.value])
  selectedIds.value = new Set()
}

function handleClickOutside(e: MouseEvent): void {
  const target = e.target as HTMLElement
  if (
      !target.closest('[data-dropdown="status-menu"]') &&
      !target.closest('[data-dropdown="sort-menu"]') &&
      !target.closest('[data-dropdown="priority-menu"]')
  ) {
    closeAllMenus()
  }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted((): void => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted((): void => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar       { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(236, 72, 153, 0.08); border-radius: 8px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(219, 39, 119, 0.3);  border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(219, 39, 119, 0.5); }

/* انیمیشن مشترک برای هر سه دراپ‌داون (Status / Sort / Priority) */
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