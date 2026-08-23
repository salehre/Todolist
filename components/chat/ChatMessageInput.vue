<template>
  <div ref="bottomAreaRef" class="shrink-0 px-4 pb-4 pt-2">
    <div v-if="isRecording" class="mb-2 px-4 py-3 bg-red-50 rounded-full border border-red-200 flex items-center gap-3">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span class="text-sm text-red-600 font-medium">Recording... {{ formatDuration(recordingDuration) }}</span>
      </div>
      <div class="flex-1">
        <div class="h-1 bg-red-200 rounded-full overflow-hidden">
          <div class="h-full bg-red-500 rounded-full transition-all duration-1000" :style="{ width: recordingProgress + '%' }"></div>
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="emit('cancel-recording')" class="p-2 rounded-lg bg-white text-red-600 hover:bg-red-100 transition"><Icon icon="mingcute:close-line" /></button>
        <button @click="emit('stop-recording')" class="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
          <Icon :icon="isSendingVoice ? 'mdi:loading' : 'solar:plain-bold'" :class="isSendingVoice ? 'animate-spin' : ''" />
        </button>
      </div>
    </div>

    <div v-if="replyTo" class="mb-2 px-3 py-2 bg-primary-50 rounded-full border border-primary-200 flex items-center gap-2">
      <div class="flex-1">
        <p class="text-xs font-medium text-primary-500">Replying to {{ replyToSenderName }}</p>
        <p class="text-xs text-primary-400 truncate">{{ replyTo.text }}</p>
      </div>
      <button @click="emit('cancel-reply')" class="text-primary-400 hover:text-primary-600"><Icon icon="mingcute:close-line" /></button>
    </div>

    <div v-if="editingMessage" class="mb-2 px-3 py-2 bg-amber-50 rounded-full border border-amber-200 flex items-center gap-2">
      <Icon icon="mi:edit" class="text-amber-500 shrink-0" />
      <p class="text-xs text-amber-600 flex-1 truncate">Editing: {{ editingMessage.text }}</p>
      <button @click="emit('cancel-edit')" class="text-amber-400 hover:text-amber-600"><Icon icon="mingcute:close-line" /></button>
    </div>

    <div ref="inputAreaRef" class="bg-white rounded-3xl border border-primary-200 shadow-sm overflow-hidden">
      <div class="grid transition-[grid-template-rows] duration-300 ease-in-out" :class="showAttachMenu ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
        <div class="overflow-hidden">
          <div class="px-4 pt-3 pb-2 border-b border-primary-100">
            <p class="text-xs text-primary-400 mb-2 font-medium">Attach & Share</p>
            <button @click="emit('pick-files', 'image')" class="flex items-center gap-2 w-full px-3 py-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-all text-sm text-primary-700 mb-1">
              <Icon icon="solar:gallery-linear" class="text-primary-500" /> Upload Images
            </button>
            <button @click="emit('pick-files', 'file')" class="flex items-center gap-2 w-full px-3 py-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-all text-sm text-primary-700 mb-1">
              <Icon icon="solar:document-linear" class="text-primary-500" /> Upload Files
            </button>
            <button @click="emit('toggle-create-task')" class="flex items-center gap-2 w-full px-3 py-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-all text-sm text-primary-700 mt-1">
              <Icon icon="mingcute:task-2-line" class="text-primary-500" /> Create Task
            </button>
          </div>
        </div>
      </div>

      <div v-if="showCreateTodo" class="px-4 pt-3 pb-2 border-b border-primary-100 space-y-2">
        <p class="text-xs text-primary-500 font-semibold flex items-center gap-1"><Icon icon="mingcute:task-2-line" /> New Task</p>
        <input v-model="todoForm.title" type="text" placeholder="Task title " class="w-full px-3 py-2 rounded-xl border border-primary-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200" />
        <textarea v-model="todoForm.description" rows="2" placeholder="Description (optional)" class="w-full px-3 py-2 rounded-xl border border-primary-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 resize-none" />
        <PrioritySlider v-model="todoForm.priority" />
        <div>
          <p class="mb-1.5 text-xs font-medium text-primary-500">Assign to</p>
          <div class="flex flex-wrap gap-1.5">
            <button
                v-for="m in members" :key="m.userId" type="button"
                @click="toggleAssignee(m.userId)"
                class="flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs transition-colors"
                :class="todoForm.assignedTo.includes(m.userId) ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-primary-100 text-primary-500 hover:border-primary-200'"
            >
              <img v-if="m.avatarUrl" :src="m.avatarUrl" class="h-4 w-4 rounded-full object-cover" alt="" />
              <div v-else :class="['h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white', colorFor(m.userId)]">{{ m.name[0] }}</div>
              {{ m.name }}
              <Icon v-if="todoForm.assignedTo.includes(m.userId)" icon="mdi:check" class="text-[10px]" />
            </button>
          </div>
        </div>
        <div class="flex gap-2">
          <button @click="submitTodo" :disabled="!todoForm.title.trim() || todoForm.assignedTo.length === 0" class="flex-1 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-all disabled:opacity-50">Create</button>
          <button @click="emit('toggle-create-task')" class="px-3 py-2 text-primary-400 hover:text-primary-600"><Icon icon="mingcute:close-line" /></button>
        </div>
      </div>

      <div class="flex items-center gap-1.5 p-2">
        <button v-if="!isRecording" @click="emit('start-recording')" class="p-2 rounded-full bg-primary-100 text-primary-400 hover:bg-primary-50 hover:text-primary-500 transition-all shrink-0" v-tooltip="'Record voice message'">
          <Icon icon="mdi:microphone" class="text-xl" />
        </button>
        <button @click="emit('toggle-attach-menu')" :class="['p-2.5 rounded-full bg-primary-100 transition-all shrink-0', showAttachMenu ? 'bg-primary-500 text-white' : 'text-primary-400 hover:bg-primary-50 hover:text-primary-500']" v-tooltip="'Attach file or image'">
          <Icon icon="lucide:paperclip" class="text-lg" />
        </button>

        <div class="flex-1 flex items-center bg-primary-50 rounded-full border border-primary-300 px-3 py-1">
          <textarea
              ref="inputRef"
              :value="modelValue"
              @input="onInput"
              @keydown.enter.exact.prevent="emit('send')"
              @keydown.enter.shift.exact="emit('update:modelValue', modelValue + '\n')"
              rows="1" placeholder="Type a message..."
              class="flex-1 resize-none bg-transparent items-center text-sm text-primary-800 placeholder-primary-300 focus:outline-none max-h-32 leading-relaxed py-1.5"
              style="field-sizing: content"
          />
        </div>

        <button
            @click="emit('send')"
            :disabled="!modelValue.trim()"
            :class="['p-2.5 rounded-full transition-all shrink-0', modelValue.trim() ? 'bg-linear-to-br from-primary-500 to-primary-600 text-white shadow-md shadow-primary-200 hover:shadow-lg hover:scale-105 active:scale-95' : 'bg-primary-100 text-primary-300 cursor-not-allowed']"
            v-tooltip="'Send message'"
        >
          <Icon icon="pepicons-pop:send" class="text-xl" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Icon } from '@iconify/vue'
