<template>
  <div class="card border-accent-success">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 rounded-full bg-accent-success/10 flex items-center justify-center">
          <svg class="w-6 h-6 text-accent-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-accent-success mb-1">{{ $t('download.ready') }}</h3>
          <p class="text-sm text-theme-muted">{{ filename }}</p>
        </div>
      </div>

      <a
        :href="downloadUrl"
        download
        class="btn-primary"
      >
        <span class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>{{ $t('download.btn') }}</span>
        </span>
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  downloadUrl: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  }
})
</script>
