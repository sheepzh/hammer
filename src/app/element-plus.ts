import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/theme-chalk/index.css'
import type { App } from 'vue'

export const initElementLocale = async (app: App) => {
    app.use(ElementPlus, { locale })
}