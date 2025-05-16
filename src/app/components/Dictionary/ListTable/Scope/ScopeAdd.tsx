import Flex from '@app/layout/Flex'
import { t } from '@app/locale'
import { DocumentCopy, Plus } from '@element-plus/icons-vue'
import clipboardy from 'clipboardy'
import { ElButton, ElCol, ElInput, ElMessage, ElOption, ElRow, ElSelect, ElSwitch, ElTooltip, type InputInstance } from 'element-plus'
import { defineComponent, ref, StyleValue } from 'vue'

type Props = {
    onSave: (scope: XGFLFG.Scope) => void
}

const ALL_TYPES: XGFLFG.ScopeType[] = ['url', 'host']

const APPEND_BTN_STYLE: StyleValue = {
    marginInline: 0,
    padding: 0,
    display: 'flex',
}

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
        <Flex gap={15}>
            <ElTooltip content={t(msg => msg.dict.msg.useRegularMsg)} placement="left">
                <ElSwitch modelValue={useReg.value} onChange={val => useReg.value = !!val} />
            </ElTooltip>
            <Flex flex={1}>
                <ElInput
                    ref={input}
                    modelValue={pattern.value}
                    placeholder='www.github.com, https://*.github.com/sheepzh/**'
                    clearable
                    onInput={val => pattern.value = val?.trim?.()}
                    onClear={() => pattern.value = ''}
                    onKeydown={ev => (ev as KeyboardEvent).code === 'Enter' && save({ useReg, pattern, input })}
                    v-slots={{
                        prepend: () => (
                            <ElSelect
                                modelValue={type.value}
                                onChange={val => type.value = val}
                                style={{
                                    "--el-select-width": "100px",
                                } as StyleValue}
                            >
                                {ALL_TYPES.map(type => (
                                    <ElOption label={t(msg => msg.item.scopeType[type])} value={type} />
                                ))}
                            </ElSelect>
                        ),
                        append: () => (
                            <Flex gap={10} marginInline={-10}>
                                <ElButton icon={Plus} onClick={save} style={APPEND_BTN_STYLE}>
                                    {t(msg => msg.dict.button.add)}
                                </ElButton>
                                <ElButton
                                    icon={DocumentCopy}
                                    onClick={() => clipboardy.read().then(val => pattern.value = val.trim())}
                                    style={APPEND_BTN_STYLE}
                                >
                                    {t(msg => msg.dict.button.paste)}
                                </ElButton>
                            </Flex>
                        ),
                    }}
                />
            </Flex>
        </Flex>
    )
}, { props: ['onSave'] })

export default ScopeAdd