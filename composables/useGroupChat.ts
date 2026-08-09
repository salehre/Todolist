import { ref, reactive } from 'vue'
import api, { getErrorMessage } from '~/src/services/api'
import { toast } from 'vue-sonner'

export interface ApiGroup {
    id: number
    name: string
    description: string | null
    avatarUrl: string | null
    membersCount: number
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
    attachment: { name: string; size: number; type: string; url: string } | null
}

export function useGroupChat() {
    const groups = ref<ApiGroup[]>([])
    const messagesByGroup = reactive<Record<number, ApiMessage[]>>({})
    const loadingGroups = ref(false)
    const loadingMessages = ref(false)

    function mapGroup(g: any): ApiGroup {
        return {
            id: g.id,
            name: g.name,
            description: g.description,
            avatarUrl: g.avatar_url,
            membersCount: g.members_count,
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

    async function sendMessage(groupId: number, payload: { text?: string; reply_to?: number }): Promise<void> {
        try {
            const res = await api.post(`/groups/${groupId}/messages`, payload)
            if (!messagesByGroup[groupId]) messagesByGroup[groupId] = []
            messagesByGroup[groupId].push(res.data)
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'ارسال پیام ناموفق بود'))
        }
    }

    // وقتی از Echo یه پیام جدید (از یوزر دیگه) می‌رسه، همینو صدا می‌زنیم
    function pushIncomingMessage(groupId: number, message: ApiMessage): void {
        if (!messagesByGroup[groupId]) messagesByGroup[groupId] = []
        // جلوگیری از دوبار اضافه شدن (اگه خودمون فرستاده باشیمش و echo هم برگردونه)
        if (messagesByGroup[groupId].some(m => m.id === message.id)) return
        messagesByGroup[groupId].push(message)
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
    }
}