<template>
  <div class="p-4 space-y-2 flex flex-col  h-full">
    <div class="flex-1">
      <AiModelingIcon />

      <UButton
          label="新对话"
          icon="i-lucide-message-circle-code"
          class="w-full h-15 text-lg my-5"
          variant="soft"
          @click="newChat"
      />


      <nav class="space-y-1 overflow-y-auto max-h-8/12">
        <NuxtLink
            v-for="chat in chatStore.chats"
            :key="chat.id"
            :to="`/chat/${chat.id}`"
            class="block rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :class="{
          'bg-primary-50 dark:bg-primary-900': route.params.id === chat.id.toString()
        }"
        >
          <div class="text-md font-medium truncate">{{ chat.title }}</div>
        </NuxtLink>
      </nav>
    </div>
    <div>
      <UNavigationMenu :items="menuItems" orientation="vertical" color="primary"></UNavigationMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "~/store/chat";
import { useUserStore } from "~/store/user";

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const userStore = useUserStore()

const fetchData = async () => {
  await userStore.info()
  await chatStore.fetchSelfChats()
}

onMounted(() => fetchData())

const menuItems = [
  {
    label: "在线编辑器",
    icon: "i-material-symbols-rocket-launch-outline-rounded",
    to: "/playground",
  },
  {
    label: "用户",
    icon: "i-material-symbols-person",
    children: [
      {
        label: "退出登录",
        icon: "i-material-symbols-exit-to-app",
        onSelect: () => {console.log("退出登录")}
      }
    ]
  }
]

const newChat = () => {
  router.push("/chat")
}

// const createNewChat = () => {
//   const tempId = `temp_${crypto.randomUUID()}`
//   appendChat({ id: tempId, title: `Chat ${tempId}` })
//   router.push(`/chat/${tempId}`)
// }

</script>