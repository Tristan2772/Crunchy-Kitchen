import { defineStore } from "pinia"

interface User {
  id: string
  email: string
  name?: string
}

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const isAuthenticated = computed(() => !!user.value)
  
  // Actions
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch("/api/auth/sign-in/email", {
        method: "POST",
        body: { email, password },
      })
      
      await fetchSession()
      return { success: true }
    }
    catch (e: any) {
      error.value = e.message || "Login failed"
      return { success: false, error: error.value }
    }
    finally {
      loading.value = false
    }
  }
  
  async function register(email: string, password: string, name?: string) {
    loading.value = true
    error.value = null
    
    try {
      await $fetch("/api/auth/sign-up/email", {
        method: "POST",
        body: { email, password, name },
      })
      
      await fetchSession()
      return { success: true }
    }
    catch (e: any) {
      error.value = e.message || "Registration failed"
      return { success: false, error: error.value }
    }
    finally {
      loading.value = false
    }
  }
  
  async function logout() {
    try {
      await $fetch("/api/auth/sign-out", { method: "POST" })
    }
    finally {
      user.value = null
    }
  }
  
  async function fetchSession() {
    try {
      const response = await $fetch("/api/auth/session") as any
      if (response?.user) {
        user.value = response.user
      }
    }
    catch {
      user.value = null
    }
  }
  
  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    login,
    register,
    logout,
    fetchSession,
  }
})
