import { locale } from "@app/locale"
import ElementPlus from 'element-plus'
import type { Language } from 'element-plus/es/locale'
import 'element-plus/theme-chalk/index.css'
import type { App } from 'vue'

const LOCALES: { [locale in XGFLFG.Locale]: () => Promise<{ default: Language }> } = {
    zh_CN: () => import('element-plus/lib/locale/lang/zh-cn'),
    en: () => import('element-plus/lib/locale/lang/en'),
}

export const initElementLocale = async (app: App) => {
    const module = await LOCALES[locale]?.()
    const elLocale = module?.default
    app.use(ElementPlus, { locale: elLocale })
}
