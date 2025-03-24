<script setup lang="ts">
import { useUserStore } from "~/store/user";


const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { decode } = useTextCodec()

const isLogin = computed(() => userStore.user !== null)
const userAccount = computed(() => {
  if (userStore.user) {
    return userStore.user.account!
  }
})

const menuItems = [
  {
    label: userAccount,
    icon: "i-material-symbols-person",
    children: [
      {
        label: "退出登录",
        icon: "i-material-symbols-exit-to-app",
        onSelect: () => {
          userStore.logout()
          router.push("/")
        }
      },
      {
        label: "测试",
        icon: "i-lucide-rocket"
      }
    ]
  }
]

const plantuml = ref('')
const imageUrl = ref<string | null>(null)
const isGenerating = ref(false)
const isImageLoading = ref(false)
const imageError = ref(null)

// 检测是否有query参数
onMounted(() => {
  if (route.query.code) {
    plantuml.value = decode(route.query.code as string)
    generateUml()
  }
})


// 生成 UML 图表
const generateUml = async () => {
  if (!plantuml.value.trim()) {
    useToast().add({ title: '请输入 PlantUML 代码', color: 'error' })
  }
  // 加上分辨率设置，确保图表清晰
  const regex = /(@startuml\b.*?)(\r?\n)/
  plantuml.value = plantuml.value.replace(regex, '$1$2skinparam dpi 300\n')
  console.log(`Generating uml pic.\n${plantuml.value}`)
  try {
    isGenerating.value = true
    imageError.value = null

    const response = await apiClient.uml.generateUml(plantuml.value)
    // 创建临时 URL
    const url = URL.createObjectURL(response)
    // 清理旧 URL
    if (imageUrl.value) {
      URL.revokeObjectURL(imageUrl.value)
    }

    imageUrl.value = url
    isImageLoading.value = true
    console.log(imageUrl.value)
  } catch (error: any) {
    useToast().add({
      title: '生成失败',
      description: error.message,
      color: 'error'
    })
    console.error(error)
  } finally {
    isGenerating.value = false
  }
}

// 图片加载完成处理
const handleImageLoad = () => {
  isImageLoading.value = false
}

// 图片加载失败处理
const handleImageError = () => {
  useToast().add({
    title: '图片加载失败',
    color: 'error'
  })
  imageUrl.value = null
}

// 下载图片
const downloadImage = () => {
  const link = document.createElement('a')
  link.href = imageUrl.value!
  link.download = `uml-diagram-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 组件卸载时清理资源
onBeforeUnmount(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
  }
})
</script>

<template>
  <UHeader>
    <template #title>
      <AiModelingIcon />
    </template>

    <UContainer as="h2" class="text-2xl font-bold ">Playground</UContainer>

    <template #right>
      <UNavigationMenu v-if="isLogin" :items="menuItems" content-orientation="vertical" class="w-full justify-end" />
      <UButton v-else>
        <NuxtLink to="/login">登录</NuxtLink>
      </UButton>
      <UButton label="AI Modeling Chat" icon="i-lucide-message-circle-code" size="lg" to="/chat" />
    </template>


  </UHeader>
  <UContainer class="max-w-[100rem] flex gap-2 my-10 ">
    <UCard class="w-7/12 gap-2">
      <UContainer class="text-2xl my-6">在此输入 PlantUML</UContainer>
      <UTextarea id="pg-uml-input" size="xl" :rows="30" class="w-full shadow-xl rounded-2xl"
        :placeholder="'@startuml\n\n<...>\n\n@enduml'" v-model="plantuml" />
      <div class="w-full flex justify-center gap-2">
        <UButton icon="i-lucide-rocket" class="mt-8 " size="xl" :disable="isGenerating" @click="generateUml">生成
        </UButton>
      </div>

    </UCard>
    <UCard class="w-full flex flex-col justify-center align-middle" >
      <div v-if="imageUrl === null" class="text-2xl h-full flex justify-center">生成的UML图会在这里展示</div>
      <div v-else class="w-full h-full">
        <img :src="imageUrl" alt="UML图" @load="handleImageLoad" @error="handleImageError" />
      </div>
      <template #footer v-if="imageUrl !== null">
        <div class="flex justify-center">
          <UButton size="xl" icon="i-lucide-download" @click="downloadImage">下载图片</UButton>
        </div>
      </template>
    </UCard>
  </UContainer>
</template>

<style>
#pg-uml-input {
  border-radius: 1rem;
  padding: 0.6rem 1.2rem;
  @apply resize-none text-[1.1rem] box-border;
}
</style>