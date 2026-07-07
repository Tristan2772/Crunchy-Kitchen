<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

const email = ref("")
const password = ref("")
const name = ref("")
const confirmPassword = ref("")

const passwordMatch = computed(() => password.value === confirmPassword.value)

async function onSubmit() {
  if (!passwordMatch.value) return
  
  const result = await authStore.register(email.value, password.value, name.value)
  if (result.success) {
    router.push("/dashboard")
  }
}
</script>

<template>
  <form class="card bg-base-100 shadow-xl" @submit.prevent="onSubmit">
    <div class="card-body">
      <h2 class="card-title">Create Account</h2>
      
      <div v-if="authStore.error" class="alert alert-error text-sm">
        {{ authStore.error }}
      </div>
      
      <div class="form-control">
        <label class="label">
          <span class="label-text">Name (optional)</span>
        </label>
        <input 
          v-model="name" 
          type="text" 
          class="input input-bordered" 
          placeholder="Your name"
        />
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
          minlength="8"
          required
        />
      </div>
      
      <div class="form-control">
        <label class="label">
          <span class="label-text">Confirm Password</span>
        </label>
        <input 
          v-model="confirmPassword" 
          type="password" 
          class="input input-bordered" 
          :class="{ 'input-error': confirmPassword && !passwordMatch }"
          required
        />
        <label v-if="confirmPassword && !passwordMatch" class="label">
          <span class="label-text-alt text-error">Passwords do not match</span>
        </label>
      </div>
      
      <div class="card-actions justify-end mt-4">
        <button 
          type="submit" 
          class="btn btn-primary" 
          :disabled="authStore.loading || !passwordMatch"
        >
          <span v-if="authStore.loading" class="loading loading-spinner loading-sm" />
          Create Account
        </button>
      </div>
    </div>
  </form>
</template>
