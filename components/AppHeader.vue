<template>
  <UHeader>
    <template #left>
      <AiModelingIcon />
    </template>

    <template #right>
      <UserMenu v-if="userAccount" orientation="vertical" class="w-full justify-end" />
      <UButton
          v-else
          variant="outline"
          size="lg"
          label="登录"
          to="/login"
          class="hidden sm:inline-flex"
      />
      <UButton
          label="AI Modeling Chat"
          size="lg"
          color="primary"
          to="/chat"
          icon="i-lucide-rocket"
      />
    </template>
  </UHeader>
</template>
<script setup lang="ts">
// import AiModelingIcon from "~/components/AiModelingIcon.vue";
import { useUserStore } from "~/store/user";

const userStore = useUserStore()
const userAccount = computed(() => {
  if (userStore.user) {
    return userStore.user.account!
  }
})
</script>