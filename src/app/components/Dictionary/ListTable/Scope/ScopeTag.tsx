import Flex from "@app/layout/Flex"
import { t } from "@app/locale"
import { Collection, Link } from "@element-plus/icons-vue"
import { ElIcon, ElTag, ElTooltip } from "element-plus"
import { defineComponent, type StyleValue, toRef } from "vue"

type Props = {
    value: XGFLFG.Scope
    onClose?: () => void
}

const ScopeTag = defineComponent<Props>(props => {
    const scope = toRef(props, 'value')

    return () => (
        <ElTag
            disableTransitions
            closable={!!props.onClose}
            onClose={props.onClose}
            style={{ marginInlineEnd: '6px', marginBottom: '6px' } satisfies StyleValue}
            type={scope.value.useReg ? 'warning' : undefined}
        >
            <ElTooltip
                content={`${t(msg => msg.item.scopeType[scope.value.type])}${scope.value.useReg ? t(msg => msg.item.useRegSuffix) : ''}`}
                placement="bottom"
                effect="light"
            >
                <Flex gap={2} align='center'>
                    <ElIcon>
                        {scope.value.type === 'url' ? <Link /> : <Collection />}
                    </ElIcon>
                    {scope.value.pattern}
                </Flex>
            </ElTooltip>
        </ElTag>
    )
}, { props: ['onClose', 'value'] })

export default ScopeTag