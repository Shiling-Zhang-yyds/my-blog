import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('../views/HomePage.vue')
    },
    {
        path: '/login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/home',
        redirect: '/home/article',
        component: () => import('../views/dashboard/DashBoard.vue'),
        children: [
            {
                path: '/home/category',
                component: () => import('../views/dashboard/Category.vue')
            },
            {
                path: '/home/article',
                component: () => import('../views/dashboard/Article.vue')
            }
        ]
    },
    {
        path: '/detail',
        component: ()=>import('../views/dashboard/Detail.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export { router, routes }