import { defineNuxtPlugin } from '#app'
import type { Directive, DirectiveBinding } from 'vue'

type TooltipSide = 'top' | 'bottom' | 'left' | 'right' | 'start' | 'end'
type ResolvedSide = 'top' | 'bottom' | 'left' | 'right'

function resolveSide(target: HTMLElement, side: TooltipSide): ResolvedSide {
    if (side !== 'start' && side !== 'end') return side
    const isRtl = getComputedStyle(target).direction === 'rtl'
    if (side === 'start') return isRtl ? 'right' : 'left'
    return isRtl ? 'left' : 'right'
}

let tooltipEl: HTMLDivElement | null = null
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

function ensureTooltipEl(): HTMLDivElement {
    if (tooltipEl) return tooltipEl

    const el = document.createElement('div')
    el.className =
        'fixed z-[9999] pointer-events-none px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium ' +
        'shadow-lg opacity-0 scale-95 transition-[opacity,transform] duration-150 ease-out whitespace-nowrap'
    el.setAttribute('role', 'tooltip')
    document.body.appendChild(el)
    tooltipEl = el
    return el
}

function positionTooltip(target: HTMLElement, rawSide: TooltipSide) {
    const el = ensureTooltipEl()
    const side = resolveSide(target, rawSide)
    const rect = target.getBoundingClientRect()

    // اول رندر کن تا ابعاد واقعی تولتیپ رو داشته باشیم
    el.style.left = '0px'
    el.style.top = '0px'
    const tipRect = el.getBoundingClientRect()

    let left = 0
    let top = 0
    const gap = 8

    if (side === 'left' || side === 'right') {
        top = rect.top + rect.height / 2 - tipRect.height / 2
        if (side === 'left') {
            left = rect.left - tipRect.width - gap
            if (left < 4) left = rect.right + gap // جا نشد -> برو راست
        } else {
            left = rect.right + gap
            if (left + tipRect.width > window.innerWidth - 4) left = rect.left - tipRect.width - gap // جا نشد -> برو چپ
        }
        top = Math.max(4, Math.min(top, window.innerHeight - tipRect.height - 4))
    } else {
        left = rect.left + rect.width / 2 - tipRect.width / 2
        if (side === 'top') {
            top = rect.top - tipRect.height - gap
            if (top < 4) top = rect.bottom + gap // جا نشد -> برو پایین
        } else {
            top = rect.bottom + gap
            if (top + tipRect.height > window.innerHeight - 4) top = rect.top - tipRect.height - gap // جا نشد -> برو بالا
        }
        left = Math.max(4, Math.min(left, window.innerWidth - tipRect.width - 4))
    }

    el.style.left = `${left}px`
    el.style.top = `${top}px`
}

function showTooltip(target: HTMLElement, text: string, side: TooltipSide) {
    if (!text || window.innerWidth < 768) return

    // مهم: هر تایمر قبلی رو پاک کن، وگرنه ممکنه چند تا show همزمان صف بشه
    if (showTimer) clearTimeout(showTimer)
    if (hideTimer) clearTimeout(hideTimer)

    showTimer = setTimeout(() => {
        // 🔑 چک اصلی: مطمئن شو المنت هنوز تو DOM و واقعاً قابل دیدنه
        // (رفع شده: اگه المنت حذف یا display:none بشه، mouseleave شلیک نمیشه
        // و target.getBoundingClientRect() صفر برمی‌گرده -> تولتیپ می‌پره گوشه‌ی صفحه)
        if (!target.isConnected || target.offsetParent === null) {
            return
        }

        const rect = target.getBoundingClientRect()
        if (rect.width === 0 && rect.height === 0) {
            return
        }

        const el = ensureTooltipEl()
        el.textContent = text
        positionTooltip(target, side)
        requestAnimationFrame(() => {
            el.classList.remove('opacity-0', 'scale-95')
            el.classList.add('opacity-100', 'scale-100')
        })
    }, 300)
}
function hideTooltip() {
    if (showTimer) clearTimeout(showTimer)
    if (!tooltipEl) return

    tooltipEl.classList.remove('opacity-100', 'scale-100')
    tooltipEl.classList.add('opacity-0', 'scale-95')
}

interface TooltipHTMLElement extends HTMLElement {
    __tooltipText?: string
    __tooltipSide?: TooltipSide
    __tooltipHandlers?: {
        enter: () => void
        leave: () => void
    }
}

function bind(el: TooltipHTMLElement, binding: DirectiveBinding<string | undefined>) {
    el.__tooltipText = binding.value
    el.__tooltipSide = (binding.arg as TooltipSide) ?? 'top'

    // اگه از قبل title داشت، حذفش کن که دو تا تولتیپ روی هم نیفته
    if (el.hasAttribute('title')) el.removeAttribute('title')

    const enter = () => {
        if (el.__tooltipText) showTooltip(el, el.__tooltipText, el.__tooltipSide ?? 'top')
    }
    const leave = () => hideTooltip()

    el.__tooltipHandlers = { enter, leave }
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mouseleave', leave)
    el.addEventListener('focus', enter)
    el.addEventListener('blur', leave)
}

function unbind(el: TooltipHTMLElement) {
    if (!el.__tooltipHandlers) return
    el.removeEventListener('mouseenter', el.__tooltipHandlers.enter)
    el.removeEventListener('mouseleave', el.__tooltipHandlers.leave)
    el.removeEventListener('focus', el.__tooltipHandlers.enter)
    el.removeEventListener('blur', el.__tooltipHandlers.leave)
    delete el.__tooltipHandlers
}

const tooltipDirective: Directive<TooltipHTMLElement, string | undefined> = {
    mounted(el, binding) {
        bind(el, binding)
    },
    updated(el, binding) {
        el.__tooltipText = binding.value
        el.__tooltipSide = (binding.arg as TooltipSide) ?? 'top'
    },
    unmounted(el) {
        unbind(el)
    },
}

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.directive('tooltip', tooltipDirective)
})