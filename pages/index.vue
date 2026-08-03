<template>
  <div
    class="min-h-screen bg-primary-50 font-sans p-6 md:p-12"
  >
    <div class="flex justify-center align-sub items-center h-screen">
      <button
        @click="router.push('/mainTodo')"
        class="rounded p-2 m-5 hover:cursor-pointer hover:bg-primary-700 hover:text-white bg-white text-primary-700 transition"
      >
        تودولیست
      </button>
      <button
        @click="router.push('/workPlan')"
        class="rounded p-2 m-5 hover:cursor-pointer hover:bg-primary-700 hover:text-white bg-white text-primary-700 transition"
      >
        کار تیمی
      </button>
      <button
        @click="router.push('/customTodo')"
        class="rounded p-2 m-5 hover:cursor-pointer hover:bg-primary-700 hover:text-white bg-white text-primary-700 transition"
      >
        تودولیست شخصی
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false });

useHead(() => ({
  titleTemplate: `%s - Home`
}))

const router = useRouter();
</script>