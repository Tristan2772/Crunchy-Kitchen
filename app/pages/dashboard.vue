<script setup lang="ts">
import { useAuthSession } from "~/composables/useAuth";

const { data: session } = await useAuthSession();

if (!session.value)
  await navigateTo("/");
</script>

<template>
  <section class="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-black text-base-content">signed in</h1>
  </section>
</template>