<script setup lang="ts">
import Test from "~/components/test.vue";
</script><!--<template>-->
<!--  <div class="min-h-screen bg-[#060818] relative overflow-hidden font-[Outfit] px-8 py-16">-->

<!--    &lt;!&ndash; Background blobs &ndash;&gt;-->
<!--    <div class="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-700/20 blur-[120px] pointer-events-none" />-->
<!--    <div class="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none" />-->
<!--    <div class="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-rose-600/10 blur-[100px] pointer-events-none" />-->

<!--    <div class="relative z-10 max-w-4xl mx-auto flex flex-col gap-16">-->

<!--      &lt;!&ndash; Title &ndash;&gt;-->
<!--      <div>-->
<!--        <h1 class="text-white/90 text-4xl font-semibold tracking-tight">دکمه‌های مدرن</h1>-->
<!--        <p class="text-white/35 text-sm mt-2 tracking-widest uppercase">Glass · 3D · Glow</p>-->
<!--      </div>-->

<!--      &lt;!&ndash; SECTION 1: Glass Glow &ndash;&gt;-->
<!--      <section>-->
<!--        <p class="section-label">Glass Glow</p>-->
<!--        <div class="flex flex-wrap gap-4 items-center">-->
<!--          <GlassButton-->
<!--            v-for="btn in glassButtons"-->
<!--            :key="btn.label"-->
<!--            :label="btn.label"-->
<!--            :icon="btn.icon"-->
<!--            :color="btn.color"-->
<!--          />-->
<!--        </div>-->
<!--      </section>-->

<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { defineComponent, h, ref } from 'vue'-->

<!--/* ── helpers ── */-->
<!--const glowMap = {-->
<!--  blue:   { bg: 'rgba(56,135,255,0.18)',  border: 'rgba(100,170,255,0.35)', glow: '0 0 28px rgba(56,135,255,0.45)',  text: '#c5e0ff' },-->
<!--  purple: { bg: 'rgba(140,70,255,0.18)',  border: 'rgba(180,120,255,0.35)', glow: '0 0 28px rgba(140,70,255,0.45)', text: '#dcc6ff' },-->
<!--  teal:   { bg: 'rgba(0,200,170,0.15)',   border: 'rgba(0,220,190,0.32)',   glow: '0 0 28px rgba(0,200,170,0.4)',   text: '#b2f5ea' },-->
<!--  rose:   { bg: 'rgba(240,60,100,0.18)',  border: 'rgba(255,100,140,0.35)', glow: '0 0 28px rgba(240,60,100,0.45)', text: '#ffc8d8' },-->
<!--  amber:  { bg: 'rgba(255,170,0,0.15)',   border: 'rgba(255,200,50,0.35)',  glow: '0 0 28px rgba(255,170,0,0.4)',   text: '#ffe4a0' },-->
<!--  ghost:  { bg: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.18)', glow: '0 0 20px rgba(255,255,255,0.1)', text: 'rgba(255,255,255,0.85)' },-->
<!--}-->

