<template>
  <div class="card">
    <div class="text-center mb-6">
      <h3 class="text-xl font-semibold mb-2">Upload Your File</h3>
      <p class="text-sm text-dark-muted">Supports .md, .markdown, and .tex files (max 10MB)</p>
    </div>

    <!-- Drop Zone -->
    <div
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @click="triggerFileInput"
      :class="[
        'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300',
        isDragging 
          ? 'border-accent-primary bg-accent-primary/10 scale-105' 
          : 'border-dark-border hover:border-accent-primary/50 hover:bg-dark-hover'
      ]"
    >
      <div class="flex flex-col items-center space-y-4">
        <!-- Upload Icon -->
        <div 
          :class="[
            'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300',
            isDragging ? 'bg-accent-primary text-white scale-110' : 'bg-dark-bg text-accent-primary'
          ]"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        <!-- Text -->
        <div>
          <p class="text-lg font-medium mb-1">
            {{ isDragging ? 'Drop your file here' : 'Drag & drop your file here' }}
          </p>
          <p class="text-sm text-dark-muted">or click to browse</p>
        </div>

        <!-- File Info -->
        <div v-if="selectedFile" class="mt-4 p-4 bg-dark-bg rounded-lg w-full max-w-md">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 flex-1 min-w-0">
              <svg class="w-5 h-5 text-accent-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ selectedFile.name }}</p>
                <p class="text-xs text-dark-muted">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
            </div>
            <button
              @click.stop="clearFile"
              class="ml-2 p-1 hover:bg-dark-hover rounded transition-colors"
            >
              <svg class="w-5 h-5 text-dark-muted hover:text-accent-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept=".md,.markdown,.tex"
      @change="handleFileSelect"
      class="hidden"
    />

    <!-- Upload Button -->
    <div v-if="selectedFile && !isUploading" class="mt-6 flex justify-center">
      <button @click="uploadFile" class="btn-primary">
        <span class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>Upload & Convert</span>
        </span>
      </button>
    </div>

    <!-- Upload Progress -->
    <div v-if="isUploading" class="mt-6">
      <div class="flex items-center justify-center space-x-3">
        <svg class="animate-spin h-5 w-5 text-accent-primary" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-dark-muted">Uploading...</span>
      </div>
      <div class="mt-3 w-full bg-dark-bg rounded-full h-2 overflow-hidden">
        <div class="h-full bg-gradient-to-r from-accent-primary to-accent-secondary animate-pulse-slow"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const emit = defineEmits(['file-uploaded', 'upload-error'])

const fileInput = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)
const isUploading = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const validateAndSetFile = (file) => {
  // Check file extension
  const validExtensions = ['.md', '.markdown', '.tex']
  const fileName = file.name.toLowerCase()
  const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext))
  
  if (!isValidExtension) {
    emit('upload-error', 'Invalid file type. Please upload a .md, .markdown, or .tex file.')
    return
  }

  // Check file size (10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    emit('upload-error', 'File size exceeds 10MB limit.')
    return
  }

  selectedFile.value = file
}

const clearFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const uploadFile = async () => {
  if (!selectedFile.value) return

  isUploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.success) {
      emit('file-uploaded', response.data.data)
      // Don't clear file yet, keep it visible during conversion
    } else {
      throw new Error(response.data.message || 'Upload failed')
    }
  } catch (error) {
    emit('upload-error', error.response?.data?.message || error.message || 'Failed to upload file')
    clearFile()
  } finally {
    isUploading.value = false
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>
