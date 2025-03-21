<script setup lang="ts">
import { useChatStore } from "~/store/chat";

const props = defineProps<{
  originTitle: string,
  chatId: number
}>()
const chatStore = useChatStore()

const open = ref(false)
const newTitle = ref("")

const openThisModal = () => {
  // console.log("Edit modal open.")
  open.value = true
}

const closeThisModal = () => {
  open.value = false
}

const handleSubmitChange = async () => {
  await chatStore.updateChatTitle(props.chatId, newTitle.value) // 持久化
  // 储存中也同步修改一下，就不重新fetch数据了，节省资源
  const index = chatStore.chats.findIndex(c => c.id === props.chatId)
  chatStore.chats.splice(index, 1, {...chatStore.chats[index], title: newTitle.value})
  closeThisModal()
}

defineExpose({openThisModal})
</script>

<template>
  <UModal v-model:open="open" title="编辑聊天标题" :ui="{footer: 'justify-end'}">
    <template #body>
      <UContainer as="div">
        <UFormField label="输入新标题" required>
          <UInput :placeholder="originTitle" v-model="newTitle" color="neutral" />
        </UFormField>
      </UContainer>
    </template>
    <template #footer>
      <UButton label="取消" color="neutral" variant="outline" @click="closeThisModal" />
      <UButton label="确认" color="neutral" @click="handleSubmitChange" />
    </template>
  </UModal>
</template>

<style scoped>

</style>