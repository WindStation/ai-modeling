<script setup lang="ts">
import { useChatStore } from "~/store/chat";

const props = defineProps<{
  chatId: number
}>()

const chatStore = useChatStore()
const router = useRouter()

const open = ref(false)

const openThisModal = () => {
  open.value = true
}

const closeThisModal = () => {
  open.value = false
}

const handleDeleteChat = async () => {
  await chatStore.deleteChat(props.chatId)  // 持久化
  chatStore.chats = chatStore.chats.filter(c => c.id !== props.chatId)  // 从页面上去除
  await router.push("/chat")
  closeThisModal()
}

defineExpose({openThisModal})
</script>

<template>
  <UModal v-model:open="open" title="删除聊天" :ui="{footer: 'justify-end'}">
    <template #body>
      <UContainer as="h2" class="text-xl">确认删除聊天？该操作不可恢复！</UContainer>
    </template>
    <template #footer>
      <UButton label="取消" color="neutral" variant="outline" @click="closeThisModal" />
      <UButton label="删除" color="error" @click="handleDeleteChat" />
    </template>
  </UModal>
</template>

<style scoped>

</style>