import type { Uml } from '~/api/models/Uml'
import type { CreateUmlDto } from '~/api/models/CreateUmlDto'
import type { UpdateUmlDto } from '~/api/models/UpdateUmlDto'
import { apiClient } from '~/composables/useRequest'

export const useUmlStore = defineStore('uml', () => {
  const umls = ref<Uml[]>([])
  const currentUml = ref<Uml | null>(null)
  const currentProjectId = ref<number | null>(null)
  const loading = ref(false)

  // 设置当前项目ID
  function setCurrentProjectId(projectId: number) {
    currentProjectId.value = projectId
  }

  // 获取项目的UML列表
  async function fetchUmls(projectId: number) {
    loading.value = true
    try {
      umls.value = await apiClient.uml.getUmlsForProject(projectId)
      // 更新当前项目ID
      setCurrentProjectId(projectId)
    } finally {
      loading.value = false
    }
  }

  // 获取单个UML图
  async function fetchUml(id: number) {
    loading.value = true
    try {
      currentUml.value = await apiClient.uml.getUmlById(id)
    } finally {
      loading.value = false
    }
  }

  // 创建UML
  async function createUml(data: CreateUmlDto) {
    loading.value = true
    try {
      await apiClient.uml.createUml(data)
      // 使用当前项目ID或传入的项目ID
      const projectId = currentProjectId.value || data.projectId
      if (projectId) {
        await fetchUmls(projectId)
      }
    } finally {
      loading.value = false
    }
  }

  // 更新UML
  async function updateUml(data: UpdateUmlDto) {
    loading.value = true
    try {
      await apiClient.uml.updateUml(data)
      // 使用当前项目ID刷新UML列表
      if (currentProjectId.value) {
        await fetchUmls(currentProjectId.value)
      }
    } finally {
      loading.value = false
    }
  }

  // 删除UML
  async function deleteUml(id: number) {
    loading.value = true
    try {
      await apiClient.uml.deleteUml(id)
      // 使用当前项目ID刷新UML列表
      if (currentProjectId.value) {
        await fetchUmls(currentProjectId.value)
      }
      if (currentUml.value && Number(currentUml.value.id) === id) {
        currentUml.value = null
      }
    } finally {
      loading.value = false
    }
  }

  return {
    umls,
    currentUml,
    currentProjectId,
    loading,
    setCurrentProjectId,
    fetchUmls,
    fetchUml,
    createUml,
    updateUml,
    deleteUml
  }
}) 