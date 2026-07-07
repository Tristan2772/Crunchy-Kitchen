<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

const email = ref("")
const password = ref("")

async function onSubmit() {
  const result = await authStore.login(email.value, password.value)
  if (result.success) {
    router.push("/dashboard")
  }
}
</script>

<template>
  <form class="card bg-base-100 shadow-xl" @submit.prevent="onSubmit">
    <div class="card-body">
      <h2 class="card-title">Sign In</h2>
      
      <div v-if="authStore.error" class="alert alert-error text-sm">
        {{ authStore.error }}
      </div>
      
      <div class="form-control">
        <label class="label">
          <span class="label-text">Email</span>
        </label>
        <input 
          v-model="email" 
          type="email" 
          class="input input-bordered" 
          placeholder="you@example.com"
          required
        />
      </div>
      
      <div class="form-control">
        <label class="label">
          <span class="label-text">Password</span>
        </label>
        <input 
          v-model="password" 
          type="password" 
          class="input input-bordered" 
          required
        />
      </div>
      
      <div class="card-actions justify-end mt-4">
        <button 
          type="submit" 
          class="btn btn-primary" 
          :disabled="authStore.loading"
        >
          <span v-if="authStore.loading" class="loading loading-spinner loading-sm" />
          Sign In
        </button>
      </div>
    </div>
  </form>
</template>
