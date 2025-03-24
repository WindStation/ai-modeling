<script setup lang="ts">
const props = defineProps<{
  code: string
}>()

const { generate } = useUmlGenerator()
const { decode } = useTextCodec()
const router = useRouter()

const imageUrl = ref<string | undefined>(undefined)

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

onMounted(() => handleUmlGenerate())

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

</script>

<template>
  <UCard>
    <UTabs :items="tabItems" color="neutral" variant="link" :ui="{trigger: 'flex-1'}">
      <template #plantuml>
        <MDCSlot unwrap="p"/>
      </template>
      <template #uml>
        <img v-if="imageUrl" :src="imageUrl" alt="UML图"/>
        <UButton v-else loading variant="ghost" color="neutral">加载中</UButton>
      </template>
    </UTabs>
    <UButton color="neutral" variant="outline" class="w-full justify-center mt-4" @click="handleEditInPlayground">编辑该PlantUML</UButton>

  </UCard>
</template>

<style scoped>

</style>