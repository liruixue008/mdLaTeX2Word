<template>
  <div class="max-w-4xl mx-auto">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold mb-4">
        Convert Your <span class="gradient-text">Markdown</span> Files
      </h2>
      <p class="text-lg text-dark-muted">
        Upload Markdown files with LaTeX formulas and convert them to Word documents instantly
      </p>
      <div class="mt-6 flex justify-center">
        <router-link to="/editor" class="btn btn-secondary flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Try Online Editor</span>
        </router-link>
      </div>
    </div>

    <!-- Upload Section -->
    <FileUpload 
      @file-uploaded="handleFileUploaded"
      @upload-error="handleUploadError"
    />

    <!-- Conversion Status -->
    <ConversionStatus 
      v-if="conversionStatus"
      :status="conversionStatus"
      :message="statusMessage"
      class="mt-8"
    />

    <!-- Download Section -->
    <DownloadButton 
      v-if="downloadUrl"
      :download-url="downloadUrl"
      :filename="outputFilename"
      class="mt-8"
    />

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-8 card border-accent-error">
      <div class="flex items-start space-x-3">
        <svg class="w-6 h-6 text-accent-error flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="font-semibold text-accent-error mb-1">Error</h3>
          <p class="text-dark-text">{{ errorMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card text-center">
        <div class="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 class="font-semibold mb-2">Easy Upload</h3>
        <p class="text-sm text-dark-muted">Drag & drop or click to upload your Markdown files</p>
      </div>

      <div class="card text-center">
        <div class="w-12 h-12 bg-accent-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="font-semibold mb-2">LaTeX Support</h3>
        <p class="text-sm text-dark-muted">Full support for LaTeX mathematical formulas</p>
      </div>

      <div class="card text-center">
        <div class="w-12 h-12 bg-accent-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-accent-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <h3 class="font-semibold mb-2">Instant Download</h3>
        <p class="text-sm text-dark-muted">Get your Word document ready in seconds</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FileUpload from '../components/FileUpload.vue'
import ConversionStatus from '../components/ConversionStatus.vue'
import DownloadButton from '../components/DownloadButton.vue'
import axios from 'axios'

const conversionStatus = ref(null)
const statusMessage = ref('')
const downloadUrl = ref(null)
const outputFilename = ref('')
const errorMessage = ref('')

const handleFileUploaded = async (fileData) => {
  errorMessage.value = ''
  conversionStatus.value = 'converting'
  statusMessage.value = 'Converting your file...'
  downloadUrl.value = null

  try {
    const response = await axios.post('/api/convert', {
      filename: fileData.filename
    })

    if (response.data.success) {
      conversionStatus.value = 'success'
      statusMessage.value = 'Conversion completed successfully!'
      downloadUrl.value = response.data.data.downloadUrl
      outputFilename.value = response.data.data.outputFilename
    } else {
      throw new Error(response.data.message || 'Conversion failed')
    }
  } catch (error) {
    conversionStatus.value = 'error'
    statusMessage.value = 'Conversion failed'
    errorMessage.value = error.response?.data?.message || error.message || 'An error occurred during conversion'
  }
}

const handleUploadError = (error) => {
  errorMessage.value = error
  conversionStatus.value = null
  downloadUrl.value = null
}
</script>
