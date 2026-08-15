import { reactive, ref } from 'vue'
import api, { getErrorMessage } from '~/src/services/api'
import { toast } from 'vue-sonner'

export interface Invite {
    id: number
    groupId: number
    groupName: string
    groupAvatarUrl: string | null
    invitedByName: string
    createdAt: string
}

export interface MessageNotice {
    groupId: number
    groupName: string
    createdAt: string
}

const invites = ref<Invite[]>([])
const messageNotices = reactive<Record<number, MessageNotice>>({}) // keyed by groupId — همیشه فقط آخرین یکی نگه داشته می‌شه

export function useNotifications() {
    async function fetchInvites(): Promise<void> {
        try {
            const res = await api.get('/invites')
            invites.value = res.data
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'گرفتن دعوت‌نامه‌ها ناموفق بود'))
        }
    }

    async function acceptInvite(inviteId: number): Promise<number | null> {
        try {
            const res = await api.put(`/invites/${inviteId}/accept`)
            invites.value = invites.value.filter(i => i.id !== inviteId)
            toast.success('به گروه اضافه شدی')
            return res.data.groupId
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'پذیرفتن دعوت ناموفق بود'))
            return null
        }
    }

    async function declineInvite(inviteId: number): Promise<void> {
        try {
            await api.put(`/invites/${inviteId}/decline`)
            invites.value = invites.value.filter(i => i.id !== inviteId)
        } catch (e: any) {
            toast.error(getErrorMessage(e, 'رد کردن دعوت ناموفق بود'))
        }
    }

    function addInviteFromEcho(invite: Invite): void {
        if (invites.value.some(i => i.id === invite.id)) return
        invites.value.unshift(invite)
    }

    function addMessageNotice(groupId: number, groupName: string): void {
        messageNotices[groupId] = { groupId, groupName, createdAt: new Date().toISOString() }
    }

    function clearMessageNotice(groupId: number): void {
        delete messageNotices[groupId]
    }

    const hasUnread = () => invites.value.length > 0 || Object.keys(messageNotices).length > 0

    return {
        invites,
        messageNotices,
        fetchInvites,
        acceptInvite,
        declineInvite,
        addInviteFromEcho,
        addMessageNotice,
        clearMessageNotice,
        hasUnread,
    }
}