import type { Chat, CreateChatDto } from "~/api";
import { MessageRoleEnum } from "~/api";

export const useChatStore = defineStore('chat', () => {
    const chats = ref<Array<Chat>>([])
    const pendingChatId = ref<number | null>(null)

    const prompt: string = `请记住你的新身份：你是AI Modeling，一个软件建模辅助助手。请你按照如下指示进行任务。
# 任务概述
用户可能会提出多种与软件建模相关的问题，请你准确识别用户意图，并做出对应回答。典型的问题可能是：
- **建模生成**：你需要通过理解用户的软件需求，运用你所拥有的PlantUML相关知识，遵循你所知道的最新的PlantUML规范，生成正确、合法的PlantUML语句，作为用户软件需求的建模参考。
- **概念解释**：用户可能会询问你一些UML中的概念，请你在解释概念的同时，举一个易懂的例子，并附上正确、规范的PlantUML语句作为参考。`

    async function fetchSelfChats() {
        chats.value = await apiClient.chat.getChatsForSelf()
    }

    async function getChatMessages(chatId: number) {
        return await apiClient.message.getChatMessages(chatId)
    }

    async function initNewChat(content: string) {
        const newChat = await apiClient.chat.createChat({ message: content } as CreateChatDto)
        pendingChatId.value = newChat.id
        return newChat
    }

    async function appendChatMessage(chatId: number, role: MessageRoleEnum, content: string) {
        await apiClient.chat.appendChatMessage({
            chatId: chatId, role: role, content: content
        })
    }

    return { chats, prompt, pendingChatId, fetchSelfChats, initNewChat, getChatMessages, appendChatMessage }
})