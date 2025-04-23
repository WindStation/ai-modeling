<script setup lang="ts">
import type { Project } from "~/api/models/Project"
import { useProjectStore } from '~/store/project'

useHead({
  title: "项目详情 - AI Modeling"
})

const route = useRoute()
const projectStore = useProjectStore()
const project = ref<Project | null>(null)
const loading = ref(false)

const fetchProject = async () => {
  loading.value = true
  try {
    const projectId = Number(route.params.id)
    if (isNaN(projectId)) {
      throw new Error('Invalid project ID')
    }
    await projectStore.fetchProject(projectId)
    project.value = projectStore.currentProject
  } catch (error) {
    console.error('获取项目信息失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProject()
})
</script>

<template>
  <AppHeader />
  <UContainer>
    <div class="py-8 space-y-6">
      <!-- 项目信息 -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl" />
      </div>

      <template v-else-if="project">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold">{{ project.name }}</h1>
        </div>
        <p class="text-gray-600 dark:text-gray-300">{{ project.description }}</p>
      </template>

      <!-- 子路由内容 -->
      <NuxtPage />
    </div>
  </UContainer>
</template>