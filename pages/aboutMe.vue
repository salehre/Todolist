<template>
  <div class="min-h-screen bg-base-100 text-base-content relative overflow-hidden">

    <!-- subtle editor-style dot grid -->
    <div
        class="pointer-events-none absolute inset-0 opacity-[0.05]"
        style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 24px 24px;"
    ></div>

    <!-- Container -->
    <div class="relative max-w-3xl mx-auto px-6 py-20 sm:py-28 space-y-24">

      <!-- 1. هدف پروژه -->
      <section class="reveal space-y-5">
        <p class="eyebrow text-primary/80">// درباره</p>
        <h1 class="font-display text-4xl sm:text-5xl font-black leading-tight">
          درباره پروژه
        </h1>
        <p class="text-lg leading-8 opacity-80 max-w-xl">
          این پروژه با هدف ساخت یک ابزار ساده، سریع و کاربردی برای کاربران ساخته شده.
          تمرکز اصلی روی تجربه کاربری خوب و حل یک نیاز واقعیه.
        </p>
        <p class="opacity-60 max-w-xl">
          هدف نهایی اینه که این پروژه به‌مرور تبدیل به یک ابزار کامل‌تر و حرفه‌ای‌تر بشه.
        </p>
      </section>

      <!-- 2. مهارت‌ها -->
      <section class="reveal space-y-8">
        <p class="eyebrow text-primary/80">// مهارت‌ها</p>
        <h2 class="font-display text-2xl sm:text-3xl font-bold">چی می‌سازم</h2>

        <div class="grid sm:grid-cols-3 gap-4">
          <div
              v-for="skill in skills"
              :key="skill.title"
              class="skill-card group p-6 rounded-2xl bg-base-200 border border-base-300/50 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
          >
            <div
                class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-content transition-colors duration-300"
                v-html="skill.icon"
            ></div>
            <h3 class="font-semibold mb-3">{{ skill.title }}</h3>
            <div class="flex flex-wrap gap-1.5">
              <span
                  v-for="tag in skill.tags"
                  :key="tag"
                  class="eyebrow-tag px-2 py-1 rounded-md bg-base-300/60 opacity-70"
              >{{ tag }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. لینک‌ها -->
      <section class="reveal space-y-6">
        <p class="eyebrow text-primary/80">// لینک‌ها</p>
        <h2 class="font-display text-2xl sm:text-3xl font-bold">جایی که می‌تونی پیدام کنی</h2>

        <div class="flex flex-wrap gap-3">
          <a
              v-for="link in links"
              :key="link.label"
              :href="link.href"
              target="_blank"
              rel="noopener"
              class="link-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-base-200 border border-base-300/50 hover:bg-base-300 hover:border-primary/40 transition-all duration-300"
          >
            <span class="w-4 h-4 shrink-0" v-html="link.icon"></span>
            <span class="font-medium">{{ link.label }}</span>
          </a>
        </div>
      </section>

      <!-- 4 + 5. حمایت از پروژه -->
      <section class="reveal">
        <div class="relative p-8 sm:p-10 rounded-3xl bg-base-200/60 border border-base-300/50 overflow-hidden">
          <div class="absolute -top-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>

          <div class="relative space-y-5">
            <p class="eyebrow text-primary/80">// حمایت</p>
            <h2 class="font-display text-2xl sm:text-3xl font-bold">حمایت از پروژه</h2>

            <p class="text-lg leading-8 opacity-80 max-w-xl">
              اگر این پروژه برات مفید بوده، می‌تونی با یه حمایت کوچیک کمک کنی که
              توسعه‌اش ادامه پیدا کنه و امکانات بیشتری بهش اضافه بشه.
            </p>

            <p class="opacity-60">
              حتی کوچیک‌ترین حمایت هم تاثیر زیادی داره ❤️
            </p>

            <a
                href="#"
                class="donate-btn inline-flex items-center gap-2 mt-2 px-8 py-3.5 rounded-2xl bg-primary text-primary-content font-semibold shadow-lg shadow-primary/20 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>☕</span>
              <span>حمایت مالی</span>
            </a>
          </div>
        </div>
      </section>

    </div>

    <!-- Floating Donate Button -->
    <a
        href="#"
        class="floating-btn fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-content shadow-lg hover:scale-105 transition-transform duration-300"
    >
      <span class="ring-pulse"></span>
      <span>❤️</span>
      <span class="font-medium">Donate</span>
    </a>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTheme } from '~/composables/useTheme'

const skills = [
  {
    title: 'Frontend',
    tags: ['Vue', 'Nuxt', 'Tailwind'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><polyline points="9 8 5 12 9 16"/><polyline points="15 8 19 12 15 16"/></svg>`,
  },
  {
    title: 'Backend',
    tags: ['Laravel', 'API Design'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><rect x="4" y="4" width="16" height="6" rx="1.5"/><rect x="4" y="14" width="16" height="6" rx="1.5"/><circle cx="8" cy="7" r="0.6" fill="currentColor" stroke="none"/><circle cx="8" cy="17" r="0.6" fill="currentColor" stroke="none"/></svg>`,
  },
  {
    title: 'Other',
    tags: ['UI/UX', 'AI Tools'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>`,
  },
]

const links = [
  {
    label: 'GitHub',
    href: '#',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="2.2"/><circle cx="17" cy="7" r="2.2"/><circle cx="12" cy="16" r="2.2"/><path d="M8.8 8.4 10.7 14M15.2 8.4 13.3 14"/></svg>`,
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="9" width="4" height="10" rx="0.5"/><circle cx="5.5" cy="5" r="1.6"/><path d="M11.5 19v-6.5c0-2 1.6-3 3.2-3s2.8 1 2.8 3V19"/><path d="M11.5 12.5V19"/></svg>`,
  },
]

onMounted(() => {
  const els = document.querySelectorAll('.reveal')
  const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
  )
  els.forEach((el) => io.observe(el))
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500&display=swap');

.font-display {
  font-family: 'Vazirmatn', sans-serif;
}

.eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.02em;
}

.eyebrow-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
}

/* scroll reveal */
.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* floating button pulse ring */
.floating-btn {
  position: fixed;
}
.ring-pulse {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 2px solid currentColor;
  opacity: 0.5;
  animation: pulse-ring 2.4s ease-out infinite;
}
@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .ring-pulse {
    animation: none;
    display: none;
  }
  .skill-card,
  .link-btn,
  .donate-btn,
  .floating-btn {
    transition: none !important;
  }
}
</style>