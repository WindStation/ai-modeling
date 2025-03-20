<script setup lang="ts">
const mainScrollContainer = ref<HTMLElement | null>(null)
provide('mainScrollContainer', mainScrollContainer)
</script>

<template>
  <div class="flex h-screen">
    <div class="w-80 border-none dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <ChatSidebar />
    </div>

    <main ref="mainScrollContainer" class="flex-1 overflow-auto">
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>

</style>