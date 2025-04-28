<script setup lang="ts">
import { useUmlStore } from "~/store/uml";
import type { CreateUmlDto } from "~/api/models/CreateUmlDto";

const props = defineProps<{
  projectId: number
}>()

const emit = defineEmits(['uml-created'])

const umlStore = useUmlStore()

const open = ref(false)
const newUml = ref<CreateUmlDto>({
  projectId: 0,
  title: '',
  umlCode: ''
})

const openThisModal = () => {
  newUml.value = {
    projectId: props.projectId,
    title: '',
    umlCode: ''
  }
  open.value = true
}

const closeThisModal = () => {
  open.value = false
}

const handleCreateUml = async () => {
  await umlStore.createUml(newUml.value)
  emit('uml-created')
  closeThisModal()
}

defineExpose({ openThisModal })
</script>

<template>
  <UModal v-model:open="open" title="创建UML" :ui="{ footer: 'justify-end' }">
    <template #body>
      <UContainer as="div" class="space-y-4">
        <UFormField label="UML名称" required>
          <UInput v-model="newUml.title" placeholder="请输入UML名称" />
        </UFormField>
        <UFormField label="UML代码">
          <UTextarea v-model="newUml.umlCode" placeholder="请输入UML代码" :rows="10" />
        </UFormField>
      </UContainer>
    </template>
    <template #footer>
      <UButton label="取消" color="neutral" variant="outline" @click="closeThisModal" />
      <UButton label="创建" color="primary" @click="handleCreateUml" />
    </template>
  </UModal>
</template>

<style scoped></style>