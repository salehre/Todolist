<template>
  <aside
      v-if="open"
      :class="[
        'h-full overflow-hidden border-s rounded-e-2xl border-primary-200/60 bg-white/80 backdrop-blur-xl flex flex-col shrink-0 transition-[width] duration-300 ease-in-out',
        isMobile ? 'w-full' : 'w-80'
      ]"
  >
      <div class="flex items-center justify-between h-18.5 shrink-0 px-5 border-b border-primary-100">
        <h3 class="text-base font-bold text-primary-900">Tasks : {{ tasks.length }}</h3>
                <div class="flex items-center gap-1">
                  <!-- Status filter -->
                  <div class="relative inline-block" data-dropdown="gt-status-menu">
                    <button
                          @click.stop="toggleMenu('status')"
                          v-tooltip="'وضعیت'"
                          :class="['w-8 h-8 flex items-center justify-center rounded-lg transition-all', currentFilter !== 'all' ? 'bg-primary-100 text-primary-600' : 'text-primary-400 hover:bg-primary-50 hover:text-primary-600']"
                      >
                      <Icon icon="mingcute:check-circle-line" class="text-lg" />
                    </button>
                    <div v-if="openMenu === 'status'" class="absolute end-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-primary-100 py-2 min-w-36 z-50">
                      <button
                            v-for="f in statusFilters" :key="f.value"
                            @click.stop="currentFilter = f.value; openMenu = null"
                            :class="['w-full px-4 py-2 text-start text-xs hover:bg-primary-50 transition-all flex items-center gap-2', currentFilter === f.value ? 'text-primary-600 font-medium bg-primary-50' : 'text-primary-700']"
                        >
                        {{ f.label }}
                        <Icon v-if="currentFilter === f.value" icon="mingcute:check-fill" class="ms-auto text-primary-600" />
                      </button>
                    </div>
                  </div>
        
                  <!-- Sort -->
                  <div class="relative inline-block" data-dropdown="gt-sort-menu">
                    <button
                          @click.stop="toggleMenu('sort')"
                          v-tooltip="'ترتیب'"
                          :class="['w-8 h-8 flex items-center justify-center rounded-lg transition-all', currentTimeSort !== 'date-desc' ? 'bg-primary-100 text-primary-600' : 'text-primary-400 hover:bg-primary-50 hover:text-primary-600']"
                      >
                      <Icon icon="solar:sort-broken" class="text-lg" />
                    </button>
                    <div v-if="openMenu === 'sort'" class="absolute end-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-primary-100 py-2 min-w-36 z-50">
                      <button
                            v-for="s in sortOptions" :key="s.value"
                            @click.stop="currentTimeSort = s.value; openMenu = null"
                            :class="['w-full px-4 py-2 text-start text-xs hover:bg-primary-50 transition-all flex items-center gap-2', currentTimeSort === s.value ? 'text-primary-600 font-medium bg-primary-50' : 'text-primary-700']"
                        >
                        <Icon :icon="s.icon" class="text-sm" />
                        {{ s.label }}
                        <Icon v-if="currentTimeSort === s.value" icon="mingcute:check-fill" class="ms-auto text-primary-600" />
                      </button>
                    </div>
                  </div>
        
                  <!-- Priority filter -->
                  <div class="relative inline-block" data-dropdown="gt-priority-menu">
                    <button
                          @click.stop="toggleMenu('priority')"
                          v-tooltip="'اولویت'"
                          :class="['w-8 h-8 flex items-center justify-center rounded-lg transition-all', currentPriorityFilter !== 'all' ? 'bg-primary-100 text-primary-600' : 'text-primary-400 hover:bg-primary-50 hover:text-primary-600']"
                      >
                      <Icon icon="solar:flag-linear" class="text-lg" />
                    </button>
                    <div v-if="openMenu === 'priority'" class="absolute end-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-primary-100 py-2 min-w-36 z-50">
                      <button
                            v-for="p in priorityFilters" :key="p.value"
                            @click.stop="currentPriorityFilter = p.value; openMenu = null"
                            :class="['w-full px-4 py-2 text-start text-xs hover:bg-primary-50 transition-all flex items-center gap-2', currentPriorityFilter === p.value ? 'text-primary-600 font-medium bg-primary-50' : 'text-primary-700']"
                        >
                        {{ p.label }}
                        <Icon v-if="currentPriorityFilter === p.value" icon="mingcute:check-fill" class="ms-auto text-primary-600" />
                      </button>
                    </div>
                  </div>

                  <button
              @click.stop="showOnlyRunbook = !showOnlyRunbook"
              v-tooltip="'فقط تسک‌های ران‌بوک'"
              :class="['w-8 h-8 flex items-center justify-center rounded-lg transition-all', showOnlyRunbook ? 'bg-primary-100 text-primary-600' : 'text-primary-400 hover:bg-primary-50 hover:text-primary-600']"
          >
            <Icon icon="mdi:book-cog-outline" class="text-lg" />
          </button>
        
                  <button @click="emit('close')" class="p-1.5 rounded-full hover:bg-primary-50 text-primary-400 hover:text-primary-600 transition">
                    <Icon icon="mingcute:close-line" class="text-lg" />
                  </button>
                </div>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        <div v-if="loading" class="space-y-2">
          <div v-for="i in 4" :key="i" class="h-16 rounded-xl bg-primary-50 animate-pulse"></div>
        </div>

        <div v-else-if="tasks.length === 0" class="h-full flex items-center justify-center">
          <div class="flex flex-col items-center gap-3 text-center px-6 py-10 rounded-2xl border border-dashed border-primary-200 bg-primary-50/40 max-w-[220px]">
            <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <Icon icon="solar:checklist-minimalistic-line-duotone" class="text-2xl text-primary-400" />
            </div>
            <p class="text-sm font-medium text-primary-600">هنوز تسکی توی این گروه ساخته نشده</p>
          </div>
        </div>

        <template v-else>
          <button
              v-for="task in sortedTasks" :key="task.id"
              @click="emit('open-task', task)"
              :class="[
              'w-full text-start p-3 rounded-xl hover:bg-primary-50 transition-colors',
              task.from_runbook ? 'border-2 border-dashed border-indigo-300' : 'border border-primary-100',
              task.is_completed ? 'opacity-75' : ''
            ]"
              v-tooltip="task.from_runbook ? 'از ران‌بوک ساخته شده' : undefined"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 min-w-0">
                <p class="text-sm font-semibold text-primary-800 truncate" :class="task.is_completed ? 'line-through text-primary-400' : ''">{{ task.title }}</p>
                <span
                    v-if="task.assignees.some(a => a.id === currentUserId)"
                    class="shrink-0 rounded-full bg-primary-100 px-1.5 py-0.5 text-[9px] font-medium text-primary-600"
                >برای من
                </span>
              </div>
              <span :class="['shrink-0 px-1.5 py-0.5 rounded-[5px] text-[10px] font-medium', priorityColors[task.priority]]">{{ task.priority }}</span>
            </div>
            <div class="mt-1.5 flex items-center -space-x-1.5 rtl:space-x-reverse">
              <div v-for="a in task.assignees" :key="a.id" v-tooltip="a.name" class="w-6 h-6 rounded-full ring-2 ring-white overflow-hidden">
                <img v-if="a.avatarUrl" :src="a.avatarUrl" class="w-full h-full object-cover" alt="" />
                <div v-else :class="['w-full h-full flex items-center justify-center text-[9px] font-bold text-white', colorFor(a.id)]">{{ a.name[0] }}</div>
              </div>
            </div>
          </button>
        </template>
      </div>
    </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { colorFor } from '~/utils/avatarColor'
