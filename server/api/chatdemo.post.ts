import { rand } from "@vueuse/shared";
import { apiClient } from "~/composables/useRequest";
import { MessageRoleEnum } from "~/api";
import axios from "axios";

export default defineEventHandler(async event => {
    const info = `
## 这是二级标题

### 这是三级标题

其他样式： **加粗** 、 *斜体* 、 ***加粗斜体***

链接：[GitHub](https://github.com)

图片：![GitHub 头像](https://avatars.githubusercontent.com/u/104140414?v=4)

**无序列表**

- 1
- 2
- 3

**有序列表**

1. Point 1
1. Point 2
1. Point 3


> Note

---
Line↑

单行代码块 \`javascript\`

多行代码块

\`\`\`java
class DemoCode {
    String a;
}
\`\`\`
    `
    const {messages, chatId} = await readBody(event)
    async function* data(chunkSize = 1) {
        let pointer = 0
        while (pointer < info.length) {
            const chunk = info.slice(pointer, pointer + chunkSize);
            pointer = pointer + chunkSize;

            yield new Promise<string>(resolve => setTimeout(() => resolve(chunk), rand(10, 50)));
        }
    }

    const splitDataGenerator = data()

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
        async start(controller) {
            let text = ""
            for await (const chunk of splitDataGenerator) {
                controller.enqueue(encoder.encode(chunk));
                text += chunk;
            }
            controller.close()
            // apiClient.chat.appendChatMessage({
            //     chatId: chatId,
            //     role: MessageRoleEnum.ASSISTANT,
            //     mdc: text
            // })
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
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })

    return sendStream(event, readableStream)
})