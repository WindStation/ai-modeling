<script setup lang="ts">

</script>

<template>
  <UError
    :error="{
      statusCode: 404,
      statusMessage: '聊天不存在',
      message: '我们无法找到这个聊天页面，请返回聊天主页重试。'
    }"
    :clear="{
      label: '返回聊天主页'
    }"
    redirect="/chat"
  />
</template>

<style scoped>

</style>