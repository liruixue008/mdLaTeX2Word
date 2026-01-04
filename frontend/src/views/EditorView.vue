<template>
  <div class="h-[calc(100vh-12rem)] flex flex-col">
    <!-- Toolbar -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <router-link to="/" class="text-theme-muted hover:text-theme-text transition-colors flex items-center space-x-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{{ $t('editor.back') }}</span>
        </router-link>
        <h2 class="text-xl font-bold">{{ $t('editor.title') }}</h2>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          @click="exportToWord" 
          :disabled="isExporting || !content.trim()"
          class="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!isExporting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isExporting ? $t('editor.exportingBtn') : $t('editor.exportBtn') }}</span>
        </button>
      </div>
    </div>

    <!-- Editor Split Pane -->
    <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
      <!-- Left: Editor -->
      <div class="flex flex-col min-h-0">
        <div class="mb-2 text-sm text-theme-muted font-medium">{{ $t('editor.markdownLabel') }}</div>
        <textarea
          v-model="content"
          :placeholder="$t('editor.placeholder')"
          class="flex-1 w-full bg-theme-surface border border-theme-border rounded-xl p-4 text-theme-text focus:outline-none focus:ring-2 focus:ring-accent-primary/50 resize-none font-mono"
        ></textarea>
      </div>

      <!-- Right: Preview -->
      <div class="flex flex-col min-h-0">
        <div class="mb-2 text-sm text-theme-muted font-medium">{{ $t('editor.previewLabel') }}</div>
        <div 
          class="flex-1 bg-theme-surface border border-theme-border rounded-xl p-6 overflow-auto markdown-preview"
          v-html="renderedContent"
        ></div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-4 p-3 bg-accent-error/10 border border-accent-error/20 rounded-lg text-accent-error text-sm">
      {{ errorMessage }}
    </div>

    <!-- Hidden Download Link -->
    <a ref="downloadLink" style="display: none"></a>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MarkdownIt from 'markdown-it'
import tm from 'markdown-it-texmath'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import axios from 'axios'

const { t } = useI18n()

const content = ref('')

onMounted(() => {
  content.value = '# Welcome to mdLaTeX2Word\n\nYou can type **Markdown** here and include *LaTeX* formulas like this:\n\nThe quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.\n\nOr block formulas:\n\n$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$\n\nFeel free to experiment!'
  // content.value = '# 欢迎使用 mdLaTeX2Word\n\n您可以直接在此输入 **Markdown** 内容，并包含 *LaTeX* 公式，例如：\n\n二次方程求根公式：$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$。\n\n或者块级公式：\n\n$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$\n\n尽情尝试吧！'
})

const isExporting = ref(false)
const errorMessage = ref('')
const downloadLink = ref(null)

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
}).use(tm, {
  engine: katex,
  delimiters: 'dollars',
  katexOptions: { 
    macros: { "\\RR": "\\mathbb{R}" },
    throwOnError: false 
  }
})

const renderedContent = computed(() => {
  return md.render(content.value)
})

const exportToWord = async () => {
  if (!content.value.trim()) return
  
  isExporting.value = true
  errorMessage.value = ''
  
  try {
    const response = await axios.post('/api/convert-content', {
      content: content.value,
      filename: 'online-editor-export.docx'
    })
    
    if (response.data.success) {
      const { downloadUrl, outputFilename } = response.data.data
      // In a real scenario, we might want to use a direct download via blob or window.open
      // but for consistency with the existing app flow, we use the downloadUrl
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', outputFilename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      throw new Error(response.data.message || 'Export failed')
    }
  } catch (error) {
    console.error('Export error:', error)
    errorMessage.value = error.response?.data?.message || error.message || 'An error occurred during export'
  } finally {
    isExporting.value = false
  }
}
</script>

<style>
.markdown-preview {
  color: var(--color-text);
}
.markdown-preview h1 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.markdown-preview h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
}
.markdown-preview p {
  margin-bottom: 1rem;
  line-height: 1.6;
  text-align: left;
}
.markdown-preview strong {
  font-weight: 600;
  color: var(--color-text);
}
.markdown-preview ul {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}
.markdown-preview ol {
  list-style-type: decimal;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}
.markdown-preview li {
  margin-bottom: 0.25rem;
  display: list-item;
}
.katex-display {
  margin: 1.5rem 0;
  padding: 1rem;
  background: var(--color-hover);
  border-radius: 0.5rem;
}
</style>
