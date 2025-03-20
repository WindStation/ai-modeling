<script setup lang="ts">
import { useChatStore } from "~/store/chat";
import { type Message, MessageRoleEnum } from "~/api";

definePageMeta({
  layout: 'chat'
})

const route = useRoute()
const router = useRouter()
const chatId = route.params.id

const chatStore = useChatStore()
const { chats } = useChatStore()
const currentChat = computed(() => chats.find(c => c.id.toString() === chatId)) // 用于检查chat id是否确实是当前用户的chat
const currentChatMessages = ref<Partial<Message>[]>([])
const streamingMessage = ref<string | null>(null)

const checkAndFetchMessages = async () => {
  await nextTick()
  if (currentChat) {
    currentChatMessages.value = await chatStore.getChatMessages(Number(chatId))
  } else {
    await router.push("/chat/error")
  }

  // 如果是刚创建的对话，立即调用一次大模型
  if (chatStore.pendingChatId !== null) {
    await chatStore.fetchSelfChats()
    await chatCompletion(true)
  }

}

onMounted(() => {
  mainScrollContainer.value?.addEventListener("scroll", updateScrollPosition) // 页面滚动监听，记录位置
  checkAndFetchMessages()
  setTimeout(() => scrollToBottom(), 1000)
})

// 用于页面滚动的方法和属性
const mainScrollContainer = inject("mainScrollContainer") as Ref<HTMLElement | null>
const { scrollPosition, updateScrollPosition, scrollToBottom } = useChatScroll(mainScrollContainer)
watch(streamingMessage, () => {
  if (Math.abs(scrollPosition.value + window.innerHeight - mainScrollContainer.value!.scrollHeight) <= 100) {
    scrollToBottom("instant")
  }
})
watch(currentChatMessages, () => scrollToBottom())
// 是否展示“回到底部”按钮
const displayToBottom = computed(() => {
  if (mainScrollContainer.value) {
    return Math.abs(scrollPosition.value + window.innerHeight - mainScrollContainer.value.scrollHeight) > 200
  } else {
    return false
  }
})

// 发送一条消息时的行为
const sendQuestion = async (text: string) => {
  currentChatMessages.value.push({
    role: MessageRoleEnum.USER,
    content: text,
  })
  scrollToBottom()
  // 持久化
  await chatStore.appendChatMessage(Number(chatId), MessageRoleEnum.USER, text)

  // 然后调用模型生成回复
  await chatCompletion()
}

// 标识当前大模型是否正在回复
const loadingCompletion = ref(false)

const mapRole = (role: MessageRoleEnum) => {
  switch (role) {
    case MessageRoleEnum.ASSISTANT:
      return "assistant"
    case MessageRoleEnum.USER:
      return "user"
  }
}

// 发送一条消息时，构建用于query大模型的历史对话记录
const _buildQueryMessages = () => {
  const messages = []
  // prompt
  messages.push({
    role: "system",
    content: chatStore.prompt
  })
  // history messages and current message
  messages.push(currentChatMessages.value.map(m => {
    return {
      role: mapRole(m.role!),
      content: m.content!
    }
  }))
  // // current question
  // messages.push({
  //   role: "user",
  //   content: question
  // })
  console.log(messages) // debug
  return messages
}

const chatCompletion = async (isFirst: boolean | undefined = false) => {
  const messages = _buildQueryMessages()
  loadingCompletion.value = true

  const response = await fetch('/api/chatdemo', { // TODO debug
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({
      chatId: Number(chatId),
      messages: messages
    })
  })
  chatStore.pendingChatId = null  // 如果是第一条对话，还要标识当前对话已经被处理
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  let completion = ""
  streamingMessage.value = completion

  while (reader) {
    const { done, value } = await reader.read()
    if (done) {
      // 整条消息读取完毕，修改store。持久化由server api管理
      currentChatMessages.value.push({
        role: MessageRoleEnum.ASSISTANT,
        content: completion
      })
      streamingMessage.value = null
      break
    }
    const chunk = decoder.decode(value)
    completion += chunk
    streamingMessage.value = completion
  }
  loadingCompletion.value = false
  if (isFirst) {
    await nextTick(() => scrollToBottom("instant"))
    // TODO 生成一次标题并持久化
  }

}

</script>

<template>
  <!--  <div>-->
  <!--    <UContainer as="h2" class="text-lg">-->
  <!--      {{ chat!.id }}-->
  <!--    </UContainer>-->
  <!--    <UContainer as="p" class="text-lg">-->
  <!--      {{ chat!.title }}-->
  <!--    </UContainer>-->
  <!--  </div>-->
  <UContainer class="pb-40">
    <MessageArea v-for="message in currentChatMessages" :chat-message="message" class="my-8"/>
    <MessageArea v-if="streamingMessage" :chat-message="{role: MessageRoleEnum.ASSISTANT, content: streamingMessage}"
                 class="my-8"/>
    <UContainer v-if="displayToBottom" class="fixed bottom-56 w-full h-fit flex justify-center">
      <UAvatar as="div" icon="i-lucide-arrow-down" size="2xl" class="shadow-xl"
               @click="() => scrollToBottom('smooth')"/>
    </UContainer>
    <ChatInputField class="fixed bottom-0 justify-items-center w-full
                           bg-gradient-to-t from-white via-white to-transparent"
                    @send="sendQuestion"
    />
  </UContainer>
  <UContainer>

  </UContainer>
</template>
