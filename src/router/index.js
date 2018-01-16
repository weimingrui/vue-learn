import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import LogMessage from "@/components/LogMessage"
import LogMessage2 from "@/components/LogMessage2"
import Login from "@/components/Login"
import HeaderLayout from "@/components/HeaderLayout"
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path:"/logmessage2",
      //path:"/logmessage2/:type/:id",
      name:"LogMessage2",
      component:LogMessage2
    },
    {
    	path:"/logmessage",
    	//path:"/logmessage/:type/:id",
    	name:"LogMessage",
    	component:LogMessage
    },
    {
      path:"/login",
      name:"login",
      component:Login
    }
  ]
})
