<script setup lang="ts">
import ChatInputField from "~/components/ChatInputField.vue";
import { useChatStore } from "~/store/chat";
import { useUserStore } from "~/store/user";

definePageMeta({
  layout: 'chat'
})

const chatStore = useChatStore()
const router = useRouter()

async function createChat(text: string) {
  // 简单设置标题
  let title: string
  if (text.length <= 15) {
    title = text
  } else {
    title = text.slice(0, 15) + "..."
  }
  const chat = await chatStore.initNewChat(text, title)
  await router.push(`/chat/${chat.id}`)
}

</script>

<template>
  <UContainer class="p-6 justify-items-center align-middle">
    <UContainer as="h1" class="text-5xl font-bold w-fit my-48">
      欢迎使用AI Modeling Chat！
    </UContainer>

    <ChatInputField  @send="createChat" />

      <ul class="space-y-3 pl-5 text-xl my-6">
        <li class="flex items-center gap-2">
          <UIcon name="i-material-symbols-tips-and-updates-outline-rounded" class="text-emerald-600" size="25" />
          我要设计一个餐饮管理系统。请你帮我分析其中可能需要的类，并构建一个类图......
        </li>
        <li class="flex items-center gap-2">
          <UIcon name="i-material-symbols-tips-and-updates-outline-rounded" class="text-emerald-600" size="25" />
          现在这份 PlantUML 代码有报错。请你帮我更正一下......
        </li>
        <li class="flex items-center gap-2">
          <UIcon name="i-material-symbols-tips-and-updates-outline-rounded" class="text-emerald-600" size="25" />
          请你构建一个描绘前后端分离系统中，用户登录过程的时序图......
        </li>
      </ul>


  </UContainer>
</template>

<style scoped>

</style>