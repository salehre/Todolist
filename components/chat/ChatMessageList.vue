<template>
  <div
      ref="containerRef"
      @scroll="emit('scroll')"
      class="flex-1 overflow-y-auto px-4 pt-4 pb-[5px] custom-scrollbar min-h-0 space-y-1"
      :style="{ opacity: ready ? 1 : 0 }"
  >
    <!-- SKELETON: initial page load -->
    <div v-if="loadingInitial" class="flex flex-col h-full">
      <div class="flex items-center gap-3 my-4">
        <div class="flex-1 h-px bg-primary-100"></div>
        <div class="h-5 w-16 rounded-full bg-primary-50 animate-pulse"></div>
        <div class="flex-1 h-px bg-primary-100"></div>
      </div>
      <div class="flex-1 flex flex-col gap-1.5">
        <template v-for="(row, i) in initialSkeletonRows" :key="'init-' + i">
          <div v-if="row.type === 'system'" class="flex items-center gap-3 my-3">
            <div class="flex-1 h-px bg-primary-100"></div>
            <div class="h-5 w-32 rounded-full bg-primary-50/80 animate-pulse"></div>
            <div class="flex-1 h-px bg-primary-100"></div>
          </div>
          <div v-else :class="['flex gap-2', row.sent ? 'flex-row-reverse' : 'flex-row', row.consecutive ? 'mt-0.5' : 'mt-3']">
            <div class="shrink-0 w-8">
              <div v-if="!row.consecutive" :class="['w-8 h-8 rounded-full animate-pulse', row.sent ? 'bg-primary-200/50' : 'bg-primary-100']"></div>
            </div>
            <div class="max-w-[72%]">
              <div v-if="!row.consecutive && !row.sent" class="h-2.5 w-16 rounded-full bg-primary-100/60 mb-1.5 ms-1 animate-pulse"></div>
              <div :class="['rounded-[20px] px-3 py-2 my-px animate-pulse', row.sent ? 'bg-primary-200/40 shadow-sm shadow-primary-100' : 'bg-white shadow-sm border border-primary-100/60']">
                <div v-if="row.hasImage" :class="['rounded-lg mb-2 animate-pulse', row.sent ? 'bg-primary-300/30' : 'bg-primary-100', row.imageWide ? 'h-36 w-52' : 'h-40 w-40']"></div>
                <div v-if="row.hasVoice" class="flex items-center gap-2 py-1">
                  <div :class="['w-7 h-7 rounded-full', row.sent ? 'bg-primary-300/40' : 'bg-primary-200/60']" />
                  <div class="flex-1 flex items-center gap-0.5">
                    <div v-for="bar in 18" :key="bar" :class="['rounded-full', row.sent ? 'bg-primary-300/40' : 'bg-primary-200/50']" :style="{ width: '3px', height: (8 + Math.sin(bar * 0.8) * 8 + Math.random() * 4) + 'px' }"></div>
                  </div>
                  <div :class="['h-2.5 w-7 rounded-full', row.sent ? 'bg-primary-300/30' : 'bg-primary-100/60']"></div>
                </div>
                <div v-if="!row.hasVoice" class="space-y-1.5">
                  <div v-for="(line, li) in row.lines" :key="li" :class="['h-2.5 rounded-full', row.sent ? 'bg-primary-300/30' : 'bg-primary-200/50']" :style="{ width: line + '%' }"></div>
                </div>
                <div class="flex items-center gap-1 mt-2 pt-0.5" :class="row.sent ? 'justify-end' : 'justify-start'">
                  <div v-if="row.sent" class="w-3 h-3 rounded-full bg-primary-200/40"></div>
                  <div :class="['h-2 w-8 rounded-full', row.sent ? 'bg-primary-200/30' : 'bg-primary-100/60']"></div>
                </div>
                <div v-if="row.hasReactions" class="flex gap-1 mt-1.5">
                  <div v-for="r in row.reactionCount" :key="r" :class="['h-5 rounded-full animate-pulse', row.sent ? 'bg-primary-300/20' : 'bg-primary-100/70', r === 1 ? 'w-10' : 'w-8']"></div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="flex items-center gap-2 mt-3 ms-10">
        <div class="flex gap-1 bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm border border-primary-100 animate-pulse">
          <span class="w-1.5 h-1.5 bg-primary-200 rounded-full"></span>
          <span class="w-1.5 h-1.5 bg-primary-200 rounded-full"></span>
          <span class="w-1.5 h-1.5 bg-primary-200 rounded-full"></span>
        </div>
        <div class="h-2.5 w-20 rounded-full bg-primary-100/50 animate-pulse"></div>
      </div>
    </div>

    <!-- SKELETON: switching to a group -->
    <div v-else-if="activeGroupId && loadingMessages && messages.length === 0" class="flex flex-col h-full">
      <div class="flex items-center gap-3 my-4">
        <div class="flex-1 h-px bg-primary-100"></div>
        <div class="h-5 w-14 rounded-full bg-primary-50 animate-pulse"></div>
        <div class="flex-1 h-px bg-primary-100"></div>
      </div>
      <div class="flex-1 flex flex-col gap-1.5">
        <template v-for="(row, i) in messageSkeletonRows" :key="'msg-' + i">
          <div :class="['flex gap-2', row.sent ? 'flex-row-reverse' : 'flex-row', row.consecutive ? 'mt-0.5' : 'mt-3']">
            <div class="shrink-0 w-8">
              <div v-if="!row.consecutive" :class="['w-8 h-8 rounded-full animate-pulse', row.sent ? 'bg-primary-200/50' : 'bg-primary-100']"></div>
            </div>
            <div class="max-w-[72%]">
              <div v-if="!row.consecutive && !row.sent" class="h-2.5 w-14 rounded-full bg-primary-100/60 mb-1.5 ms-1 animate-pulse"></div>
              <div :class="['rounded-[20px] px-3 py-2 my-px animate-pulse', row.sent ? 'bg-primary-200/40 shadow-sm shadow-primary-100' : 'bg-white shadow-sm border border-primary-100/60']">
                <div class="space-y-1.5">
                  <div v-for="(line, li) in row.lines" :key="li" :class="['h-2.5 rounded-full', row.sent ? 'bg-primary-300/30' : 'bg-primary-200/50']" :style="{ width: line + '%' }"></div>
                </div>
                <div class="flex items-center gap-1 mt-2 pt-0.5" :class="row.sent ? 'justify-end' : 'justify-start'">
                  <div v-if="row.sent" class="w-3 h-3 rounded-full bg-primary-200/40"></div>
                  <div :class="['h-2 w-8 rounded-full', row.sent ? 'bg-primary-200/30' : 'bg-primary-100/60']"></div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- No group selected -->
    <div v-else-if="!activeGroupId" class="flex h-full items-center justify-center">
      <div class="flex flex-col text-center items-center gap-2 rounded-2xl border border-primary-200/60 bg-white/80 sm:px-24 py-6 shadow-lg shadow-primary-200/20 backdrop-blur-xl">
        <Icon icon="mdi:users-group" class="text-3xl text-primary-700" />
        <strong class="text-lg font-semibold text-primary-600">یک چت رو انتخاب کن</strong>
        <p class="text-sm text-primary-400">اگر گروهی نداری، یکی بساز</p>
      </div>
    </div>

    <!-- Empty messages -->
    <div v-else-if="!loadingMessages && messages.length === 0" class="flex h-full items-center justify-center">
      <div class="flex flex-col text-center items-center gap-2 rounded-2xl border border-primary-200/60 bg-white/80 sm:px-24 px-14 py-6 shadow-lg shadow-primary-200/20 backdrop-blur-xl">
        <Icon icon="ep:chat-round" class="text-4xl text-primary-700" />
        <strong class="text-lg text-primary-600">هنوز پیامی وجود نداره</strong>
        <p class="text-sm text-primary-400">اولین پیام رو بفرست!</p>
      </div>
    </div>

    <!-- Actual messages -->
    <template v-else>
      <template v-for="(group, date) in groupedMessages" :key="date">
        <div :ref="el => emit('date-divider-ref', el, date)" class="flex items-center gap-3 my-4">
          <div class="flex-1 h-px bg-primary-100"></div>
          <span class="text-xs text-primary-300 px-2 py-1 bg-white/60 rounded-full">{{ date }}</span>
          <div class="flex-1 h-px bg-primary-100"></div>
        </div>

        <ChatMessageBubble
            v-for="(msg, index) in group"
            :key="msg.id"
            :message="msg"
            :current-user-id="currentUserId"
            :consecutive="isSameSenderAsPrev(group, index)"
            :highlighted="highlightedMessageId === msg.id"
            :members="members"
            :all-messages="messages"
            @open-profile="emit('open-profile', $event)"
            @preview-image="emit('preview-image', $event)"
            @view-todo="emit('view-todo', $event)"
            @toggle-reaction="(id, emoji) => emit('toggle-reaction', id, emoji)"
            @open-menu="(msg, event) => emit('open-menu', msg, event)"
        />
      </template>

      <div v-if="typingUsers.length > 0" class="flex items-center gap-2 mt-2 ml-10">
        <div class="flex gap-1 bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm border border-primary-100">
          <span class="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
          <span class="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
          <span class="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
        </div>
        <span class="text-xs text-primary-400">{{ typingText }}</span>
      </div>

      <div ref="bottomAnchorRef"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import ChatMessageBubble from '~/components/chat/ChatMessageBubble.vue'
