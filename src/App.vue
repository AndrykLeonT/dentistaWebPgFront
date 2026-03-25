<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
</script>

<template>
  <div class="min-h-screen font-sans p-4 md:p-8 bg-background">
    <div class="max-w-6xl mx-auto border border-border rounded-[1.5rem] shadow-sm bg-card overflow-hidden pb-10">
      <div class="p-6 md:p-10">
        <RouterView />
      </div>
    </div>
    <Toaster position="top-right" />
  </div>
</template>

<style>
body {
  background-color: var(--color-background);
}
</style>
