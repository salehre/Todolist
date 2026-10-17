<template>
  <div class="flex flex-col gap-3">
    <h2 v-if="feedbackTitle" class="text-lg font-bold text-slate-800">{{ feedbackTitle }}</h2>

    <template v-if="authState.isLoggedIn">
      <input
          type="text"
          :placeholder="$t('feedback.namePlaceholder')"
          v-model="feedback.name"
          class="w-full rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      />
      <textarea
          rows="4"
          :placeholder="$t('feedback.messagePlaceholder')"
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
        {{ sending ? $t('feedback.sending') : $t('feedback.send') }}
      </button>
    </template>

    <div v-else class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
      <p class="text-sm text-slate-500">{{ $t('feedback.loginRequired') }}</p>
      <NuxtLink
          to="/auth/login"
          class="mt-3 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary-500 to-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-200 transition-all hover:from-primary-600 hover:to-primary-700"
      >
        <Icon icon="mdi:login" class="text-base" />
        {{ $t('feedback.loginSignup') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, reactive, ref } from 'vue'
import api from '~/src/services/api'
import { toast } from 'vue-sonner'
import { useAuth } from '~/composables/useAuth'
import { useLocale } from '~/composables/useLocale'

const props = defineProps<{ title?: string }>()
const { t } = useLocale()
const feedbackTitle = computed(() => props.title === undefined ? t('feedback.title') : props.title)

const { authState } = useAuth()

const feedback = reactive({ name: '', message: '' })
const sending = ref(false)

async function sendFeedback() {
  if (!feedback.message.trim()) return
  sending.value = true
  try {
    await api.post('/feedback', feedback)
    toast.success(t('feedback.sent'))
    feedback.name = ''
    feedback.message = ''
  } catch (e: any) {
    if (e?.response?.status === 401) {
      toast.error(t('feedback.authRequired'))
    } else {
      toast.error(t('feedback.failed'))
    }
  } finally {
    sending.value = false
  }
}
</script>