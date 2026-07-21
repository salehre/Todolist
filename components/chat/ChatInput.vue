<template>
  <div class="shrink-0 px-4 pb-4 pt-2">

    <!-- Reply Preview -->
    <transition name="slide-up">
      <div
          v-if="replyTo"
          class="mx-1 mb-2 px-3 py-2 bg-pink-50 rounded-xl border border-pink-200 flex items-center gap-2"
      >
        <Icon icon="solar:reply-linear" class="text-pink-400 shrink-0" />
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-pink-500">
            Replying to {{ replyTo.senderName }}
          </p>
          <p class="text-xs text-pink-400 truncate">{{ replyTo.text }}</p>
        </div>
        <button @click="emit('cancel-reply')" class="text-pink-400 hover:text-pink-600 shrink-0">
          <Icon icon="mingcute:close-line" />
        </button>
      </div>
    </transition>

    <!-- Edit Preview -->
    <transition name="slide-up">
      <div
          v-if="editingText"
          class="mx-1 mb-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2"
      >
        <Icon icon="mi:edit" class="text-amber-500 shrink-0" />
        <p class="text-xs text-amber-600 flex-1 truncate">Editing: {{ editingText }}</p>
        <button @click="emit('cancel-edit')" class="text-amber-400 hover:text-amber-600 shrink-0">
          <Icon icon="mingcute:close-line" />
        </button>
      </div>
    </transition>

    <!-- Main Input Card -->
    <div class="bg-white rounded-2xl border border-pink-200 shadow-sm overflow-hidden">

      <!-- Attachment Options -->
      <transition name="slide-down">
        <div v-if="showAttachMenu" class="px-4 pt-3 pb-2 border-b border-pink-100">
          <p class="text-xs text-pink-400 mb-2 font-medium uppercase tracking-wide">Create & Share</p>
          <button
              @click="emit('open-todo-form'); showAttachMenu = false"
              class="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 transition-all text-sm text-rose-700 font-medium"
          >
            <div class="w-6 h-6 rounded-lg bg-pink-200 flex items-center justify-center">
              <Icon icon="mingcute:task-2-line" class="text-pink-600 text-sm" />
            </div>
            Create a new task for the team
          </button>
        </div>
      </transition>

      <!-- Inline Todo Creation Form -->
      <transition name="slide-down">
        <div v-if="showTodoForm" class="px-4 pt-3 pb-2 border-b border-pink-100 space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs text-pink-500 font-semibold flex items-center gap-1">
              <Icon icon="mingcute:task-2-line" /> New Task
            </p>
            <button @click="emit('close-todo-form')" class="text-pink-300 hover:text-pink-500">
              <Icon icon="mingcute:close-line" class="text-sm" />
            </button>
          </div>
          <input
              :value="todoForm.title"
              @input="updateTodoForm('title', ($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="Task title *"
              class="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition-all"
              @keyup.enter="emit('submit-todo')"
          />
          <textarea
              :value="todoForm.description"
              @input="updateTodoForm('description', ($event.target as HTMLTextAreaElement).value)"
              rows="2"
              placeholder="Description (optional)"
              class="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition-all resize-none"
          ></textarea>
          <div class="flex gap-2">
            <select
                :value="todoForm.priority"
                @change="updateTodoForm('priority', ($event.target as HTMLSelectElement).value)"
                class="flex-1 px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-1 focus:ring-pink-200 text-rose-700 font-medium"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <button
                @click="emit('submit-todo')"
                :disabled="!todoForm.title.trim()"
                class="px-4 py-2 bg-pink-500 text-white rounded-xl text-sm font-medium hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              Create
            </button>
          </div>
        </div>
      </transition>

      <!-- Text Input Row -->
      <div class="flex items-end gap-2 p-3">

        <!-- Attach Button -->
        <button
            @click="showAttachMenu = !showAttachMenu; showEmojiPicker = false"
            :class="[
            'p-2 rounded-xl transition-all shrink-0',
            showAttachMenu
              ? 'bg-pink-100 text-pink-600'
              : 'text-pink-400 hover:bg-pink-50 hover:text-pink-500'
          ]"
            v-tooltip="'Attach'"
        >
          <Icon icon="solar:paperclip-linear" class="text-lg" />
        </button>

        <!-- Emoji Picker Toggle -->
        <button
            @click="showEmojiPicker = !showEmojiPicker; showAttachMenu = false"
            :class="[
            'p-2 rounded-xl transition-all shrink-0',
            showEmojiPicker
              ? 'bg-pink-100 text-pink-600'
              : 'text-pink-400 hover:bg-pink-50 hover:text-pink-500'
          ]"
            v-tooltip="'Emoji'"
        >
          <Icon icon="solar:emoji-funny-square-linear" class="text-lg" />
        </button>

        <!-- Textarea -->
        <textarea
            ref="textareaRef"
            :value="modelValue"
            @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
            @keydown.enter.exact.prevent="emit('send')"

            @keydown.escape="onEscape"
            rows="1"
            :placeholder="editingText ? 'Edit your message...' : 'Type a message...'"
            class="flex-1 resize-none bg-transparent text-sm text-rose-800 placeholder-pink-300 focus:outline-none max-h-32 leading-relaxed py-1.5"
            style="field-sizing: content"
        ></textarea>

        <!-- Send / Save Button -->
        <button
            @click="emit('send')"
            :disabled="!modelValue.trim()"
            :class="[
            'p-2.5 rounded-xl transition-all shrink-0',
            modelValue.trim()
              ? 'bg-linear-to-br from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200 hover:shadow-lg hover:scale-105 active:scale-95'
              : 'bg-pink-100 text-pink-300 cursor-not-allowed'
          ]"
            v-tooltip:end="editingText ? 'Save Edit' : 'Send Message'"
        >
          <Icon :icon="editingText ? 'mingcute:check-line' : 'solar:plain-bold'" class="text-base" />
        </button>
      </div>

      <!-- Emoji Picker -->
      <transition name="slide-down">
        <div v-if="showEmojiPicker" class="px-4 pb-3 border-t border-pink-50">
          <div class="flex flex-wrap gap-2 pt-2">
            <button
                v-for="emoji in allEmojis"
                :key="emoji"
                @click="emit('update:modelValue', modelValue + emoji)"
                class="text-xl hover:scale-125 transition-transform leading-none"
            >{{ emoji }}</button>
          </div>
        </div>
      </transition>

    </div>

    <!-- Keyboard Hint -->
    <p class="text-center text-[10px] text-pink-300 mt-1.5">
      Enter to send · Shift+Enter for new line · Esc to cancel
    </p>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { InlineTodoForm } from '~/types/ChatType'

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps<{
  /** v-model: متن input */
  modelValue: string
  /** اگه داره reply می‌کنه */
  replyTo: { text: string; senderName: string } | null
  /** اگه داره edit می‌کنه — متن اصلی رو نشون میده */
  editingText: string | null
  /** وضعیت فرم تسک */
  showTodoForm: boolean
  todoForm: InlineTodoForm
}>()

