<template>
  <div class="h-full w-full flex flex-col overflow-hidden p-4 md:p-6">
    <div class="flex items-center gap-3 mb-4 shrink-0">
      <NuxtLink to="/runbooks" class="p-2 rounded-lg text-primary-400 hover:bg-primary-50 hover:text-primary-600 transition-all">
        <Icon icon="solar:arrow-left-linear" class="text-lg rtl:rotate-180" />
      </NuxtLink>
      <h1 class="text-xl font-bold text-primary-900 truncate">{{ runbook?.name || '...' }}</h1>
      <button
          @click="openTaskDialog()"
          class="ms-auto flex items-center gap-2 px-4 py-2 bg-linear-to-br from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md shadow-primary-200 hover:shadow-lg transition-all"
      >
        تسک جدید
      </button>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar space-y-2">
      <div v-if="loading" class="space-y-2">
        <div v-for="i in 5" :key="i" class="h-16 rounded-xl bg-primary-50 animate-pulse"></div>
      </div>

      <div v-else-if="tasks.length === 0" class="h-full flex items-center justify-center">
        <div class="flex flex-col items-center gap-3 text-center px-6 py-10 rounded-2xl border border-dashed border-primary-200 bg-primary-50/40 max-w-[260px]">
          <Icon icon="mingcute:task-2-line" class="text-2xl text-primary-400" />
          <p class="text-sm font-medium text-primary-600">این ران‌بوک هنوز تسکی نداره</p>
        </div>
      </div>

      <div
          v-else
          v-for="t in tasks" :key="t.id"
          class="flex items-center justify-between gap-3 p-3 rounded-xl border border-primary-100 bg-white"
      >
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <p class="text-sm font-semibold text-primary-800 truncate">{{ t.title }}</p>
            <span :class="['shrink-0 px-1.5 py-0.5 rounded-[5px] text-[10px] font-medium', priorityColors[t.priority]]">{{ t.priority }}</span>
          </div>
          <p v-if="t.description" class="text-xs text-primary-400 truncate mt-0.5">{{ t.description }}</p>
        </div>
        <div class="flex gap-1 shrink-0">
          <button @click="openTaskDialog(t)" class="p-2 rounded-lg text-primary-400 hover:bg-primary-50 hover:text-primary-600 transition-all">
            <Icon icon="mi:edit" />
          </button>
          <button @click="confirmDeleteTask(t)" class="p-2 rounded-lg text-primary-400 hover:bg-red-50 hover:text-red-500 transition-all">
            <Icon icon="mingcute:delete-line" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="showTaskDialog" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="closeTaskDialog">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div class="flex justify-between items-center p-6 border-b border-primary-100 sticky top-0 bg-white z-10">
          <h3 class="text-xl font-bold text-primary-900">{{ editingTaskId ? ' ویرایش تسک' : ' تسک جدید' }}</h3>
          <button @click="closeTaskDialog" class="text-primary-400 hover:text-primary-600 text-2xl">✕</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-primary-700 mb-2">عنوان <span class="text-red-300">*</span></label>
            <input v-model="taskForm.title" type="text" class="w-full px-4 py-2 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all" @keyup.enter="submitTask" />
          </div>
          <div>
            <label class="block text-sm font-medium text-primary-700 mb-2">توضیحات</label>
            <textarea v-model="taskForm.description" rows="3" class="w-full px-4 py-2 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all resize-none"></textarea>
          </div>
          <PrioritySlider v-model="taskForm.priority" />
        </div>
        <div class="flex gap-3 p-6 border-t border-primary-100 rounded-b-2xl sticky bottom-0 bg-white">
          <button @click="closeTaskDialog" class="flex-1 px-4 py-2 bg-white border border-primary-200 text-primary-700 rounded-xl font-medium hover:bg-primary-50 transition-all">انصراف</button>
          <button @click="submitTask" :disabled="!taskForm.title.trim()" class="flex-1 px-4 py-2 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">ذخیره</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import api, { getErrorMessage } from '~/src/services/api'
import { useConfirmDialog } from '~/composables/useConfirmDialog'
import PrioritySlider from '~/components/Priorityslider.vue'
import type { Priority } from '~/types/todoType'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const runbookId = Number(route.params.id)
const { openConfirm } = useConfirmDialog()

interface RunbookTaskItem { id: number; title: string; description: string | null; priority: Priority }

const runbook = ref<{ id: number; name: string } | null>(null)
const tasks = ref<RunbookTaskItem[]>([])
const loading = ref(true)

const priorityColors: Record<Priority, string> = {
  low: 'bg-emerald-50 text-emerald-600',
  medium: 'bg-amber-50 text-amber-600',
  high: 'bg-rose-50 text-rose-600',
}

async function fetchRunbook(): Promise<void> {
  loading.value = true
  try {
    const res = await api.get(`/runbooks/${runbookId}`)
    runbook.value = { id: res.data.id, name: res.data.name }
    tasks.value = res.data.tasks
  } catch (e: any) {
    toast.error(getErrorMessage(e, 'گرفتن اطلاعات ران‌بوک ناموفق بود'))
  } finally {
    loading.value = false
  }
}

onMounted(fetchRunbook)

const showTaskDialog = ref(false)
const editingTaskId = ref<number | null>(null)
const taskForm = reactive<{ title: string; description: string; priority: Priority }>({ title: '', description: '', priority: 'medium' })

function openTaskDialog(task?: RunbookTaskItem): void {
  if (task) {
    editingTaskId.value = task.id
    taskForm.title = task.title
    taskForm.description = task.description ?? ''
    taskForm.priority = task.priority
  } else {
    editingTaskId.value = null
    taskForm.title = ''
    taskForm.description = ''
    taskForm.priority = 'medium'
  }
  showTaskDialog.value = true
}

function closeTaskDialog(): void {
  showTaskDialog.value = false
  editingTaskId.value = null
}

async function submitTask(): Promise<void> {
  const title = taskForm.title.trim()
  if (!title) return
  try {
    if (editingTaskId.value) {
      const res = await api.put(`/runbooks/${runbookId}/tasks/${editingTaskId.value}`, {
        title, description: taskForm.description.trim() || null, priority: taskForm.priority,
      })
      const idx = tasks.value.findIndex(t => t.id === editingTaskId.value)
      if (idx !== -1) tasks.value[idx] = res.data
    } else {
      const res = await api.post(`/runbooks/${runbookId}/tasks`, {
        title, description: taskForm.description.trim() || null, priority: taskForm.priority,
      })
      tasks.value.push(res.data)
    }
    closeTaskDialog()
  } catch (e: any) {
    toast.error(getErrorMessage(e, 'ذخیره تسک ناموفق بود'))
  }
}

function confirmDeleteTask(task: RunbookTaskItem): void {
  openConfirm({
    title: 'حذف تسک',
    message: `تسک «${task.title}» از ران‌بوک حذف بشه؟`,
    confirmLabel: 'حذف',
    danger: true,
    onConfirm: async () => {
      try {
        await api.delete(`/runbooks/${runbookId}/tasks/${task.id}`)
        tasks.value = tasks.value.filter(t => t.id !== task.id)
      } catch (e: any) {
        toast.error(getErrorMessage(e, 'حذف تسک ناموفق بود'))
      }
    },
  })
}
</script>