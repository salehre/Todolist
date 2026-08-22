import type { Priority } from '~/types/todoType'

export interface MessageAttachment {
    id: number
    name: string
    size: number
    type: 'image' | 'file' | 'voice'
    url: string
    voiceDuration: number | null
}

export interface TodoRef {
    id: number
    text: string
    priority: Priority
}

export interface ApiMessage {
    id: number
    senderId: number
    text: string | null
    timestamp: string
    type: 'text' | 'system'
    pinned: boolean
    edited: boolean
    replyTo: number | null
    reactions: Record<string, number[]>
    readBy: number[]
    mentions: number[]
    todoRef: TodoRef | null
    attachments: MessageAttachment[]
    status?: 'pending' | 'sent'
    failed?: boolean
}

export interface ApiGroup {
    id: number
    name: string
    description: string | null
    avatarUrl: string | null
    membersCount: number
    lastMessagePreview: string | null
    lastMessageAt: string | null
    createdAt: string
}

export interface GroupMember {
    userId: number
    name: string
    username: string
    avatarUrl: string | null
    role: 'admin' | 'member'
}

export interface UserSearchResult {
    id: number
    name: string
    username: string
    avatarUrl: string | null
}

export interface UserProfile {
    id: number
    name: string
    username: string
    avatarUrl: string | null
    coverUrl: string | null
    bio: string | null
    social_links: { platform: string; url: string }[]
}

export interface PendingFile {
    file: File
    previewUrl: string
    isImage: boolean
}

export interface InlineTodoForm {
    title: string
    description: string
    priority: Priority
    assignedTo: number[]
}

export interface SkeletonRow {
    type: 'message' | 'system'
    sent: boolean
    consecutive: boolean
    lines: number[]
    hasImage: boolean
    imageWide: boolean
    hasVoice: boolean
    hasReactions: boolean
    reactionCount: number
}

export interface ConfirmDialogOptions {
    title: string
    message: string
    confirmLabel: string
    danger?: boolean
    onConfirm: () => void | Promise<void>
}