// ─── Emits ───────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  'update:modelValue': [value: string]
  /** ارسال پیام یا ذخیره edit */
  send: []
  'cancel-reply': []
  'cancel-edit': []
  'open-todo-form': []
  'close-todo-form': []
  'submit-todo': []
  'update:todoForm': [form: InlineTodoForm]
}>()

// ─── Local UI State ───────────────────────────────────────────────────────────
const showAttachMenu  = ref<boolean>(false)
const showEmojiPicker = ref<boolean>(false)
const textareaRef     = ref<HTMLTextAreaElement | null>(null)

const allEmojis = [
  '😊','😂','❤️','🔥','👍','👏','🎉','😎','🤔',
  '💡','✅','❌','⚡','🚀','💪','🙏','😅','🥲',
] as const

// ─── Helpers ──────────────────────────────────────────────────────────────────
function updateTodoForm(field: keyof InlineTodoForm, value: string): void {
  emit('update:todoForm', { ...props.todoForm, [field]: value })
}

function onEscape(): void {
  if (props.editingText) emit('cancel-edit')
  else if (props.replyTo) emit('cancel-reply')
  showEmojiPicker.value = false
  showAttachMenu.value = false
}

// focus textarea وقتی reply یا edit شروع میشه
watch(() => props.replyTo, (val) => { if (val) textareaRef.value?.focus() })
watch(() => props.editingText, (val) => { if (val) textareaRef.value?.focus() })

// بستن منوها وقتی todo form باز میشه
watch(() => props.showTodoForm, (val) => { if (val) { showAttachMenu.value = false } })

// ─── Expose ───────────────────────────────────────────────────────────────────
defineExpose({ focus: () => textareaRef.value?.focus() })
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active,
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.18s ease;
  overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; max-height: 0; }
.slide-down-enter-to, .slide-down-leave-from  { opacity: 1; max-height: 300px; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(6px); }
.slide-up-enter-to, .slide-up-leave-from  { opacity: 1; transform: translateY(0); }
</style>