import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store.js'

import Login from '@/components/pages/Login'
import Register from '@/components/pages/Register'
import ConnectDevices from '@/components/pages/ConnectDevices'
import Calibration from '@/components/pages/Calibration'
import Neutral from '@/components/pages/Neutral'
import Session from '@/components/pages/Session'
import SelectSession from '@/components/pages/SelectSession'
import HelloWorld from '@/components/HelloWorld'
import Dashboard from '@/components/pages/Dashboard'
import AnalysisDashboard from '@/components/pages/AnalysisDashboard'
import ResetPassword from '@/components/pages/ResetPassword'
import NewPassword from '@/components/pages/NewPassword'
import RecycleBin from "@/components/pages/RecycleBin.vue";
import Subjects from "@/components/pages/Subjects.vue";
import ProfilePage from '@/components/pages/ProfilePage'
import License from '@/components/pages/License'

Vue.use(Router)

var router = new Router({
  mode: "history",
  base: "/",  
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/license',
      name: 'License',
      component: License
    },
    {
      path: '/register-nmbl',
      name: 'Register',
      component: Register
    },
    {
      path: '/sessions',
      alias: '/',
      name: 'SelectSession',
      component: SelectSession
    },
    {
      path: '/:id/connect-devices',
      name: 'ConnectDevicesForId',
      component: ConnectDevices
    },
    {
      path: '/connect-devices',
      name: 'ConnectDevices',
      component: ConnectDevices
    },
    {
      path: '/:id/calibration',
      name: 'Calibration',
      component: Calibration
    },
    {
      path: '/:id/neutral',
      name: 'Neutral',
      component: Neutral
    },
    {
      path: '/session/:id',
      name: 'Session',
      component: Session
    },
    {
      path: '/dashboard/:id',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/analysis-dashboard/:id/',
      name: 'AnalysisDashboard',
      component: AnalysisDashboard
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: ResetPassword
    },
    {
      path: '/new-password/:token',
      name: 'NewPassword',
      component: NewPassword
    },
    {
      path: '/recycle-bin',
      name: 'RecycleBin',
      component: RecycleBin
    },
    {
      path: '/subjects',
      name: 'Subjects',
      component: Subjects
    },
    {
      path: '/profile/:username/',
      name: 'ProfilePage',
      component: ProfilePage
    }
  ]
})

const routesWithOutAuth = [
  'Login',
  'Register',
  'Session',
  'ResetPassword',
  'NewPassword',
  'Dashboard',
  'AnalysisDashboard',
  'ProfilePage'
  
]

const routesRequireSession = [
  'ConnectDevicesForId',
  'Calibration',
  'Neutral'
]

const acceptedRoutes = [
  'Login',
  'Register',
  'License',
  'SelectSession',
  'ConnectDevices',
  'ConnectDevicesForId',
  'Calibration',
  'Neutral',
  'Session',
  'Dashboard',
  'AnalysisDashboard',
  'ResetPassword',
  'NewPassword',
  'RecycleBin',
  'Subjects',
  'ProfilePage'
]

router.beforeEach((to, from, next) => {
  // If the user has logged in (email OTP bypass: verified is set at login; see auth.checkToken for session restore).
  if (store.state.auth.loggedIn) {
    if (!store.state.auth.verified) {
      next({ name: 'Login' })
      return
    }
    let institutionalUse = localStorage.getItem('institutional_use')
    if (to.name !== 'License' && (institutionalUse === '' || institutionalUse === 'patient_care' || institutionalUse === 'sports_performance_assessment' || institutionalUse === 'use_in_company')) {
      next({ name: 'License' })
      return
    }

    if (!store.state.data.session && routesRequireSession.includes(to.name)) {
      next({ name: 'ConnectDevices' })
    } else if (acceptedRoutes.includes(to.name)) {
      next()
    } else {
      next({ name: 'SelectSession' })
    }
  } else {
    if (routesWithOutAuth.includes(to.name)) {
      next()
    } else {
      next({ name: 'Login' })
    }
  }
})

export default router
