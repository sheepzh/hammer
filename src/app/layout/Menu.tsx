import { ElMenu, ElMenuItem } from 'element-plus'
import { defineComponent, type StyleValue } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { type I18nKey, t } from '../locale'

type MenuInfo = {
    route: string
    title: I18nKey
}

const ALL_MENUS: MenuInfo[] = [
    {
        route: '/dict',
        title: msg => msg.menu.dictionary
    }, {
        route: '/setting',
        title: msg => msg.menu.setting
    }
]

const Menu = defineComponent(() => {
    const router = useRouter()
    const current = useRoute()

    return () => (
        <ElMenu
            defaultActive={current.path}
            style={{ height: '100%' } satisfies StyleValue}
        >
            {ALL_MENUS.map(({ route, title }) => (
                <ElMenuItem
                    index={route}
                    onClick={() => router.push(route)}>
                    <span class="non-selected">{t(title)}</span>
                </ElMenuItem>
            ))}
        </ElMenu >
    )
})

export default Menu