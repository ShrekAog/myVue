import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import nProgress from 'nprogress'
import store from './store/store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/css/index.css'
import './assets/css/animation.css'
import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'
nProgress.inc(0.2)
nProgress.configure({easing:'ease',speed:560,showSpinner:false})
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(store)
app.mount('#app')
