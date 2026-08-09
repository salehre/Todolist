<template>
  <div class="flex flex-col gap-3">
    <h2 v-if="title" class="text-lg font-bold text-slate-800">{{ title }}</h2>

    <template v-if="authState.isLoggedIn">
      <input
          type="text"
          placeholder="اسمت (اختیاری)"
          v-model="feedback.name"
          class="w-full rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      />
      <textarea
          rows="4"
          placeholder="برام بنویس"
          v-model="feedback.message"
          class="w-full resize-none rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      />
      <button
          type="button"
          @click="sendFeedback"
          :disabled="sending || !feedback.message.trim()"
          class="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary-500 to-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-200 transition-all hover:from-primary-600 hover:to-primary-700 hover:-translate-y-0.5"
          :class="{ 'cursor-not-allowed opacity-50 hover:translate-y-0': sending || !feedback.message.trim() }"
      >
        <Icon icon="mdi:send-outline" class="text-base"></Icon>
        {{ sending ? 'در حال ارسال...' : 'ارسال پیام' }}
      </button>
    </template>

    <div v-else class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
      <p class="text-sm text-slate-500">برای ارسال پیام اول باید وارد حسابت بشی.</p>
      <NuxtLink
          to="/auth/login"
          class="mt-3 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary-500 to-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-200 transition-all hover:from-primary-600 hover:to-primary-700"
      >
        <Icon icon="mdi:login" class="text-base" />
        ورود / ثبت‌نام
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { reactive, ref } from 'vue'
import api from '~/src/services/api'
import { toast } from 'vue-sonner'
import { useAuth } from '~/composables/useAuth'

withDefaults(defineProps<{ title?: string }>(), {
  title: 'ارتباط با من',
})

const { authState } = useAuth()

const feedback = reactive({ name: '', message: '' })
const sending = ref(false)

async function sendFeedback() {
  if (!feedback.message.trim()) return
  sending.value = true
  try {
    await api.post('/feedback', feedback)
    toast.success('پیامت ارسال شد')
    feedback.name = ''
    feedback.message = ''
  } catch (e: any) {
    if (e?.response?.status === 401) {
      toast.error('برای ارسال پیام باید ثبت نام کنی')
    } else {
      toast.error('ارسال پیام ناموفق بود')
    }
  } finally {
    sending.value = false
  }
}
</script>