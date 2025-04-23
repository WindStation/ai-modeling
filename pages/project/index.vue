<script setup lang="ts">
import type { Project } from '~/api/models/Project'
import type { CreateProjectDto } from '~/api/models/CreateProjectDto'
import type { UpdateProjectDto } from '~/api/models/UpdateProjectDto'
import { useProjectStore } from '~/store/project'
import CreateProjectModal from '~/components/CreateProjectModal.vue'
import EditProjectModal from '~/components/EditProjectModal.vue'
import { useRouter } from 'vue-router'

useHead({
  title: "项目管理 - AI Modeling"
})

const projectStore = useProjectStore()
const router = useRouter()
const currentProject = ref<Project | null>(null)

const createProjectModal = ref<InstanceType<typeof CreateProjectModal> | null>(null)
const editProjectModal = ref<InstanceType<typeof EditProjectModal> | null>(null)

const fetchProjects = async () => {
  try {
    await projectStore.fetchProjects()
  } catch (error) {
    console.error('获取项目列表失败:', error)
  }
}

const openCreateProjectModal = () => {
  createProjectModal.value?.openThisModal()
}

const openEditProjectModal = (project: Project) => {
  currentProject.value = project
  editProjectModal.value?.openThisModal()
}

const handleProjectClick = (project: Project) => {
  router.push(`/project/${project.id}`)
}

const handleProjectDelete = async (project: Project) => {
  if (confirm(`确定要删除项目 "${project.name}" 吗？此操作不可恢复。`)) {
    try {
      await projectStore.deleteProject(project.id)
      await fetchProjects()
    } catch (error) {
      console.error('删除项目失败:', error)
    }
  }
}

onMounted(() => {
  fetchProjects()
})
</script>

<template>
  <AppHeader />
  <UContainer>
    <div class="py-8 space-y-6">
      <!-- 页面标题和新建按钮 -->
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold">我的项目</h1>
        <UButton
          color="primary"
          icon="i-heroicons-plus"
          @click="openCreateProjectModal"
        >
          新建项目
        </UButton>
      </div>

      <!-- 项目列表 -->
      <div v-if="!projectStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard
          v-for="project in projectStore.projects"
          :key="project.id"
          class="hover:shadow-lg transition-shadow"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-semibold">{{ project.name }}</h3>
              <UDropdownMenu
                :items="[
                  {
                    label: '编辑',
                    icon: 'i-heroicons-pencil',
                    click: () => openEditProjectModal(project)
                  },
                  {
                    label: '删除',
                    icon: 'i-heroicons-trash',
                    click: () => handleProjectDelete(project)
                  }
                ]"
              >
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-ellipsis-horizontal"
                />
              </UDropdownMenu>
            </div>
          </template>

          <p class="text-gray-600 dark:text-gray-300">{{ project.description }}</p>

          <template #footer>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">
                0 个UML图
              </span>
              <UButton
                color="primary"
                variant="ghost"
                :to="`/project/${project.id}`"
              >
                查看详情
              </UButton>
            </div>
          </template>
        </UCard>
      </div>

      <!-- 加载状态 -->
      <div v-else class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" />
      </div>

      <!-- 新建项目模态框 -->
      <CreateProjectModal ref="createProjectModal" @project-created="fetchProjects" />

      <!-- 编辑项目模态框 -->
      <EditProjectModal 
        v-if="currentProject"
        ref="editProjectModal" 
        :project="currentProject"
        @project-updated="fetchProjects" 
      />
    </div>
  </UContainer>
</template>
