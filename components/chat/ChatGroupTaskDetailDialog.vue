<template>
  <Teleport to="body">
    <div v-if="task" class="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" @click.self="emit('close')">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full h-[85vh] overflow-hidden flex flex-col">
        <div class="flex-1 min-h-0 overflow-hidden">
          <TodoDetail
              :model-value="task"
              :show-back-button="true"
              :pending-step-ids="pendingStepIds"
              @back="emit('close')"
              @toggle-complete="emit('toggle-complete', $event)"
              @update-steps="(id, steps, ordered) => emit('update-steps', id, steps, ordered)"
              @complete-step="(id, stepId) => emit('complete-step', id, stepId)"
              @undo-step="(id, stepId) => emit('undo-step', id, stepId)"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import TodoDetail from '~/components/TodoDetail.vue'
import type { Todo, Step } from '~/types/todoType'

defineProps<{ task: Todo | null; pendingStepIds: Set<number> }>()
const emit = defineEmits<{
  close: []
  'toggle-complete': [todoId: number]
  'update-steps': [todoId: number, steps: Step[], orderedSteps?: boolean]
  'complete-step': [todoId: number, stepId: number]
  'undo-step': [todoId: number, stepId: number]
}>()
</script>