<template>
  <Teleport to="body">
    <div v-if="task" class="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" @click.self="emit('close')">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] flex flex-col">
        <div class="flex items-start justify-between gap-3 p-5 border-b border-primary-100">
          <div class="min-w-0">
            <h3 class="text-base font-bold text-primary-900 break-words" :class="task.is_completed ? 'line-through text-primary-400' : ''">
              {{ task.title }}
            </h3>
            <span :class="['inline-flex mt-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium', priorityColors[task.priority]]">
              {{ task.priority }}
            </span>
          </div>
          <button @click="emit('close')" class="shrink-0 text-primary-400 hover:text-primary-600 text-xl">✕</button>
        </div>

        <div class="flex-1 overflow-y-auto p-5 space-y-4">
          <p v-if="task.description" class="text-sm text-primary-600 leading-6">{{ task.description }}</p>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-primary-300 mb-2">Assignees</p>
            <div class="flex flex-wrap gap-2">
              <div v-for="a in task.assignees" :key="a.id" class="flex items-center gap-1.5 rounded-full bg-primary-50 pe-2.5 ps-1 py-1">
                <img v-if="a.avatarUrl" :src="a.avatarUrl" class="w-6 h-6 rounded-full object-cover" alt="" />
                <div v-else :class="['w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white', colorFor(a.id)]">{{ a.name[0] }}</div>
                <span class="text-xs text-primary-700">{{ a.name }}</span>
              </div>
            </div>
          </div>

          <div v-if="task.steps?.length">
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-semibold uppercase tracking-wide text-primary-300">Steps</p>
              <span class="text-xs text-primary-400">{{ completedStepsCount }}/{{ task.steps.length }}</span>
            </div>
            <div class="space-y-1.5">
              <label
                  v-for="step in task.steps" :key="step.id"
                  class="flex items-center gap-2.5 rounded-xl border border-primary-100 px-3 py-2"
                  :class="task.can_complete ? 'cursor-pointer hover:bg-primary-50' : 'opacity-70'"
              >
                <input
                    type="checkbox"
                    :checked="step.completed"
                    :disabled="!task.can_complete"
                    @change="emit('toggle-step', task.id, step.id)"
                    class="w-4 h-4 accent-primary-600 rounded shrink-0"
                />
                <span :class="['text-sm', step.completed ? 'line-through text-primary-300' : 'text-primary-700']">{{ step.text }}</span>
              </label>
            </div>
          </div>

          <p v-if="!task.can_complete" class="text-xs text-primary-300">فقط کسی که این تسک بهش محول شده می‌تونه استپ‌هاش رو تغییر بده</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { colorFor } from '~/utils/avatarColor'
import type { Priority } from '~/types/todoType'

export interface GroupTaskDetail {
  id: number
  title: string
  description: string | null
  priority: Priority
  is_completed: boolean
  can_complete: boolean
  steps: { id: number; text: string; completed: boolean }[]
  assignees: { id: number; name: string; username: string; avatarUrl: string | null }[]
}

const props = defineProps<{ task: GroupTaskDetail | null }>()
const emit = defineEmits<{ close: []; 'toggle-step': [taskId: number, stepId: number] }>()

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-amber-100 text-amber-600',
  low: 'bg-emerald-100 text-emerald-600',
}

const completedStepsCount = computed(() => props.task?.steps.filter(s => s.completed).length ?? 0)
</script>