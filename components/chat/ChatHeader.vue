<template>
  <div class="shrink-0 bg-white/90 backdrop-blur-md md:rounded-ss-none rounded-t-2xl border-b border-primary-200/60 shadow-sm relative z-50">
    <div class="px-5 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3 min-w-0 cursor-pointer" @click.stop="emit('open-info')">
        <div class="w-10 h-10 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md shadow-primary-200 z-50 overflow-hidden shrink-0">
          <img v-if="group?.avatarUrl" :src="group.avatarUrl" class="w-full h-full object-cover" alt="" />
          <Icon v-else-if="group" icon="solar:users-group-rounded-bold" class="text-white text-xl" />
          <div v-else class="w-full h-full bg-white/30 animate-pulse"></div>
        </div>
        <div v-if="group" class="min-w-0">
          <h2 class="text-sm font-bold text-primary-900 truncate">{{ group.name }}</h2>
          <p class="text-xs text-primary-400">{{ onlineCount }} online · {{ memberCount }} members</p>
        </div>
        <div v-else class="min-w-0 space-y-1.5">
          <div class="h-3 w-24 rounded bg-primary-100 animate-pulse"></div>
          <div class="h-2.5 w-16 rounded bg-primary-100/70 animate-pulse"></div>
        </div>
      </div>

      <div class="flex items-center gap-2 relative">
        <button @click="emit('open-sidebar')" class="md:hidden flex items-center gap-2 px-2 py-2 text-sm text-primary-700 transition-colors" v-tooltip="'Chats'">
          <Icon icon="solar:hamburger-menu-linear" class="text-lg" />
        </button>
        <button @click="emit('go-to-tasks')" class="flex items-center gap-2 px-2 py-2 text-sm text-primary-700 transition-colors" v-tooltip="'My Tasks (all)'">
          <Icon icon="solar:checklist-minimalistic-linear" class="text-lg" />
        </button>
        <button @click="emit('open-group-tasks')" class="flex items-center gap-2 px-2 py-2 text-sm text-primary-700 transition-colors" v-tooltip="'Group tasks'">
          <Icon icon="solar:clipboard-list-linear" class="text-lg" />
        </button>
        <button @click="emit('toggle-search')" :class="['flex items-center gap-2 px-2 py-2 text-sm transition-colors', showSearch ? 'text-primary-600' : 'text-primary-700']">
          <Icon icon="boxicons:search" class="text-lg" />
        </button>

        <div class="relative inline-block" data-dropdown="header-menu">
          <button @click.stop="toggleMenu" class="p-2 rounded-full text-primary-400 hover:bg-primary-50 hover:text-primary-600 transition-all" v-tooltip="'More options'">
            <Icon icon="mage:dots" class="text-xl" />
          </button>

          <Transition name="dropdown">
            <div
                v-if="menuOpen"
                ref="menuPanelRef"
                data-dropdown="header-menu"
                :class="['absolute top-full mt-1 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg py-2 min-w-45 z-[9999]', menuAlign === 'right' ? 'left-0 origin-top-left' : 'right-0 origin-top-right']"
            >
              <button @click.stop="emit('toggle-filter'); menuOpen = false" class="flex items-center gap-2 w-full px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors">
                <Icon icon="mi:filter" class="text-sm" /> Filter messages
              </button>
              <button @click.stop="emit('open-info'); menuOpen = false" class="flex items-center gap-2 w-full px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors border-t border-primary-100 mt-1">
                <Icon icon="mi:circle-information" class="text-sm" /> Group info
              </button>
              <button v-if="isAdmin" @click.stop="menuOpen = false; emit('delete-group')" class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-primary-100 mt-1">
                <Icon icon="mi:delete" class="text-sm" /> حذف گروه
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import type { ApiGroup } from '~/types/ChatType'

defineProps<{
  group: ApiGroup | undefined
  onlineCount: number
  memberCount: number
  isAdmin: boolean
  showSearch: boolean
}>()

const emit = defineEmits<{
  'open-sidebar': []
  'go-to-tasks': []
  'toggle-search': []
  'toggle-filter': []
  'open-group-tasks': []
  'open-info': []
  'delete-group': []
}>()

const menuOpen = ref(false)
const menuAlign = ref<'left' | 'right'>('right')
const menuPanelRef = ref<HTMLElement | null>(null)

function computeAlign(triggerEl: HTMLElement): 'left' | 'right' {
  const wrapper = triggerEl.closest('[data-dropdown]') as HTMLElement | null
  if (!wrapper) return 'right'
  const rect = wrapper.getBoundingClientRect()
  const menuWidth = menuPanelRef.value?.offsetWidth || 180
  const margin = 8
  const spaceRight = window.innerWidth - rect.left - margin
  const spaceLeft = rect.right - margin
  const isRtl = getComputedStyle(wrapper).direction === 'rtl'
  const preferred = isRtl ? 'left' : 'right'
  const fallback = isRtl ? 'right' : 'left'
  const spaceOf = (side: 'left' | 'right') => (side === 'right' ? spaceRight : spaceLeft)
  if (spaceOf(preferred) >= menuWidth) return preferred
  if (spaceOf(fallback) >= menuWidth) return fallback
  return spaceRight >= spaceLeft ? 'right' : 'left'
}

function toggleMenu(event: MouseEvent): void {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    const target = event.currentTarget as HTMLElement
    menuAlign.value = computeAlign(target)
    nextTick(() => { menuAlign.value = computeAlign(target) })
  }
}

function handleClickOutside(e: MouseEvent): void {
  const target = e.target as HTMLElement
  if (menuOpen.value && !target.closest('[data-dropdown="header-menu"]')) menuOpen.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.dropdown-enter-active { transition: opacity 0.16s ease-out, transform 0.16s ease-out; }
.dropdown-leave-active { transition: opacity 0.12s ease-in, transform 0.12s ease-in; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px) scale(0.96); }
.dropdown-enter-to, .dropdown-leave-from { opacity: 1; transform: translateY(0) scale(1); }
</style>