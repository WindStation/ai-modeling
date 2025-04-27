<script setup lang="ts">
const text = ref("")

const emit = defineEmits(["send"])

const handleSend = (e: Event) => {
  const event = e as KeyboardEvent
  if (event.shiftKey) {
    // Shift+Enter，插入换行
    const textarea = event.target as HTMLTextAreaElement
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    text.value = text.value.slice(0, start) + '\n' + text.value.slice(end)
    textarea.selectionStart = textarea.selectionEnd = start + 1
  } else {
    // 仅Enter，提交
    if (text.value.trim().length > 0) {
      emit("send", text.value)
      text.value = ""
    }
  }
}
</script>

<template>
  <UContainer class="flex p-10 items-end">
    <UTextarea id="chat_input" placeholder="输入软件需求..." color="primary" size="xl" variant="subtle" v-model="text"
      class="flex w-full shadow-xl box-border rounded-2xl" :autoresize="true"
      @keydown.enter.prevent="handleSend($event)" :rows="4">
    </UTextarea>
    <UButton icon="i-lucide-send" color="neutral" size="xl" class="ml-5 rounded-full" @click="handleSend($event)" />
  </UContainer>
</template>

<style>
#chat_input {
  border-radius: 1rem;
  padding: 0.6rem 1.2rem;
  @apply resize-none text-[1.1rem] box-border;
}
</style>