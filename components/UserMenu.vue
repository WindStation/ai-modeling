<script setup lang="ts">
import { useUserStore } from "~/store/user";

const props = defineProps<{
  orientation: "horizontal" | "vertical"
}>()

const userStore = useUserStore()
const router = useRouter()

const userAccount = computed(() => {
  if (userStore.user) {
    return userStore.user.account!
  }
})

const menuItems = [
  {
    label: userAccount.value,
    icon: "i-material-symbols-person",
    children: [
      {
        label: "退出登录",
        icon: "i-material-symbols-exit-to-app",
        onSelect: () => {
          console.log('退出登录')
          userStore.logout()
          router.push("/logout")
        }
      },
      {
        label: "测试",
        icon: "i-lucide-rocket"
      }
    ]
  }
]
</script>

<template>
  <UNavigationMenu :items="menuItems" :content-orientation="orientation" />
</template>

<style scoped></style>