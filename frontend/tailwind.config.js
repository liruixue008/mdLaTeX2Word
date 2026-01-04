/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                theme: {
                    bg: 'rgb(var(--color-bg) / <alpha-value>)',
                    surface: 'rgb(var(--color-surface) / <alpha-value>)',
                    border: 'rgb(var(--color-border) / <alpha-value>)',
                    hover: 'rgb(var(--color-hover) / <alpha-value>)',
                    text: 'rgb(var(--color-text) / <alpha-value>)',
                    muted: 'rgb(var(--color-muted) / <alpha-value>)',
                },
                accent: {
                    primary: '#3b82f6',
                    secondary: '#8b5cf6',
                    success: '#10b981',
                    error: '#ef4444',
                    warning: '#f59e0b',
                }
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 3s linear infinite',
            }
        },
    },
    plugins: [],
}
