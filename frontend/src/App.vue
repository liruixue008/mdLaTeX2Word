<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="border-b border-theme-border bg-theme-surface/80 backdrop-blur-lg sticky top-0 z-50">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src="./assets/styles/logo.png" alt="Logo" class="w-10 h-10 object-contain" />
            <div>
              <h1 class="text-2xl font-bold gradient-text">{{ $t('app.title') }}</h1>
              <p class="text-sm text-theme-muted">{{ $t('app.subtitle') }}</p>
            </div>
          </router-link>
          <div class="flex items-center space-x-6">
            <nav class="hidden md:flex items-center space-x-6">
              <router-link to="/" class="text-sm font-medium hover:text-accent-primary transition-colors" :class="$route.name === 'home' ? 'text-accent-primary' : 'text-theme-muted'">{{ $t('nav.home') }}</router-link>
              <router-link to="/editor" class="text-sm font-medium hover:text-accent-primary transition-colors" :class="$route.name === 'editor' ? 'text-accent-primary' : 'text-theme-muted'">{{ $t('nav.editor') }}</router-link>
            </nav>
            
            <!-- Language Switcher -->
            <div class="flex items-center bg-theme-hover rounded-lg p-1">
              <button 
                @click="setLocale('en')" 
                :class="[
                  'px-2 py-1 text-xs font-bold rounded transition-colors',
                  $i18n.locale === 'en' ? 'bg-accent-primary text-white' : 'text-theme-muted hover:text-theme-text'
                ]"
              >
                EN
              </button>
              <button 
                @click="setLocale('zh')" 
                :class="[
                  'px-2 py-1 text-xs font-bold rounded transition-colors',
                  $i18n.locale === 'zh' ? 'bg-accent-primary text-white' : 'text-theme-muted hover:text-theme-text'
                ]"
              >
                中文
              </button>
            </div>

            <!-- Theme Toggle -->
            <button @click="toggleTheme" class="p-2 rounded-lg hover:bg-theme-hover transition-colors text-theme-text" :title="$t('app.toggleTheme')">
              <svg v-if="theme === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>

            <span class="text-sm text-theme-muted border-l border-theme-border pl-6">{{ $t('app.version') }}</span>
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
    <footer class="border-t border-theme-border bg-theme-surface mt-auto">
      <div class="container mx-auto px-6 py-6">
        <div class="text-center text-sm text-theme-muted">
          <p>{{ $t('footer.builtBy') }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const $route = useRoute()
const theme = ref(localStorage.getItem('theme') || 'dark')

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  updateTheme()
}

const updateTheme = () => {
  localStorage.setItem('theme', theme.value)
  if (theme.value === 'light') {
    document.documentElement.classList.add('light')
  } else {
    document.documentElement.classList.remove('light')
  }
}

const setLocale = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

onMounted(() => {
  updateTheme()
})
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
  @apply bg-theme-border text-theme-text hover:bg-theme-border/80 h-full flex items-center;
}

.card {
  @apply bg-theme-surface border border-theme-border rounded-2xl p-6 hover:border-accent-primary/30 transition-colors;
}

.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary;
}
</style>
