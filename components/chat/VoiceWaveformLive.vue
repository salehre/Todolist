<template>
  <canvas ref="canvasEl" class="w-full h-8"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{ analyser: AnalyserNode | null }>()

const canvasEl = ref<HTMLCanvasElement | null>(null)
let rafId: number | null = null

function draw(): void {
  const canvas = canvasEl.value
  const analyser = props.analyser
  if (!canvas || !analyser) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  if (canvas.width !== width * dpr) {
    canvas.width = width * dpr
    canvas.height = height * dpr
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)

  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  analyser.getByteFrequencyData(dataArray)

  const barCount = 32
  const step = Math.floor(bufferLength / barCount)
  const barWidth = width / barCount
  ctx.fillStyle = '#ef4444'

  for (let i = 0; i < barCount; i++) {
    const value = dataArray[i * step] / 255
    const barHeight = Math.max(2, value * height)
    const x = i * barWidth
    const y = (height - barHeight) / 2
    ctx.beginPath()
    ctx.roundRect(x, y, barWidth - 2, barHeight, 2)
    ctx.fill()
  }

  rafId = requestAnimationFrame(draw)
}

watch(() => props.analyser, (analyser) => {
  if (analyser) {
    if (rafId) cancelAnimationFrame(rafId)
    draw()
  }
})

onMounted(() => { if (props.analyser) draw() })
onUnmounted(() => { if (rafId) cancelAnimationFrame(rafId) })
</script>