<template>
  <UHeader>
    <template #left>
      <AiModelingIcon />
    </template>

    <template #right>
      <UButton
          variant="outline"
          size="lg"
          label="登录"
          to="/login"
          class="hidden sm:inline-flex"
      />
      <UButton
          label="立即试用"
          size="lg"
          color="primary"
          to="/chat"
          icon="i-lucide-rocket"
      />
    </template>
  </UHeader>
</template>
<script setup lang="ts">
import AiModelingIcon from "~/components/AiModelingIcon.vue";
</script>