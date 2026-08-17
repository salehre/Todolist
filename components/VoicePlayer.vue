<template>
  <div class="flex items-center gap-2 min-w-56">
    <button
        @click="togglePlay"
        :disabled="!isReady"
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition disabled:opacity-40"
        :class="variant === 'sent' ? 'bg-white/20 hover:bg-white/30' : 'bg-primary-100 hover:bg-primary-200'"
    >
      <Icon :icon="isPlaying ? 'solar:pause-bold' : 'solar:play-bold'" class="text-sm" />
    </button>

    <div ref="waveformEl" class="flex-1 min-w-0" />

    <span class="shrink-0 text-[10px] tabular-nums opacity-70">{{ displayTime }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import WaveSurfer from 'wavesurfer.js'

const props = defineProps<{
  url: string
  duration: number // مدت‌زمانی که موقع ضبط ثبت شده، فقط برای نمایش اولیه قبل از لود کامل موج
  variant?: 'sent' | 'received'
}>()

const waveformEl = ref<HTMLElement | null>(null)
const isPlaying = ref(false)
const isReady = ref(false)
const currentTime = ref(0)
const realDuration = ref(0)
let wavesurfer: WaveSurfer | null = null

const displayTime = computed(() => {
  const total = realDuration.value || props.duration
  const secondsLeft = isPlaying.value || currentTime.value > 0
      ? Math.max(0, Math.ceil(total - currentTime.value))
      : total
  const mins = Math.floor(secondsLeft / 60)
  const secs = Math.floor(secondsLeft % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

const isSent = computed(() => props.variant === 'sent')

onMounted(() => {
  if (!waveformEl.value) return

  wavesurfer = WaveSurfer.create({
    container: waveformEl.value,
    waveColor: isSent.value ? 'rgba(255,255,255,0.45)' : 'rgba(100,116,139,0.35)',
    progressColor: isSent.value ? '#ffffff' : 'var(--t-500, #6366f1)',
    cursorWidth: 0,
    height: 28,
    barWidth: 2,
    barGap: 2,
    barRadius: 2,
    normalize: true,
  })

  // صریح load می‌کنیم (نه از طریق آپشن url تو create) که با هر نسخه‌ای از
  // wavesurfer.js سازگار باشه، چون این آپشن بین نسخه‌ها فرق می‌کنه
  wavesurfer.load(props.url)

  wavesurfer.on('ready', () => {
    isReady.value = true
    realDuration.value = wavesurfer!.getDuration()
  })
  wavesurfer.on('play', () => { isPlaying.value = true })
  wavesurfer.on('pause', () => { isPlaying.value = false })
  wavesurfer.on('finish', () => {
    isPlaying.value = false
    currentTime.value = 0
  })
  wavesurfer.on('timeupdate', (time: number) => {
    currentTime.value = time
  })
})

function togglePlay(): void {
  wavesurfer?.playPause()
}

onUnmounted(() => {
  wavesurfer?.destroy()
})
</script>