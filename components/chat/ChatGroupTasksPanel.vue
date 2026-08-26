<template>
  <Transition enter-active-class="transition-opacity duration-300 ease-in-out" leave-active-class="transition-opacity duration-300 ease-in-out" enter-from-class="opacity-0" leave-to-class="opacity-0">
    <div v-if="open" @click="emit('close')" class="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px]" />
  </Transition>

  <Transition enter-active-class="transition-transform duration-300 ease-in-out" leave-active-class="transition-transform duration-300 ease-in-out" enter-from-class="translate-x-full rtl:-translate-x-full" leave-to-class="translate-x-full rtl:-translate-x-full">
    <aside v-if="open" class="absolute inset-y-0 inset-e-0 z-40 w-full max-w-md bg-white shadow-2xl flex flex-col">
      <div class="flex items-center justify-between h-16 shrink-0 px-5 border-b border-primary-100">
        <h3 class="text-base font-bold text-primary-900">Group Tasks — {{ tasks.length }}</h3>
        <button @click="emit('close')" class="p-1.5 rounded-full hover:bg-primary-50 text-primary-400 hover:text-primary-600 transition">
          <Icon icon="mingcute:close-line" class="text-lg" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        <div v-if="loading" class="space-y-2">
          <div v-for="i in 4" :key="i" class="h-16 rounded-xl bg-primary-50 animate-pulse"></div>
        </div>

        <p v-else-if="tasks.length === 0" class="text-center text-sm text-primary-300 py-10">هنوز تسکی توی این گروه ساخته نشده</p>

        <button
            v-for="task in tasks" :key="task.id"
            @click="emit('open-task', task)"
            class="w-full text-start p-3 rounded-xl border border-primary-100 hover:bg-primary-50 transition-colors"
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
            <span :class="['shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-medium', priorityColors[task.priority]]">{{ task.priority }}</span>
          </div>
          <div class="mt-1.5 flex items-center -space-x-1.5 rtl:space-x-reverse">
            <div v-for="a in task.assignees" :key="a.id" v-tooltip="a.name" class="w-6 h-6 rounded-full ring-2 ring-white overflow-hidden">
              <img v-if="a.avatarUrl" :src="a.avatarUrl" class="w-full h-full object-cover" alt="" />
              <div v-else :class="['w-full h-full flex items-center justify-center text-[9px] font-bold text-white', colorFor(a.id)]">{{ a.name[0] }}</div>
            </div>
          </div>
        </button>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { colorFor } from '~/utils/avatarColor'
import type { Priority } from '~/types/todoType'

interface GroupTask {
  id: number
  title: string
  priority: Priority
  is_completed: boolean
  assignees: { id: number; name: string; username: string; avatarUrl: string | null }[]
}

const props = defineProps<{ open: boolean; tasks: GroupTask[]; loading: boolean; currentUserId: number }>()
const emit = defineEmits<{ close: []; 'open-task': [task: GroupTask] }>()

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-amber-100 text-amber-600',
  low: 'bg-emerald-100 text-emerald-600',
}
</script>