<script setup lang="ts">
const authStore = useAuthStore()
const syncStore = useSyncStore()

// Protected route
onMounted(async () => {
  await authStore.fetchSession()
  if (!authStore.isAuthenticated) {
    navigateTo("/login")
  }
})
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- User Card -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title text-lg">Welcome, {{ authStore.user?.name || authStore.user?.email }}</h2>
          <p class="text-base-content/70">You're signed in and ready to manage your kitchen.</p>
          <div class="card-actions mt-4">
            <button class="btn btn-sm btn-outline" @click="authStore.logout()">
              Sign Out
            </button>
          </div>
        </div>
      </div>
      
      <!-- Sync Status -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title text-lg">Sync Status</h2>
          
          <div class="flex items-center gap-2 mt-2">
            <div 
              class="w-3 h-3 rounded-full" 
              :class="syncStore.isOnline ? 'bg-success' : 'bg-error'"
            />
            <span>{{ syncStore.isOnline ? 'Online' : 'Offline' }}</span>
          </div>
          
          <div v-if="syncStore.lastSynced" class="text-sm text-base-content/70 mt-2">
            Last synced: {{ new Date(syncStore.lastSynced).toLocaleTimeString() }}
          </div>
          
          <div v-if="syncStore.pendingCount > 0" class="text-sm mt-2">
            {{ syncStore.pendingCount }} changes pending
          </div>
          
          <div class="card-actions mt-4">
            <button 
              class="btn btn-sm btn-outline" 
              :disabled="syncStore.isSyncing || !syncStore.isOnline"
              @click="syncStore.sync()"
            >
              <span v-if="syncStore.isSyncing" class="loading loading-spinner loading-xs" />
              Sync Now
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Phase 1 Complete Notice -->
    <div class="alert alert-info mt-6">
      <span>🎉 Phase 1 Complete! Auth and sync foundation is working.</span>
    </div>
  </div>
</template>
