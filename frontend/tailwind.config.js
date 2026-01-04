/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#0a0a0a',
                    surface: '#1a1a1a',
                    border: '#2a2a2a',
                    hover: '#252525',
                    text: '#e5e5e5',
                    muted: '#a0a0a0',
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
