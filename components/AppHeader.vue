<template>
  <UHeader>
    <template #left>
      <AiModelingIcon />
    </template>
    <UContainer v-if="title" as="h2" class="text-2xl font-bold ">{{ title }}</UContainer>
    <template #right>
      <UserMenu v-if="userAccount" orientation="vertical" class="w-full justify-end" />
      <UButton v-else variant="outline" size="lg" label="登录" to="/login" class="hidden sm:inline-flex" />
      <div
        class="border-2 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 border-transparent bg-clip-border whitespace-nowrap">
        <UButton class="justify-center rounded-md bg-white px-4" color="neutral" variant="ghost" size="lg" to="/chat">
          <UIcon name="i-lucide-message-circle-code" class="mr-2" />
          <span>AI Modeling Chat</span>
        </UButton>
      </div>
    </template>
  </UHeader>
</template>
<script setup lang="ts">
// import AiModelingIcon from "~/components/AiModelingIcon.vue";
import { useUserStore } from "~/store/user";
const props = defineProps<{
  title?: string
}>()

const userStore = useUserStore()
const userAccount = computed(() => {
  if (userStore.user) {
    return userStore.user.account!
  }
})
</script>