<template>
  <div class="shrink-0 bg-white/90 backdrop-blur-md border-b border-pink-200/60 shadow-sm">

    <!-- Main Header Row -->
    <div class="px-5 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Group Avatar -->
        <div class="relative">
          <div class="w-10 h-10 rounded-2xl bg-linear-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-md shadow-pink-200">
            <Icon icon="solar:users-group-rounded-bold" class="text-white text-xl" />
          </div>
          <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></span>
        </div>
        <div>
          <h2 class="text-sm font-bold text-rose-900">Project Team</h2>
          <p class="text-xs text-pink-400">{{ onlineCount }} online · {{ members.length }} members</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <!-- Member Avatars Stack -->
        <div class="flex -space-x-2">
          <div
              v-for="member in members.slice(0, 4)"
              :key="member.id"
              :title="member.name"
              :class="[
              'w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm',
              member.avatarBg
            ]"
          >
            {{ member.name[0] }}
          </div>
          <div
              v-if="members.length > 4"
              class="w-7 h-7 rounded-full border-2 border-white bg-pink-200 flex items-center justify-center text-xs font-bold text-pink-700"
          >
            +{{ members.length - 4 }}
          </div>
        </div>

        <!-- Search Button -->
        <button
            @click="emit('toggle-search')"
            :class="[
            'p-2 rounded-xl transition-all',
            searchOpen
              ? 'bg-pink-100 text-pink-600'
              : 'text-pink-400 hover:bg-pink-50 hover:text-pink-600'
          ]"
            v-tooltip="'Search messages'"
        >
          <Icon icon="solar:magnifer-linear" class="text-lg" />
        </button>

        <!-- Pinned Messages Button -->
        <button
            @click="emit('toggle-pinned')"
            :class="[
            'p-2 rounded-xl transition-all',
            pinnedOpen
              ? 'bg-pink-100 text-pink-600'
              : 'text-pink-400 hover:bg-pink-50 hover:text-pink-600'
          ]"
            v-tooltip="'Pinned messages'"
        >
          <Icon icon="solar:pin-linear" class="text-lg" />
          <!-- badge تعداد pinned -->
          <span
              v-if="pinnedCount > 0 && !pinnedOpen"
              class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
          >
            {{ pinnedCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <transition name="slide-down">
      <div v-if="searchOpen" class="px-5 pb-3">
        <div class="flex items-center gap-2 bg-pink-50 rounded-xl px-3 py-2 border border-pink-100">
          <Icon icon="solar:magnifer-linear" class="text-pink-400 shrink-0" />
          <input
              :value="searchQuery"
              @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="Search messages..."
              class="flex-1 bg-transparent text-sm text-rose-800 placeholder-pink-300 focus:outline-none"
              autofocus
          />
          <button
              v-if="searchQuery"
              @click="emit('update:searchQuery', '')"
              class="text-pink-300 hover:text-pink-500"
          >
            <Icon icon="mingcute:close-line" />
          </button>
        </div>
        <p v-if="searchQuery && searchResultCount === 0" class="text-xs text-pink-300 mt-1.5 ml-1">
          No messages found
        </p>
        <p v-else-if="searchQuery" class="text-xs text-pink-400 mt-1.5 ml-1">
          {{ searchResultCount }} result{{ searchResultCount !== 1 ? 's' : '' }}
        </p>
      </div>
    </transition>

    <!-- Pinned Messages Panel -->
    <transition name="slide-down">
      <div v-if="pinnedOpen" class="px-5 pb-3">
        <div v-if="pinnedMessages.length > 0" class="bg-pink-50/80 rounded-xl p-3 border border-pink-100">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-1">
              <Icon icon="solar:pin-bold" class="text-pink-500 text-xs" />
              <span class="text-xs font-semibold text-pink-600">Pinned Messages</span>
            </div>
            <span class="text-[10px] text-pink-300">{{ pinnedMessages.length }} pinned</span>
          </div>
          <div
              v-for="msg in pinnedMessages"
              :key="msg.id"
              class="text-xs text-rose-700 py-1.5 border-t border-pink-100 first:border-0 flex items-center gap-2"
          >
            <Icon icon="solar:pin-bold" class="text-pink-300 shrink-0 text-[10px]" />
            <div class="flex-1 min-w-0">
              <span class="font-medium text-pink-600">{{ getMemberName(msg.senderId) }}: </span>
              <span class="truncate">{{ msg.text }}</span>
            </div>
            <button
                @click="emit('unpin-message', msg.id)"
                class="text-pink-300 hover:text-pink-500 shrink-0"
                v-tooltip="'Unpin'"
            >
              <Icon icon="mingcute:close-line" class="text-xs" />
            </button>
          </div>
        </div>
        <div v-else class="text-center py-2">
          <p class="text-xs text-pink-300">No pinned messages yet</p>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { Member, Message } from '~/types/ChatType'

// ─── Props ────────────────────────────────────────────────────────────────────
defineProps<{
  members: Member[]
  onlineCount: number
  searchOpen: boolean
  pinnedOpen: boolean
  searchQuery: string
  searchResultCount: number
  pinnedMessages: Message[]
  pinnedCount: number
}>()

// ─── Emits ───────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  'toggle-search': []
  'toggle-pinned': []
  /** v-model:searchQuery */
  'update:searchQuery': [value: string]
  /** unpin یه پیام از panel */
  'unpin-message': [id: number]
}>()

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getMemberName(id: number): string {
  // این inject میشه از parent یا می‌تونی members prop رو search کنی
  return `User ${id}`
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  padding-bottom: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 200px;
}
</style>