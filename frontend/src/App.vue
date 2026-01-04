<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="border-b border-dark-border bg-dark-surface/80 backdrop-blur-lg sticky top-0 z-50">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <svg class="w-10 h-10 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h1 class="text-2xl font-bold gradient-text">mdLaTeX2Word</h1>
              <p class="text-sm text-dark-muted">Markdown + LaTeX → Word</p>
            </div>
          </router-link>
          <div class="flex items-center space-x-6">
            <nav class="hidden md:flex items-center space-x-6">
              <router-link to="/" class="text-sm font-medium hover:text-accent-primary transition-colors" :class="$route.name === 'home' ? 'text-accent-primary' : 'text-dark-muted'">Home</router-link>
              <router-link to="/editor" class="text-sm font-medium hover:text-accent-primary transition-colors" :class="$route.name === 'editor' ? 'text-accent-primary' : 'text-dark-muted'">Online Editor</router-link>
            </nav>
            <span class="text-sm text-dark-muted border-l border-dark-border pl-6">v1.1.0</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 container mx-auto px-6 py-12">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="border-t border-dark-border bg-dark-surface mt-auto">
      <div class="container mx-auto px-6 py-6">
        <div class="text-center text-sm text-dark-muted">
          <p>Built with Vue 3, Node.js, and Tailwind CSS</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const $route = useRoute()
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Base styles for buttons and components */
.btn {
  @apply px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-95;
}

.btn-primary {
  @apply bg-accent-primary text-white hover:bg-accent-primary/90 shadow-lg shadow-accent-primary/20;
}

.btn-secondary {
  @apply bg-dark-border text-dark-text hover:bg-dark-border/80 h-full flex items-center;
}

.card {
  @apply bg-dark-surface border border-dark-border rounded-2xl p-6 hover:border-accent-primary/30 transition-colors;
}

.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary;
}
</style>