import PrioritySlider from '~/components/Priorityslider.vue'
import { colorFor } from '~/utils/avatarColor'
import type { ApiMessage, GroupMember, InlineTodoForm } from '~/types/ChatType'

const props = defineProps<{
  modelValue: string
  members: GroupMember[]
  replyTo: ApiMessage | null
  editingMessage: ApiMessage | null
  showAttachMenu: boolean
  showCreateTodo: boolean
  isRecording: boolean
  isSendingVoice: boolean
  recordingDuration: number
  recordingProgress: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  typing: []
  send: []
  'cancel-reply': []
  'cancel-edit': []
  'toggle-attach-menu': []
  'toggle-create-task': []
  'pick-files': [type: 'image' | 'file']
  'start-recording': []
  'stop-recording': []
  'cancel-recording': []
  'create-todo': [form: InlineTodoForm]
}>()

const replyToSenderName = computed(() => props.members.find(m => m.userId === props.replyTo?.senderId)?.name ?? 'Unknown')

function onInput(e: Event): void {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
  emit('typing')
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const todoForm = reactive<InlineTodoForm>({ title: '', description: '', priority: 'medium', assignedTo: [] })

function toggleAssignee(userId: number): void {
  const idx = todoForm.assignedTo.indexOf(userId)
  if (idx > -1) todoForm.assignedTo.splice(idx, 1)
  else todoForm.assignedTo.push(userId)
}

function submitTodo(): void {
  emit('create-todo', { ...todoForm })
  todoForm.title = ''; todoForm.description = ''; todoForm.priority = 'medium'; todoForm.assignedTo = []
}

const inputAreaRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)

defineExpose({ inputAreaRef, focusInput: () => inputRef.value?.focus() })
</script>