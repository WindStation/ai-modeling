<script setup lang="ts">
import type { Uml } from '~/api/models/Uml'
import type { UpdateUmlDto } from '~/api/models/UpdateUmlDto'
import { useUmlStore } from '~/store/uml'
import { useUmlGenerator } from '~/composables/useUmlGenerator'
import EditUmlModal from '~/components/EditUmlModal.vue'

useHead({
  title: "UML图详情 - AI Modeling"
})

const route = useRoute()
console.log('Route params:', route.params)

// 确保从路由参数中正确获取ID
const projectId = computed(() => Number(route.params.id))
const umlId = computed(() => Number(route.params.umlId))

// 监听路由参数变化
watch([projectId, umlId], ([newProjectId, newUmlId]) => {
  console.log('Route params changed:', { projectId: newProjectId, umlId: newUmlId })
  if (!isNaN(newProjectId) && !isNaN(newUmlId)) {
    fetchUml()
  }
}, { immediate: true })

const umlStore = useUmlStore()
const { generate: generateUml } = useUmlGenerator()
const uml = ref<Uml | null>(null)
const loading = ref(false)
const umlImage = ref<string | null>(null)
const editUmlModal = ref<InstanceType<typeof EditUmlModal> | null>(null)
const openEditModal = ref(false)

// 获取UML图详情
async function fetchUml() {
  if (isNaN(projectId.value) || isNaN(umlId.value)) {
    console.error('Invalid project or UML ID:', { projectId: projectId.value, umlId: umlId.value })
    return
  }

  loading.value = true
  try {
    console.log('Fetching UML:', { projectId: projectId.value, umlId: umlId.value })
    await umlStore.fetchUml(umlId.value)
    uml.value = umlStore.currentUml
    console.log('Fetched UML:', uml.value)

    // 生成UML图片
    if (uml.value?.umlCode) {
      try {
        const regex = /(@startuml\b.*?)(\r?\n)/
        const targetPlantUml = uml.value.umlCode.replace(regex, '$1$2skinparam dpi 150\n')
        umlImage.value = await generateUml(targetPlantUml)
        console.log('Generated UML image')
      } catch (error) {
        console.error('生成UML图片失败:', error)
      }
    }
  } catch (error) {
    console.error('获取UML详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 打开编辑模态框
function openEditUmlModal() {
  console.log(uml.value)
  if (uml.value) {
    openEditModal.value = true
  }
}

// 在组件卸载时清理图片URL
onUnmounted(() => {
  if (umlImage.value) {
    URL.revokeObjectURL(umlImage.value)
  }
})

onMounted(() => {
  console.log('Component mounted')
  // 设置当前项目ID
  umlStore.setCurrentProjectId(projectId.value)
  // 获取UML图详情
  fetchUml()
})
</script>

<template>
  <UContainer>
    <div class="py-8 space-y-6">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl" />
      </div>

      <!-- UML图信息 -->
      <div v-else-if="uml" class="space-y-4">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold">{{ uml.title }}</h1>
          <UButton color="primary" icon="i-heroicons-pencil" @click="openEditUmlModal">
            编辑
          </UButton>
        </div>
      </div>

      <!-- UML图编辑和预览 -->
      <div v-if="!loading && uml" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 代码编辑器 -->
        <UCard>
          <template #header>
            <h3 class="text-xl font-semibold">PlantUML代码</h3>
          </template>
          <UTextarea v-model="uml.umlCode" class="font-mono w-full" :rows="20" readonly />
        </UCard>

        <!-- 预览 -->
        <UCard>
          <template #header>
            <h3 class="text-xl font-semibold">预览</h3>
          </template>
          <img v-if="umlImage" :src="umlImage" :alt="uml.title" class="w-full rounded-lg" />
          <div v-else class="flex justify-center items-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl" />
          </div>
        </UCard>
      </div>

      <!-- 编辑模态框 -->
      <EditUmlModal v-if="uml" :open="openEditModal" ref="editUmlModal" :uml="uml" @uml-updated="fetchUml"
        @close="openEditModal = false" />
    </div>
  </UContainer>
</template>