import { createI18n } from 'vue-i18n'

const messages = {
    en: {
        app: {
            title: 'MD LaTeX Online',
            subtitle: 'Markdown + LaTeX → Word',
            toggleTheme: 'Toggle Theme',
            version: 'v1.1.0'
        },
        nav: {
            home: 'Home',
            editor: 'Online Editor'
        },
        home: {
            heroTitle: 'Convert Your {tag} Files',
            heroSubtitle: 'Upload Markdown files with LaTeX formulas and convert them to Word documents instantly',
            tryEditor: 'Try Online Editor',
            errorTitle: 'Error',
            feature1Title: 'Easy Upload',
            feature1Desc: 'Drag & drop or click to upload your Markdown files',
            feature2Title: 'LaTeX Support',
            feature2Desc: 'Full support for LaTeX mathematical formulas',
            feature3Title: 'Instant Download',
            feature3Desc: 'Get your Word document ready in seconds',
            convertingStatus: 'Converting your file...',
            conversionSuccess: 'Conversion completed successfully!',
            conversionError: 'Conversion failed'
        },
        editor: {
            back: 'Back',
            title: 'Online Editor',
            exportBtn: 'Export to Word',
            exportingBtn: 'Exporting...',
            markdownLabel: 'Markdown + LaTeX',
            placeholder: 'Type your markdown here... (e.g., $E=mc^2$)',
            previewLabel: 'Real-time Preview',
            defaultContent: '# Welcome to mdLaTeX2Word\n\nYou can type **Markdown** here and include *LaTeX* formulas like this:\n\nThe quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.\n\nOr block formulas:\n\n$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$\n\nFeel free to experiment!'
        },
        upload: {
            title: 'Upload Your File',
            subtitle: 'Supports .md, .markdown, and .tex files (max 10MB)',
            dropHere: 'Drop your file here',
            dragDrop: 'Drag & drop your file here',
            browse: 'or click to browse',
            btn: 'Upload & Convert',
            uploading: 'Uploading...',
            errorType: 'Invalid file type. Please upload a .md, .markdown, or .tex file.',
            errorSize: 'File size exceeds 10MB limit.',
            errorUpload: 'Failed to upload file'
        },
        status: {
            converting: 'Converting...',
            success: 'Success!',
            error: 'Failed'
        },
        download: {
            ready: 'Document Ready!',
            btn: 'Download'
        },
        footer: {
            builtBy: 'Built by Mofeiyu Tech'
        }
    },
    zh: {
        app: {
            title: 'MD LaTeX 在线',
            subtitle: 'Markdown + LaTeX → Word',
            toggleTheme: '切换主题',
            version: 'v1.1.0'
        },
        nav: {
            home: '首页',
            editor: '在线编辑器'
        },
        home: {
            heroTitle: '转换您的 {tag} 文件',
            heroSubtitle: '上传带有 LaTeX 公式的 Markdown 文件，立即转换为 Word 文档',
            tryEditor: '试试在线编辑器',
            errorTitle: '错误',
            feature1Title: '便捷上传',
            feature1Desc: '拖拽或点击上传您的 Markdown 文件',
            feature2Title: 'LaTeX 支持',
            feature2Desc: '完美支持 LaTeX 数学公式',
            feature3Title: '即时下载',
            feature3Desc: '数秒内即可生成 Word 文档',
            convertingStatus: '正在转换文件...',
            conversionSuccess: '转换成功！',
            conversionError: '转换失败'
        },
        editor: {
            back: '返回',
            title: '在线编辑器',
            exportBtn: '导出为 Word',
            exportingBtn: '正在导出...',
            markdownLabel: 'Markdown + LaTeX',
            placeholder: '在此输入 Markdown 内容... (例如: $E=mc^2$)',
            previewLabel: '实时预览', 
        },
        upload: {
            title: '上传文件',
            subtitle: '支持 .md, .markdown 和 .tex 文件 (最大 10MB)',
            dropHere: '松开鼠标以上传',
            dragDrop: '拖拽文件至此',
            browse: '或点击浏览文件',
            btn: '上传并转换',
            uploading: '正在上传...',
            errorType: '文件格式错误。请上传 .md, .markdown 或 .tex 文件。',
            errorSize: '文件大小超过 10MB 限制。',
            errorUpload: '上传文件失败'
        },
        status: {
            converting: '正在转换...',
            success: '成功！',
            error: '失败'
        },
        download: {
            ready: '文档已就绪！',
            btn: '下载'
        },
        footer: {
            builtBy: '墨飞鱼科技   |  粤ICP备2021051584号 '
        }
    }
}

// Get initial locale from localStorage or browser settings
const getInitialLocale = () => {
    const savedLocale = localStorage.getItem('locale')
    if (savedLocale) return savedLocale

    const browserLocale = navigator.language.split('-')[0]
    return messages[browserLocale] ? browserLocale : 'en'
}

const i18n = createI18n({
    legacy: false,
    locale: getInitialLocale(),
    fallbackLocale: 'en',
    messages,
})

export default i18n
