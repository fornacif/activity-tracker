import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from './components/Dashboard.vue'
const firebase = require('./firebaseConfig.js')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: function () {
      return import('./components/Login.vue')
    }
  },
  {
    path: '/activities',
    name: 'Activities',
    component: function () {
      return import('./components/Activities.vue')
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/activity',
    name: 'Activity',
    component: function () {
      return import('./components/Activity.vue')
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/map',
    name: 'Map',
    component: function () {
      return import('./components/Map.vue')
    },
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
  const requiresAuth = to.matched.some(param => param.meta.requiresAuth);

  firebase.auth.onAuthStateChanged(function(user) {
    if (requiresAuth && !user) {
      next('/login')
    } else if (requiresAuth && user) {
        next()
    } else {
        next()
    }
  });

})

export default router
