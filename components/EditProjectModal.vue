<script setup lang="ts">
import { useProjectStore } from "~/store/project";
import type { UpdateProjectDto } from "~/api/models/UpdateProjectDto";
import type { Project } from "~/api/models/Project";

const props = defineProps<{
  project: Project
}>()

const projectStore = useProjectStore()

const open = ref(false)
const editProject = ref<UpdateProjectDto>({
  projectId: 0,
  name: '',
  description: ''
})

const openThisModal = () => {
  editProject.value = {
    projectId: props.project.id,
    name: props.project.name || '',
    description: props.project.description || ''
  }
  open.value = true
}

const closeThisModal = () => {
  open.value = false
}

const handleUpdateProject = async () => {
  await projectStore.updateProject(editProject.value)
  closeThisModal()
}

defineExpose({ openThisModal })
</script>

<template>
  <UModal v-model:open="open" title="编辑项目" :ui="{footer: 'justify-end'}">
    <template #body>
      <UContainer as="div" class="space-y-4">
        <UFormField label="项目名称" required>
          <UInput v-model="editProject.name" placeholder="请输入项目名称" />
        </UFormField>
        <UFormField label="项目描述">
          <UTextarea
            v-model="editProject.description"
            placeholder="请输入项目描述"
          />
        </UFormField>
      </UContainer>
    </template>
    <template #footer>
      <UButton label="取消" color="neutral" variant="outline" @click="closeThisModal" />
      <UButton label="保存" color="primary" @click="handleUpdateProject" />
    </template>
  </UModal>
</template>

<style scoped>
</style> 