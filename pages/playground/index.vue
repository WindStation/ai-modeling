<script setup lang="ts">
import { useUserStore } from "~/store/user";

useHead({
  title: "UML Playground - AI Modeling"
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { decode } = useTextCodec()

const userAccount = computed(() => {
  if (userStore.user) {
    return userStore.user.account!
  }
})

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
    return
  }
  // 加上分辨率设置，确保图表清晰
  const regex = /(@startuml\b.*?)(\r?\n)/
  const targetPlantUml = plantuml.value.replace(regex, '$1$2skinparam dpi 300\n')
  try {
    isGenerating.value = true
    imageError.value = null

    const response = await apiClient.uml.generateUml(targetPlantUml)
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

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(plantuml.value)
    useToast().add({
      title: '复制成功',
      color: 'success'
    })
  } catch (err) {
    useToast().add({
      title: '复制失败',
      description: '请手动复制',
      color: 'error'
    })
  }
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
      <!--      <UNavigationMenu v-if="userStore.isLogin" :items="menuItems" content-orientation="vertical" class="w-full justify-end" />-->
      <UserMenu v-if="userAccount" orientation="vertical" class="w-full justify-end" />
      <UButton v-else size="lg">
        <NuxtLink to="/login">登录</NuxtLink>
      </UButton>
      <div
        class="border-2 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 border-transparent bg-clip-border whitespace-nowrap">
        <UButton class="justify-center rounded-md bg-white px-4" color="neutral" variant="ghost" size="lg" to="/chat">
          <UIcon name="i-lucide-message-circle-code" class="mr-2" />
          <span>AI Modeling Chat</span>
        </UButton>
      </div>
    </template>
  </UHeader>

  <UContainer class="max-w-[100rem] flex gap-2 my-10 ">
    <UCard class="w-7/12 gap-2">
      <div class="flex justify-between items-center px-5">
        <div class="text-2xl my-6">在此输入 PlantUML</div>
        <UButton size="lg" variant="solid" color="neutral" @click="copyToClipboard">复制</UButton>
      </div>

      <UTextarea id="pg-uml-input" size="xl" :rows="30" class="w-full shadow-xl rounded-2xl font-mono"
        :placeholder="'@startuml\n\n<...>\n\n@enduml'" v-model="plantuml" />
      <div class="w-full flex flex-col justify-center gap-2 px-4 space-y-5">
        <UButton icon="i-lucide-rocket" class="mt-8 flex flex-1 justify-center" size="xl" :disable="isGenerating"
          @click="generateUml">
          生成
        </UButton>
        <UDrawer direction="right">
          <UButton class="flex flex-1 justify-center" size="xl" color="neutral" variant="outline">
            遇到问题？问问 Modeling Chat!
          </UButton>
          <template #content>
            <EmbeddedChat :plantuml-code="plantuml" />
          </template>
        </UDrawer>

      </div>

    </UCard>
    <UCard class="w-full flex flex-col justify-center align-middle">
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