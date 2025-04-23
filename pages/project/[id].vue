<script setup lang="ts">
import type { Uml } from '~/api/models/Uml'
import type { CreateUmlDto } from '~/api/models/CreateUmlDto'
import type { UpdateUmlDto } from '~/api/models/UpdateUmlDto'
import { useProjectStore } from '~/store/project'
import { useUmlStore } from '~/store/uml'
import type { Project } from "~/api/models/Project"
import CreateUmlModal from "~/components/CreateUmlModal.vue"
import EditUmlModal from "~/components/EditUmlModal.vue"
import DeleteUmlModal from "~/components/DeleteUmlModal.vue"
import { useUmlGenerator } from '~/composables/useUmlGenerator'

useHead({
  title: "项目详情 - AI Modeling"
})

const route = useRoute()
const projectStore = useProjectStore()
const umlStore = useUmlStore()
const { generate: generateUml } = useUmlGenerator()

const project = ref<Project | null>(null)
const loading = ref(false)
const currentUml = ref<Uml | null>(null)
const umlImages = ref<Record<number, string>>({})

const createUmlModal = ref<InstanceType<typeof CreateUmlModal> | null>(null)
const editUmlModal = ref<InstanceType<typeof EditUmlModal> | null>(null)
const deleteUmlModal = ref<InstanceType<typeof DeleteUmlModal> | null>(null)

const fetchProjectAndUmls = async () => {
  loading.value = true
  try {
    const projectId = Number(route.params.id)
    if (isNaN(projectId)) {
      throw new Error('Invalid project ID')
    }
    await projectStore.fetchProject(projectId)
    await umlStore.fetchUmls(projectId)
    project.value = projectStore.currentProject
    
    // 为每个UML生成图片
    for (const uml of umlStore.umls) {
      if (uml.umlCode) {
        try {
          const imageUrl = await generateUml(uml.umlCode)
          umlImages.value[uml.id] = imageUrl
        } catch (error) {
          console.error(`生成UML图片失败 (ID: ${uml.id}):`, error)
        }
      }
    }
  } catch (error) {
    console.error('获取项目信息失败:', error)
  } finally {
    loading.value = false
  }
}

const openCreateUmlModal = () => {
  if (project.value) {
    createUmlModal.value?.openThisModal()
  }
}

const openEditUmlModal = (uml: Uml) => {
  currentUml.value = uml
  editUmlModal.value?.openThisModal()
}

const openDeleteUmlModal = (uml: Uml) => {
  currentUml.value = uml
  deleteUmlModal.value?.openThisModal()
}

const openUmlDetail = (uml: Uml) => {
  if (project.value) {
    console.log('Navigating to UML detail:', { projectId: project.value.id, umlId: uml.id })
    navigateTo(`/project/${project.value.id}/uml/${uml.id}`)
  }
}

// 在组件卸载时清理图片URL
onUnmounted(() => {
  Object.values(umlImages.value).forEach(url => {
    URL.revokeObjectURL(url)
  })
})

onMounted(() => {
  fetchProjectAndUmls()
})
</script>

<template>
  <NuxtPage />
  <AppHeader />
  <UContainer>
    <div class="py-8 space-y-6">
      <!-- 项目信息 -->
      <div v-if="loading" class="flex justify-center items-center h-64">
<!--        <ULoadingIcon />-->
      </div>

      <template v-else-if="project">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold">{{ project.name }}</h1>
          <UButton
            color="primary"
            icon="i-heroicons-plus"
            @click="openCreateUmlModal"
          >
            新建UML图
          </UButton>
        </div>
        <p class="text-gray-600 dark:text-gray-300">{{ project.description }}</p>
      </template>

      <!-- UML图列表 -->
      <div v-if="!loading && umlStore.umls.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard
          v-for="uml in umlStore.umls"
          :key="uml.id"
          class="hover:shadow-lg transition-shadow"
        >
          <template #header>
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-semibold">{{ uml.title }}</h3>
              <div class="flex space-x-2">
                <UButton
                  icon="i-heroicons-pencil"
                  color="neutral"
                  variant="ghost"
                  @click="openEditUmlModal(uml)"
                />
                <UButton
                  icon="i-heroicons-trash"
                  color="error"
                  variant="ghost"
                  @click="openDeleteUmlModal(uml)"
                />
              </div>
            </div>
          </template>

          <!-- UML预览 -->
          <div class="mt-4">
            <img
              v-if="umlImages[uml.id]"
              :src="umlImages[uml.id]"
              :alt="uml.title"
              class="w-full rounded-lg"
            />
            <div v-else class="flex justify-center items-center h-32 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p class="text-gray-500">加载中...</p>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton
                v-if="project"
                color="primary"
                variant="ghost"
                @click="openUmlDetail(uml)"
              >
                查看详情
              </UButton>
            </div>
          </template>
        </UCard>
      </div>

      <!-- 加载状态 -->
      <div v-else-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" />
      </div>

      <template v-else-if="!loading && umlStore.umls.length === 0">
        <div class="text-center py-12">
          <p class="text-gray-500">暂无UML，点击"新建UML"按钮创建一个。</p>
        </div>
      </template>

      <!-- 新建UML图模态框 -->
      <CreateUmlModal 
        v-if="project"
        ref="createUmlModal" 
        :project-id="project.id" 
        @uml-created="fetchProjectAndUmls" 
      />
      <EditUmlModal 
        v-if="currentUml"
        ref="editUmlModal" 
        :uml="currentUml"
        @uml-updated="fetchProjectAndUmls" 
      />
      <DeleteUmlModal 
        v-if="currentUml"
        ref="deleteUmlModal" 
        :uml="currentUml"
        @uml-deleted="fetchProjectAndUmls" 
      />
    </div>
  </UContainer>
</template> 