<!--/* ── GlassButton ── */-->
<!--const GlassButton = defineComponent({-->
<!--  props: { label: String, icon: String, color: { type: String, default: 'ghost' } },-->
<!--  setup(props) {-->
<!--    const hovered = ref(false)-->
<!--    const pressed = ref(false)-->
<!--    const c = () => glowMap[props.color] || glowMap.ghost-->
<!--    const style = () => ({-->
<!--      display: 'inline-flex',-->
<!--      alignItems: 'center',-->
<!--      gap: '8px',-->
<!--      padding: '0.72rem 1.7rem',-->
<!--      borderRadius: '14px',-->
<!--      border: `1px solid ${c().border}`,-->
<!--      background: hovered.value ? c().bg.replace(/[\d.]+\)$/, v => (parseFloat(v) * 1.7).toFixed(2) + ')') : c().bg,-->
<!--      backdropFilter: 'blur(16px)',-->
<!--      WebkitBackdropFilter: 'blur(16px)',-->
<!--      color: c().text,-->
<!--      fontSize: '15px',-->
<!--      fontWeight: '500',-->
<!--      fontFamily: 'Outfit, sans-serif',-->
<!--      cursor: 'pointer',-->
<!--      outline: 'none',-->
<!--      letterSpacing: '0.01em',-->
<!--      transition: 'all 0.18s cubic-bezier(.34,1.56,.64,1)',-->
<!--      transform: pressed.value-->
<!--        ? 'scale(0.96) translateY(2px)'-->
<!--        : hovered.value ? 'translateY(-3px) scale(1.03)' : 'none',-->
<!--      boxShadow: hovered.value-->
<!--        ? `${c().glow}, 0 14px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)`-->
<!--        : `0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)`,-->
<!--      position: 'relative',-->
<!--      overflow: 'hidden',-->
<!--    })-->
<!--    return () => h('button', {-->
<!--      style: style(),-->
<!--      onMouseenter: () => hovered.value = true,-->
<!--      onMouseleave: () => { hovered.value = false; pressed.value = false },-->
<!--      onMousedown: () => pressed.value = true,-->
<!--      onMouseup: () => pressed.value = false,-->
<!--    }, [-->
<!--      props.icon && h('span', { style: 'font-size:17px;line-height:1' }, props.icon),-->
<!--      h('span', props.label),-->
<!--      /* shine overlay */-->
<!--      h('span', {-->
<!--        style: 'position:absolute;top:0;left:0;right:0;height:40%;background:linear-gradient(180deg,rgba(255,255,255,0.16) 0%,transparent 100%);border-radius:14px 14px 50% 50%;pointer-events:none'-->
<!--      }),-->
<!--    ])-->
<!--  }-->
<!--})-->

<!--/* ── Button3D ── */-->
<!--const themes3d = {-->
<!--  blue:   { top: '#5b9fff', mid: '#2b6fe8', bot: '#1a55cc', shadow: '#0d3a8f', glow: 'rgba(30,80,200,0.55)' },-->
<!--  green:  { top: '#4de89a', mid: '#18c065', bot: '#0da050', shadow: '#077038', glow: 'rgba(0,140,70,0.5)'  },-->
<!--  orange: { top: '#ffb347', mid: '#f07000', bot: '#d05e00', shadow: '#8a3800', glow: 'rgba(200,80,0,0.5)'  },-->
<!--  purple: { top: '#c084fc', mid: '#8b3cf7', bot: '#7020e0', shadow: '#430a96', glow: 'rgba(110,30,220,0.5)'},-->
<!--  rose:   { top: '#fb7185', mid: '#e11d48', bot: '#be123c', shadow: '#7f1d1d', glow: 'rgba(220,30,80,0.5)' },-->
<!--}-->

<!--/* ── Data ── */-->
<!--const glassButtons = [-->
<!--  { label: 'Ghost',    icon: '',   color: 'ghost'  },-->
<!--  { label: 'Blue',     icon: '✦',  color: 'blue'   },-->
<!--  { label: 'Purple',   icon: '✦',  color: 'purple' },-->
<!--  { label: 'Teal',     icon: '✦',  color: 'teal'   },-->
<!--  { label: 'Rose',     icon: '✦',  color: 'rose'   },-->
<!--  { label: 'Amber',    icon: '✦',  color: 'amber'  },-->
<!--]-->

<!--</script>-->

<!--<style scoped>-->
<!--@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');-->

<!--.section-label {-->
<!--  font-size: 11px;-->
<!--  font-weight: 600;-->
<!--  letter-spacing: 0.15em;-->
<!--  text-transform: uppercase;-->
<!--  color: rgba(255, 255, 255, 0.3);-->
<!--  margin-bottom: 1.2rem;-->
<!--  font-family: 'Outfit', sans-serif;-->
<!--}-->
<!--</style>-->

<template>
  <div class="justify-center items-center">
  <test />
  </div>
</template>