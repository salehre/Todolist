<template>
  <aside
      :class="[
        'h-full overflow-hidden border-e border-primary-200/60 bg-white/80 backdrop-blur-xl relative',
        isMobile ? 'w-full' : ['shrink-0 transition-[width] duration-300 ease-in-out', sidebarIconOnly ? 'w-19' : 'w-72'],
        isMobile && mobilePane !== 'sidebar' ? 'hidden' : 'flex flex-col'
      ]"
  >
    <div v-if="!sidebarIconOnly" class="w-full shrink-0 border-b border-primary-100">
      <div class="flex items-center gap-2 h-14 px-3 pt-2">
        <div class="flex items-center gap-1 p-1 rounded-xl bg-primary-50 flex-1 min-w-0">
          <button
              class="flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold bg-white text-primary-700 shadow-sm transition-all"
              v-tooltip="'Chats & Groups'"
          >
            <Icon icon="solar:chat-round-dots-bold" class="text-base shrink-0" />
            <span class="truncate">Chats</span>
          </button>
          <button
              @click="emit('go-to-tasks')"
              class="flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-primary-400 hover:text-primary-600 hover:bg-white/60 transition-all"
              v-tooltip="'Open Tasks list'"
          >
            <Icon icon="solar:checklist-minimalistic-linear" class="text-base shrink-0" />
            <span class="truncate">Tasks</span>
          </button>
        </div>
        <button
            @click="handleToggle"
            class="p-2 rounded-lg text-primary-400 hover:bg-primary-50 hover:text-primary-600 transition-all shrink-0"
            v-tooltip="isMobile ? 'Close' : 'Collapse'"
        >
          <Icon :icon="isMobile ? 'mingcute:close-line' : 'solar:double-alt-arrow-right-linear'" class="text-lg" />
        </button>
      </div>

      <div class="px-3 pb-3">
        <div class="flex items-center gap-2 bg-primary-50 rounded-xl px-3 py-2">
          <Icon icon="solar:magnifer-linear" class="text-primary-400 shrink-0 text-sm" />
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Search groups..."
              class="flex-1 min-w-0 bg-transparent text-xs text-primary-800 placeholder-primary-300 focus:outline-none"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="text-primary-300 hover:text-primary-500 shrink-0">
            <Icon icon="mingcute:close-line" class="text-sm" />
          </button>
        </div>
      </div>
    </div>

    <div v-else class="hidden md:flex w-19 shrink-0 flex-col items-center gap-1.5 border-b border-primary-100 py-2.5">
      <button @click="handleToggle" class="w-9 h-9 flex items-center justify-center rounded-lg text-primary-400 hover:bg-primary-50 hover:text-primary-600 transition-all" v-tooltip="'Expand'">
        <Icon icon="solar:double-alt-arrow-left-linear" class="text-lg" />
      </button>
      <button class="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-100 text-primary-700 transition-all" v-tooltip="'Chats & Groups'">
        <Icon icon="solar:chat-round-dots-bold" class="text-lg" />
      </button>
      <button @click="emit('go-to-tasks')" class="w-9 h-9 flex items-center justify-center rounded-lg text-primary-400 hover:bg-primary-50 hover:text-primary-600 transition-all" v-tooltip="'Open Tasks list'">
        <Icon icon="solar:checklist-minimalistic-linear" class="text-lg" />
      </button>
    </div>

    <div class="w-full flex-1 overflow-y-auto overflow-x-hidden px-2 pt-2 pb-20 space-y-1 custom-scrollbar">
      <p v-if="!sidebarIconOnly" class="px-2.5 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-primary-300">
        {{ searchQuery ? `Results — ${filteredGroups.length}` : 'Chats' }}
      </p>

      <div v-if="loadingGroups && groups.length === 0" class="space-y-0.5">
        <div
            v-for="i in 8"
            :key="'sg-' + i"
            :class="['flex items-center gap-3 rounded-xl px-2.5 py-2.5 animate-pulse', sidebarIconOnly ? 'md:justify-center md:px-0' : '', i === 1 ? 'bg-primary-50/60' : '']"
        >
          <div :class="['shrink-0 rounded-full h-10 w-10', i <= 2 ? 'bg-primary-200/60' : 'bg-primary-100']"></div>
          <div v-if="!sidebarIconOnly" class="flex-1 min-w-0 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <div :class="['h-3 rounded-full bg-primary-100', i % 3 === 0 ? 'w-20' : i % 2 === 0 ? 'w-28' : 'w-24']"></div>
              <div class="h-2.5 w-8 rounded-full bg-primary-100/60 shrink-0"></div>
            </div>
            <div :class="['h-2.5 rounded-full', i % 2 === 0 ? 'w-3/4 bg-primary-100/50' : 'w-1/2 bg-primary-100/40']"></div>
          </div>
          <div v-if="!sidebarIconOnly && (i === 2 || i === 5)" class="shrink-0 h-5 w-5 rounded-full bg-primary-200/50"></div>
        </div>
      </div>

      <button
          v-else
          v-for="g in filteredGroups"
          :key="g.id"
          @click="handleSelect(g.id)"
          :class="[
          'group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-start transition-colors',
          sidebarIconOnly ? 'md:justify-center md:px-0' : '',
          activeGroupId === g.id ? 'bg-primary-100/80 text-primary-800' : 'hover:bg-primary-50 text-primary-700'
        ]"
          v-tooltip="sidebarIconOnly ? g.name : undefined"
      >
        <div class="relative shrink-0">
          <img v-if="g.avatarUrl" :src="g.avatarUrl" class="w-10 h-10 rounded-full object-cover" alt="" />
          <div v-else :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm', colorFor(g.id)]">
            {{ g.name[0] }}
          </div>
        </div>
        <div v-if="!sidebarIconOnly" class="flex-1 min-w-0 overflow-hidden">
          <div class="flex items-center justify-between gap-1">
            <span class="text-sm font-semibold truncate">{{ g.name }}</span>
            <span v-if="g.lastMessageAt" class="text-[10px] text-primary-300 shrink-0">{{ formatTime(g.lastMessageAt) }}</span>
          </div>
          <div class="flex items-center justify-between gap-1">
            <p class="text-xs text-primary-400 truncate">{{ g.lastMessagePreview || g.description || 'No messages yet' }}</p>
            <span
                v-if="unreadCounts[g.id] > 0"
                class="shrink-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-bold text-white"
            >
              {{ unreadCounts[g.id] > 99 ? '99+' : unreadCounts[g.id] }}
            </span>
          </div>
        </div>
      </button>

      <p v-if="!sidebarIconOnly && searchQuery && filteredGroups.length === 0" class="px-2.5 py-6 text-center text-xs text-primary-300">
        No groups found for "{{ searchQuery }}"
      </p>
    </div>

    <div class="pointer-events-none absolute inset-x-3 bottom-3 flex justify-start">
      <button
          @click="showCreateDialog = true"
          v-tooltip="'New Group'"
          class="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-300/50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
      >
        <Icon icon="mingcute:add-line" class="text-2xl" />
      </button>
    </div>

    <Teleport to="body">
      <div v-if="showCreateDialog" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="closeCreateDialog">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center p-6 border-b border-primary-100 sticky top-0 bg-white z-10">
            <h3 class="text-xl font-bold text-primary-900">➕ Create New Group</h3>
            <button @click="closeCreateDialog" class="text-primary-400 hover:text-primary-600 text-2xl">✕</button>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex flex-col items-center gap-2">
              <div class="relative">
                <div class="w-20 h-20 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                  {{ newGroupForm.name ? newGroupForm.name[0].toUpperCase() : '👥' }}
                </div>
              </div>
              <span class="text-xs text-primary-400">Group photo can be added after creation</span>
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-700 mb-2">Group Name <span class="text-primary-600">*</span></label>
              <input
                  v-model="newGroupForm.name"
                  type="text"
                  placeholder="e.g. Product Design Team"
                  class="w-full px-4 py-2 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                  @keyup.enter="submitCreate"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-700 mb-2">Description</label>
              <textarea
                  v-model="newGroupForm.description"
                  rows="3"
                  placeholder="What's this group about? (optional)"
                  class="w-full px-4 py-2 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>
          <div class="flex gap-3 p-6 border-t border-primary-100 rounded-b-2xl sticky bottom-0 bg-white">
            <button @click="closeCreateDialog" class="flex-1 px-4 py-2 bg-white border border-primary-200 text-primary-700 rounded-xl font-medium hover:bg-primary-50 transition-all">Cancel</button>
            <button
                @click="submitCreate"
                :disabled="!newGroupForm.name.trim()"
                class="flex-1 px-4 py-2 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { colorFor } from '~/utils/avatarColor'
