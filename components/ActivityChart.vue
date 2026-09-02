<template>
  <div class="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
    <h2 class="text-lg font-bold text-slate-800">میزان فعالیت (۷ روز اخیر)</h2>

    <div v-if="loading" class="mt-6 h-64 rounded-xl bg-slate-100 animate-pulse"></div>

    <div v-else-if="hasNoData" class="mt-6 flex h-40 items-center justify-center text-sm text-slate-400">
      هنوز فعالیتی ثبت نشده
    </div>

    <VChart v-else class="mt-4 h-64 w-full" :option="chartOption" autoresize />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import api from '~/src/services/api'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent])

interface ActivityData {
  labels: string[]
  personal: number[]
  group: number[]
  completed: number[]
}

const loading = ref(true)
const data = ref<ActivityData | null>(null)

const hasNoData = computed(() => {
  if (!data.value) return true
  const total = [...data.value.personal, ...data.value.group, ...data.value.completed].reduce((a, b) => a + b, 0)
  return total === 0
})

onMounted(async () => {
  try {
    const res = await api.get('/users/me/activity')
    data.value = res.data
  } finally {
    loading.value = false
  }
})

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })
}

const chartOption = computed(() => {
  if (!data.value) return {}
  return {
    color: ['#0ea5e9', '#f97316', '#10b981'], // شخصی: آبی، گروهی: نارنجی، انجام‌شده: سبز
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['تسک‌های فردی', 'تسک‌های گروهی', 'انجام‌شده'],
      bottom: 0,
      textStyle: { fontFamily: 'inherit', fontSize: 12 },
    },
    grid: { left: 30, right: 20, top: 20, bottom: 40 },
    xAxis: {
      type: 'category',
      data: data.value.labels.map(formatDate),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { fontFamily: 'inherit', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: '#f1f5f9' } },
    },
    series: [
      { name: 'تسک‌های فردی', type: 'line', smooth: true, data: data.value.personal, areaStyle: { opacity: 0.08 } },
      { name: 'تسک‌های گروهی', type: 'line', smooth: true, data: data.value.group, areaStyle: { opacity: 0.08 } },
      { name: 'انجام‌شده', type: 'line', smooth: true, data: data.value.completed, areaStyle: { opacity: 0.08 } },
    ],
  }
})
</script>