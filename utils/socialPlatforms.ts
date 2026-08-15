export interface SocialPlatform {
    value: string
    label: string
    icon: string
}

export const socialPlatforms: SocialPlatform[] = [
    { value: 'Telegram', label: 'تلگرام', icon: 'simple-icons:telegram' },
    { value: 'Instagram', label: 'اینستاگرام', icon: 'simple-icons:instagram' },
    { value: 'Pinterest', label: 'پینترست', icon: 'simple-icons:pinterest' },
    { value: 'Github', label: 'گیت‌هاب', icon: 'simple-icons:github' },
    { value: 'LinkedIn', label: 'لینکدین', icon: 'simple-icons:linkedin' },
    { value: 'TikTok', label: 'تیک‌تاک', icon: 'simple-icons:tiktok' },
    { value: 'Reddit', label: 'ردیت', icon: 'simple-icons:reddit' },
    { value: 'X', label: 'ایکس', icon: 'simple-icons:x' },
    { value: 'YouTube', label: 'یوتیوب', icon: 'simple-icons:youtube' },
    { value: 'Facebook', label: 'فیسبوک', icon: 'simple-icons:facebook' },
    { value: 'SoundCloud', label: 'ساوندکلاد', icon: 'simple-icons:soundcloud' },
    { value: 'Spotify', label: 'اسپاتیفای', icon: 'simple-icons:spotify' },
    { value: 'WhatsApp', label: 'واتس‌اپ', icon: 'simple-icons:whatsapp' },
    { value: 'Snapchat', label: 'اسنپ‌چت', icon: 'simple-icons:snapchat' },
    { value: 'Discord', label: 'دیسکورد', icon: 'simple-icons:discord' },
    { value: 'LetterBoxd', label: 'لترباکسد', icon: 'simple-icons:letterboxd' },
    { value: 'Twitch', label: 'توییچ', icon: 'simple-icons:twitch' },
    { value: 'Threads', label: 'تردز', icon: 'simple-icons:threads' },
    { value: 'Tumblr', label: 'تامبلر', icon: 'simple-icons:tumblr' },
    { value: 'other', label: 'سایر', icon: 'mdi:link-variant' },
]

export function platformInfo(value: string | undefined): SocialPlatform {
    // @ts-ignore
    return socialPlatforms.find(p => p.value === value) ?? socialPlatforms[socialPlatforms.length - 1]
}