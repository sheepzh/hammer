import { t } from '@app/locale'
import { ElTag, ElTooltip } from 'element-plus'
import { defineComponent } from 'vue'

type Props = {
    scopes: XGFLFG.Scopes
    closable?: boolean
    onDeleted?: (key: string) => void
}

const ScopeList = defineComponent<Props>(props => {
    return () => (
        <div>
            {Object.entries(props.scopes).map(([key, scope]) => (
                <ElTag
                    key={key}
                    closable={props.closable}
                    onClose={() => props.onDeleted?.(key)}
                    style="margin-right:6px;margin-bottom:6px;"
                    type={scope.useReg ? 'warning' : undefined}
                >
                    <ElTooltip
                        content={`${t(msg => msg.item.scopeType[scope.type])}${scope.useReg ? t(msg => msg.item.useRegSuffix) : ''}`}
                        placement="bottom"
                        effect="light"
                    >
                        <span>
                            <i class={`el-icon-${scope.type === 'url' ? 'link' : 'collection'}`} style="margin-right:4px" />
                            {scope.pattern}
                        </span>
                    </ElTooltip>
                </ElTag>
            ))}
        </div>
    )
}, { props: ['scopes', 'closable'] })

export default ScopeList