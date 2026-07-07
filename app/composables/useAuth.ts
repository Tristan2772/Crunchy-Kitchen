import { useFetch, useCookie } from "#app"

interface User {
  id: string
  email: string
  name?: string
}

interface AuthSession {
  user: User | null
  token: string | null
}

// Better Auth client composable
export function useAuth() {
  const user = useState<User | null>("auth-user", () => null)
  const loading = useState("auth-loading", () => false)
  const error = useState<string | null>("auth-error", () => null)
  
  // Token storage (httpOnly cookie set by server)
  const tokenCookie = useCookie("auth-token")
  
  // Login with email/password
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await useFetch("/api/auth/sign-in/email", {
        method: "POST",
        body: { email, password },
      })
      
      if (fetchError.value) {
        throw new Error(fetchError.value.message)
      }
      
      // Update user state
      await fetchSession()
      return { success: true }
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : "Login failed"
      return { success: false, error: error.value }
    }
    finally {
      loading.value = false
    }
  }
  
  // Register new account
  async function register(email: string, password: string, name?: string) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await useFetch("/api/auth/sign-up/email", {
        method: "POST",
        body: { email, password, name },
      })
      
      if (fetchError.value) {
        throw new Error(fetchError.value.message)
      }
      
      // Auto-login after registration
      await fetchSession()
      return { success: true }
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : "Registration failed"
      return { success: false, error: error.value }
    }
    finally {
      loading.value = false
    }
  }
  
  // Logout
  async function logout() {
    try {
      await $fetch("/api/auth/sign-out", { method: "POST" })
      user.value = null
      tokenCookie.value = null
    }
    catch (e) {
      console.error("Logout error:", e)
    }
  }
  
  // Fetch current session
  async function fetchSession() {
    try {
      const { data } = await useFetch("/api/auth/session")
      if (data.value?.user) {
        user.value = data.value.user as User
      }
    }
    catch (e) {
      user.value = null
    }
  }
  
  // Check if authenticated
  const isAuthenticated = computed(() => !!user.value)
  
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
}
