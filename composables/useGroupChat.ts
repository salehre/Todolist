import { ref, reactive } from 'vue'
import api, { getErrorMessage } from '~/src/services/api'
import { toast } from 'vue-sonner'

export interface ApiGroup {
    id: number
    name: string
    description: string | null
    avatarUrl: string | null
    membersCount: number
    lastMessageAt: string | null
    createdAt: string
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
    todoRef: { id: number; text: string; priority: string } | null
    attachments: { id: number; name: string; size: number; type: string; url: string; voiceDuration: number | null }[]
    status?: 'pending' | 'sent'
    failed?: boolean
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

const groups = ref<ApiGroup[]>([])
const messagesByGroup = reactive<Record<number, ApiMessage[]>>({})
const membersByGroup = reactive<Record<number, GroupMember[]>>({})
const profileCache = reactive<Record<number, UserProfile>>({})
const loadingGroups = ref(false)
const loadingMessages = ref(false)
const unreadCounts = reactive<Record<number, number>>({})
let trackedActiveGroupId: number | null = null
let trackedUserId = 0

export function useGroupChat() {


    function setChatContext(activeGroupId: number | null, currentUserId: number): void {
        trackedActiveGroupId = activeGroupId
        trackedUserId = currentUserId
        if (activeGroupId !== null) unreadCounts[activeGroupId] = 0
    }

    function mapGroup(g: any): ApiGroup {
        return {
            id: g.id,
            name: g.name,
            description: g.description,
            avatarUrl: g.avatar_url,
            membersCount: g.members_count,
            lastMessageAt: g.last_message_at ?? null,
            lastMessagePreview: g.last_message_preview ?? null,
            createdAt: g.created_at,
        }
    }

    async function fetchGroups(): Promise<void> {
        loadingGroups.value = true
        try {
            const res = await api.get('/groups')
            groups.value = res.data.map(mapGroup)
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'گرفتن لیست گروه‌ها ناموفق بود'))
        } finally {
            loadingGroups.value = false
        }
    }

    async function fetchMessages(groupId: number): Promise<void> {
        loadingMessages.value = true
        try {
            const res = await api.get(`/groups/${groupId}/messages`)
            messagesByGroup[groupId] = res.data
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'گرفتن پیام‌ها ناموفق بود'))
        } finally {
            loadingMessages.value = false
        }
    }

    async function createGroup(data: { name: string; description?: string }): Promise<ApiGroup | null> {
        try {
            const res = await api.post('/groups', data)
            const group = mapGroup({ ...res.data, avatar_url: null, members_count: 1 })
            groups.value.unshift(group)
            messagesByGroup[group.id] = []
            return group
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'ساخت گروه ناموفق بود'))
            return null
        }
    }

    async function sendMessage(groupId: number, payload: { text?: string; reply_to?: number }): Promise<ApiMessage | null> {
        try {
            const res = await api.post(`/groups/${groupId}/messages`, payload)
            return res.data
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'ارسال پیام ناموفق بود'))
            return null
        }
    }

    async function toggleReaction(groupId: number, messageId: number, emoji: string): Promise<void> {
        try {
            await api.post(`/groups/${groupId}/messages/${messageId}/react`, { emoji })
            // خودِ آپدیت لیست از broadcast (message.reacted) میاد، نه اینجا —
            // همون الگوی sendMessage که چند پیام قبل توضیح دادیم (یه منبع واحد)
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'ثبت واکنش ناموفق بود'))
        }
    }

    async function togglePin(groupId: number, messageId: number): Promise<void> {
        try {
            await api.put(`/groups/${groupId}/messages/${messageId}/pin`)
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'پین‌کردن ناموفق بود'))
        }
    }

    async function deleteMessage(groupId: number, messageId: number): Promise<void> {
        try {
            await api.delete(`/groups/${groupId}/messages/${messageId}`)
            if (messagesByGroup[groupId]) {
                messagesByGroup[groupId] = messagesByGroup[groupId].filter(m => m.id !== messageId)
            }
            recomputeGroupLastMessage(groupId)
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'حذف پیام ناموفق بود'))
        }
    }

    async function editMessage(groupId: number, messageId: number, text: string): Promise<void> {
        try {
            await api.put(`/groups/${groupId}/messages/${messageId}`, { text })
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'ویرایش پیام ناموفق بود'))
        }
    }

