<template>
  <!-- System Message -->
  <div v-if="message.type === 'system'" class="flex justify-center my-2">
    <div class="flex items-center gap-2 px-3 py-1.5 bg-pink-50 rounded-full border border-pink-100">
      <Icon icon="mingcute:check-circle-line" class="text-pink-500 text-sm" />
      <span class="text-xs text-pink-500">{{ message.text }}</span>
    </div>
  </div>

  <!-- Regular Message -->
  <div
      v-else
      :class="[
      'flex gap-2 group',
      isOwn ? 'flex-row-reverse' : 'flex-row',
      condensed ? 'mt-0.5' : 'mt-3'
    ]"
  >
    <!-- Avatar -->
    <div class="shrink-0 w-8">
      <div
          v-if="!condensed"
          :class="[
          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm',
          sender?.avatarBg ?? 'bg-pink-400'
        ]"
          :title="sender?.name"
      >
        {{ sender?.name[0] ?? '?' }}
      </div>
    </div>

    <!-- Bubble Column -->
    <div :class="['max-w-[72%] flex flex-col', isOwn ? 'items-end' : 'items-start']">

      <!-- Sender Name (first message in group) -->
      <span
          v-if="!condensed && !isOwn"
          class="text-xs text-pink-500 font-medium mb-1 ml-1"
      >
        {{ sender?.name }}
      </span>

      <!-- Reply Preview -->
      <div
          v-if="message.replyTo && repliedMessage"
          :class="[
          'text-xs px-3 py-2 rounded-t-xl mb-0.5 border-l-2 border-pink-400 bg-pink-50 max-w-full cursor-pointer hover:bg-pink-100 transition-all',
          isOwn ? 'rounded-tr-sm' : 'rounded-tl-sm'
        ]"
          @click="emit('scroll-to', message.replyTo!)"
      >
        <span class="font-medium text-pink-500">{{ repliedSenderName }}</span>
        <p class="text-pink-400 truncate">{{ repliedMessage.text }}</p>
      </div>

      <!-- Todo Card -->
      <div
          v-if="message.todoRef"
          :class="[
          'flex items-center gap-2 px-3 py-2 rounded-xl mb-1 bg-pink-50 border border-pink-200 text-xs text-rose-700 cursor-pointer hover:bg-pink-100 transition-all',
          isOwn ? 'rounded-tr-sm' : 'rounded-tl-sm'
        ]"
          @click="emit('view-todo', message.todoRef!)"
      >
        <Icon icon="mingcute:task-2-line" class="text-pink-500 shrink-0" />
        <span class="font-medium flex-1 truncate">Task: {{ message.todoRef.text }}</span>
        <span :class="['px-1.5 py-0.5 rounded-full text-xs font-medium shrink-0', priorityColors[message.todoRef.priority]]">
          {{ message.todoRef.priority }}
        </span>
      </div>

      <!-- Message Bubble -->
      <div
          :class="[
          'px-3 py-2 rounded-2xl text-sm leading-relaxed',
          isOwn
            ? 'bg-linear-to-br from-pink-500 to-rose-500 text-white rounded-tr-sm shadow-md shadow-pink-200'
            : 'bg-white text-rose-800 rounded-tl-sm shadow-sm border border-pink-100',
          message.replyTo ? 'rounded-t-md' : ''
        ]"
      >
        <!-- Text (with optional search highlight) -->
        <span
            v-if="searchQuery && message.text.toLowerCase().includes(searchQuery.toLowerCase())"
            v-html="highlightText(message.text, searchQuery)"
        ></span>
        <span v-else>{{ message.text }}</span>

        <!-- Edited badge -->
        <span
            v-if="message.edited"
            :class="['text-[10px] ml-1', isOwn ? 'text-pink-200' : 'text-pink-300']"
        >(edited)</span>

        <!-- Time + Read Status -->
        <div :class="['flex items-center gap-1 mt-1', isOwn ? 'justify-end' : 'justify-start']">
          <span :class="['text-[10px]', isOwn ? 'text-pink-200' : 'text-pink-300']">
            {{ formatTime(message.timestamp) }}
          </span>
          <Icon
              v-if="isOwn"
              :icon="message.read ? 'solar:check-read-linear' : 'solar:check-linear'"
              :class="['text-xs', message.read ? 'text-emerald-300' : 'text-pink-300']"
          />
        </div>

        <!-- Reactions -->
        <div
            v-if="Object.keys(message.reactions).length > 0"
            class="flex flex-wrap gap-1 mt-1.5"
        >
          <button
              v-for="(users, emoji) in message.reactions"
              :key="emoji"
              @click="emit('react', message.id, String(emoji))"
              :class="[
              'flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-all',
              isReactedByMe(String(emoji))
                ? 'bg-pink-200/80 text-pink-700'
                : isOwn
                ? 'bg-white/20 text-white/80 hover:bg-white/30'
                : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
            ]"
          >
            {{ emoji }}
            <span>{{ (users as number[]).length }}</span>
          </button>
        </div>
      </div>

      <!-- Hover Action Bar -->
      <div
          :class="[
          'flex items-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity',
          isOwn ? 'flex-row-reverse' : 'flex-row'
        ]"
      >
        <!-- Quick Emoji Reactions -->
        <button
            v-for="emoji in quickEmojis"
            :key="emoji"
            @click="emit('react', message.id, emoji)"
            class="text-sm hover:scale-125 transition-transform px-0.5"
            :v-tooltip="'`React with ${emoji}`'"
        >{{ emoji }}</button>

        <div class="w-px h-3 bg-pink-100 mx-1"></div>

        <!-- Reply -->
        <button
            @click="emit('reply', message)"
            class="p-1.5 text-pink-300 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all"
            v-tooltip="'Reply'"
        >
          <Icon icon="solar:reply-linear" class="text-sm" />
        </button>

        <!-- Pin / Unpin -->
        <button
            @click="emit('pin', message.id)"
            :class="[
            'p-1.5 hover:bg-pink-50 rounded-lg transition-all',
            message.pinned ? 'text-pink-500' : 'text-pink-300 hover:text-pink-500'
          ]"
            :title="message.pinned ? 'Unpin' : 'Pin'"
        >
          <Icon icon="solar:pin-linear" class="text-sm" />
        </button>

        <!-- Edit (own messages only) -->
        <button
            v-if="isOwn"
            @click="emit('edit', message)"
            class="p-1.5 text-pink-300 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all"
            v-tooltip="'Edit'"
        >
          <Icon icon="mi:edit" class="text-sm" />
        </button>

        <!-- Delete (own messages only) -->
        <button
            v-if="isOwn"
            @click="emit('delete', message.id)"
            class="p-1.5 text-pink-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
            v-tooltip="'Delete'"
        >
          <Icon icon="mingcute:delete-line" class="text-sm" />
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { Message, Member, TodoRef } from '~/types/ChatType'
import type { Priority } from '~/types/TodoType'

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps<{
  message: Message
  /** پیام reply شده (اگه replyTo داره) */
  repliedMessage: Message | null
  sender: Member | undefined
  repliedSender: Member | undefined
  currentUserId: number
  /** پیام قبلی از همین فرستنده‌ست — bubble فشرده‌تر نمایش داده میشه */
  condensed: boolean
  searchQuery: string
}>()

// ─── Emits ───────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  reply: [msg: Message]
  pin: [id: number]
  edit: [msg: Message]
  delete: [id: number]
  react: [msgId: number, emoji: string]
  'view-todo': [ref: TodoRef]
  'scroll-to': [msgId: number]
}>()

// ─── Constants ────────────────────────────────────────────────────────────────
const quickEmojis = ['👍', '❤️', '😂', '🔥', '👏'] as const

const priorityColors: Record<Priority, string> = {
  high:   'bg-red-100 text-red-600',
  medium: 'bg-amber-100 text-amber-600',
  low:    'bg-emerald-100 text-emerald-600',
}

// ─── Computed ─────────────────────────────────────────────────────────────────
const isOwn = computed<boolean>(() => props.message.senderId === props.currentUserId)

const repliedSenderName = computed<string>(() => props.repliedSender?.name ?? 'Unknown')

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isReactedByMe(emoji: string): boolean {
  return props.message.reactions[emoji]?.includes(props.currentUserId) ?? false
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

function highlightText(text: string, query: string): string {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(
      new RegExp(`(${escaped})`, 'gi'),
      '<mark class="bg-yellow-200 rounded px-0.5 text-rose-800">$1</mark>'
  )
}
</script>