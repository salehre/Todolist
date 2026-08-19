import { ref, type Ref } from 'vue'

export function useDateDivider(container: Ref<HTMLElement | null>) {
    const refs = ref<Record<string, HTMLElement>>({})
    const currentVisibleDate = ref<string | null>(null)

    function setRef(el: unknown, date: string): void {
        if (el) refs.value[date] = el as HTMLElement
    }

    function update(): void {
        const el = container.value
        if (!el) return
        const containerTop = el.getBoundingClientRect().top
        let latest: string | null = null

        for (const date of Object.keys(refs.value)) {
            const top = refs.value[date]?.getBoundingClientRect().top
            if (top !== undefined && top <= containerTop + 4) latest = date
        }
        currentVisibleDate.value = latest
    }

    return { setRef, update, currentVisibleDate }
}