<script setup lang="ts">
import { useUserStore } from "~/store/user";

const userStore = useUserStore()
onMounted(() => userStore.init())
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
