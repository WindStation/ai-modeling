<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { useUserStore } from "~/store/user";

const formFields = [
  {
    name: "username",
    type: "text" as const,
    label: "用户名",
    required: true
  },
  {
    name: "password",
    type: "password" as const,
    label: "密码",
    required: true
  }
]

const schema = z.object({
  username: z.string(),
  password: z.string().min(5)
})
type Schema = z.output<typeof schema>

const userStore = useUserStore()
const toast = useToast()
const router = useRouter()

async function onSubmit(form: FormSubmitEvent<Schema>) {
  try {
    await userStore.login(form.data.username, form.data.password)
    await router.push("/chat")
  } catch (error) {
    console.error(error)
    toast.add({
      title: "登录失败",
      description: "用户名或密码错误，请重试",
      color: "error"
    })
  }

}
</script>

<template>
  <UHeader>
    <template #left> <div></div> </template>
    <AiModelingIcon/>
  </UHeader>

  <UContainer class="max-w-xl h-[70vh] flex items-center">
    <UCard class="w-full">
      <UAuthForm
          :schema="schema"
          title="用户登录"
          description="登入以使用AI Modeling完整服务"
          icon="i-lucide-user"
          :fields="formFields"
          :submit="{label: '登录'}"
          @submit="onSubmit"
      >
        <template #footer>
          新用户？<ULink to="/register" class="text-primary-400">立即注册</ULink>
        </template>
      </UAuthForm>
    </UCard>
  </UContainer>
</template>

<style scoped>

</style>