<script setup lang="ts">
const text = ref("")

const emit = defineEmits(["send"])

const handleSend = () => {
  emit("send", text.value)
  text.value = ""
}
</script>

<template>
  <UContainer class="flex p-10 items-end">
    <UTextarea
        id="chat_input" placeholder="输入软件需求..." color="primary" size="xl" variant="subtle" v-model="text"
        class="flex w-full shadow-xl box-border rounded-2xl" :autoresize="true" @keydown.enter.prevent="handleSend" :rows="4">
    </UTextarea>
    <UButton icon="i-lucide-send" size="xl" class="ml-5 rounded-full" @click="handleSend"  />
  </UContainer>
</template>

<style>
#chat_input {
  border-radius: 1rem;
  padding: 0.6rem 1.2rem;
  @apply resize-none text-[1.1rem] box-border;
}
</style>