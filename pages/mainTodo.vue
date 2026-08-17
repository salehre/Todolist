<template>
  <div class="flex h-full gap-3 overflow-hidden p-3 font-sans">

    <!-- لیست تسک‌ها -->
    <TodoList
        :todos="todos"
        :selected-todo="selectedTodo"
        :mobile-open="!selectedTodo"
        @select-todo="selectedTodo = $event"
        @toggle-complete="toggleComplete"
        @edit-todo="openEditDialog"
        @delete-todo="handleDeleteFromList"
        @add-todo="openAddDialog"
        :hideChatButton="hideChatButton"
        :is-loading="isLoading"
    />

    <!-- جزئیات تسک -->
    <TodoDetail
        v-model="selectedTodo"
        @toggle-complete="toggleComplete"
        @edit-todo="openEditDialog"
        @delete-todo="openDeleteConfirm"
        @back="selectedTodo = null"
        @update-steps="updateSteps"
        @complete-step="completeStep"
        @undo-step="undoStep"
    />

    <!-- Delete Confirmation Dialog -->
    <div
        v-if="showDeleteDialog"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closeDeleteDialog"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
        <div class="flex flex-col items-center p-6 text-center">
          <div class="text-6xl mb-2">
            <Icon class="text-primary-900" icon="quill:folder-trash" />
          </div>
          <h3 class="text-xl font-bold text-primary-900 mb-2">Confirm Delete</h3>
          <p class="text-primary-600 text-sm mb-2">{{ deleteDialogMessage }}</p>
          <p class="text-primary-400 text-xs">This action cannot be undone!</p>
        </div>
        <div
            class="flex gap-3 p-6 border-t border-primary-100 bg-primary-50/50 rounded-b-2xl"
        >
          <button
              @click="closeDeleteDialog"
              class="flex-1 px-4 py-2 bg-white border border-primary-200 text-primary-700 rounded-xl font-medium hover:bg-primary-50 transition-all"
          >
            Cancel
          </button>
          <button
              @click="confirmDelete"
              class="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Add / Edit Task Dialog -->
    <div
        v-if="isDialogOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closeDialog"
    >
      <div
          class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div
            class="flex justify-between items-center p-6 border-b border-primary-100 sticky top-0 bg-white z-10"
        >
          <h3 class="text-xl flex font-bold text-primary-900">
            {{ dialogMode === "add" ? "Add New Task" : "Edit Task" }}
          </h3>
          <button
              @click="closeDialog"
              class="text-primary-400 hover:text-primary-600 text-2xl"
          >
            ✕
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-primary-900 mb-2">
              Title
            </label>
            <input
                v-model="dialogForm.title"
                type="text"
                placeholder="Enter task title"
                class="w-full px-4 py-2 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                @keyup.enter="submitDialog"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-primary-900 mb-2"> Description </label>
            <textarea
                v-model="dialogForm.description"
                rows="4"
                placeholder="Enter task description (optional)"
                class="w-full px-4 py-2 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all resize-none"
            />
          </div>
          <div>
            <PrioritySlider v-model="dialogForm.priority" />
          </div>
        </div>
        <div
            class="flex gap-3 p-6 border-t border-primary-100 rounded-b-2xl sticky bottom-0 bg-white"
        >
          <button
              @click="closeDialog"
              class="flex-1 px-4 py-2 bg-white border border-primary-200 text-primary-700 rounded-xl font-medium hover:bg-primary-50 transition-all"
          >
            Cancel
          </button>
          <button
              @click="submitDialog"
              :disabled="!dialogForm.title.trim()"
              class="flex-1 px-4 py-2 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ dialogMode === "add" ? "Add Task" : "Save Changes" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

// import { onMounted } from "vue";
import TodoList from "~/components/TodoList.vue";
import TodoDetail from "~/components/TodoDetail.vue";
import { Icon } from "@iconify/vue";
import { useTodos } from "~/composables/useTodos";
import PrioritySlider from '~/components/Priorityslider.vue'
import { onMounted } from 'vue'


// ─── تست موقت Echo — بعد از تأیید، این بلاک رو پاک کن ───────────────────
onMounted(() => {
  const { $echo } = useNuxtApp()
  $echo.private('group.3')
      .listen('.message.sent', (e: any) => {
        console.log('پیام رسید:', e)
      })
})

useHead(() => ({
  titleTemplate: `%s - My TodoList`
}))

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps({
  hideChatButton: { type: Boolean, required: false, default: false },
});

const {
  todos,
  selectedTodo,
  isLoading,
  showDeleteDialog,
  deleteDialogMessage,
  isDialogOpen,
  dialogMode,
  dialogForm,
  fetchTodos,
  toggleComplete,
  completeStep,
  undoStep,
  updateSteps,
  openDeleteConfirm,
  closeDeleteDialog,
  handleDeleteFromList,
  confirmDelete,
  openAddDialog,
  openEditDialog,
  closeDialog,
  submitDialog,
} = useTodos();

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(fetchTodos);
</script>