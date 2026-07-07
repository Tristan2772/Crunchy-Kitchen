// Sync engine composable - manages local/remote sync
export function useSync() {
  const isOnline = useState("sync-online", () => true)
  const isSyncing = useState("sync-syncing", () => false)
  const lastSynced = useState<string | null>("sync-last", () => null)
  const pendingCount = useState("sync-pending", () => 0)
  const syncError = useState<string | null>("sync-error", () => null)
  
  // Update online status
  function setOnlineStatus(online: boolean) {
    isOnline.value = online
  }
  
  // Pull changes from server
  async function pullChanges() {
    if (!isOnline.value) return { success: false, offline: true }
    
    isSyncing.value = true
    syncError.value = null
    
    try {
      const since = lastSynced.value || new Date(0).toISOString()
      const { data } = await $fetch(`/api/sync/pull?since=${encodeURIComponent(since)}`)
      
      // Apply changes to local storage
      // TODO: Implement local DB updates
      
      lastSynced.value = data.serverTime
      return { success: true, changes: data.changes }
    }
    catch (e) {
      syncError.value = e instanceof Error ? e.message : "Sync failed"
      return { success: false, error: syncError.value }
    }
    finally {
      isSyncing.value = false
    }
  }
  
  // Push local changes to server
  async function pushChanges() {
    if (!isOnline.value) return { success: false, offline: true }
    
    isSyncing.value = true
    syncError.value = null
    
    try {
      // Get pending changes from local storage
      // TODO: Get from local SQLite sync_queue
      const changes: any[] = []
      
      if (changes.length === 0) {
        return { success: true, pushed: 0 }
      }
      
      const { data } = await $fetch("/api/sync/push", {
        method: "POST",
        body: { changes },
      })
      
      // Clear synced items from queue
      pendingCount.value = 0
      lastSynced.value = data.serverTime
      
      return { success: true, pushed: changes.length }
    }
    catch (e) {
      syncError.value = e instanceof Error ? e.message : "Push failed"
      return { success: false, error: syncError.value }
    }
    finally {
      isSyncing.value = false
    }
  }
  
  // Full sync: pull then push
  async function sync() {
    const pull = await pullChanges()
    if (!pull.success) return pull
    
    const push = await pushChanges()
    return push
  }
  
  return {
    isOnline: readonly(isOnline),
    isSyncing: readonly(isSyncing),
    lastSynced: readonly(lastSynced),
    pendingCount: readonly(pendingCount),
    syncError: readonly(syncError),
    setOnlineStatus,
    pullChanges,
    pushChanges,
    sync,
  }
}
