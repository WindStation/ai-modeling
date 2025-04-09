import type { Chat, CreateChatDto } from "~/api";
import { MessageRoleEnum } from "~/api";

export const useChatStore = defineStore('chat', () => {
    const chats = ref<Array<Chat>>([])
    const pendingChatId = ref<number | null>(null)

    const prompt: string = `请记住你的新身份：你是AI Modeling，一个软件建模辅助助手。请你按照如下指示进行任务。
# 任务概述
用户可能会提出多种与软件建模相关的问题，请你准确识别用户意图，并做出对应回答。典型的问题可能是：
- **建模生成**：你需要通过理解用户的软件需求，运用你所拥有的PlantUML相关知识，遵循你所知道的最新的PlantUML规范，生成正确、合法的PlantUML语句，作为用户软件需求的建模参考。
- **概念解释**：用户可能会询问你一些UML中的概念，请你在解释概念的同时，举一个易懂的例子，并附上正确、规范的PlantUML语句作为参考。

# 任务要求
- 请按照PlantUML的语法规范，生成正确的PlantUML语句。
- 请使用最新的PlantUML规范。
- 请确保生成的PlantUML语句符合用户的需求。
- 请确保生成的PlantUML语句符合PlantUML的语法规范。`

    // 用于embedding chat的prompt
    const embedPrompt: string = `请记住你的新身份：你是AI Modeling，一个软件建模辅助助手。请你按照如下指示进行任务。
用户现在很有可能需要针对一个需求编写PlantUML代码，或者他们可能有一段遇到错误的PlantUML代码，需要你来修正。你的工作是帮助用户生成或修正PlantUML语句，作为用户软件需求的建模参考。
# 任务要求
- 请按照PlantUML的语法规范，生成正确的PlantUML语句。
- 请使用最新的PlantUML规范。
- 请确保生成的PlantUML语句符合用户的需求。
- 请确保生成的PlantUML语句符合PlantUML的语法规范。
`

    async function fetchSelfChats() {
        chats.value = await apiClient.chat.getChatsForSelf()
    }

    async function getChatMessages(chatId: number) {
        return await apiClient.message.getChatMessages(chatId)
    }

    async function initNewChat(content: string, title: string | undefined = undefined) {
        const newChat = await apiClient.chat.createChat({ message: content, title: title } as CreateChatDto)    // 持久化
        pendingChatId.value = newChat.id
        chats.value.unshift(newChat)    // store中也同步一下
        return newChat
    }

    async function appendChatMessage(chatId: number, role: MessageRoleEnum, content: string) {
        await apiClient.chat.appendChatMessage({
            chatId: chatId, role: role, content: content
        })
    }

    async function updateChatTitle(chatId: number, title: string) {
        await apiClient.chat.updateChat({
            chatId: chatId, title: title
        })
    }

    async function deleteChat(chatId: number) {
        await apiClient.chat.deleteChat({ chatId: chatId })
    }

    return { chats, prompt, embedPrompt, pendingChatId, fetchSelfChats, initNewChat, getChatMessages, appendChatMessage, updateChatTitle, deleteChat }
})