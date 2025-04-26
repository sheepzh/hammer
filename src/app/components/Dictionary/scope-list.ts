import { ElTag, ElTooltip } from 'element-plus'
import { defineComponent, h, reactive } from 'vue'
import { t } from '../../locale'

export default defineComponent({
  name: 'scope-list',
  props: {
    scopes: {
      type: Object,
      required: true
    },
    tooltipEffect: {
      type: String
    },
    closable: {
      type: Boolean,
      required: false
    }
  },
  emits: ['deleted'],
  setup(_props: any) {
    const scopes = _props.scopes
    const tooltipEffect = _props.tooltipEffect || 'dark'
    const closable = _props.closable || false
    return reactive({
      scopes,
      tooltipEffect,
      closable
    })
  },
  render(_ctx: any) {
    const scopes = _ctx.scopes || {}
    const tags = []
    const closable = _ctx.closable
    for (const key in scopes) {
      const scope = scopes[key] as XGFLFG.Scope
      const i = h('i', { class: `el-icon-${scope.type === 'url' ? 'link' : 'collection'}`, style: 'margin-right:4px' })
      const tooltip = h(ElTooltip,
        {
          content: `${t(msg => msg.item.scopeType[scope.type])}${scope.useReg ? t(msg => msg.item.useRegSuffix) : ''}`,
          placement: 'bottom',
          effect: _ctx.tooltipEffect
        },
        () => h(ElTag, {
          closable,
          onClose: () => _ctx.$emit('deleted', key),
          style: 'margin-right:6px;margin-bottom:6px;',
          type: scope.useReg ? 'warning' : undefined
        }, () => [i, scope.pattern])
      )
      tags.push(tooltip)
    }
    return h('div', tags)
  }
})