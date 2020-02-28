import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Home from '../views/Home.vue'

Vue.use(VueRouter)
Vue.use(Vuex)

const routes = [
  {
    path: '/',
    fullPath: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/logist',
    name: 'logist',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Logistic.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashBoard',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/missions',
    name: 'missions',
    component: () => import('../views/Missions.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/sellers',
    name: 'sellers',
    component: () => import('../views/Sellers.vue'),
    meta: {
      requiresAuth: true
    }
  },  
  {
    path: '/security',
    name: 'security',
    component: () => import('../views/Security.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tracking',
    name: 'tracking',
    component: () => import('../views/Tracking.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if ((localStorage.getItem('token') == null || localStorage.getItem('token') == undefined) && to.fullPath != '/') {
    router.push({ path: '/' })
  } else if (localStorage.getItem('token') != null && localStorage.getItem('token') != undefined) {
    let role = localStorage.getItem('role').split(',');
    window.console.log(Vuex.Store);
    if (role == 'Руководитель отдела') {
      if (to.fullPath != '/missions' && to.fullPath != "/sellers")
        router.push({ path: '/missions' })
      else
        next()
    } else if (role == 'Юридическая служба (СБ)' && to.fullPath != '/security') {
      router.push({ path: '/security' })
    } else if (role == 'Логист') {
      if ( to.fullPath != '/logist' &&  to.fullPath != '/tracking') {
        router.push({ path: '/logist' })
      }
      else
        next()
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
