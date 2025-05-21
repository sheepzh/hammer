import { type App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dict'
    }, {
        path: '/dict',
        component: () => import('./components/Dictionary')
    },
    {
        path: '/setting',
        component: () => import('./components/Setting')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})


export default function installRouter(app: App): void {
    app.use(router)
}
