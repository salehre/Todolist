<template>
  <!-- System Message -->
  <div v-if="message.type === 'system'" class="flex items-center gap-3 my-4">
    <div class="flex-1 h-px bg-primary-100" />
    <span class="whitespace-nowrap text-xs text-primary-400">{{ message.text }}</span>
    <div class="flex-1 h-px bg-primary-100" />
  </div>

  <!-- Regular Message -->
  <div
      v-else
      :id="`message-${message.id}`"
      :class="[
        'flex gap-2 group relative transition-all duration-500',
        isMine ? 'flex-row-reverse' : 'flex-row',
        consecutive ? 'mt-0.5' : 'mt-3',
        highlighted ? 'bg-primary-100/50 rounded-xl -mx-2 px-2 py-1' : ''
      ]"
  >
    <div class="shrink-0 w-8">
      <div v-if="!consecutive" @click="emit('open-profile', message.senderId)" class="cursor-pointer">
        <img v-if="sender?.avatarUrl" :src="sender.avatarUrl" class="w-8 h-8 rounded-full object-cover shadow-sm hover:opacity-80 transition" alt="member profile" />
        <div v-else :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm', colorFor(message.senderId)]">
          {{ senderName[0] }}
        </div>
      </div>
    </div>

    <div class="flex-1 max-w-[72%] relative">
      <span v-if="!consecutive && !isMine" class="text-xs text-primary-500 font-medium mb-1 ml-1 block">{{ senderName }}</span>

      <div class="relative group/message">
        <div :class="['px-3 py-1 my-px rounded-[20px] text-[16px] leading-relaxed', isMine ? 'bg-linear-to-br from-primary-500 to-primary-600 text-white shadow-md shadow-primary-200' : 'bg-white text-primary-800 shadow-sm border border-primary-100']">

          <div v-if="message.replyTo" class="text-xs px-3 py-2 rounded-[11px] mb-1.5 mt-2 border-primary-400 bg-primary-50 max-w-full">
            <span class="font-medium text-primary-500">{{ getMemberName(replyToMessage?.senderId ?? 0) }}</span>
            <p class="text-primary-400 truncate">{{ replyToMessage?.text }}</p>
          </div>

          <div v-if="message.attachments?.length" class="mb-2 -mx-3 first:mt-0">
            <div v-if="message.attachments.some(a => a.type === 'image')" class="flex justify-center px-3" :class="message.attachments.filter(a => a.type === 'image').length > 1 ? 'grid grid-cols-2 gap-1' : ''">
              <img
                  v-for="a in message.attachments.filter(a => a.type === 'image')"
                  :key="a.id"
                  :src="a.url" :alt="a.name"
                  class="rounded-lg max-h-64 w-full object-cover cursor-pointer hover:opacity-90 transition"
                  @click="emit('preview-image', a.url)"
              />
            </div>
            <div v-for="a in message.attachments.filter(a => a.type === 'voice')" :key="a.id" class="px-3 mt-1">
              <VoicePlayer :url="a.url" :duration="a.voiceDuration ?? 0" :variant="isMine ? 'sent' : 'received'" />
            </div>
            <div v-for="a in message.attachments.filter(a => a.type === 'file')" :key="a.id" class="mx-3 mt-1 flex items-center gap-2 p-2 bg-white/20 rounded-lg">
              <Icon :icon="getFileIcon(a.name)" class="text-2xl" />
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium truncate">{{ a.name }}</p>
                <p class="text-[10px] opacity-70">{{ formatFileSize(a.size) }}</p>
              </div>
              <a :href="a.url" download class="hover:scale-110 transition"><Icon icon="solar:download-linear" class="text-sm" /></a>
            </div>
          </div>

          <div v-if="message.todoRef" :class="['flex items-center gap-2 px-3 py-2 rounded-xl mb-1.5 bg-primary-50 border border-primary-200 text-xs text-primary-700 cursor-pointer hover:bg-primary-100 transition-all', isMine ? 'rounded-tr-sm' : 'rounded-tl-sm']" @click="emit('view-todo', message.todoRef!)">
            <Icon icon="mingcute:task-2-line" class="text-primary-500 shrink-0" />
            <span class="font-medium">Task: {{ message.todoRef.text }}</span>
            <span :class="['ml-auto px-1.5 py-0.5 rounded-full text-xs font-medium', priorityColors[message.todoRef.priority]]">{{ message.todoRef.priority }}</span>
          </div>

          <div><span>{{ message.text }}</span></div>

          <div class="flex flex-wrap items-center justify-between gap-2 mt-2 pt-1">
            <div :class="['flex items-center gap-1', isMine ? 'justify-end' : 'justify-start']">
              <Icon
                  v-if="isMine"
                  :icon="message.status === 'pending' ? 'mdi:clock-time-four-outline' : message.failed ? 'mdi:alert-circle-outline' : (message.readBy.includes(currentUserId) ? 'solar:check-read-linear' : 'solar:check-linear')"
                  :class="['text-xs', message.failed ? 'text-red-400' : (message.readBy.includes(currentUserId) ? 'text-emerald-300' : 'text-primary-300')]"
              />
              <span :class="['text-[12px]', isMine ? 'text-primary-400' : 'text-primary-300']">{{ formatTime(message.timestamp) }}</span>
              <Icon v-if="message.pinned" icon="iconoir:pin" class="text-primary-600 text-xs" />
              <Icon v-if="message.edited" icon="mdi:edit-outline" class="text-blue-600 text-xs" />
            </div>

            <div v-if="message.reactions && Object.keys(message.reactions).length > 0" class="flex flex-wrap gap-1">
              <button
                  v-for="(users, emoji) in message.reactions" :key="emoji"
                  @click="emit('toggle-reaction', message.id, String(emoji))"
                  :class="['flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-all', users.includes(currentUserId) ? 'bg-primary-200/80 text-primary-700' : isMine ? 'bg-white/20 text-white/80 hover:bg-white/30' : 'bg-primary-50 text-primary-600 hover:bg-primary-100']"
              >{{ emoji }} <span>{{ users.length }}</span></button>
            </div>
          </div>
        </div>

        <button
            @click="emit('open-menu', message, $event)"
            :class="['absolute top-1/3 -translate-y-1/2 opacity-0 group-hover/message:opacity-100 transition-all duration-200 hover:scale-110 p-1.5 rounded-full', isMine ? '-left-6' : '-right-6']"
        >
          <Icon icon="mage:dots" class="text-primary-500 text-lg" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import VoicePlayer from '~/components/VoicePlayer.vue'
