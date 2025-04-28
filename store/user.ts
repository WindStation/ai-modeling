import type { User } from "~/api";

export const useUserStore = defineStore("user", () => {
    const user = ref<User | null>(null)
    const isInit = ref(false)
    const isLogin = computed(() => user.value !== null)

    async function login(username: string, password: string) {
        const token = await apiClient.auth.login({
            username: username, password: password
        })
        localStorage.setItem("token", token.accessToken)
        localStorage.setItem("refreshToken", token.refreshToken)
    }

    async function logout() {
        user.value = null
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
    }

    async function register(username: string, password: string) {
        const token = await apiClient.auth.register({
            account: username, password: password
        })
        localStorage.setItem("token", token.accessToken)
    }

    async function info() {
        user.value = await apiClient.user.self()
    }

    async function init() {
        if (!isInit.value && localStorage.getItem("token")) {
            await info()
        }
    }

    return { user, isLogin, login, logout, register, info, init }
})