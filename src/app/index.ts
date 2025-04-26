import { t2Chrome } from "@util/i18n/chrome/t"
import { createApp } from 'vue'
import './element-plus'
import { initElementLocale } from './element-plus'
import Main from "./layout"
import installRouter from './router'
import './style'

function main() {
    const app = createApp(Main)
    installRouter(app)
    initElementLocale(app)
    const el = document.createElement('div')
    el.id = 'app'
    document.body.append(el)
    app.mount(el)
    document.title = t2Chrome(msg => msg.app.name)
}

main()