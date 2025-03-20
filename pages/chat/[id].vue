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
  if (currentChat) {
    currentChatMessages.value = await chatStore.getChatMessages(Number(chatId))
  } else {
    await router.push("/chat/error")
  }

  // 如果是刚创建的对话，立即调用一次大模型
  if (chatStore.pendingChatId !== null) {
    await chatCompletion()
  }
}

onMounted(() => checkAndFetchMessages())

// 发送一条消息时的行为
const sendQuestion = async (text: string) => {
  currentChatMessages.value.push({
    role: MessageRoleEnum.USER,
    content: text,
  })
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

const chatCompletion = async () => {
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
}

const mockData: Array<Partial<Message>> = [
  {
    role: MessageRoleEnum.USER,
    content: "你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！"
  },
  {
    role: MessageRoleEnum.ASSISTANT, content: `是的，我具备编写PlantUML代码的知识。以下基于一个**智能家居系统用户登录验证**的需求场景，设计两组PlantUML代码示例：

---

### 示例1：用户登录时序图（含异常处理）
\`\`\`plantuml
@startuml
title 用户登录时序图
autonumber
actor "用户" as User
participant "手机APP" as App
participant "网关" as Gateway
participant "身份服务" as AuthService

User -> App: 输入账号密码
activate App #LightBlue
App -> Gateway: 发送加密登录请求
activate Gateway

alt 网络正常
    Gateway -> AuthService: 验证凭证
    activate AuthService #Pink
    AuthService --> Gateway: 返回Token
    deactivate AuthService
    Gateway --> App: 转发Token
    App -> User: 显示主页
else 网络超时
    Gateway --> App: 返回错误代码408
    App -> User: 提示“网络连接失败”
end

deactivate Gateway
deactivate App
@enduml
\`\`\`
**设计说明**
• 使用\`alt/else\`实现网络异常的**分支逻辑**，通过\`autonumber\`自动生成步骤编号
• \`activate/deactivate\`标记组件的激活状态，配合颜色区分（#LightBlue、#Pink）
• 参与者层级包含用户终端（APP）、网关、微服务，体现物联网典型架构

---

### 示例2：设备控制活动图
\`\`\`plantuml
@startuml
title 语音控制灯光流程
start
partition 用户交互 {
    :用户说出“打开客厅灯”;
    if (语音识别成功?) then (是)
        :解析为设备指令;
    else (否)
        :播报“请重复指令”;
        stop
    endif
}

partition 业务逻辑 {
    :查询设备绑定关系;
    fork
        ->MQTT协议推送指令;
        :灯光控制器响应;
    fork again
        ->记录操作日志;
    end fork
}

:APP显示“操作成功”;
stop
@enduml
\`\`\`
**关键特性**
• 通过\`partition\`划分**用户交互**与**业务逻辑**两大模块
• \`fork\`实现**异步操作**（设备控制与日志记录并行）
• 包含语音识别失败的中断流程

---

### 扩展建议
若需绘制**类图**，可参考以下智能家居设备管理示例：
\`\`\`plantuml
@startuml
class SmartDevice {
  - deviceId: String
  - status: boolean
  + turnOn(): void
  + turnOff(): void
}

class Light <<设备>> {
  - brightness: int
  + setBrightness(int): void
}

class Gateway {
  - ipAddress: String
  + sendCommand(SmartDevice): void
}

SmartDevice <|-- Light
Gateway "1" *-- "n" SmartDevice : 管控
@enduml
\`\`\`
此代码通过\`<<设备>>\`定义原型标签，\`*--\`表示组合关系。

所有代码均可通过VSCode安装PlantUML插件实时渲染（需Java环境），或直接使用[在线编辑器](http://www.plantuml.com/plantuml/uml/)验证。
`
  }
]
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
    <MessageArea v-if="streamingMessage" :chat-message="{role: MessageRoleEnum.ASSISTANT, content: streamingMessage}"/>
    <ChatInputField class="fixed bottom-0 justify-items-center w-full
                           bg-gradient-to-t from-white via-white to-transparent"
                    @send="sendQuestion"
    />
  </UContainer>
  <UContainer>

  </UContainer>
</template>

<style scoped>

</style>