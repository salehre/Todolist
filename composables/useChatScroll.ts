import { ref, type Ref } from 'vue'

export function useChatScroll(container: Ref<HTMLElement | null>) {
    const isNearBottom = ref(true)
    const unreadCount = ref(0)

    let isProgrammaticScroll = false
    let scrollTimeout: number | null = null

    function scrollToBottom(instant = false): void {
        const el = container.value
        if (!el) return

        isProgrammaticScroll = true
        if (scrollTimeout) clearTimeout(scrollTimeout)

        el.scrollTo({ top: el.scrollHeight, behavior: instant ? 'auto' : 'smooth' })
        isNearBottom.value = true
        unreadCount.value = 0

        const finish = () => { isProgrammaticScroll = false; el.removeEventListener('scrollend', finish) }
        if ('onscrollend' in el) el.addEventListener('scrollend', finish, { once: true })
        else scrollTimeout = window.setTimeout(finish, instant ? 50 : 500)
    }

    function jumpToBottomInstant(): void {
        const el = container.value
        if (!el) return
        el.scrollTop = el.scrollHeight
        isNearBottom.value = true
        unreadCount.value = 0
    }

    function onScroll(onAfter?: () => void): void {
        const el = container.value
        if (!el || isProgrammaticScroll) return
        const threshold = 100
        isNearBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < threshold
        if (isNearBottom.value) unreadCount.value = 0
        onAfter?.()
    }

    return { isNearBottom, unreadCount, scrollToBottom, jumpToBottomInstant, onScroll }
}