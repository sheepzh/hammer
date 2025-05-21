import Flex from '@app/layout/Flex'
import { t } from '@app/locale'
import dictionaryDb from '@db/dictionary-db'
import { useManualRequest, useRequest } from '@src/hooks/useRequest'
import { ElDialog, ElMessage } from 'element-plus'
import { defineComponent, ref, toRaw } from 'vue'
import ScopeTest from '../../Test'
import ScopeAdd from './ScopeAdd'
import ScopeTag from './ScopeTag'

export type ScopeInstance = { open: ArgCallback<XGFLFG.Dictionary> }

const keyOf = ({ type, pattern }: XGFLFG.Scope) => type + pattern

const Scope = defineComponent<{ onClose: NoArgCallback }>((props, ctx) => {
    const visible = ref(false)
    const dictId = ref(0)
    const dictName = ref('')
    const scopeArr = ref<XGFLFG.Scope[]>([])

    useManualRequest(() => {
        if (!visible.value) return
        const data: XGFLFG.Scopes = {}
        scopeArr.value.forEach(scope => {
            const key = scope.type + scope.pattern
            data[key] = toRaw(scope)
        })
        dictionaryDb.updateScopes(dictId.value, data)
    }, { deps: scopeArr })

    const { data: listKey } = useRequest(() => Date.now(), { deps: scopeArr })

    const handleAdd = (scope: XGFLFG.Scope) => {
        const key = keyOf(scope)
        scopeArr.value = [...scopeArr.value.filter(s => key !== keyOf(s)), scope]
        ElMessage.success(t(msg => msg.dict.msg.savedSuccessfully))
    }

    const handleDelete = (scope: XGFLFG.Scope) => {
        const key = keyOf(scope)
        scopeArr.value = scopeArr.value.filter(s => key !== keyOf(s))
        ElMessage.success(t(msg => msg.dict.msg.deletedSuccessfully))
    }

    const open = ({ id, name, scopes }: XGFLFG.Dictionary) => {
        dictId.value = id
        dictName.value = name ?? 'NaN'
        scopeArr.value = Object.values(scopes)
        visible.value = true
    }

    const close = () => {
        visible.value = false
        props.onClose?.()
    }

    ctx.expose({ open } satisfies ScopeInstance)

    return () => (
        <ElDialog
            width="80%"
            title={`${t(msg => msg.item.scope)} - ${dictName.value}`}
            modelValue={visible.value}
            onClosed={close}
        >
            <Flex width="100%" column gap={15}>
                <Flex column gap={15}>
                    <ScopeTest scopes={scopeArr.value} />
                    <ScopeAdd onSave={handleAdd} />
                </Flex>
                <Flex key={listKey.value} wrap>
                    {scopeArr.value.map(s => (<ScopeTag value={s} onClose={() => handleDelete(s)} />))}
                </Flex>
            </Flex>
        </ElDialog>
    )
}, { props: ['onClose'] })

export default Scope