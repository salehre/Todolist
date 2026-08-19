<!-- ChatPinnedBar.vue -->
<template>
  <div v-if="messages.length > 0" :class="['pb-2 shrink-0 px-5 pt-3 absolute top-18 left-0 right-0 z-30', offsetForSearch ? 'pt-17' : 'pt-3']">
    <button @click="emit('open')" class="w-full mx-auto flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-primary-200/60 shadow-lg shadow-primary-200/20 hover:shadow-primary-200/40 transition-all group">
      <Icon icon="iconoir:pin" class="text-primary-500 -rotate-45 text-sm shrink-0" />
      <span class="text-sm text-primary-700 flex-1 text-left truncate">{{ messages[0].text }}</span>
      <span class="text-xs text-primary-400 bg-primary-200/50 px-2 py-0.5 rounded-full font-medium shrink-0">{{ messages.length }} pinned</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { ApiMessage } from '~/types/chatType'

defineProps<{ messages: ApiMessage[]; offsetForSearch: boolean }>()
const emit = defineEmits<{ open: [] }>()
</script>