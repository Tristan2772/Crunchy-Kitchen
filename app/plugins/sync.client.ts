// Client-side plugin for online/offline detection and sync
export default defineNuxtPlugin(() => {
  const syncStore = useSyncStore()
  
  // Update online status on mount
  if (process.client) {
    syncStore.setOnlineStatus(navigator.onLine)
    
    // Listen for online/offline events
    window.addEventListener("online", () => {
      syncStore.setOnlineStatus(true)
      // Auto-sync when coming back online
      syncStore.sync()
    })
    
    window.addEventListener("offline", () => {
      syncStore.setOnlineStatus(false)
    })
    
    // Periodic sync every 30 seconds when online
    setInterval(() => {
      if (navigator.onLine) {
        syncStore.sync()
      }
    }, 30000)
  }
})