import { colorFor } from '~/utils/avatarColor'
import type { ApiMessage, GroupMember, Priority } from '~/types/chatType'

const props = defineProps<{
  message: ApiMessage
  currentUserId: number
  consecutive: boolean
  highlighted: boolean
  members: GroupMember[]
  allMessages: ApiMessage[]
}>()

const emit = defineEmits<{
  'open-profile': [userId: number]
  'preview-image': [url: string]
  'view-todo': [todoRef: NonNullable<ApiMessage['todoRef']>]
  'toggle-reaction': [id: number, emoji: string]
  'open-menu': [message: ApiMessage, event: MouseEvent]
}>()

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-amber-100 text-amber-600',
  low: 'bg-emerald-100 text-emerald-600',
}

const isMine = computed(() => props.message.senderId === props.currentUserId)
const sender = computed(() => props.members.find(m => m.userId === props.message.senderId))
const senderName = computed(() => sender.value?.name ?? 'Unknown')
const replyToMessage = computed(() => props.allMessages.find(m => m.id === props.message.replyTo))

function getMemberName(id: number): string {
  return props.members.find(m => m.userId === id)?.name ?? 'Unknown'
}

function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

function getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'solar:gallery-bold'
  if (ext === 'pdf') return 'solar:document-bold'
  if (['doc', 'docx'].includes(ext || '')) return 'solar:document-text-bold'
  if (['xls', 'xlsx'].includes(ext || '')) return 'solar:document-add-bold'
  if (['zip', 'rar', '7z'].includes(ext || '')) return 'solar:archive-bold'
  return 'solar:file-bold'
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>