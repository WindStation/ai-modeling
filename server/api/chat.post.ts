import OpenAI from "openai";
import { apiClient } from "~/composables/request"
import { MessageRoleEnum } from "~/api";
import axios from "axios";

export default defineEventHandler(async event => {

    const config = useRuntimeConfig()
    const { messages, chatId } = await readBody(event)

    const openai = new OpenAI({
        baseURL: "https://maas-cn-southwest-2.modelarts-maas.com/v1/infers/fd53915b-8935-48fe-be70-449d76c0fc87/v1",
        apiKey: config.dsApiKey.huawei
    })

    const stream = await openai.chat.completions.create({
        model: "DeepSeek-V3",
        messages: messages,
        stream: true,
        temperature: 0
    })

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
        async start(controller) {
            let text = ""
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || ""
                text += content
                controller.enqueue(encoder.encode(content))
            }
            controller.close()
            // 管理持久化
            // 这里是服务端，不能用客户端的apiClient，只能单独用axios发请求给SpringBoot后端
            await axios.put('http://localhost:8080/api/chat/append', {
                chatId: chatId, role: MessageRoleEnum.ASSISTANT, content: text
            }, {
                headers: {
                    'Authorization': event.headers.get('Authorization'),
                }
            })
        }
    })

    setResponseHeaders(event, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    })

    return sendStream(event, readableStream)
})