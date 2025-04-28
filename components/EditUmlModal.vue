<script setup lang="ts">
import { useUmlStore } from "~/store/uml";
import type { Uml } from "~/api/models/Uml";
import type { UpdateUmlDto } from "~/api/models/UpdateUmlDto";

const props = defineProps<{
  uml: Uml,
  open: boolean
}>()

const emit = defineEmits(['uml-updated', 'close'])

const umlStore = useUmlStore()

const open = ref(props.open)
const updatedUml = ref<UpdateUmlDto>({
  umlId: 0,
  title: '',
  umlCode: ''
})

// const openThisModal = () => {
//   updatedUml.value = {
//     umlId: props.uml.id,
//     title: props.uml.title,
//     umlCode: props.uml.umlCode
//   }
//   // open.value = true
// }

watch(
  [() => props.open, () => props.uml],
  ([open]) => {
    if (open && props.uml) {
      updatedUml.value = {
        umlId: props.uml.id,
        title: props.uml.title,
        umlCode: props.uml.umlCode
      }
    }
  },
  { immediate: true }
)

watch(open, () => {
  if (!open.value) {
    emit('close')
  }
})

watchEffect(() => {
  open.value = props.open
})

const closeThisModal = () => {
  open.value = false
  emit('close')
}

const handleUpdateUml = async () => {
  await umlStore.updateUml(updatedUml.value)
  emit('uml-updated')
  closeThisModal()
}

// defineExpose({ openThisModal })

</script>

<template>
  <UModal v-model:open="open" title="编辑UML" :ui="{ footer: 'justify-end' }">
    <template #body>
      <UContainer as="div" class="space-y-4">
        <UFormField label="UML名称" required>
          <UInput v-model="updatedUml.title" placeholder="请输入UML名称" />
        </UFormField>
        <UFormField label="UML代码">
          <UTextarea class="w-full font-mono" v-model="updatedUml.umlCode" placeholder="请输入UML代码" :rows="10" />
        </UFormField>
      </UContainer>
    </template>
    <template #footer>
      <UButton label="取消" color="neutral" variant="outline" @click="closeThisModal" />
      <UButton label="保存" color="primary" @click="handleUpdateUml" />
    </template>
  </UModal>
</template>

<style scoped></style>