import type { Todo, Priority } from '~/types/todoType'

// ─── Members ──────────────────────────────────────────────────────────────────
export interface Member {
    id: number
    name: string
    avatarBg: string
    online: boolean
}

// ─── Messages ─────────────────────────────────────────────────────────────────
export type MessageType = 'text' | 'system'

/** key = emoji string، value = آرایه id کسایی که ری‌اکت کردن */
export type Reactions = Record<string, number[]>

export type TodoRef = Pick<Todo, 'id' | 'text' | 'priority'>

export interface Message {
    id: number
    senderId: number
    text: string
    timestamp: Date
    type: MessageType
    read: boolean
    pinned: boolean
    edited: boolean
    replyTo: number | null       // id پیام reply شده
    reactions: Reactions
    todoRef: TodoRef | null
}

// ─── Forms ────────────────────────────────────────────────────────────────────
export interface InlineTodoForm {
    title: string
    description: string
    priority: Priority
}

// ─── Emits shared between sub-components ─────────────────────────────────────
/** رویدادهایی که MessageItem به بالا emit می‌کنه */
export interface MessageActions {
    reply: (msg: Message) => void
    pin: (id: number) => void
    edit: (msg: Message) => void
    delete: (id: number) => void
    react: (msgId: number, emoji: string) => void
    viewTodo: (ref: TodoRef) => void
}