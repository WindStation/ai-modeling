<script setup lang="ts">
import { useProjectStore } from '~/store/project'
import AddToProjectModal from '~/components/AddUmlToProjectModal.vue'

const props = defineProps<{
  code: string
}>()

const { generate } = useUmlGenerator()
const { decode } = useTextCodec()
const router = useRouter()

const imageUrl = ref<string | undefined>(undefined)
const addToProjectModal = ref<InstanceType<typeof AddToProjectModal> | null>(null)

const handleUmlGenerate = async () => {
  const plantuml = decode(props.code)
  try {
    imageUrl.value = await generate(plantuml)
  } catch (error: any) {
    useToast().add({
      title: '生成失败',
      description: error.message,
      color: 'error'
    })
    console.error(error)
  }
}

onMounted(async () => {
  await handleUmlGenerate()
})

const tabItems = [
  {
    label: "UML图",
    slot: "uml"
  },
  {
    label: "PlantUML",
    slot: "plantuml"
  }
]

const handleEditInPlayground = () => {
  router.push({
    path: '/playground',
    query: {
      code: props.code,
    }
  })
}

const handleAddToProject = () => {
  addToProjectModal.value?.openThisModal()
}
</script>

<template>
  <UCard>
    <UTabs :items="tabItems" color="neutral" variant="link" :ui="{ trigger: 'flex-1' }">
      <template #plantuml>
        <MDCSlot unwrap="p" />
      </template>
      <template #uml>
        <img v-if="imageUrl" :src="imageUrl" alt="UML图" />
        <UButton v-else loading variant="ghost" color="neutral">加载中</UButton>
      </template>
    </UTabs>
    <div class="flex gap-2 mt-4">
      <UButton color="neutral" icon="i-heroicons-arrow-top-right-on-square-16-solid" variant="outline" size="lg"
        class="flex-1 justify-center" @click="handleEditInPlayground">编辑该PlantUML</UButton>
      <UButton color="primary" icon="i-heroicons-plus-circle-16-solid" variant="outline" size="lg"
        class="flex-1 justify-center" @click="handleAddToProject">添加到项目</UButton>
    </div>
    <AddToProjectModal ref="addToProjectModal" :uml-code="code" />
  </UCard>
</template>

<style scoped></style>