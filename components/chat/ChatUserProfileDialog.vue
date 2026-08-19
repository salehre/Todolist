<template>
  <Teleport to="body">
    <div v-if="profile" class="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" @click.self="emit('close')">
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        <div class="h-28 bg-linear-to-l from-primary-500 to-primary-400 relative">
          <img v-if="profile.coverUrl" :src="profile.coverUrl" class="w-full h-full object-cover" alt="" />
          <button @click="emit('close')" class="absolute top-3 inset-e-3 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50">
            <Icon icon="mingcute:close-line" class="text-lg" />
          </button>
        </div>
        <div class="flex flex-col items-center relative z-50 -mt-12 px-6 pb-6">
          <img v-if="profile.avatarUrl" :src="profile.avatarUrl" class="w-24 h-24 rounded-full object-cover border-2 border-white shadow-lg" alt="profile" />
          <div v-else class="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white shadow-lg" :class="colorFor(profile.id)">
            {{ profile.name[0] }}
          </div>
          <h3 class="mt-3 text-lg font-bold text-primary-900">{{ profile.name }}</h3>
          <p class="text-sm text-primary-400" dir="ltr">@{{ profile.username }}</p>
          <p v-if="profile.bio" class="mt-2 text-sm text-primary-600 text-center">{{ profile.bio }}</p>
          <div v-if="profile.social_links?.length" class="mt-4 flex items-center gap-2">
            <a v-for="link in profile.social_links" :key="link.platform + link.url" :href="link.url" target="_blank" rel="noopener" v-tooltip="link.url" class="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors">
              <Icon :icon="platformInfo(link.platform).icon" class="text-base" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { colorFor } from '~/utils/avatarColor'
import { platformInfo } from '~/utils/socialPlatforms'
import type { UserProfile } from '~/types/chatType'

defineProps<{ profile: UserProfile | null }>()
const emit = defineEmits<{ close: [] }>()
</script>