import type { ApiGroup, ApiMessage } from '~/types/ChatType'

const props = defineProps<{
  groups: ApiGroup[]
  messagesByGroup: Record<number, ApiMessage[]>
  unreadCounts: Record<number, number>
  activeGroupId: number | null
  loadingGroups: boolean
  isMobile: boolean
  sidebarCollapsed: boolean
  mobilePane: 'sidebar' | 'main'
}>()

const emit = defineEmits<{
  'select-group': [id: number]
  'go-to-tasks': []
  'create-group': [{ name: string; description: string }]
  'update:sidebarCollapsed': [boolean]
  'update:mobilePane': ['sidebar' | 'main']
}>()

const sidebarIconOnly = computed(() => !props.isMobile && props.sidebarCollapsed)

function handleToggle(): void {
  if (props.isMobile) emit('update:mobilePane', 'main')
  else emit('update:sidebarCollapsed', !props.sidebarCollapsed)
}

function handleSelect(id: number): void {
  emit('select-group', id)
  if (props.isMobile) emit('update:mobilePane', 'main')
}

const searchQuery = ref('')
const filteredGroups = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const sorted = [...props.groups].sort((a, b) => {
    const at = new Date(a.lastMessageAt ?? a.createdAt).getTime()
    const bt = new Date(b.lastMessageAt ?? b.createdAt).getTime()
    return bt - at
  })
  if (!q) return sorted
  return sorted.filter(g => g.name.toLowerCase().includes(q))
})

function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

const showCreateDialog = ref(false)
const newGroupForm = ref({ name: '', description: '' })

function closeCreateDialog(): void {
  showCreateDialog.value = false
  newGroupForm.value = { name: '', description: '' }
}

function submitCreate(): void {
  const name = newGroupForm.value.name.trim()
  if (!name) return
  emit('create-group', { name, description: newGroupForm.value.description.trim() })
  closeCreateDialog()
}
</script>