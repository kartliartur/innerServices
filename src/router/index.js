import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    fullPath: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/tracking',
    name: 'tracking',
    component: () => import('../views/Tracking.vue'),
    meta: {
      requiresAuth: true
    }
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
    let flag = false;
    let arr = [];
    for (let i in store.getters.getRoleLinks) {
      let item = store.getters.getRoleLinks[i];
      for (let j in role) {
        if (role[j] == item.name) {
          for (let i in item.links) {
            arr.push(item.links[i])
          }
        } 
      }
    }

    const availableLinks = Array.from(new Set(arr.map(item => item.link)));
    //window.console.log(availableLinks)
    availableLinks.forEach(link => {
      if (link == to.fullPath) {
        flag = true;
      }
    });
    if (flag) {
      next();
    } else {
      router.push({ path: availableLinks[0]})
    }
  } else {
    next()
  }
})


export default router
