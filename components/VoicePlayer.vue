<template>
  <div class="flex items-center gap-2 min-w-50">
    <button @click="togglePlay" class="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition shrink-0">
      <Icon :icon="isPlaying ? 'solar:pause-bold' : 'solar:play-bold'" class="text-sm" />
    </button>
    <div ref="waveformEl" class="flex-1 min-w-0" />
    <span class="text-[10px] opacity-70 shrink-0">{{ formattedDuration }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import WaveSurfer from 'wavesurfer.js'

const props = defineProps<{ url: string; duration: number }>()

const waveformEl = ref<HTMLElement | null>(null)
const isPlaying = ref(false)
let wavesurfer: WaveSurfer | null = null

const formattedDuration = computed(() => {
  const mins = Math.floor(props.duration / 60)
  const secs = props.duration % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

onMounted(() => {
  if (!waveformEl.value) return
  wavesurfer = WaveSurfer.create({
    container: waveformEl.value,
    waveColor: 'rgba(255,255,255,0.4)',
    progressColor: '#fff',
    height: 28,
    barWidth: 2,
    barGap: 2,
    barRadius: 2,
    url: props.url,
  })
  wavesurfer.on('finish', () => { isPlaying.value = false })
})

function togglePlay(): void {
  wavesurfer?.playPause()
  isPlaying.value = !isPlaying.value
}

onUnmounted(() => wavesurfer?.destroy())
</script>