<script setup lang="ts">
import { MessageRoleEnum } from "~/api";

const info = `
## 这是二级标题

### 这是三级标题

- 1
- 2
- 3

1. Point 1
1. Point 2
1. Point 3


> Note

---
Line↑

单行代码块 \`javascript\`

\`\`\`Java
class DemoCode {
    String a;
}
\`\`\`
`

const chatStore = reactive({
  messages: [] as string[],
  streamingMsg: null as string | null,
})

const loading = ref(false)

let mockData = `## UML和MDC自定义组件测试
这是Java code
\`\`\`java
class DemoCode {
    String a;
}
\`\`\`

这是PlantUML code
\`\`\`plantuml
@startuml
Bob -> Alice : hello
@enduml
\`\`\`

`

const encode = (code: string) => {
  const encoder = new TextEncoder()
  return btoa(Array.from(encoder.encode(code), byte => String.fromCharCode(byte)).join(''))
}

const regex = /```plantuml\n([\s\S]*?)\n```/g
mockData = mockData.replace(regex, (match, code) => {
  return `::uml-code-display{code="${encode(code)}"}\n${match}\n::`
})

chatStore.messages.push(mockData)

const fetchStream = async () => {
  const response = await fetch('/api/chatdemo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  let streamMsg = ""
  chatStore.streamingMsg = streamMsg

  while (reader) {
    const { done, value } = await reader.read()
    if (done) {
      chatStore.messages.push(streamMsg)
      chatStore.streamingMsg = null
      break
    }
    const chunk = decoder.decode(value)
    streamMsg += chunk
    chatStore.streamingMsg = streamMsg

  }
  loading.value = false
}
</script>

<template>
  <UApp>
    <UCard class="mx-52 mt-6 p-6 flex flex-1 flex-col ">
      <UButton :on-click="fetchStream" class="w-28 h-16 my-5 justify-self-center justify-center" color="primary">
        开始生成</UButton>
      <!--    <UCard v-for="block in chatStore.messages" class="my-5 block w-4xl">-->
      <!--      <div class="mdc-container flex flex-col mx-6">-->
      <!--        <div class="prose">-->
      <!--          <MDC :value="block" />-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </UCard>-->

      <!--    <UCard v-if="chatStore.streamingMsg" class="my-5 block w-4xl">-->
      <!--      <div class="mdc-container flex flex-col mx-6">-->
      <!--        <div class="prose ">-->
      <!--          <MDC :value="chatStore.streamingMsg + ' ●'" />-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </UCard>-->
      <MessageArea v-for="block in chatStore.messages"
        :chat-message="{ role: MessageRoleEnum.ASSISTANT, content: block }" class="w-full" />
      <MessageArea v-if="chatStore.streamingMsg" loading
        :chat-message="{ role: MessageRoleEnum.ASSISTANT, content: chatStore.streamingMsg! }" />
      <MDC :value="mockData"></MDC>

    </UCard>
  </UApp>
</template>

<style scoped></style>