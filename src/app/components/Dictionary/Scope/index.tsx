import Flex from '@app/layout/Flex'
import { defineComponent } from 'vue'
import './scope.sass'
import ScopeAdd from './ScopeAdd'
import ScopeList from './ScopeList'
import ScopeTest from './ScopeTest'

type Props = {
    scopes: XGFLFG.Scopes
    onScopeAdd?: (scope: XGFLFG.Scope) => void
    onScopeDelete?: (key: string) => void
}

const Scope = defineComponent<Props>(props => {
    return () => {
        <Flex>
            <ScopeTest scopes={props.scopes} />
            <ScopeAdd onSave={scope => props.onScopeAdd?.(scope)} />
            <div style={{ height: '15px', width: '100%' }} />
            <ScopeList
                scopes={props.scopes}
                closable
                onDeleted={key => props.onScopeDelete?.(key)}
            />
        </Flex>
    }
}, { props: ['scopes', 'onScopeAdd', 'onScopeDelete'] })

export default Scope