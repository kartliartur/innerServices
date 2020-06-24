import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import Home from '../views/Home.vue'
import store from '../store'
import Funcs from '../assets/js-funcs/default-funcs.js'

Vue.use(VueRouter)
Vue.use(axios)

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
  if (Funcs.getCookie() === null && to.fullPath != '/') {
    router.push({ path: '/' })
  } else if (Funcs.getCookie() !== null) {
    const data = {
      session: Funcs.getCookie()
    }
    axios
    .post(store.getters.getLinkByName('auth','login'), data)
    .then(res => {
      window.console.log(res.data);
      if (!res.data.error) {
        if (res.data.data.Access_Groups == undefined || res.data.data.Access_Groups == null || res.data.data.Access_Groups.length == 0) {
          if (to.fullPath != '/')
            router.push({ path: '/' });
        } else {
          localStorage.setItem('user', res.data.data.first_name + res.data.data.last_name);
          //localStorage.setItem('token', cooks);
          //localStorage.setItem('dept', res.data.data.Dept)
          let roles = [];
          for (let i in res.data.data.Access_Groups) {
            let item = res.data.data.Access_Groups[i];
            for (let j in store.state.rolesLinks) {
              let role = store.state.rolesLinks[j];
              if (item == role.name) {
                roles.push(item);
                break;
              }
            }
          }
          if (roles.length === 0 && to.fullPath != '/') {
            router.push({ path: '/' });
          } else
            localStorage.setItem('role', roles);
          if (localStorage.getItem('token') != null) {
            this.$emit('loggedIn')
            if(this.$route.params.nextUrl != null){
              router.push(this.$route.params.nextUrl)
            } else {
              router.push('/tracking');
            }
          }
        }
      } else {
        if (to.fullPath != '/')
          router.push({ path: '/' });
      }
    })
    .catch(() => {
      router.push({ path: '/' });
    });
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

    const availableLinks = Funcs.uniqueItem(arr);
    availableLinks.forEach(item => {
      if (item.link == to.fullPath) {
        flag = true;
      }
    });
    if (flag) {
      next();
    } else {
      router.push({ path: availableLinks[0].link})
    }
  } else {
    next()
  }
})


export default router
