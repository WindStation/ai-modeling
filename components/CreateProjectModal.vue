<script setup lang="ts">
import { useProjectStore } from "~/store/project";
import type { CreateProjectDto } from "~/api/models/CreateProjectDto";

const projectStore = useProjectStore()
const router = useRouter()

const open = ref(false)
const newProject = ref<CreateProjectDto>({
  title: '',
  description: ''
})

const openThisModal = () => {
  open.value = true
}

const closeThisModal = () => {
  open.value = false
  // 重置表单
  newProject.value = {
    title: '',
    description: ''
  }
}

const handleCreateProject = async () => {
  await projectStore.createProject(newProject.value)
  closeThisModal()
}

defineExpose({ openThisModal })
</script>

<template>
  <UModal v-model:open="open" title="新建项目" :ui="{footer: 'justify-end'}">
    <template #body>
      <UContainer as="div" class="space-y-4">
        <UFormField label="项目名称" required>
          <UInput v-model="newProject.title" placeholder="请输入项目名称" />
        </UFormField>
        <UFormField label="项目描述">
          <UTextarea
            v-model="newProject.description"
            placeholder="请输入项目描述"
          />
        </UFormField>
      </UContainer>
    </template>
    <template #footer>
      <UButton label="取消" color="neutral" variant="outline" @click="closeThisModal" />
      <UButton label="创建" color="primary" @click="handleCreateProject" />
    </template>
  </UModal>
</template>

<style scoped>
</style> 