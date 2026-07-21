<template>
  <div class="relative flex-1 min-h-0">

    <!-- Scrollable Messages Container -->
    <div
        ref="containerRef"
        class="h-full overflow-y-auto px-4 py-4 custom-scrollbar space-y-1"
        @scroll="onScroll"
    >
      <!-- Date Groups -->
      <template v-for="(group, dateLabel) in groupedMessages" :key="dateLabel">

        <!-- Date Separator -->
        <div class="flex items-center gap-3 my-4">
          <div class="flex-1 h-px bg-pink-100"></div>
          <span class="text-xs text-pink-300 px-2 py-1 bg-white/60 rounded-full whitespace-nowrap">
            {{ dateLabel }}
          </span>
          <div class="flex-1 h-px bg-pink-100"></div>
        </div>

        <!-- Messages -->
        <MessageItem
            v-for="(msg, index) in group"
            :key="msg.id"
            :data-msg-id="msg.id"
            :message="msg"
            :replied-message="msg.replyTo ? getMessageById(msg.replyTo) ?? null : null"
            :sender="getMemberById(msg.senderId)"
            :replied-sender="msg.replyTo ? getMemberById(getMessageById(msg.replyTo)?.senderId ?? 0) : undefined"
            :current-user-id="currentUserId"
            :condensed="isSameSenderAsPrev(group, index)"
            :search-query="searchQuery"
            @reply="emit('reply', $event)"
            @pin="emit('pin', $event)"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
            @react="emit('react', $event[0] as number, $event[1] as string)"
            @view-todo="emit('view-todo', $event)"
            @scroll-to="scrollToMessage"
        />
      </template>

      <!-- Typing Indicator -->
      <div v-if="typingUsers.length > 0" class="flex items-center gap-2 mt-2 ml-10">
        <div class="flex gap-1 bg-white rounded-2xl rounded-tl-sm px-3 py-2.5 shadow-sm border border-pink-100">
          <span
              v-for="(_, i) in 3"
              :key="i"
              class="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"
              :style="{ animationDelay: `${i * 150}ms` }"
          ></span>
        </div>
        <span class="text-xs text-pink-400">{{ typingText }}</span>
      </div>

      <!-- Scroll Anchor -->
      <div ref="bottomAnchorRef"></div>
    </div>

    <!-- Scroll to Bottom Badge -->
    <transition name="fade-up">
      <div v-if="!isNearBottom && unreadCount > 0" class="absolute bottom-4 right-4 z-10">
        <button
            @click="scrollToBottom"
            class="flex items-center gap-1.5 px-3 py-2 bg-pink-500 text-white rounded-full text-xs font-medium shadow-lg hover:bg-pink-600 transition-all active:scale-95"
        >
          <Icon icon="mingcute:arrow-down-line" />
          {{ unreadCount }} new
        </button>
      </div>
    </transition>

    <!-- Scroll to Bottom (no unread) -->
    <transition name="fade-up">
      <div v-if="!isNearBottom && unreadCount === 0" class="absolute bottom-4 right-4 z-10">
        <button
            @click="scrollToBottom"
            class="p-2 bg-white/80 backdrop-blur-sm text-pink-400 rounded-full shadow-md hover:bg-white transition-all border border-pink-100"
            v-tooltip="'Scroll to bottom'"
        >
          <Icon icon="mingcute:arrow-down-line" class="text-base" />
        </button>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import MessageItem from './MessageItem.vue'
import type { Message, Member } from '~/types/ChatType'

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps<{
  messages: Message[]
  members: Member[]
  currentUserId: number
  typingUsers: number[]
  searchQuery: string
  unreadCount: number
}>()

// ─── Emits ───────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  reply: [msg: Message]
  pin: [id: number]
  edit: [msg: Message]
  delete: [id: number]
  /** آرگومان‌ها به صورت tuple پاس میشن چون Vue generic emits آرایه می‌خواد */
  react: [msgId: number, emoji: string]
  'view-todo': [ref: import('~/types/ChatType').TodoRef]
  'update:unreadCount': [count: number]
  'near-bottom-change': [isNear: boolean]
}>()

// ─── Refs ─────────────────────────────────────────────────────────────────────
const containerRef   = ref<HTMLElement | null>(null)
const bottomAnchorRef = ref<HTMLElement | null>(null)
const isNearBottom   = ref<boolean>(true)

// ─── Computed ─────────────────────────────────────────────────────────────────

/** پیام‌ها رو بر اساس تاریخ گروه‌بندی می‌کنه */
const groupedMessages = computed<Record<string, Message[]>>(() => {
  const groups: Record<string, Message[]> = {}
  props.messages.forEach(msg => {
    const key = getDateLabel(msg.timestamp)
    if (!groups[key]) groups[key] = []
    groups[key].push(msg)
  })
  return groups
})

const typingText = computed<string>(() => {
  if (!props.typingUsers.length) return ''
  const names = props.typingUsers.map(id => getMemberById(id)?.name ?? 'Someone')
  return names.join(', ') + (props.typingUsers.length === 1 ? ' is typing...' : ' are typing...')
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getMemberById(id: number): Member | undefined {
  return props.members.find(m => m.id === id)
}

function getMessageById(id: number): Message | undefined {
  return props.messages.find(m => m.id === id)
}

function isSameSenderAsPrev(group: Message[], index: number): boolean {
  if (index === 0) return false
  return (
      group[index].senderId === group[index - 1].senderId &&
      group[index].type !== 'system' &&
      group[index - 1].type !== 'system'
  )
}

function getDateLabel(date: Date): string {
  const now  = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── Scroll ───────────────────────────────────────────────────────────────────
function scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
  nextTick(() => {
    bottomAnchorRef.value?.scrollIntoView({ behavior })
    isNearBottom.value = true
    emit('update:unreadCount', 0)
    emit('near-bottom-change', true)
  })
}

function scrollToMessage(msgId: number): void {
  const el = containerRef.value?.querySelector(`[data-msg-id="${msgId}"]`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function onScroll(): void {
  const el = containerRef.value
  if (!el) return
  const near = el.scrollHeight - el.scrollTop - el.clientHeight < 100
  if (near !== isNearBottom.value) {
    isNearBottom.value = near
    emit('near-bottom-change', near)
  }
  if (near) emit('update:unreadCount', 0)
}

// ─── Expose برای parent ───────────────────────────────────────────────────────
defineExpose({ scrollToBottom })

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted((): void => {
  scrollToBottom('instant' as ScrollBehavior)
})

watch(
    () => props.messages.length,
    (): void => {
      if (isNearBottom.value) scrollToBottom()
    }
)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar       { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(219,39,119,0.2); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(219,39,119,0.4); }

.fade-up-enter-active, .fade-up-leave-active { transition: all 0.2s ease; }
.fade-up-enter-from, .fade-up-leave-to { opacity: 0; transform: translateY(8px); }
</style>