<template>
  <div class="flex h-screen w-screen gap-3 overflow-hidden bg-primary-50 p-3">
    <DashboardSidebar />
    <div class="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden">
      <DashboardHeader />
      <main class="min-w-0 flex-1 overflow-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue'
</script>