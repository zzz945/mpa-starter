/* eslint-disable */
import App from './App.vue'
import routes from './routes.js'
import { pageInit } from 'utils/_spa-common.js'
import './index.styl'

pageInit({
  routes,
  vue: {
    render: h => h(App)
  },
})