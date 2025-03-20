<script setup lang="ts">
import { type Message, MessageRoleEnum } from "~/api";

const props = defineProps<{
  chatMessage: Partial<Message>,
  loading?: boolean
}>()
</script>

<template>
  <UContainer class="flex items-start justify-center">
    <div>
      <UAvatar v-if="chatMessage.role === MessageRoleEnum.ASSISTANT" icon="i-lucide-codesandbox" size="xl"></UAvatar>
    </div>

    <div v-if="chatMessage.role === MessageRoleEnum.USER" class="w-full flex justify-end max-w-[60rem]" >
    <!--   模拟一个自定义padding的UCard   -->
      <div
           class="ring ring-(--ui-border) divide-y divide-(--ui-border) bg-gray-100
          max-w-3xl rounded-[1.5rem] px-3 py-2">
        {{ chatMessage.content }}
      </div>
    </div>


    <UCard v-if="chatMessage.role === MessageRoleEnum.ASSISTANT"
           class="border-none w-full max-w-4xl ml-5"
    >
      <MDC v-if="loading" class="w-full max-w-5xl p-4" :value="chatMessage.content! + ' ●'" />
      <MDC v-else class=" w-full max-w-5xl p-4" :value="chatMessage.content!"/>

    </UCard>

  </UContainer>
</template>

<style scoped>

</style>