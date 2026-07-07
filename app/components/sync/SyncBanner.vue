<script setup lang="ts">
const syncStore = useSyncStore()

const showBanner = computed(() => {
  // Show if offline or potentially out of sync
  return !syncStore.isOnline || syncStore.isOutOfSync
})

const bannerClass = computed(() => {
  if (!syncStore.isOnline) return "alert-warning"
  if (syncStore.isOutOfSync) return "alert-info"
  return ""
})

const bannerText = computed(() => {
  if (!syncStore.isOnline) {
    return "Offline - changes will sync when reconnected"
  }
  if (syncStore.isOutOfSync) {
    return "Syncing... your data may be slightly out of date"
  }
  return ""
})

function dismissBanner() {
  // User can close but it will reappear on next check
  // In a real app, track dismissed time
}
</script>

<template>
  <div v-if="showBanner" :class="['alert', bannerClass, 'rounded-none']">
    <span>{{ bannerText }}</span>
    <div class="flex gap-2">
      <button v-if="syncStore.isOnline && syncStore.pendingCount > 0" 
              class="btn btn-xs btn-ghost" 
              :disabled="syncStore.isSyncing"
              @click="syncStore.sync()">
        <span v-if="syncStore.isSyncing" class="loading loading-spinner loading-xs" />
        <span v-else>Sync Now</span>
      </button>
      <button class="btn btn-xs btn-ghost" @click="dismissBanner()">Dismiss</button>
    </div>
  </div>
</template>
