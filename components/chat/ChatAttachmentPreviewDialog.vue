<script setup lang="ts">

</script>

<template>

</template>

<style scoped>

</style><template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" @click.self="emit('close')">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-primary-100">
          <h3 class="text-sm font-bold text-primary-900">{{ files.length }} Files Selected</h3>
          <button @click="emit('close')" class="text-primary-400 hover:text-primary-600 text-xl">✕</button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 flex flex-wrap justify-center gap-2">
          <div v-for="(f, i) in files" :key="i" class="relative w-24 aspect-square rounded-xl overflow-hidden bg-primary-50 border border-primary-100">
            <img v-if="f.isImage" :src="f.previewUrl" class="w-full h-full object-cover" alt="" />
            <div v-else class="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
              <Icon :icon="getFileIcon(f.file.name)" class="text-2xl text-primary-400" />
              <p class="text-[10px] text-primary-500 truncate w-full text-center">{{ f.file.name }}</p>
            </div>
            <button @click="emit('remove-file', i)" class="absolute top-1 inset-e-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70">
              <Icon icon="mingcute:close-line" class="text-xs" />
            </button>
          </div>
        </div>

        <div class="p-4 border-t border-primary-100 space-y-3">
          <textarea
              :value="caption"
              @input="emit('update:caption', ($event.target as HTMLTextAreaElement).value)"
              rows="2"
              placeholder="Add a caption.."
              class="w-full px-3 py-2 rounded-xl border border-primary-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 resize-none"
          />
          <button @click="emit('send')" class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all">
            <Icon icon="solar:plain-bold" class="text-base" /> Send {{ files.length }} Files
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { PendingFile } from '~/types/chatType'

defineProps<{ open: boolean; files: PendingFile[]; caption: string }>()
const emit = defineEmits<{ close: []; 'remove-file': [index: number]; 'update:caption': [value: string]; send: [] }>()

function getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'solar:gallery-bold'
  if (ext === 'pdf') return 'solar:document-bold'
  if (['doc', 'docx'].includes(ext || '')) return 'solar:document-text-bold'
  if (['xls', 'xlsx'].includes(ext || '')) return 'solar:document-add-bold'
  if (['zip', 'rar', '7z'].includes(ext || '')) return 'solar:archive-bold'
  return 'solar:file-bold'
}
</script>