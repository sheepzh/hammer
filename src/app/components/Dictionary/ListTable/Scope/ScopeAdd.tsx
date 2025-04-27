import { t } from '@app/locale'
import { DocumentCopy, Plus } from '@element-plus/icons-vue'
import clipboardy from 'clipboardy'
import { ElButton, ElCol, ElInput, ElMessage, ElOption, ElRow, ElSelect, ElSwitch, ElTooltip, type InputInstance } from 'element-plus'
import { defineComponent, ref } from 'vue'

type Props = {
    onSave: (scope: XGFLFG.Scope) => void
}

const ALL_TYPES: XGFLFG.ScopeType[] = ['url', 'host']

const ScopeAdd = defineComponent<Props>(({ onSave }) => {
    const useReg = ref(false)
    const pattern = ref('')
    const type = ref<XGFLFG.ScopeType>('host')
    const input = ref<InputInstance>()

    const save = (_ctx: any) => {
        const patternVal = pattern.value
        const useRegVal = useReg.value
        const typeVal = type.value

        if (!patternVal) {
            ElMessage.error(t(msg => msg.dict.msg.noUrlError))
            return input.value?.focus()
        }
        if (useRegVal) {
            // Check the regular expression is valid
            try {
                new RegExp(patternVal)
            } catch (e) {
                ElMessage.error(t(msg => msg.dict.msg.invalidRegularError))
                return input.value?.focus()
            }
        }
        onSave({ useReg: useRegVal, pattern: patternVal, type: typeVal })
        pattern.value = ''
        input.value?.focus()
    }

    return () => (
        <ElRow gutter={20}>
            <ElCol span={2} class='reg-switch-cell'>
                <ElTooltip content={t(msg => msg.dict.msg.useRegularMsg)} placement="left">
                    <ElSwitch modelValue={useReg.value} onChange={val => useReg.value = !!val} />
                </ElTooltip>
            </ElCol>
            <ElCol span={22}>
                <ElInput
                    ref={input}
                    class='scope-input'
                    modelValue={pattern.value}
                    placeholder={t(msg => msg.dict.msg.urlPlaceholder)}
                    clearable
                    onInput={val => pattern.value = val?.trim?.()}
                    onClear={() => pattern.value = ''}
                    onKeydown={ev => (ev as KeyboardEvent).code === 'Enter' && save({ useReg, pattern, input })}
                    v-slots={{
                        prepend: () => (
                            <ElSelect modelValue={type.value} onChange={val => type.value = val}>
                                {ALL_TYPES.map(type => (
                                    <ElOption label={t(msg => msg.item.scopeType[type])} value={type} />
                                ))}
                            </ElSelect>
                        ),
                        append: () => <>
                            <ElButton icon={Plus} onClick={save}>
                                {t(msg => msg.dict.button.add)}
                            </ElButton>
                            <ElButton
                                icon={DocumentCopy}
                                onClick={() => clipboardy.read().then(val => pattern.value = val.trim())}
                            >
                                {t(msg => msg.dict.button.paste)}
                            </ElButton>
                        </>,
                    }}
                />
            </ElCol>
        </ElRow>
    )
}, { props: ['onSave'] })

export default ScopeAdd