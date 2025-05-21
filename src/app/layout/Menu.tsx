import { Notebook, Setting } from '@element-plus/icons-vue'
import { ElIcon, ElMenu, ElMenuItem } from 'element-plus'
import { defineComponent, h, type Component, type StyleValue } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { t, type I18nKey } from '../locale'
import Flex from './Flex'

type MenuInfo = {
    icon: Component
    route: string
    title: I18nKey
}

const ALL_MENUS: MenuInfo[] = [
    {
        icon: Notebook,
        route: '/dict',
        title: msg => msg.menu.dictionary
    }, {
        icon: Setting,
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
            style={{
                height: '100%',
                width: '100%',
                backgroundColor: 'var(--el-menu-bg-color)',
                border: 'none',
            } satisfies StyleValue}
        >
            {ALL_MENUS.map(({ icon, route, title }) => (
                <ElMenuItem
                    index={route}
                    onClick={() => router.push(route)}
                    style={{
                        backgroundColor: route === current.path ? 'var(--el-menu-item-active-bg-color)' : undefined
                    } satisfies StyleValue}
                >
                    <Flex gap={8} align="center" color='var(--el-menu-text-color)' style={{ userSelect: "none" }}>
                        <ElIcon>
                            {h(icon)}
                        </ElIcon>
                        {t(title)}
                    </Flex>
                </ElMenuItem>
            ))}
        </ElMenu >
    )
})

export default Menu