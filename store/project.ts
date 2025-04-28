import type { Project } from '~/api/models/Project'
import type { CreateProjectDto } from '~/api/models/CreateProjectDto'
import type { UpdateProjectDto } from '~/api/models/UpdateProjectDto'
import { apiClient } from '~/composables/useRequest'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const loading = ref(false)

  // 获取项目列表
  async function fetchProjects() {
    loading.value = true
    try {
      projects.value = await apiClient.project.getSelfProjects()
    } finally {
      loading.value = false
    }
  }

  // 获取项目详情
  async function fetchProject(id: number) {
    loading.value = true
    try {
      currentProject.value = await apiClient.project.getProject(id)
    } finally {
      loading.value = false
    }
  }

  // 创建项目
  async function createProject(data: CreateProjectDto) {
    loading.value = true
    let project = undefined
    try {
      project = await apiClient.project.createProjectForSelf(data)
      await fetchProjects()
    } finally {
      loading.value = false
    }
    return project
  }

  // 更新项目
  async function updateProject(data: UpdateProjectDto) {
    loading.value = true
    try {
      await apiClient.project.updateProject(data)
      await fetchProjects()
    } finally {
      loading.value = false
    }
  }

  // 删除项目
  async function deleteProject(id: number) {
    loading.value = true
    try {
      await apiClient.project.deleteProject(id)
      await fetchProjects()
      if (currentProject.value?.id === id) {
        currentProject.value = null
      }
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    currentProject,
    loading,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject
  }
}) 