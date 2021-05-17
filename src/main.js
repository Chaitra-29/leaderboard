import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Leaderboard from './components/Leaderboard'
import SignIn from './components/SignIn'

Vue.config.productionTip = false

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes:[
    {
      path:"/route/leaderboard",
      component: Leaderboard
    },
    {
      path:"/",
      component: SignIn
    }
  ]
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
