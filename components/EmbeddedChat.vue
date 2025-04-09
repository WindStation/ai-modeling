<script setup lang="ts">
import { type Message, MessageRoleEnum } from "~/api";
import { useChatStore } from "~/store/chat";

const props = defineProps<{
    plantumlCode?: string
}>()

// const emit = defineEmits<{
//     'update:isOpen': [value: boolean]
// }>()
const chatStore = useChatStore()
const messages = ref<Partial<Message>[]>([])
const streamingMessage = ref<string | null>(null)
const loadingCompletion = ref(false)

// 用于页面滚动的方法和属性
const chatContainer = ref<HTMLElement | null>(null)
const scrollPosition = ref(0)

const updateScrollPosition = () => {
    if (chatContainer.value) {
        scrollPosition.value = chatContainer.value.scrollTop
    }
}

const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatContainer.value) {
        chatContainer.value.scrollTo({
            top: chatContainer.value.scrollHeight,
            behavior
        })
    }
}

// 是否展示"回到底部"按钮
const displayToBottom = computed(() => {
    if (chatContainer.value) {
        return Math.abs(scrollPosition.value + chatContainer.value.clientHeight - chatContainer.value.scrollHeight) > 200
    }
    return false
})

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
    const queryMessages = []
    // prompt
    queryMessages.push({
        role: "system",
        content: chatStore.embedPrompt
    })
    // history messages
    queryMessages.push(...messages.value.map(m => ({
        role: mapRole(m.role!),
        content: m.content!
    })))
    return queryMessages
}

const chatCompletion = async () => {
    const queryMessages = _buildQueryMessages()
    loadingCompletion.value = true

    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            messages: queryMessages
        })
    })

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    let completion = ""
    streamingMessage.value = completion

    while (reader) {
        const { done, value } = await reader.read()
        if (done) {
            messages.value.push({
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
}

// 发送一条消息时的行为
const sendQuestion = async (text: string) => {
    messages.value.push({
        role: MessageRoleEnum.USER,
        content: text,
    })
    scrollToBottom()
    await chatCompletion()
}

onMounted(() => {
    chatContainer.value?.addEventListener("scroll", updateScrollPosition)

    if (props.plantumlCode?.trim()) {
        messages.value.push({
            role: MessageRoleEnum.ASSISTANT,
            content: `我已经看到了您当前的 PlantUML 代码。您可以直接告诉我需要如何修改或改进这段代码。\n\n当前代码：\n\`\`\`plantuml\n${props.plantumlCode}\n\`\`\``
        })
    }
})

watch(streamingMessage, () => {
    if (chatContainer.value && Math.abs(scrollPosition.value + chatContainer.value.clientHeight - chatContainer.value.scrollHeight) <= 100) {
        scrollToBottom("instant")
    }
})

watch(messages, () => scrollToBottom())
</script>

<template>
    <div class="fixed right-0 top-0 h-full w-180 bg-white shadow-lg z-50 flex flex-col">
        <div ref="chatContainer" class="flex-1 overflow-y-auto p-4">
            <MessageArea v-for="message in messages" :chat-message="message" class="my-4" />
            <MessageArea v-if="streamingMessage"
                :chat-message="{ role: MessageRoleEnum.ASSISTANT, content: streamingMessage }" loading class="my-4" />
            <UContainer v-if="displayToBottom" class="fixed bottom-56 w-full h-fit flex justify-center"
                @click="() => scrollToBottom('smooth')">
                <UAvatar as="div" icon="i-lucide-arrow-down" size="2xl" class="shadow-xl" />
            </UContainer>
        </div>

        <div class="p-4 border-t bg-gradient-to-t from-white via-white to-transparent">
            <ChatInputField @send="sendQuestion" />
        </div>
    </div>
</template>
