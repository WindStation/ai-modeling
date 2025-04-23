<script setup lang="ts">
import { useUmlStore } from "~/store/uml";
import type { Uml } from "~/api/models/Uml";

const props = defineProps<{
  uml: Uml
}>()

const umlStore = useUmlStore()

const open = ref(false)

const openThisModal = () => {
  open.value = true
}

const closeThisModal = () => {
  open.value = false
}

const handleDeleteUml = async () => {
  await umlStore.deleteUml(props.uml.id)
  closeThisModal()
}

defineExpose({ openThisModal })
</script>

<template>
  <UModal v-model:open="open" title="删除UML" :ui="{footer: 'justify-end'}">
    <template #body>
      <UContainer as="div" class="space-y-4">
        <p>确定要删除UML "{{ uml.title }}" 吗？此操作不可恢复。</p>
      </UContainer>
    </template>
    <template #footer>
      <UButton label="取消" color="neutral" variant="outline" @click="closeThisModal" />
      <UButton label="删除" color="error" @click="handleDeleteUml" />
    </template>
  </UModal>
</template>

<style scoped>
</style> 