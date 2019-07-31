import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import History from '@/components/History'
import Upload from '@/components/Upload'
import Role from '@/components/Role'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/Index',
      name: 'index',
      component: Index,
      children:[{
        path:'/History',
        component:History,
      },{
        path:'/Upload',
        component:Upload,
      },
      {
        path:'/Role',
        component:Role,
      },]
    },
    {
      path: '/Login',
      name: 'login',
      component: Login,
    },{
      path: '/',
      component: Upload,
      redirect:'/Upload',
    }
  ]
})
