// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(ElementUI);
Vue.use(router);
Vue.use(iView);
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.config.productionTip = false
// 路由拦截
router.beforeEach((to, from, next) => {
  const role = sessionStorage.getItem('id');
  if (!role && to.path !== '/Login') {
    next('/Login');
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入
    role === 'admin' ? next() : next('/403');
  } else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      });
    } else {
      next();
    }
  }
})
//请求头添加token
axios.interceptors.request.use(
  config => {
    if (sessionStorage.getItem('token')) {
      config.headers.authStr = sessionStorage.getItem('token');
    }
 
    return config;
  },
  error => {
    return Promise.reject(error);
  });
  // 响应拦截
  axios.interceptors.response.use((res) => {
    if (res.data.code ==504) {
      console.log(res)
      // this.$Message.error('token过期，请重新登录！')
      router.push("/Login")
      
    //其余错误状态处理    
    }else if(res.data.code ==526){
      this.$message.warning('没有该操作权限')
    }
    return res
  }, function (error) {
    return Promise.reject(error);
  });
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
