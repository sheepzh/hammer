import Flex from '@app/layout/Flex'
import { t } from '@app/locale'
import dictionaryDb from '@db/dictionary-db'
import { useManualRequest, useRequest } from '@src/hooks/useRequest'
import { ElMessage } from 'element-plus'
import { defineComponent, ref, toRaw } from 'vue'
import ScopeAdd from './ScopeAdd'
import ScopeTag from './ScopeTag'
import ScopeTest from '../../Test'

type Props = {
    dictId: number
    scopes: XGFLFG.Scopes
}

const keyOf = ({ type, pattern }: XGFLFG.Scope) => type + pattern

const Scope = defineComponent<Props>(props => {
    const scopes = ref<XGFLFG.Scope[]>(Object.values(props.scopes ?? {}))

    useManualRequest(() => {
        const data: XGFLFG.Scopes = {}
        scopes.value.forEach(scope => {
            const key = scope.type + scope.pattern
            data[key] = toRaw(scope)
        })
        dictionaryDb.updateScopes(props.dictId, data)
    }, { deps: scopes })

    const { data: listKey } = useRequest(() => Date.now(), { deps: scopes })

    const handleAdd = (scope: XGFLFG.Scope) => {
        const key = keyOf(scope)
        scopes.value = [...scopes.value.filter(s => key !== keyOf(s)), scope]
        ElMessage.success(t(msg => msg.dict.msg.savedSuccessfully))
    }

    const handleDelete = (scope: XGFLFG.Scope) => {
        const key = keyOf(scope)
        scopes.value = scopes.value.filter(s => key !== keyOf(s))
        ElMessage.success(t(msg => msg.dict.msg.deletedSuccessfully))
    }

    return () => (
        <Flex width="100%" column gap={15}>
            <Flex column gap={15}>
                <ScopeTest scopes={props.scopes} />
                <ScopeAdd onSave={handleAdd} />
            </Flex>
            <Flex key={listKey.value} wrap>
                {scopes.value.map(s => (<ScopeTag value={s} onClose={() => handleDelete(s)} />))}
            </Flex>
        </Flex>
    )
}, { props: ['dictId', 'scopes'] })

export default Scope