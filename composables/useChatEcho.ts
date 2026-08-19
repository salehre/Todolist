import { ref } from 'vue'
import type { ApiMessage } from '~/types/ChatType'
import { useGroupChat } from '~/composables/useGroupChat'

export function useChatEcho() {
    const {
        pushIncomingMessage,
        updateIncomingMessage,
        removeIncomingMessage,
        messagesByGroup,
    } = useGroupChat()

    const onlineUserIds = ref<number[]>([])
    const typingUsers = ref<number[]>([])
    const typingNames = ref<Record<number, string>>({})

    let currentChannel: string | null = null
    let currentPresenceChannel: string | null = null

    function addTypingUser(userId: number, userName: string, currentUserId: number): void {
        if (userId === currentUserId) return
        typingNames.value[userId] = userName
        if (!typingUsers.value.includes(userId)) typingUsers.value.push(userId)
        setTimeout(() => {
            typingUsers.value = typingUsers.value.filter(id => id !== userId)
        }, 3000)
    }

    function subscribe(groupId: number, currentUserId: number): void {
        const { $echo } = useNuxtApp()

        if (currentChannel) $echo.leave(currentChannel)
        currentChannel = `group.${groupId}`

        $echo.private(currentChannel)
            .listen('.message.sent', (e: { groupId: number; message: ApiMessage }) => {
                pushIncomingMessage(e.groupId, e.message)
            })
            .listen('.message.reacted', (e: { groupId: number; message: ApiMessage }) => {
                updateIncomingMessage(e.groupId, e.message)
            })
            .listen('.message.updated', (e: { groupId: number; message: ApiMessage }) => {
                updateIncomingMessage(e.groupId, e.message)
            })
            .listen('.message.deleted', (e: { groupId: number; messageId: number }) => {
                removeIncomingMessage(e.groupId, e.messageId)
            })
            .listen('.message.pinned', (e: { groupId: number; messageId: number; pinned: boolean }) => {
                const msg = messagesByGroup[e.groupId]?.find(m => m.id === e.messageId)
                if (msg) msg.pinned = e.pinned
            })
            .listen('.user.typing', (e: { groupId: number; userId: number; userName: string }) => {
                addTypingUser(e.userId, e.userName, currentUserId)
            })
            .listen('.message.read', (e: { groupId: number; userId: number; lastReadMessageId: number }) => {
                const arr = messagesByGroup[e.groupId]
                if (!arr) return
                arr.forEach(m => {
                    if (m.id <= e.lastReadMessageId && !m.readBy.includes(e.userId)) {
                        m.readBy.push(e.userId)
                    }
                })
            })

        if (currentPresenceChannel) $echo.leave(currentPresenceChannel)
        currentPresenceChannel = `online-group.${groupId}`
        onlineUserIds.value = []

        $echo.join(currentPresenceChannel)
            .here((users: { id: number }[]) => { onlineUserIds.value = users.map(u => u.id) })
            .joining((user: { id: number }) => {
                if (!onlineUserIds.value.includes(user.id)) onlineUserIds.value.push(user.id)
            })
            .leaving((user: { id: number }) => {
                onlineUserIds.value = onlineUserIds.value.filter(id => id !== user.id)
            })
    }

    function unsubscribe(): void {
        const { $echo } = useNuxtApp()
        if (currentChannel) { $echo.leave(currentChannel); currentChannel = null }
        if (currentPresenceChannel) { $echo.leave(currentPresenceChannel); currentPresenceChannel = null }
    }

    return { onlineUserIds, typingUsers, typingNames, subscribe, unsubscribe }
}