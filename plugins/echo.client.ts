import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import api from '~/src/services/api'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    // @ts-expect-error - لازمه چون Echo انتظار داره Pusher رو global بذاریم
    window.Pusher = Pusher

    const echo = new Echo({
        broadcaster: 'pusher',
        key: config.public.pusherKey,
        cluster: config.public.pusherCluster,
        forceTLS: true,
        // به‌جای authEndpoint پیش‌فرض (که کوکی/CSRF ما رو نمی‌فرسته)، خودمون
        // درخواست auth کانال خصوصی رو با axios instance خودمون می‌زنیم
        authorizer: (channel: { name: string }) => ({
            authorize: (socketId: string, callback: (err: boolean, data?: unknown) => void) => {
                api
                    .post('/broadcasting/auth', { socket_id: socketId, channel_name: channel.name })
                    .then((response) => callback(false, response.data))
                    .catch((error) => callback(true, error))
            },
        }),
    })

    return {
        provide: { echo },
    }
})