import type { ApiMessage, GroupMember, SkeletonRow } from '~/types/ChatType'

const props = defineProps<{
  messages: ApiMessage[]
  members: GroupMember[]
  currentUserId: number
  activeGroupId: number | null
  loadingInitial: boolean
  loadingMessages: boolean
  ready: boolean
  highlightedMessageId: number | null
  typingUsers: number[]
  typingNames: Record<number, string>
  searchQuery: string
}>()

const emit = defineEmits<{
  scroll: []
  'date-divider-ref': [el: unknown, date: string]
  'open-profile': [userId: number]
  'preview-image': [url: string]
  'view-todo': [todoRef: NonNullable<ApiMessage['todoRef']>]
  'toggle-reaction': [id: number, emoji: string]
  'open-menu': [message: ApiMessage, event: MouseEvent]
}>()

const containerRef = ref<HTMLElement | null>(null)
const bottomAnchorRef = ref<HTMLElement | null>(null)
defineExpose({ containerRef, bottomAnchorRef })

const filteredMessages = computed(() => {
  if (!props.searchQuery) return props.messages
  return props.messages.filter(m => (m.text ?? '').toLowerCase().includes(props.searchQuery.toLowerCase()))
})

function getDateLabel(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const days = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const groupedMessages = computed<Record<string, ApiMessage[]>>(() => {
  const groups: Record<string, ApiMessage[]> = {}
  filteredMessages.value.forEach(msg => {
    const key = getDateLabel(msg.timestamp)
    if (!groups[key]) groups[key] = []
    groups[key].push(msg)
  })
  return groups
})

function isSameSenderAsPrev(group: ApiMessage[], index: number): boolean {
  if (index === 0) return false
  return group[index].senderId === group[index - 1].senderId && group[index].type !== 'system' && group[index - 1].type !== 'system'
}

const typingText = computed(() => {
  if (props.typingUsers.length === 0) return ''
  const names = props.typingUsers.map(id => props.typingNames[id] ?? 'someone')
  return names.join(', ') + (props.typingUsers.length === 1 ? ' is typing...' : ' are typing...')
})

const initialSkeletonRows = computed<SkeletonRow[]>(() => [
  { type: 'message', sent: false, consecutive: false, lines: [90, 60], hasImage: false, imageWide: false, hasVoice: false, hasReactions: false, reactionCount: 0 },
  { type: 'message', sent: false, consecutive: true, lines: [75], hasImage: false, imageWide: false, hasVoice: false, hasReactions: false, reactionCount: 0 },
  { type: 'message', sent: true, consecutive: false, lines: [85, 50, 30], hasImage: false, imageWide: false, hasVoice: false, hasReactions: true, reactionCount: 2 },
  { type: 'message', sent: false, consecutive: false, lines: [], hasImage: true, imageWide: true, hasVoice: false, hasReactions: false, reactionCount: 0 },
  { type: 'message', sent: false, consecutive: true, lines: [65], hasImage: false, imageWide: false, hasVoice: false, hasReactions: false, reactionCount: 0 },
  { type: 'message', sent: true, consecutive: false, lines: [95, 70], hasImage: false, imageWide: false, hasVoice: false, hasReactions: false, reactionCount: 0 },
  { type: 'message', sent: true, consecutive: true, lines: [40], hasImage: false, imageWide: false, hasVoice: false, hasReactions: false, reactionCount: 0 },
  { type: 'system', sent: false, consecutive: false, lines: [], hasImage: false, imageWide: false, hasVoice: false, hasReactions: false, reactionCount: 0 },
  { type: 'message', sent: false, consecutive: false, lines: [], hasImage: false, imageWide: false, hasVoice: true, hasReactions: false, reactionCount: 0 },
  { type: 'message', sent: true, consecutive: false, lines: [80, 55], hasImage: false, imageWide: false, hasVoice: false, hasReactions: true, reactionCount: 3 },
])

const messageSkeletonRows = computed<SkeletonRow[]>(() => [
  { type: 'message', sent: false, consecutive: false, lines: [85, 55], hasImage: false, imageWide: false, hasVoice: false, hasReactions: false, reactionCount: 0 },
  { type: 'message', sent: false, consecutive: true, lines: [70], hasImage: false, imageWide: false, hasVoice: false, hasReactions: false, reactionCount: 0 },
  { type: 'message', sent: true, consecutive: false, lines: [90, 65, 35], hasImage: false, imageWide: false, hasVoice: false, hasReactions: true, reactionCount: 2 },
  { type: 'message', sent: false, consecutive: false, lines: [], hasImage: false, imageWide: false, hasVoice: true, hasReactions: false, reactionCount: 0 },
  { type: 'message', sent: true, consecutive: false, lines: [50], hasImage: false, imageWide: false, hasVoice: false, hasReactions: false, reactionCount: 0 },
])
</script>