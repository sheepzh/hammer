import { ElAside, ElContainer, ElMain } from 'element-plus'
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import Menu from './Menu'

const Main = defineComponent(() => {
  return () => (
    <ElContainer>
      <ElAside>
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

