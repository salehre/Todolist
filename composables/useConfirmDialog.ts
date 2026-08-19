import { ref } from 'vue'
import type { ConfirmDialogOptions } from '~/types/ChatType'

const confirmDialog = ref<ConfirmDialogOptions | null>(null)
const confirmLoading = ref(false)

export function useConfirmDialog() {
    function openConfirm(opts: ConfirmDialogOptions): void {
        confirmDialog.value = opts
    }

    function closeConfirm(): void {
        confirmDialog.value = null
    }

    async function runConfirm(): Promise<void> {
        if (!confirmDialog.value) return
        confirmLoading.value = true
        try {
            await confirmDialog.value.onConfirm()
        } finally {
            confirmLoading.value = false
            confirmDialog.value = null
        }
    }

    return { confirmDialog, confirmLoading, openConfirm, closeConfirm, runConfirm }
}