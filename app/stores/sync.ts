import { defineStore } from "pinia"

export const useSyncStore = defineStore("sync", () => {
  // State
  const isOnline = ref(true)
  const isSyncing = ref(false)
  const lastSynced = ref<string | null>(null)
  const pendingCount = ref(0)
  const error = ref<string | null>(null)
  
  // Getters
  const hasPendingChanges = computed(() => pendingCount.value > 0)
  const isOutOfSync = computed(() => {
    // Out of sync if offline with pending changes
    // or if last sync was > 5 minutes ago
    if (!isOnline.value && hasPendingChanges.value) return true
    if (!lastSynced.value) return true
    
    const lastSync = new Date(lastSynced.value).getTime()
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    return lastSync < fiveMinutesAgo
  })
  
  // Actions
  function setOnlineStatus(online: boolean) {
    isOnline.value = online
  }
  
  async function sync() {
    if (!isOnline.value) {
      return { success: false, offline: true }
    }
    
    isSyncing.value = true
    error.value = null
    
    try {
      // Pull changes
      const since = lastSynced.value || new Date(0).toISOString()
      const pullData = await $fetch(`/api/sync/pull?since=${encodeURIComponent(since)}`) as any
      
      // Push changes
      // TODO: Get pending from local DB
      const changes: any[] = []
      
      if (changes.length > 0) {
        await $fetch("/api/sync/push", {
          method: "POST",
          body: { changes },
        })
      }
      
      lastSynced.value = pullData.serverTime
      pendingCount.value = 0
      
      return { success: true }
    }
    catch (e: any) {
      error.value = e.message || "Sync failed"
      return { success: false, error: error.value }
    }
    finally {
      isSyncing.value = false
    }
  }
  
  function incrementPending() {
    pendingCount.value++
  }
  
  return {
    isOnline: readonly(isOnline),
    isSyncing: readonly(isSyncing),
    lastSynced: readonly(lastSynced),
    pendingCount: readonly(pendingCount),
    error: readonly(error),
    hasPendingChanges,
    isOutOfSync,
    setOnlineStatus,
    sync,
    incrementPending,
  }
})
