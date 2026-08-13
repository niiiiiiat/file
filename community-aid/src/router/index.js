import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/HomePage.vue') },
  { path: '/volunteer/register', name: 'VolunteerRegister', component: () => import('@/views/VolunteerRegisterPage.vue') },
  { path: '/requester/register', name: 'RequesterRegister', component: () => import('@/views/RequesterRegisterPage.vue') },
  {
    path: '/volunteer/dashboard',
    name: 'VolunteerDashboard',
    component: () => import('@/views/VolunteerDashboard.vue'),
    meta: { requiresAuth: true, role: 'volunteer' }
  },
  {
    path: '/requester/dashboard',
    name: 'RequesterDashboard',
    component: () => import('@/views/RequesterDashboard.vue'),
    meta: { requiresAuth: true, role: 'requester' }
  },
  {
    path: '/request/new',
    name: 'PostRequest',
    component: () => import('@/views/PostRequestPage.vue'),
    meta: { requiresAuth: true, role: 'requester' }
  },
  {
    path: '/resources',
    name: 'Resources',
    component: () => import('@/views/ResourceListPage.vue'),
    meta: { requiresAuth: true }
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('/')
  } else if (to.meta.role && auth.user?.role !== to.meta.role) {
    next('/')
  } else {
    next()
  }
})

export default router
