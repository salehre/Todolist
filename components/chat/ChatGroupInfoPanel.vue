<template>
  <Transition enter-active-class="transition-opacity duration-300 ease-in-out" leave-active-class="transition-opacity duration-300 ease-in-out" enter-from-class="opacity-0" leave-to-class="opacity-0">
    <div v-if="open" @click="emit('close')" class="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px]" />
  </Transition>

  <Transition enter-active-class="transition-transform duration-300 ease-in-out" leave-active-class="transition-transform duration-300 ease-in-out" enter-from-class="translate-x-full rtl:-translate-x-full" leave-to-class="translate-x-full rtl:-translate-x-full">
    <aside v-if="open" class="absolute inset-y-0 inset-e-0 z-40 w-full max-w-sm bg-white shadow-2xl flex flex-col">
      <div class="flex items-center justify-between h-16 shrink-0 px-5 border-b border-primary-100">
        <h3 class="text-base font-bold text-primary-900">Group Info</h3>
        <button @click="emit('close')" class="p-1.5 rounded-full hover:bg-primary-50 text-primary-400 hover:text-primary-600 transition">
          <Icon icon="mingcute:close-line" class="text-lg" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar" v-if="group">
        <div class="p-6 flex flex-col items-center gap-3 border-b border-primary-100">
          <div class="relative">
            <img v-if="group.avatarUrl" :src="group.avatarUrl" class="w-24 h-24 rounded-full object-cover shadow-sm" alt="" />
            <div v-else :class="['w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-sm', colorFor(group.id)]">{{ group.name[0] }}</div>
            <label v-if="isAdmin" class="absolute -bottom-1 -inset-e-1 p-2 rounded-full bg-primary-500 text-white shadow-md hover:bg-primary-600 cursor-pointer transition-all">
              <Icon icon="solar:camera-bold" class="text-sm" />
              <input type="file" accept="image/*" class="hidden" @change="emit('avatar-select', $event)" />
            </label>
          </div>

          <div class="w-full">
            <label class="block text-[11px] font-semibold uppercase tracking-wide text-primary-300 mb-1">Name</label>
            <input v-model="form.name" @blur="emit('save-info', { ...form })" @keyup.enter="($event.target as HTMLInputElement).blur()" type="text" class="w-full px-3 py-2 rounded-xl border border-transparent hover:border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all text-sm font-semibold text-primary-900 text-center" :disabled="!isAdmin" />
          </div>
          <div class="w-full">
            <label class="block text-[11px] font-semibold uppercase tracking-wide text-primary-300 mb-1">Description</label>
            <textarea v-model="form.description" @blur="emit('save-info', { ...form })" rows="2" placeholder="Add a description..." class="w-full px-3 py-2 rounded-xl border border-transparent hover:border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all text-sm text-primary-600 text-center resize-none" :disabled="!isAdmin" />
          </div>
        </div>

        <div class="p-4">
          <div class="flex items-center justify-between px-2 pb-2">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-primary-300">Members — {{ members.length }}</p>
            <button v-if="isAdmin" @click="emit('open-add-member')" class="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700">
              <Icon icon="mingcute:user-add-line" class="text-sm" /> Add
            </button>
          </div>

          <div class="space-y-1">
            <div v-for="m in members" :key="m.userId" class="group/member relative flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-primary-50 transition-colors">
              <div class="relative shrink-0">
                <img v-if="m.avatarUrl" :src="m.avatarUrl" class="w-10 h-10 rounded-full object-cover" alt="" />
                <div v-else :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm', colorFor(m.userId)]">{{ m.name[0] }}</div>
                <span class="absolute bottom-0 inset-e-0 w-2.5 h-2.5 rounded-full ring-2 ring-white" :class="onlineUserIds.includes(m.userId) ? 'bg-emerald-500' : 'bg-primary-200'" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-primary-800 truncate">{{ m.name }}<span v-if="m.userId === currentUserId" class="text-primary-400 font-normal"> (you)</span></p>
                <p class="text-xs text-primary-400">{{ m.role === 'admin' ? 'Admin' : 'Member' }}</p>
              </div>

              <div v-if="isAdmin && m.userId !== currentUserId" class="opacity-0 group-hover/member:opacity-100 transition-opacity flex items-center gap-1">
                <button @click="emit('change-role', m)" v-tooltip="m.role === 'admin' ? 'Make member' : 'Make admin'" class="p-1.5 rounded-lg text-primary-400 hover:bg-primary-100 hover:text-primary-600">
                  <Icon icon="mingcute:vip-2-line" class="text-sm" />
                </button>
                <button @click="emit('remove-member', m)" v-tooltip="'Remove from group'" class="p-1.5 rounded-lg text-primary-400 hover:bg-red-50 hover:text-red-500">
                  <Icon icon="mingcute:user-remove-line" class="text-sm" />
                </button>
              </div>
              <button v-else-if="m.userId === currentUserId" @click="emit('leave-group')" v-tooltip="'Leave group'" class="opacity-0 group-hover/member:opacity-100 transition-opacity p-1.5 rounded-lg text-primary-400 hover:bg-red-50 hover:text-red-500">
                <Icon icon="mingcute:exit-line" class="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { colorFor } from '~/utils/avatarColor'
import type { ApiGroup, GroupMember } from '~/types/ChatType'

const props = defineProps<{
  open: boolean
  group: ApiGroup | undefined
  members: GroupMember[]
  onlineUserIds: number[]
  isAdmin: boolean
  currentUserId: number
}>()

const emit = defineEmits<{
  close: []
  'avatar-select': [event: Event]
  'save-info': [{ name: string; description: string }]
  'open-add-member': []
  'change-role': [member: GroupMember]
  'remove-member': [member: GroupMember]
  'leave-group': []
}>()

const form = reactive({ name: '', description: '' })

watch(() => props.group, (g) => {
  if (g) { form.name = g.name; form.description = g.description || '' }
}, { immediate: true })
</script>