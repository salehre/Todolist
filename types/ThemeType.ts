export type ThemeName = 'light' | 'dark' | 'ocean' | 'forest' | 'sunset'

export interface ThemeOption {
    name: ThemeName
    label: string
    icon: string
    isDark: boolean
    previewColors: {
        bg: string
        primary: string
        secondary: string
    }
}

export const THEMES: ThemeOption[] = [
    {
        name: 'light',
        label: 'روشن',
        icon: '☀️',
        isDark: false,
        previewColors: { bg: '#FFFFFF', primary: '#6366F1', secondary: '#8B5CF6' },
    },
    {
        name: 'dark',
        label: 'تاریک',
        icon: '🌙',
        isDark: true,
        previewColors: { bg: '#0A0A0A', primary: '#818CF8', secondary: '#A78BFA' },
    },
    {
        name: 'ocean',
        label: 'اقیانوس',
        icon: '🌊',
        isDark: true,
        previewColors: { bg: '#082F49', primary: '#38BDF8', secondary: '#22D3EE' },
    },
    {
        name: 'forest',
        label: 'جنگل',
        icon: '🌿',
        isDark: true,
        previewColors: { bg: '#142814', primary: '#86EFAC', secondary: '#6EE7B7' },
    },
    {
        name: 'sunset',
        label: 'غروب',
        icon: '🌆',
        isDark: true,
        previewColors: { bg: '#1E0A28', primary: '#FB923C', secondary: '#E879F9' },
    },
]