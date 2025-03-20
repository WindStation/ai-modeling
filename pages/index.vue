<script setup lang="ts">


const pngs = [
  "assets/img/uml-demo.png",
  "assets/img/uml-demo.png",
  "assets/img/uml-demo.png"
]
</script>

<template>
  <AppHeader />
  <UContainer>
    <div class="py-16 space-y-12 ">
      <!-- 主标题区 -->
      <div class="text-center space-y-6">
        <div class="items-center">
          <UContainer
              as="h1"
              class="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent w-fit"
              style="font-family: 'JetBrains Mono',ui-sans-serif;"
          >
            AI Modeling
          </UContainer>
        </div>

        <UContainer as="p" class="text-xl text-gray-600 dark:text-gray-300">
          基于大语言模型的智能软件建模平台，支持实时UML编辑预览
        </UContainer>
      </div>

      <!-- 功能展示 -->
      <UCard class="p-10 mx-auto box-border">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div class="px-5">

            <img
                src="assets/img/uml-demo.png"
                alt="AI生成示例"
                class="rounded-lg shadow-xl"
            />
          </div>

          <div class="space-y-4">

            <UIcon name="i-heroicons-sparkles" class="w-12 h-12 text-primary"/>
            <UContainer as="h2" class="text-3xl font-semibold">
              三大核心能力
            </UContainer>
            <ul class="space-y-3 pl-5 text-lg">
              <li class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-emerald-600" size="20" />
                自然语言转UML图表
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-emerald-600" size="20" />
                多模型智能修正
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-emerald-600" size="20" />
                管理所有历史UML图表
              </li>
            </ul>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>

</template>