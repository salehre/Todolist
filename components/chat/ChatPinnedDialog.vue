<!-- ChatPinnedDialog.vue -->
<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center" @click.self="emit('close')">
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[70vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between px-5 py-4 border-b border-primary-100">
          <div class="flex items-center gap-2">
            <Icon icon="iconoir:pin" class="text-primary-500 -rotate-45 text-lg" />
            <h3 class="text-base font-bold text-primary-900">Pinned Messages</h3>
            <span class="text-xs text-primary-400 bg-primary-50 px-2 py-0.5 rounded-full">{{ messages.length }}</span>
          </div>
          <button @click="emit('close')" class="p-1.5 rounded-full hover:bg-primary-50 text-primary-400 hover:text-primary-600 transition">
            <Icon icon="mingcute:close-line" class="text-lg" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          <div v-for="msg in messages" :key="msg.id" @click="emit('go-to-message', msg.id)" class="flex items-start gap-3 p-3 rounded-xl hover:bg-primary-50 transition-all cursor-pointer group/item">
            <div class="shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <Icon icon="iconoir:pin" class="text-primary-500 -rotate-45 text-sm" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-xs font-medium text-primary-800">{{ getMemberName(msg.senderId) }}</span>
                <span class="text-[10px] text-primary-300">{{ formatTime(msg.timestamp) }}</span>
              </div>
              <p class="text-sm text-primary-600 line-clamp-2">{{ msg.text }}</p>
            </div>
            <button @click.stop="emit('unpin', msg.id)" class="shrink-0 p-1.5 rounded-lg bg-primary-100 text-primary-500 opacity-0 transition-all" v-tooltip="'Unpin'">
              <Icon icon="ri:unpin-fill" class="text-sm -rotate-45" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { ApiMessage, GroupMember } from '~/types/chatType'

const props = defineProps<{ open: boolean; messages: ApiMessage[]; members: GroupMember[] }>()
const emit = defineEmits<{ close: []; unpin: [id: number]; 'go-to-message': [id: number] }>()

function getMemberName(id: number): string {
  return props.members.find(m => m.userId === id)?.name ?? 'Unknown'
}
function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}
</script>