// وقتی از Echo یه پیام آپدیت‌شده (ری‌اکشن/ادیت) می‌رسه
    function updateIncomingMessage(groupId: number, message: ApiMessage): void {
        const arr = messagesByGroup[groupId]
        if (!arr) return
        const idx = arr.findIndex(m => m.id === message.id)
        if (idx !== -1) arr[idx] = message
    }

// وقتی از Echo یه پیام حذف‌شده اطلاع می‌رسه
    function removeIncomingMessage(groupId: number, messageId: number): void {
        if (messagesByGroup[groupId]) {
            messagesByGroup[groupId] = messagesByGroup[groupId].filter(m => m.id !== messageId)
        }
        recomputeGroupLastMessage(groupId)
    }

    async function sendTyping(groupId: number): Promise<void> {
        try {
            await api.post(`/groups/${groupId}/typing`)
        } catch {}
    }

    async function markRead(groupId: number, messageId: number): Promise<void> {
        try {
            await api.put(`/groups/${groupId}/read`, { message_id: messageId })
        } catch {}
    }

    function pushIncomingMessage(groupId: number, message: ApiMessage): void {
        if (!messagesByGroup[groupId]) messagesByGroup[groupId] = []
        if (messagesByGroup[groupId].some(m => m.id === message.id)) return
        messagesByGroup[groupId].push(message)
        bumpGroupLastMessage(groupId, message.timestamp, message.text || (message.attachments.length ? '📎 File' : null))
        if (message.senderId !== trackedUserId && groupId !== trackedActiveGroupId) {
            unreadCounts[groupId] = (unreadCounts[groupId] || 0) + 1
        }
    }

    function bumpGroupLastMessage(groupId: number, timestamp: string, previewText: string | null): void {
        const g = groups.value.find(g => g.id === groupId)
        if (g) { g.lastMessageAt = timestamp; g.lastMessagePreview = previewText }
    }

    async function fetchMembers(groupId: number): Promise<void> {
        try {
            const res = await api.get(`/groups/${groupId}/members`)
            membersByGroup[groupId] = res.data
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'گرفتن لیست اعضا ناموفق بود'))
        }
    }

    async function deleteGroup(groupId: number): Promise<boolean> {
        try {
            await api.delete(`/groups/${groupId}`)
            groups.value = groups.value.filter(g => g.id !== groupId)
            delete messagesByGroup[groupId]
            delete membersByGroup[groupId]
            toast.success('گروه حذف شد')
            return true
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'حذف گروه ناموفق بود'))
            return false
        }
    }

    async function searchUsers(query: string): Promise<UserSearchResult[]> {
        try {
            const res = await api.get('/users/search', { params: { q: query } })
            return res.data
        } catch {
            return []
        }
    }

    async function inviteMember(groupId: number, userId: number): Promise<boolean> {
        try {
            await api.post(`/groups/${groupId}/invites`, { user_id: userId })
            toast.success('دعوت‌نامه فرستاده شد')
            return true
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'فرستادن دعوت ناموفق بود'))
            return false
        }
    }

    async function removeMember(groupId: number, userId: number): Promise<boolean> {
        try {
            await api.delete(`/groups/${groupId}/members/${userId}`)
            if (membersByGroup[groupId]) {
                membersByGroup[groupId] = membersByGroup[groupId].filter(m => m.userId !== userId)
            }
            return true
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'حذف عضو ناموفق بود'))
            return false
        }
    }

    function addOptimisticMessage(groupId: number, message: ApiMessage): void {
        if (!messagesByGroup[groupId]) messagesByGroup[groupId] = []
        messagesByGroup[groupId].push(message)
        bumpGroupLastMessage(groupId, message.timestamp, message.text || (message.attachments.length ? '📎 File' : null))
    }

    function replaceMessage(groupId: number, tempId: number, real: ApiMessage): void {
        const arr = messagesByGroup[groupId]
        if (!arr) return
        const idx = arr.findIndex(m => m.id === tempId)
        if (idx === -1) return
        // اگه broadcast زودتر از جواب POST رسیده و پیام واقعی رو خودش اضافه کرده، فقط موقتی رو حذف کن
        if (arr.some(m => m.id === real.id)) {
            arr.splice(idx, 1)
        } else {
            arr[idx] = real
        }
    }

    function markMessageFailed(groupId: number, tempId: number): void {
        const msg = messagesByGroup[groupId]?.find(m => m.id === tempId)
        if (msg) msg.failed = true
    }

    async function updateMemberRole(groupId: number, userId: number, role: 'admin' | 'member'): Promise<boolean> {
        try {
            await api.put(`/groups/${groupId}/members/${userId}/role`, { role })
            const member = membersByGroup[groupId]?.find(m => m.userId === userId)
            if (member) member.role = role
            return true
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'تغییر نقش ناموفق بود'))
            return false
        }
    }

    function recomputeGroupLastMessage(groupId: number): void {
        const g = groups.value.find(g => g.id === groupId)
        if (!g) return
        const arr = messagesByGroup[groupId]
        const last = arr && arr.length ? arr[arr.length - 1] : null
        g.lastMessageAt = last ? last.timestamp : null
        g.lastMessagePreview = last ? (last.text || (last.attachments.length ? '📎 File' : null)) : null
    }

    function bumpUnreadFromNotification(groupId: number): void {
          if (groupId === trackedActiveGroupId) return
          unreadCounts[groupId] = (unreadCounts[groupId] || 0) + 1
            }

    async function updateGroup(groupId: number, data: { name?: string; description?: string }): Promise<boolean> {
        try {
            await api.put(`/groups/${groupId}`, data)
            const group = groups.value.find(g => g.id === groupId)
            if (group) {
                if (data.name !== undefined) group.name = data.name
                if (data.description !== undefined) group.description = data.description
            }
            toast.success('اطلاعات گروه ذخیره شد')
            return true
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'ذخیره اطلاعات گروه ناموفق بود'))
            return false
        }
    }

    async function uploadGroupAvatar(groupId: number, file: File): Promise<boolean> {
        const formData = new FormData()
        formData.append('avatar', file)
        try {
            const res = await api.post(`/groups/${groupId}/avatar`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            const group = groups.value.find(g => g.id === groupId)
            if (group) group.avatarUrl = res.data.avatar_url
            toast.success('عکس گروه تغییر کرد')
            return true
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'آپلود عکس گروه ناموفق بود'))
            return false
        }
    }

    async function sendMessageWithFiles(
        groupId: number,
        files: File[],
        extra: { text?: string; reply_to?: number; voice_duration?: number } = {}
    ): Promise<void> {
        const formData = new FormData()
        files.forEach(file => formData.append('attachments[]', file))
        if (extra.text) formData.append('text', extra.text)
        if (extra.reply_to) formData.append('reply_to', String(extra.reply_to))
        if (extra.voice_duration) formData.append('voice_duration', String(extra.voice_duration))


        try {
            await api.post(`/groups/${groupId}/messages`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            // مثل sendMessage معمولی، خودِ لیست از broadcast آپدیت می‌شه، نه اینجا
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'ارسال فایل ناموفق بود'))
        }
    }

    async function fetchUserProfile(userId: number): Promise<UserProfile | null> {
        if (profileCache[userId]) return profileCache[userId]
        try {
            const res = await api.get(`/users/${userId}/profile`)
            profileCache[userId] = res.data
            return res.data
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'گرفتن پروفایل ناموفق بود'))
            return null
        }
    }

    return {
        groups,
        messagesByGroup,
        loadingGroups,
        loadingMessages,
        fetchGroups,
        fetchMessages,
        createGroup,
        sendMessage,
        pushIncomingMessage,
        unreadCounts,
        setChatContext,
        toggleReaction,
        togglePin,
        deleteMessage,
        bumpUnreadFromNotification,
        editMessage,
        updateIncomingMessage,
        removeIncomingMessage,
        sendTyping,
        markRead,
        membersByGroup,
        fetchMembers,
        searchUsers,
        inviteMember,
        removeMember,
        updateMemberRole,
        updateGroup,
        uploadGroupAvatar,
        sendMessageWithFiles,
        fetchUserProfile,
        addOptimisticMessage,
        replaceMessage,
        markMessageFailed,
        deleteGroup,
    }
}