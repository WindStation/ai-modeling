<script setup lang="ts">
import AppHeader from "~/components/AppHeader.vue"

const headerLinks = [
  { label: '文档', to: '/docs' },
  { label: '案例', to: '/cases' }
]
</script>
<!--<template>-->
<!--  <NuxtLayout>-->
<!--    <UContainer>-->
<!--      <AppHeader :links="headerLinks"/>-->
<!--      <NuxtRouteAnnouncer/>-->
<!--      <NuxtPage/>-->
<!--    </UContainer>-->
<!--  </NuxtLayout>-->
<!--</template>-->
<template>
  <UApp :toaster="{position: 'top-center'}">
    <UMain>
      <NuxtLayout>
<!--        <AppHeader/>-->
        <NuxtPage/>
      </NuxtLayout>
    </UMain>
  </UApp>
</template>
