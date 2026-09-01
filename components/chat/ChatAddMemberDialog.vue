<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4" @click.self="emit('close')">
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full max-h-[70vh] flex flex-col">
        <div class="flex items-center justify-between p-5 border-b border-primary-100">
          <h3 class="text-base font-bold text-primary-900">Add Member</h3>
          <button @click="emit('close')" class="text-primary-400 hover:text-primary-600 text-xl">✕</button>
        </div>
        <div class="p-4">
          <div class="flex items-center gap-2 bg-primary-50 rounded-xl px-3 py-2">
            <Icon icon="solar:magnifer-linear" class="text-primary-400 shrink-0 text-sm" />
            <input
                :value="query"
                @input="localQuery = ($event.target as HTMLInputElement).value"
                @keyup.enter="emit('search', localQuery)"
                type="text" placeholder="Search by username or name..."
                class="flex-1 bg-transparent text-sm text-primary-800 placeholder-primary-300 focus:outline-none"
                autofocus
            />
            <button
                @click="emit('search', localQuery)"
                class="shrink-0 text-primary-400 hover:text-primary-600"
                v-tooltip="'Search'"
            >
              <Icon icon="mdi:magnify" class="text-sm" />
            </button>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          <button
              v-for="u in results" :key="u.id"
              @click="emit('add', u.id)"
              :disabled="addingId !== null"
              class="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-primary-50 transition-colors text-start disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img v-if="u.avatarUrl" :src="u.avatarUrl" class="w-9 h-9 rounded-full object-cover shrink-0" alt="" />
            <div v-else :class="['w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0', colorFor(u.id)]">{{ u.name[0] }}</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-primary-800 truncate">{{ u.name }}</p>
              <p class="text-xs text-primary-400" dir="ltr">@{{ u.username }}</p>
            </div>
            <Icon v-if="addingId === u.id" icon="mdi:loading" class="animate-spin text-primary-400 shrink-0" />
          </button>
          <p v-if="query.length >= 2 && results.length === 0" class="text-center text-xs text-primary-300 py-4">No users found</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { colorFor } from '~/utils/avatarColor'
import type { UserSearchResult } from '~/types/ChatType.ts'
import { ref, watch } from 'vue'

const props = defineProps<{ open: boolean; query: string; results: UserSearchResult[]; addingId: number | null }>()
const emit = defineEmits<{ close: []; 'update:query': [value: string]; search: [value: string]; add: [userId: number] }>()
const localQuery = ref(props.query)
watch(() => props.query, (v) => { localQuery.value = v })
</script>