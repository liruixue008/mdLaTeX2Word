import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EditorView from '../views/EditorView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/editor',
        name: 'editor',
        component: EditorView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
