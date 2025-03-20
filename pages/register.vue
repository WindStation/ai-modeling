<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { useUserStore } from "~/store/user";

const formFields = [
  {
    name: "username",
    type: "text" as const,
    label: "用户名",
    placeholder: "身份唯一标识",
    required: true
  },
  {
    name: "password",
    type: "password" as const,
    label: "密码",
    placeholder: "不少于6位密码",
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

async function onSubmit(form: FormSubmitEvent<Schema>) {
  try {
    await userStore.register(form.data.username, form.data.password)
  } catch (error) {
    console.error(error)
    toast.add({
      title: "注册失败",
      description: "已经存在相同用户名，请重试。",
      color: "error"
    })
  }
}
</script>

<template>
  <UHeader>
    <template #left>
      <div></div>
    </template>
    <AiModelingIcon/>
  </UHeader>

  <UContainer class=" h-[70vh] flex flex-col items-center justify-center space-y-10 ">
    <UContainer as="h1" class="text-primary text-4xl font-bold">Welcome to AI Modeling!</UContainer>
    <UCard class="w-full max-w-xl">
      <UAuthForm
          :schema="schema"
          title="用户注册"
          icon="i-lucide-user"
          :fields="formFields"
          :submit="{label: '注册用户'}"
          @submit="onSubmit"
      >
        <template #footer>
          前往
          <ULink class="text-primary-400" to="/login">登录页面</ULink>
        </template>
      </UAuthForm>
    </UCard>
  </UContainer>
</template>

<style scoped>

</style>