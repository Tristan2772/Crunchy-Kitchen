<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

// Redirect based on auth status
onMounted(async () => {
  await authStore.fetchSession()
  if (authStore.isAuthenticated) {
    router.push("/dashboard")
  }
  else {
    router.push("/login")
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <span class="loading loading-spinner loading-lg" />
  </div>
</template>
