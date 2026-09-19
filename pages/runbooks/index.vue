<template>
  <div class="h-full w-full flex flex-col overflow-hidden p-4 md:p-6">
    <div class="flex items-center justify-between mb-4 shrink-0">
      <h1 class="text-xl font-bold text-primary-900">ران‌بوک‌ها</h1>
      <button
          @click="showCreateDialog = true"
          class="flex items-center gap-2 px-4 py-2 bg-linear-to-br from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-md shadow-primary-200 hover:shadow-lg transition-all"
      >
        ران‌بوک جدید
      </button>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="i in 6" :key="i" class="h-28 rounded-2xl bg-primary-50 animate-pulse"></div>
      </div>

      <div v-else-if="runbooks.length === 0" class="h-full flex items-center justify-center">
        <div class="flex flex-col items-center gap-3 text-center px-6 py-10 rounded-2xl border border-dashed border-primary-200 bg-primary-50/40 max-w-[260px]">
          <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <Icon icon="mdi:book-cog-outline" class="text-2xl text-primary-400" />
          </div>
          <p class="text-sm font-medium text-primary-600">هنوز ران‌بوکی نساختی</p>
          <p class="text-xs text-primary-400">با دکمه‌ی بالا اولین ران‌بوکت رو بساز</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <NuxtLink
            v-for="rb in runbooks" :key="rb.id"
            :to="`/runbooks/${rb.id}`"
            class="p-4 rounded-2xl border border-primary-100 bg-white hover:border-primary-300 hover:shadow-sm transition-all"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <Icon icon="mdi:book-cog-outline" class="text-lg text-primary-600" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-primary-800 truncate">{{ rb.name }}</p>
              <p class="text-xs text-primary-400">{{ rb.tasksCount }} تسک</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div v-if="showCreateDialog" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="closeCreateDialog">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div class="flex justify-between items-center p-6 border-b border-primary-100 sticky top-0 bg-white z-10">
          <h3 class="text-xl font-bold text-primary-900">📘 ران‌بوک جدید</h3>
          <button @click="closeCreateDialog" class="text-primary-400 hover:text-primary-600 text-2xl">✕</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-primary-700 mb-2">اسم ران‌بوک <span class="text-primary-600">*</span></label>
            <input
                v-model="form.name"
                type="text"
                placeholder="مثلاً: راه‌اندازی پروژه‌ی جدید"
                class="w-full px-4 py-2 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
            />
          </div>
          <div v-if="form.name.trim()">
            <label class="block text-sm font-medium text-primary-700 mb-2">فایل اکسل (اختیاری)</label>
            <label class="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-primary-300 bg-primary-50/40 cursor-pointer hover:bg-primary-50 transition-all">
              <Icon icon="solar:file-text-linear" class="text-primary-500" />
              <span class="text-sm text-primary-600 truncate">{{ form.file ? form.file.name : 'انتخاب فایل xlsx...' }}</span>
              <input type="file" accept=".xlsx,.xls" class="hidden" @change="onFileSelect" />
            </label>
            <p class="text-xs text-primary-400 mt-1.5">ستون‌ها: title (اجباری)، description، priority (low/medium/high)</p>
          </div>
        </div>
        <div class="flex gap-3 p-6 border-t border-primary-100 rounded-b-2xl sticky bottom-0 bg-white">
          <button @click="closeCreateDialog" class="flex-1 px-4 py-2 bg-white border border-primary-200 text-primary-700 rounded-xl font-medium hover:bg-primary-50 transition-all">انصراف</button>
          <button
              @click="submitCreate"
              :disabled="!form.name.trim() || isSubmitting"
              class="flex-1 px-4 py-2 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Icon v-if="isSubmitting" icon="mdi:loading" class="animate-spin" />
            <span>ساخت</span>
          </button>
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

definePageMeta({ layout: 'dashboard' })

interface RunbookListItem { id: number; name: string; tasksCount: number; createdAt: string }

const runbooks = ref<RunbookListItem[]>([])
const loading = ref(true)

async function fetchRunbooks(): Promise<void> {
  loading.value = true
  try {
    const res = await api.get('/runbooks')
    runbooks.value = res.data.map((r: any) => ({ id: r.id, name: r.name, tasksCount: r.tasks_count, createdAt: r.created_at }))
  } catch (e: any) {
    toast.error(getErrorMessage(e, 'گرفتن لیست ران‌بوک‌ها ناموفق بود'))
  } finally {
    loading.value = false
  }
}

onMounted(fetchRunbooks)

const showCreateDialog = ref(false)
const isSubmitting = ref(false)
const form = reactive<{ name: string; file: File | null }>({ name: '', file: null })

function onFileSelect(e: Event): void {
  form.file = (e.target as HTMLInputElement).files?.[0] ?? null
}

function closeCreateDialog(): void {
  showCreateDialog.value = false
  form.name = ''
  form.file = null
}

async function submitCreate(): Promise<void> {
  const name = form.name.trim()
  if (!name || isSubmitting.value) return
  isSubmitting.value = true
  try {
    const fd = new FormData()
    fd.append('name', name)
    if (form.file) fd.append('file', form.file)
    await api.post('/runbooks', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    toast.success('ران‌بوک ساخته شد')
    closeCreateDialog()
    fetchRunbooks()
  } catch (e: any) {
    toast.error(getErrorMessage(e, 'ساخت ران‌بوک ناموفق بود'))
  } finally {
    isSubmitting.value = false
  }
}
</script>