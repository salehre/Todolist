/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

// ─── کش/آپدیت (معادل رفتار قبلیِ generateSW با registerType: autoUpdate) ───
self.skipWaiting()
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

// @ts-ignore - لیست فایل‌ها موقع build توسط vite-pwa جایگزین می‌شه
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

for (const url of ['/', '/index.html', '/200.html']) {
    try {
        registerRoute(new NavigationRoute(createHandlerBoundToURL(url)))
        break
    } catch {
        // این آدرس توی precache نیست (مثلاً توی dev)؛ بعدی رو امتحان می‌کنیم
    }
}

// ─── Push ────────────────────────────────────────────────────────────────
interface PushData {
    title?: string
    body?: string
    tag?: string
    url?: string
    groupId?: number
}

async function showPush(event: PushEvent): Promise<void> {
    let data: PushData = {}
    try {
        data = event.data ? event.data.json() : {}
    } catch {
        data = { body: event.data?.text() }
    }

    const tag = data.tag || 'todolist'
    // اگه نوتیف قبلیِ همین گروه هنوز نمایش داده می‌شه، تعدادشون رو روی عنوان می‌ذاریم
    const existing = await self.registration.getNotifications({ tag })
    const count = ((existing[0]?.data as { count?: number } | undefined)?.count ?? 0) + 1
    const baseTitle = data.title || 'Todolist'

    await self.registration.showNotification(count > 1 ? `${baseTitle} (${count})` : baseTitle, {
        body: data.body,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag,
        dir: 'rtl',
        lang: 'fa',
        renotify: true,
        data: { url: data.url || '/workPlan', groupId: data.groupId, count },
    } as NotificationOptions)
}

self.addEventListener('push', (event) => {
    event.waitUntil(showPush(event))
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    const { url = '/workPlan', groupId } = (event.notification.data ?? {}) as { url?: string; groupId?: number }

    event.waitUntil((async () => {
        const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        const open = windows.find((c) => new URL(c.url).origin === self.location.origin) as WindowClient | undefined

        if (open) {
            await open.focus()
            if (groupId) open.postMessage({ type: 'open-group', groupId })
            return
        }
        await self.clients.openWindow(url)
    })())
})