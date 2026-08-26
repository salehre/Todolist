<template>
  <div class="flex h-full overflow-hidden font-sans relative">

    <TodoList
        v-if="viewMode === 'todo'"
        :todos="todos"
        :selected-todo="selectedTodo"
        :mobile-open="mobileListOpen"
        @select-todo="handleSelectTodo"
        @toggle-complete="toggleComplete"
        @edit-todo="openEditDialog"
        @delete-todo="handleDeleteFromList"
        @add-todo="openAddDialog"
        @close-mobile="viewMode = 'chat'"
        :is-loading="isLoading"
    />

    <!-- Right panel: TodoDetail (only in todo mode) -->
    <template v-if="viewMode === 'todo'">
      <transition name="panel-swap" mode="out-in">
        <TodoDetail
            v-if="selectedTodo"
            :key="'detail-' + selectedTodo.id"
            v-model="selectedTodo"
            :show-back-button="true"
            @toggle-complete="toggleComplete"
            @edit-todo="openEditDialog"
            @delete-todo="handleDeleteTodoFromDetail"
            @back="() => { selectedTodo = null; mobileListOpen = true }"
            @update-steps="updateSteps"
            @complete-step="completeStep"
            @undo-step="undoStep"
            @open-chat="viewMode = 'chat'"
        />
        <div v-else key="no-selection" class="hidden md:flex flex-1 flex-col items-center justify-center gap-2 text-primary-300">
          <Icon icon="solar:checklist-minimalistic-linear" class="text-4xl" />
          <p class="text-sm">Select a task to see its details</p>
          <button @click="viewMode = 'chat'" class="mt-1 text-xs text-primary-400 hover:text-primary-600 underline underline-offset-2">
            Back to Chat
          </button>
        </div>
      </transition>
    </template>

    <!-- گروه چت (only in chat mode) -->
    <GroupChat
        v-if="viewMode === 'chat'"
        key="chat"
        :todos="todos"
        @create-todo="handleCreateTodoFromChat"
        @view-todo="handleViewTodo"
        @open-tasks="viewMode = 'todo'"
    />

    <!-- Add / Edit Task Dialog -->
    <div v-if="isDialogOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="closeDialog">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div class="flex justify-between items-center p-6 border-b border-primary-100 sticky top-0 bg-white z-10">
          <h3 class="text-xl font-bold text-primary-900">
            {{ dialogMode === 'add' ? '➕ Add New Task' : '✏️ Edit Task' }}
          </h3>
          <button @click="closeDialog" class="text-primary-400 hover:text-primary-600 text-2xl">✕</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-primary-700 mb-2">
              Title <span class="text-primary-600">*</span>
            </label>
            <input
                v-model="dialogForm.title"
                type="text"
                placeholder="Enter task title..."
                class="w-full px-4 py-2 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                @keyup.enter="submitDialog"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-primary-700 mb-2">Description</label>
            <textarea
                v-model="dialogForm.description"
                rows="4"
                placeholder="Enter task description (optional)..."
                class="w-full px-4 py-2 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all resize-none"
            ></textarea>
          </div>
          <div>
            <PrioritySlider v-model="dialogForm.priority" />
          </div>
        </div>
        <div class="flex gap-3 p-6 border-t border-primary-100 rounded-b-2xl sticky bottom-0 bg-white">
          <button @click="closeDialog" class="flex-1 px-4 py-2 bg-white border border-primary-200 text-primary-700 rounded-xl font-medium hover:bg-primary-50 transition-all">Cancel</button>
          <button
              @click="submitDialog"
              :disabled="!dialogForm.title.trim()"
              class="flex-1 px-4 py-2 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ dialogMode === 'add' ? 'Add Task' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteDialog" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="closeDeleteDialog">
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
        <div class="p-6 text-center">
          <div class="text-5xl mb-4">⚠️</div>
          <h3 class="text-xl font-bold text-primary-900 mb-2">Confirm Delete</h3>
          <p class="text-primary-600 text-sm mb-2">Are you sure you want to delete this task?</p>
          <p class="text-primary-400 text-xs">This action cannot be undone!</p>
        </div>
        <div class="flex gap-3 p-6 border-t border-primary-100 bg-primary-50/50 rounded-b-2xl">
          <button @click="closeDeleteDialog" class="flex-1 px-4 py-2 bg-white border border-primary-200 text-primary-700 rounded-xl font-medium hover:bg-primary-50 transition-all">Cancel</button>
          <button @click="confirmDelete" class="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-all">Delete</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import TodoList   from '~/components/TodoList.vue'
import TodoDetail from '~/components/TodoDetail.vue'
import GroupChat  from '~/components/GroupChat.vue'
import PrioritySlider from '~/components/PrioritySlider.vue'
import type { Todo, Priority } from '~/types/todoType'
import api from '~/src/services/api'
import { mapTodoFromApi } from '~/src/services/todoMapper'
import { useTodos } from '~/composables/useTodos'

useHead(() => ({
  titleTemplate: `%s - TeamWork`
}))

const mobileListOpen = ref<boolean>(false)
const viewMode = ref<'chat' | 'todo'>('chat')

const {
  todos,
  selectedTodo,
  isLoading,
  showDeleteDialog,
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
  confirmDelete,
  openAddDialog,
  openEditDialog,
  closeDialog,
  submitDialog,
} = useTodos()

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

function handleSelectTodo(todo: Todo): void {
  selectedTodo.value = todos.value.find(t => t.id === todo.id) ?? todo
  mobileListOpen.value = false
}

// ─── Chat Handlers (مخصوص این صفحه) ───────────────────────────────────────────
async function handleCreateTodoFromChat(title: string, description: string, priority: Priority): Promise<void> {
  try {
    const response = await api.post('/tasks/create', {
      title,
      description: description || null,
      priority,
    })
    const newTodo = mapTodoFromApi(response.data)
    todos.value.unshift(newTodo)
  } catch (error) {
    console.error('خطا در ساختن تسک از چت:', error)
  }
}

function handleViewTodo(todoRef: Pick<Todo, 'id' | 'text' | 'priority'>): void {
  const todo = todos.value.find(t => t.id === todoRef.id)
  if (todo) selectedTodo.value = todo
  viewMode.value = 'todo'
  mobileListOpen.value = false
}

// ─── Delete (این صفحه حذف گروهی رو بدون تأیید انجام می‌ده) ────────────────────
async function handleDeleteFromList(idOrIds: number | number[]): Promise<void> {
  if (Array.isArray(idOrIds)) {
    try {
      await Promise.all(idOrIds.map(id => api.delete('/tasks/delete', { data: { id } })))
      const set = new Set(idOrIds)
      todos.value = todos.value.filter(t => !set.has(t.id))
      if (selectedTodo.value && set.has(selectedTodo.value.id)) selectedTodo.value = null
    } catch (error) {
      console.error('خطا در حذف گروهی:', error)
    }
  } else {
    openDeleteConfirm(idOrIds)
  }
}

function handleDeleteTodoFromDetail(id: number): void {
  openDeleteConfirm(id)
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(fetchTodos)
</script>

<style scoped>
.panel-swap-enter-active,
.panel-swap-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.panel-swap-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.panel-swap-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>