<template>
  <div v-if="task" class="absolute inset-0 z-[70] bg-white flex overflow-hidden">
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