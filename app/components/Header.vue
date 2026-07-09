<script setup lang="ts">
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-base-300/70 bg-base-100/85 backdrop-blur">
    <div class="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex-1">
        <NuxtLink to="/" class="text-xl font-black uppercase tracking-[0.24em] text-base-content sm:text-2xl">
          Crunchy Kitchen
        </NuxtLink>
      </div>

      <div class="flex-none">
        <AuthButton />
      </div>
    </div>
  </header>
</template>