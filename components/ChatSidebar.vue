<template>
  <div class="p-4 space-y-2 flex flex-col  h-full">
    <div class="flex-1">
      <AiModelingIcon />

      <UButton label="新对话" icon="i-lucide-message-circle-code" class="w-full h-15 text-lg my-5" variant="soft"
        @click="newChat" />
      <EditChatTitleModal ref="editModal" :chat-id="targetChatId" :origin-title="targetChatTitle" />
      <DeleteChatModal ref="deleteModal" :chat-id="targetChatId" />

      <nav class="space-y-1 overflow-y-auto max-h-8/12">
        <NuxtLink v-for="chat in chatStore.chats" :key="chat.id" :to="`/chat/${chat.id}`"
          class="flex justify-between items-center rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          :class="{
            'bg-primary-50 dark:bg-primary-900': route.params.id === chat.id.toString()
          }">
          <div class="text-md font-medium truncate overflow-x-clip">{{ chat.title }}</div>
          <UPopover>
            <UButton size="sm" variant="ghost" color="neutral" icon="i-lucide-ellipsis-vertical" @click.prevent />
            <template #content>
              <UNavigationMenu class="p-2" orientation="vertical" :items="[
                {
                  label: '修改标题',
                  icon: 'i-lucide-pen-line',
                  onSelect: () => { handleOpenEditModal(chat.id, chat.title) }
                },
                {
                  label: '删除聊天',
                  icon: 'i-lucide-trash-2',
                  onSelect: () => { handleOpenDeleteModal(chat.id) }
                }
              ]" />
            </template>
          </UPopover>
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
        onSelect: () => {
          console.log("退出登录")
        }
      },
      {
        label: "我的项目",
        icon: "i-heroicons-cube",
        onSelect: () => {
          router.push("/project")
        }
      }
    ]
  }
]


const newChat = () => {
  router.push("/chat")
}

// 模态框相关
const targetChatId = ref(0)
const targetChatTitle = ref("")
const editModal = ref()
const deleteModal = ref()

const handleOpenEditModal = (chatId: number, title: string) => {
  targetChatId.value = chatId
  targetChatTitle.value = title
  editModal.value.openThisModal()
}

const handleOpenDeleteModal = (chatId: number) => {
  targetChatId.value = chatId
  deleteModal.value.openThisModal()
}

</script>