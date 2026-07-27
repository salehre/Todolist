import { ref } from 'vue'
import type { Todo, Step, DialogForm, DialogMode } from '~/types/todoType'
import { mapTodoFromApi } from '~/src/services/todoMapper'
import api from '~/src/services/api'
import { toast } from 'vue-sonner'
import { getErrorMessage } from '~/src/services/api'

export function useTodos() {
    const todos = ref<Todo[]>([])
    const selectedTodo = ref<Todo | null>(null)
    const isLoading = ref<boolean>(false)

    // ─── Delete dialog state ────────────────────────────────────────────────
    const showDeleteDialog = ref<boolean>(false)
    const deleteTargetId = ref<number | null>(null)
    const deleteDialogMessage = ref<string>('Are you sure you want to delete this task?')

    // ─── Add / Edit dialog state ────────────────────────────────────────────
    const isDialogOpen = ref<boolean>(false)
    const dialogMode = ref<DialogMode>('add')
    const dialogForm = ref<DialogForm>({ title: '', description: '', priority: 'medium' })
    const editingId = ref<number | null>(null)

    // ─── Fetch ───────────────────────────────────────────────────────────────
    async function fetchTodos(): Promise<void> {
        isLoading.value = true
        try {
            const response = await api.get('/tasks')
            todos.value = response.data.map(mapTodoFromApi)
        } catch (error) {
            console.error('خطا در گرفتن tasks:', error)
            toast.error(getErrorMessage(error, 'گرفتن لیست تسک‌ها ناموفق بود'))
        } finally {
            isLoading.value = false
        }
    }

    // ─── Toggle complete ────────────────────────────────────────────────────
    async function toggleComplete(id: number): Promise<void> {
        const todo = todos.value.find(t => t.id === id)
        if (!todo) return

        const newCompletedState = !todo.completed

        try {
            const response = await api.put('/tasks/updateTask', {
                id,
                is_completed: newCompletedState,
            })
            const updated = mapTodoFromApi(response.data)
            todo.completed = updated.completed

            if (todo.completed) {
                todo.steps.forEach((s: Step) => (s.completed = true))
                if (todo.steps.length > 0) await syncSteps(id, todo.steps)
            }

            if (selectedTodo.value?.id === id) selectedTodo.value = { ...todo }
        } catch (error) {
            console.error('خطا در آپدیت وضعیت:', error)
        }
    }

    // ─── Step sync (یک API برای همه‌ی عملیات step) ─────────────────────────
    async function syncSteps(todoId: number, steps: Step[]): Promise<Step[]> {
        try {
            const payload = {
                task_id: todoId,
                steps: steps.map(s => ({
                    id: s.id ?? null,
                    text: s.text,
                    completed: s.completed,
                })),
            }
            const response = await api.put('/tasks/updateStep', payload)
            return response.data.map((s: any) => ({
                id: s.id,
                text: s.text,
                completed: s.completed,
            }))
        } catch (error) {
            console.error('خطا در sync کردن step ها:', error)
            return steps
        }
    }

    async function completeStep(todoId: number, stepId: number): Promise<void> {
        const todo = todos.value.find(t => t.id === todoId)
        if (!todo) return
        const idx = todo.steps.findIndex((s: Step) => s.id === stepId)
        if (idx === -1) return

        todo.steps[idx].completed = !todo.steps[idx].completed

        if (!todo.steps[idx].completed) {
            for (let i = idx + 1; i < todo.steps.length; i++) {
                todo.steps[i].completed = false
            }
        }

        todo.completed = todo.steps.every((s: Step) => s.completed) && todo.steps.length > 0

        const synced = await syncSteps(todoId, todo.steps)
        todo.steps = synced

        if (selectedTodo.value?.id === todoId) selectedTodo.value = { ...todo }
    }

    async function undoStep(todoId: number, stepId: number): Promise<void> {
        const todo = todos.value.find(t => t.id === todoId)
        if (!todo) return
        const idx = todo.steps.findIndex((s: Step) => s.id === stepId)
        if (idx === -1) return

        todo.steps[idx].completed = false
        todo.completed = false

        const synced = await syncSteps(todoId, todo.steps)
        todo.steps = synced

        if (selectedTodo.value?.id === todoId) selectedTodo.value = { ...todo }
    }

    async function updateSteps(todoId: number, newSteps: Step[]): Promise<void> {
        const todo = todos.value.find(t => t.id === todoId)
        if (!todo) return

        const synced = await syncSteps(todoId, newSteps)
        todo.steps = synced

        if (!synced.length) {
            await api.put('/tasks/updateTask', { id: todoId, is_completed: false })
            todo.completed = false
        }

        if (selectedTodo.value?.id === todoId) selectedTodo.value = { ...todo }
    }

    // ─── Delete ──────────────────────────────────────────────────────────────
    function openDeleteConfirm(id: number, message = 'Are you sure you want to delete this task?'): void {
        deleteTargetId.value = id
        deleteDialogMessage.value = message
        showDeleteDialog.value = true
    }

    function closeDeleteDialog(): void {
        showDeleteDialog.value = false
        deleteTargetId.value = null
    }

    async function deleteMultiple(ids: number[]): Promise<void> {
        try {
            await Promise.all(ids.map(id => api.delete('/tasks/delete', { data: { id } })))
            const set = new Set(ids)
            todos.value = todos.value.filter(t => !set.has(t.id))
            if (selectedTodo.value && set.has(selectedTodo.value.id)) {
                selectedTodo.value = null
            }
        } catch (error) {
            console.error('خطا در حذف گروهی:', error)
        }
    }

    // هندلر مشترک برای رویداد delete-todo لیست: اگه آرایه بود حذف گروهی
    // بدون تأیید، اگه تک آیدی بود دیالوگ تأیید باز می‌شه
    function handleDeleteFromList(idOrIds: number | number[]): void {
        if (Array.isArray(idOrIds)) {
            deleteMultiple(idOrIds)
        } else {
            openDeleteConfirm(idOrIds)
        }
    }

    async function confirmDelete(): Promise<void> {
        if (deleteTargetId.value === null) return
        const id = deleteTargetId.value

        try {
            await api.delete('/tasks/delete', { data: { id } })
            todos.value = todos.value.filter(t => t.id !== id)
            if (selectedTodo.value?.id === id) selectedTodo.value = null
        } catch (error) {
            console.error('خطا در حذف task:', error)
            toast.error('حذف تسک ناموفق بود')
        } finally {
            closeDeleteDialog()
        }
    }

    // ─── Add / Edit dialog ───────────────────────────────────────────────────
    function openAddDialog(): void {
        dialogMode.value = 'add'
        dialogForm.value = { title: '', description: '', priority: 'medium' }
        editingId.value = null
        isDialogOpen.value = true
    }

    function openEditDialog(id: number): void {
        const todo = todos.value.find(t => t.id === id)
        if (!todo || todo.completed) return
        dialogMode.value = 'edit'
        dialogForm.value = {
            title: todo.text,
            description: todo.description ?? '',
            priority: todo.priority,
        }
        editingId.value = id
        isDialogOpen.value = true
    }

    function closeDialog(): void {
        isDialogOpen.value = false
        editingId.value = null
    }

    async function submitDialog(): Promise<void> {
        const title = dialogForm.value.title.trim()
        if (!title) return

        try {
            if (dialogMode.value === 'add') {
                const response = await api.post('/tasks/create', {
                    title,
                    description: dialogForm.value.description.trim() || null,
                    priority: dialogForm.value.priority,
                })
                const newTodo = mapTodoFromApi(response.data)
                todos.value.unshift(newTodo)
                toast.success('تسک اضافه شد')
            } else {
                const response = await api.put('/tasks/updateTask', {
                    id: editingId.value,
                    title,
                    description: dialogForm.value.description.trim() || null,
                    priority: dialogForm.value.priority,
                })
                const updated = mapTodoFromApi(response.data)
                const todo = todos.value.find(t => t.id === editingId.value)
                if (todo) {
                    todo.text = updated.text
                    todo.description = updated.description
                    todo.priority = updated.priority
                    if (selectedTodo.value?.id === editingId.value) {
                        selectedTodo.value = { ...todo }
                    }
                }
                toast.success('تسک ویرایش شد')
            }
        } catch (error) {
            console.error('خطا در ذخیره task:', error)
            toast.error('ذخیره تسک ناموفق بود')
        } finally {
            closeDialog()
        }
    }

    return {
        // state
        todos,
        selectedTodo,
        isLoading,
        showDeleteDialog,
        deleteTargetId,
        deleteDialogMessage,
        isDialogOpen,
        dialogMode,
        dialogForm,
        editingId,
        // methods
        fetchTodos,
        toggleComplete,
        syncSteps,
        completeStep,
        undoStep,
        updateSteps,
        openDeleteConfirm,
        closeDeleteDialog,
        deleteMultiple,
        handleDeleteFromList,
        confirmDelete,
        openAddDialog,
        openEditDialog,
        closeDialog,
        submitDialog,
    }
}