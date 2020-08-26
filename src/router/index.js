import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/Login.vue'
import home from '../components/home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
// 导入全局样式表
import '../assets/css/global.css'
//  导入字体图标
import '../assets/fonts/iconfont.css'
import axios from 'axios'
// import { config } from 'vue/types/umd'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// request 为axios请求拦截器
axios.interceptors.request.use(config => {
  // 为请求对象,添加token验证的authorization字段
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})
Vue.prototype.$http = axios
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
      path: '/home',
      component: home,
      redirect: '/welcome',
      children: [{ path: '/welcome', component: Welcome }, { path: '/users', component: Users }]
    }
  ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
// to 要访问的地址， from从哪个页面跳转， next 一个函数 表示放行
// next() 表示放行 next('/login')表示强制跳转到login页面
  if (to.path === '/login') return next()
  // 获取token
  const sessStr = window.sessionStorage.getItem('token')
  if (!sessStr) return next('/login')
  next()
})
export default router
