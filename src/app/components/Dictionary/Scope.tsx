import { ElSpace } from 'element-plus'
import { defineComponent } from 'vue'
import ScopeAdd from './scope-add'
import ScopeList from './scope-list'
import ScopeTest from './scope-test'
import './style/scope'

interface Props {
    scopes: XGFLFG.Scopes
    onScopeAdd?: (scope: XGFLFG.Scope) => void
    onScopeDelete?: (key: string) => void
}

const Scope = defineComponent<Props>(props => {
    return () => {
        <ElSpace direction="vertical" style="width:100%">
            <ScopeTest scopes={props.scopes} />
            <ScopeAdd onSaved={scope => props.onScopeAdd?.(scope)} />
            <div style={{ height: '15px', width: '100%' }} />
            <ScopeList
                scopes={props.scopes}
                closable
                onDeleted={key => props.onScopeDelete?.(key)}
            />
        </ElSpace>
    }
}, { props: ['scopes', 'onScopeAdd', 'onScopeDelete'] })

export default Scope