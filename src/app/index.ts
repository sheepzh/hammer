import { t2Chrome } from "@util/i18n/chrome/t"
import 'element-plus/theme-chalk/index.css'
import { createApp } from 'vue'
import './element-plus'
import { initElementLocale } from './element-plus'
import Main from "./layout"
import installRouter from './router'
import './style/index.sass'

async function main() {
    const app = createApp(Main)
    await initElementLocale(app)

    installRouter(app)
    const el = document.createElement('div')
    document.body.append(el)
    el.id = 'app'
    app.mount(el)
    document.title = t2Chrome(msg => msg.app.name)
}

main()