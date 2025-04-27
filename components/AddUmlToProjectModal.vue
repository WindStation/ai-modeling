<script setup lang="ts">
import { useProjectStore } from "~/store/project";
import { useUmlStore } from "~/store/uml";
import type { CreateUmlDto } from "~/api/models/CreateUmlDto";

const props = defineProps<{
    umlCode: string
}>()

const projectStore = useProjectStore()
const umlStore = useUmlStore()
const { decode } = useTextCodec()

const open = ref(false)
const selectedProjectId = ref<number | undefined>(undefined)
const newUml = ref<CreateUmlDto>({
    projectId: 0,
    title: '',
    umlCode: ''
})

const openThisModal = async () => {
    // 先获取项目列表
    await projectStore.fetchProjects()
    // 然后打开模态框
    open.value = true
    // 重置表单
    selectedProjectId.value = undefined
    newUml.value = {
        projectId: 0,
        title: '',
        umlCode: decode(props.umlCode)
    }
}

const closeThisModal = () => {
    open.value = false
}

const handleCreateUml = async () => {
    if (!selectedProjectId.value) {
        useToast().add({
            title: '请选择项目',
            description: '请选择一个项目来保存UML图',
            color: 'error'
        })
        return
    }

    if (!newUml.value.title) {
        useToast().add({
            title: '请输入标题',
            description: '请为UML图输入一个标题',
            color: 'error'
        })
        return
    }

    newUml.value.projectId = selectedProjectId.value
    await umlStore.createUml(newUml.value)
    closeThisModal()
}

defineExpose({ openThisModal })
</script>

<template>
    <UModal v-model:open="open" title="添加到项目" :ui="{ footer: 'justify-end' }">
        <template #body>
            <UContainer as="div" class="space-y-4">
                <UFormField label="选择项目" required>
                    <USelect v-model="selectedProjectId"
                        :items="projectStore.projects.map(p => ({ label: p.name, value: p.id }))" placeholder="请选择项目" />
                </UFormField>
                <UFormField label="UML标题" required>
                    <UInput v-model="newUml.title" placeholder="请输入UML标题" />
                </UFormField>
            </UContainer>
        </template>
        <template #footer>
            <UButton label="取消" color="neutral" variant="outline" @click="closeThisModal" />
            <UButton label="添加" color="primary" @click="handleCreateUml" />
        </template>
    </UModal>
</template>

<style scoped></style>