import { ElAside, ElContainer, ElMain } from 'element-plus'
import { defineComponent, type StyleValue } from 'vue'
import { RouterView } from 'vue-router'
import Menu from './Menu'

const Main = defineComponent(() => {
    return () => (
        <ElContainer style={{ height: '100vh' } satisfies StyleValue}>
            <ElAside style={{ width: '240px' } satisfies StyleValue}>
                <Menu />
            </ElAside>
            <ElContainer>
                <ElMain>
                    <RouterView />
                </ElMain>
            </ElContainer>
        </ElContainer>
    )
})

export default Main

