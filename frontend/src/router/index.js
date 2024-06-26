import { createRouter, createWebHashHistory } from 'vue-router'
import routerMap from './routerMap'

const Router = createRouter({
  history: createWebHashHistory(),
  routes: routerMap,
})

// Router.beforeEach((to, from, next) => {
//   // Router.push({ name: 'SpecialLoginWindow', params: {}});
//   debugger
//   if (to.name == 'SpecialLoginWindow') {
//     next()
//   } else {
//     const 
//     next({
//       name: 'SpecialLoginWindow', params: {}
//     })
//   }
// })

export default Router
