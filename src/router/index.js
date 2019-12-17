import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import Organize from '@/components/Organize'
import Equipment from '@/components/Equipment'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/Index',
      name: 'index',
      component: Index,
      children:[{
        path:'/Organize',
        component:Organize,
      },
      {
        path:'/Equipment',
        component:Equipment,
      },]
    },
    {
      path: '/Login',
      name: 'login',
      component: Login,
    },{
      path: '/',
      component: Organize,
      redirect:'/Organize',
    }
  ]
})
