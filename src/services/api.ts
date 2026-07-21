
const STORAGE_KEY = 'todos_db'
const STEP_ID_KEY = 'todos_db_next_step_id'
const TASK_ID_KEY = 'todos_db_next_task_id'

interface ApiStep {
    id: number
    text: string
    completed: boolean
}

interface ApiTodo {
    id: number
    title: string
    description: string | null
    is_completed: boolean
    priority: 'low' | 'medium' | 'high'
    steps: ApiStep[]
    created_at: string
}

// ─── Storage Helpers ────────────────────────────────────────────────────────
function isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage
}

function readAll(): ApiTodo[] {
    if (!isBrowser()) return []
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    try {
        return JSON.parse(raw) as ApiTodo[]
    } catch {
        return []
    }
}

function writeAll(todos: ApiTodo[]): void {
    if (!isBrowser()) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function nextTaskId(): number {
    if (!isBrowser()) return Date.now()
    const current = Number(window.localStorage.getItem(TASK_ID_KEY) ?? '0')
    const next = current + 1
    window.localStorage.setItem(TASK_ID_KEY, String(next))
    return next
}

function nextStepId(): number {
    if (!isBrowser()) return Date.now()
    const current = Number(window.localStorage.getItem(STEP_ID_KEY) ?? '0')
    const next = current + 1
    window.localStorage.setItem(STEP_ID_KEY, String(next))
    return next
}

function findTaskOrThrow(todos: ApiTodo[], id: number): ApiTodo {
    const todo = todos.find(t => t.id === id)
    if (!todo) throw new Error(`Task with id ${id} not found`)
    return todo
}

// شبیه‌سازی تأخیر شبکه، تا رفتار loading state دقیقاً مثل قبل بمونه
function delay<T>(value: T, ms = 150): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(value), ms))
}

// ─── Route Handlers ──────────────────────────────────────────────────────────
function handleGetTasks(): ApiTodo[] {
    return [...readAll()].sort((a, b) => b.id - a.id)
}

function handleCreateTask(body: any): ApiTodo {
    const todos = readAll()
    const newTodo: ApiTodo = {
        id: nextTaskId(),
        title: body.title,
        description: body.description ?? null,
        is_completed: false,
        priority: body.priority ?? 'medium',
        steps: [],
        created_at: new Date().toISOString(),
    }
    todos.push(newTodo)
    writeAll(todos)
    return newTodo
}

function handleUpdateTask(body: any): ApiTodo {
    const todos = readAll()
    const todo = findTaskOrThrow(todos, body.id)

    if (body.title !== undefined) todo.title = body.title
    if (body.description !== undefined) todo.description = body.description
    if (body.priority !== undefined) todo.priority = body.priority
    if (body.is_completed !== undefined) todo.is_completed = body.is_completed

    writeAll(todos)
    return todo
}

function handleUpdateSteps(body: any): ApiStep[] {
    const todos = readAll()
    const todo = findTaskOrThrow(todos, body.task_id)

    const newSteps: ApiStep[] = (body.steps ?? []).map((s: any) => ({
        id: s.id ?? nextStepId(),
        text: s.text,
        completed: !!s.completed,
    }))

    todo.steps = newSteps
    writeAll(todos)
    return todo.steps
}

function handleDeleteTask(body: any): { success: true } {
    const todos = readAll()
    const filtered = todos.filter(t => t.id !== body.id)
    writeAll(filtered)
    return { success: true }
}

// ─── Mock axios-like client ──────────────────────────────────────────────────
// همون امضای api.get/post/put/delete که قبلاً axios می‌داد، اینجا هم حفظ شده
const api = {
    async get(url: string) {
        if (url === '/tasks') {
            return delay({ data: handleGetTasks() })
        }
        throw new Error(`Unknown GET route: ${url}`)
    },

    async post(url: string, body?: any) {
        if (url === '/tasks/create') {
            return delay({ data: handleCreateTask(body) })
        }
        throw new Error(`Unknown POST route: ${url}`)
    },

    async put(url: string, body?: any) {
        if (url === '/tasks/updateTask') {
            return delay({ data: handleUpdateTask(body) })
        }
        if (url === '/tasks/updateStep') {
            return delay({ data: handleUpdateSteps(body) })
        }
        throw new Error(`Unknown PUT route: ${url}`)
    },

    async delete(url: string, config?: { data?: any }) {
        if (url === '/tasks/delete') {
            return delay({ data: handleDeleteTask(config?.data) })
        }
        throw new Error(`Unknown DELETE route: ${url}`)
    },
}

export default api