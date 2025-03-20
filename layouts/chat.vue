<script setup lang="ts">

</script>

<template>
  <div class="flex h-screen">
    <div class="w-80 border-none dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <ChatSidebar />
    </div>

    <main class="flex-1 overflow-auto">
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>

</style>