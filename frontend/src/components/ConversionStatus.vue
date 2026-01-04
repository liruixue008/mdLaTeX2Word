<template>
  <div class="card">
    <div class="flex items-center justify-center space-x-4">
      <!-- Status Icon -->
      <div class="relative">
        <div
          v-if="status === 'converting'"
          class="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center"
        >
          <svg class="animate-spin h-6 w-6 text-accent-primary" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div
          v-else-if="status === 'success'"
          class="w-12 h-12 rounded-full bg-accent-success/10 flex items-center justify-center animate-float"
        >
          <svg class="w-6 h-6 text-accent-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div
          v-else-if="status === 'error'"
          class="w-12 h-12 rounded-full bg-accent-error/10 flex items-center justify-center"
        >
          <svg class="w-6 h-6 text-accent-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>

      <!-- Status Message -->
      <div class="flex-1">
        <h3
          :class="[
            'font-semibold mb-1',
            status === 'success' ? 'text-accent-success' :
            status === 'error' ? 'text-accent-error' :
            'text-accent-primary'
          ]"
        >
          {{ statusTitle }}
        </h3>
        <p class="text-sm text-theme-muted">{{ message }}</p>
      </div>
    </div>

    <!-- Progress Bar -->
    <div v-if="status === 'converting'" class="mt-4 w-full bg-theme-bg rounded-full h-2 overflow-hidden">
      <div class="h-full bg-gradient-to-r from-accent-primary to-accent-secondary animate-pulse-slow"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['converting', 'success', 'error'].includes(value)
  },
  message: {
    type: String,
    default: ''
  }
})

const statusTitle = computed(() => {
  switch (props.status) {
    case 'converting':
      return 'Converting...'
    case 'success':
      return 'Success!'
    case 'error':
      return 'Failed'
    default:
      return ''
  }
})
</script>
