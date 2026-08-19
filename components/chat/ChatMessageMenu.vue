<template>
  <Teleport to="body">
    <div
        v-if="message"
        ref="menuElRef"
        @click.stop
        class="fixed z-[100] bg-white rounded-lg shadow-xl py-1 min-w-40 menu-pop"
        :style="{ top: style.top + 'px', left: style.left + 'px', transformOrigin: origin }"
    >
      <div class="flex gap-1 px-2 py-1.5 border-b max-w-40 overflow-x-auto scrollbar-thin border-primary-100">
        <button
            v-for="emoji in quickEmojis"
            :key="emoji"
            @click="emit('react', message.id, emoji); emit('close')"
            class="text-base hover:scale-125 transition-transform px-1 hover:bg-primary-50 rounded"
        >{{ emoji }}</button>
      </div>

      <button @click="emit('copy', message.text ?? ''); emit('close')" class="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors">
        <Icon icon="solar:copy-linear" class="text-primary-500 text-sm" /> Copy
      </button>
      <button @click="emit('reply', message); emit('close')" class="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors">
        <Icon icon="solar:reply-linear" class="text-primary-500 text-sm" /> Reply
      </button>
      <button v-if="message.senderId === currentUserId" @click="emit('edit', message); emit('close')" class="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors">
        <Icon icon="mi:edit" class="text-primary-500 text-sm" /> Edit
      </button>
      <button @click="emit('toggle-pin', message.id); emit('close')" class="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors">
        <Icon :icon="message.pinned ? 'ri:unpin-line' : 'iconoir:pin'" class="text-primary-500 text-sm" />
        {{ message.pinned ? 'Unpin' : 'Pin' }}
      </button>
      <button v-if="message.senderId === currentUserId" @click="emit('delete', message.id); emit('close')" class="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 transition-colors">
        <Icon icon="mingcute:delete-line" class="text-primary-500 text-sm" /> Delete
      </button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import type { ApiMessage } from '~/types/chatType'

const props = defineProps<{
  message: ApiMessage | null
  triggerRect: DOMRect | null
  inputAreaRect: DOMRectReadOnly | undefined
  currentUserId: number
}>()

const emit = defineEmits<{
  close: []
  copy: [text: string]
  reply: [message: ApiMessage]
  edit: [message: ApiMessage]
  'toggle-pin': [id: number]
  delete: [id: number]
  react: [id: number, emoji: string]
}>()

const quickEmojis = ['👍', '❤️', '😂', '🔥', '👏', '😮', '😭', '😟']
const menuElRef = ref<HTMLElement | null>(null)
const style = ref({ top: -9999, left: -9999 })
const origin = ref('top left')
const MARGIN = 6
const PADDING = 8

function position(): void {
  if (!props.triggerRect || !menuElRef.value) return
  const rect = props.triggerRect
  const menuRect = menuElRef.value.getBoundingClientRect()
  const maxBottom = props.inputAreaRect ? props.inputAreaRect.top - PADDING : window.innerHeight - PADDING

  let top = rect.bottom + MARGIN
  origin.value = 'top left'

  if (top + menuRect.height > maxBottom) {
    const above = rect.top - menuRect.height - MARGIN
    top = above < PADDING ? PADDING : above
    origin.value = 'bottom left'
  }
  if (top + menuRect.height > maxBottom) top = maxBottom - menuRect.height

  let left = rect.left
  if (left + menuRect.width > window.innerWidth - PADDING) left = window.innerWidth - menuRect.width - PADDING
  if (left < PADDING) left = PADDING

  style.value = { top, left }
}

watch(() => props.message, (m) => {
  if (m) { style.value = { top: -9999, left: -9999 }; nextTick(position) }
})
</script>

<style scoped>
@keyframes menu-pop { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
.menu-pop { animation: menu-pop 0.25s ease-out; }
</style>