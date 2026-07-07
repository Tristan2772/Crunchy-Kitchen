<script setup lang="ts">
// Initialize auth session on app load
const authStore = useAuthStore()
onMounted(async () => {
  await authStore.fetchSession()
})
</script>

<template>
  <IonApp>
    <NuxtLayout />
  </IonApp>
</template>
