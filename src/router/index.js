// 路由配置
import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const Mailstart=()=>import ("../views/mailstart/index.vue") 
const Testcode=()=>import ("../views/testcode/index.vue") 
const Maildetail=()=>import ("../views/maildetail/index.vue") 


const router =new VueRouter({
    // mode:"history",
    base:"/",
    // base:process.env.BASE_URL,
    routes:[
        {path:"//:id?",name:"index",component:Mailstart},
        {path:"/testcode/:id?",name:"testcode",component:Testcode},
        {path:"/maildetail/:id?",name:"maildetail",component:Maildetail}
    ],
})

router.beforeEach((to,form,next)=>{
    next()
})

export default router
