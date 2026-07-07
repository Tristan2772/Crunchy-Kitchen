<script setup lang="ts">
definePageMeta({
  layout: "auth",
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md space-y-6">
      <div class="text-center">
        <h1 class="text-4xl font-bold">Crunchy Kitchen</h1>
        <p class="text-base-content/70 mt-2">Manage your kitchen, plan meals, track inventory</p>
      </div>
      
      <AuthLoginForm />
      
      <p class="text-center text-sm text-base-content/70">
        Don't have an account?
        <NuxtLink to="/register" class="link link-primary">Create one</NuxtLink>
      </p>
    </div>
  </div>
</template>