import type { Priority } from '~/types/todoType'

interface GroupTask {
  id: number
  title: string
  priority: Priority
  is_completed: boolean
  from_runbook: boolean
  assignees: { id: number; name: string; username: string; avatarUrl: string | null }[]
}

const props = defineProps<{ open: boolean; tasks: GroupTask[]; loading: boolean; currentUserId: number; isMobile: boolean }>()
const emit = defineEmits<{ close: []; 'open-task': [task: GroupTask] }>()

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-amber-100 text-amber-600',
  low: 'bg-emerald-100 text-emerald-600',
}

    // ── فیلتر / سورت (سه دکمه) ────────────────────────────────────────────
    type FilterValue = 'all' | 'active' | 'completed'
    type PriorityFilterValue = 'all' | 'high' | 'medium' | 'low'
    type SortValue = 'date-desc' | 'date-asc' | 'priority-high'
    type MenuType = 'status' | 'sort' | 'priority' | null
    
    const currentFilter = ref<FilterValue>('all')
    const currentPriorityFilter = ref<PriorityFilterValue>('all')
    const currentTimeSort = ref<SortValue>('date-desc')
      const showOnlyRunbook = ref(false)
    const openMenu = ref<MenuType>(null)
    
    function toggleMenu(type: Exclude<MenuType, null>): void {
        openMenu.value = openMenu.value === type ? null : type
          }
    
    const statusFilters = [
        { label: 'همه', value: 'all' as FilterValue },
        { label: 'فعال', value: 'active' as FilterValue },
        { label: 'تکمیل‌شده', value: 'completed' as FilterValue },
      ]
    const priorityFilters = [
        { label: 'همه‌ی اولویت‌ها', value: 'all' as PriorityFilterValue },
        { label: 'اولویت بالا', value: 'high' as PriorityFilterValue },
        { label: 'اولویت متوسط', value: 'medium' as PriorityFilterValue },
        { label: 'اولویت پایین', value: 'low' as PriorityFilterValue },
      ]
    const sortOptions = [
        { label: 'جدیدترین', value: 'date-desc' as SortValue, icon: 'solar:sort-from-bottom-to-top-broken' },
        { label: 'قدیمی‌ترین', value: 'date-asc' as SortValue, icon: 'solar:sort-from-top-to-bottom-broken' },
        { label: 'اولویت', value: 'priority-high' as SortValue, icon: 'solar:flag-linear' },
      ]
    
    const priorityWeight: Record<Priority, number> = { high: 3, medium: 2, low: 1 }
    
    const sortedTasks = computed(() => {
        let result = [...props.tasks]
        if (showOnlyRunbook.value) result = result.filter(t => t.from_runbook)
            if (currentFilter.value === 'active') result = result.filter(t => !t.is_completed)
            if (currentFilter.value === 'completed') result = result.filter(t => t.is_completed)
            if (currentPriorityFilter.value !== 'all') result = result.filter(t => t.priority === currentPriorityFilter.value)
            switch (currentTimeSort.value) {
            case 'date-desc': result.sort((a, b) => b.id - a.id); break
              case 'date-asc': result.sort((a, b) => a.id - b.id); break
              case 'priority-high': result.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority] || b.id - a.id); break
            }
        return result
          })
    
    function handleClickOutside(e: MouseEvent): void {
        if (!(e.target as HTMLElement).closest('[data-dropdown]')) openMenu.value = null
          }
    onMounted(() => document.addEventListener('click', handleClickOutside))
    onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>