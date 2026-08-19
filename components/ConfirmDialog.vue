<template>
  <Teleport to="body">
    <div
        v-if="confirmDialog"
        class="fixed inset-0 z-[75] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="closeConfirm"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
        <div
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
            :class="confirmDialog.danger ? 'bg-red-50' : 'bg-primary-50'"
        >
          <Icon
              :icon="confirmDialog.danger ? 'mdi:alert-outline' : 'mdi:help-circle-outline'"
              class="text-2xl"
              :class="confirmDialog.danger ? 'text-red-500' : 'text-primary-500'"
          />
        </div>
        <h3 class="mt-3 text-base font-bold text-primary-900">{{ confirmDialog.title }}</h3>
        <p class="mt-1 text-sm text-primary-500">{{ confirmDialog.message }}</p>

        <div class="mt-5 flex gap-3">
          <button
              @click="closeConfirm"
              :disabled="confirmLoading"
              class="flex-1 rounded-xl border border-primary-200 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50 disabled:opacity-50"
          >
            انصراف
          </button>
          <button
              @click="runConfirm"
              :disabled="confirmLoading"
              class="flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium text-white disabled:opacity-50"
              :class="confirmDialog.danger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-500 hover:bg-primary-600'"
          >
            <Icon v-if="confirmLoading" icon="mdi:loading" class="animate-spin text-base" />
            <span v-else>{{ confirmDialog.confirmLabel }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useConfirmDialog } from '~/composables/useConfirmDialog'

const { confirmDialog, confirmLoading, closeConfirm, runConfirm } = useConfirmDialog()
</script>