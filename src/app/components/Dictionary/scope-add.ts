import clipboardy from 'clipboardy'
import { ElButton, ElCol, ElInput, ElMessage, ElOption, ElRow, ElSelect, ElSwitch, ElTooltip } from 'element-plus'
import { defineComponent, h, reactive } from 'vue'
import { t } from '../../locale'

const inputRef = 'scopeInput'

const save = (_ctx: any) => {
  const useReg = _ctx.useReg
  const pattern = _ctx.pattern
  const type = _ctx.type
  if (!pattern) {
    ElMessage.error(t(msg => msg.dict.msg.noUrlError))
    _ctx.$refs[inputRef].focus()
    return
  }
  if (useReg) {
    // Check the regular expression is valid
    try {
      new RegExp(pattern)
    } catch (e) {
      ElMessage.error(t(msg => msg.dict.msg.invalidRegularError))
      _ctx.$refs[inputRef].focus()
      return
    }
  }
  _ctx.$emit('saved', { useReg, pattern, type } as XGFLFG.Scope)
  _ctx.pattern = ''
  _ctx.$refs[inputRef].focus()
}

export default defineComponent({
  name: 'dict-scope-add',
  setup() {
    return reactive({
      pattern: '',
      useReg: false,
      type: 'host'
    } as XGFLFG.Scope)
  },
  emits: ['saved'],
  render(_ctx: any) {
    const updatePattern = (val: string) => _ctx.pattern = (val || '').trim()

    const typeSelect = h(ElSelect,
      {
        modelValue: _ctx.type,
        onChange: (val: string) => _ctx.useReg = (_ctx.type = val) === 'url'
      },
      {
        default: () => {
          const allTypes: XGFLFG.ScopeType[] = ['url', 'host']
          return allTypes.map(type => h(ElOption, { label: t(msg => msg.item.scopeType[type]), value: type }))
        }
      }
    )

    const useRegSwitch = () => h(ElTooltip,
      {
        content: t(msg => msg.dict.msg.useRegularMsg),
        placement: "left",
      },
      { default: () => h(ElSwitch, { modelValue: _ctx.useReg, onChange: val => _ctx.useReg = !!val }) }
    )

    const saveButton = h(
      ElButton,
      {
        icon: 'el-icon-plus',
        onClick: () => save(_ctx)
      },
      { default: () => t(msg => msg.dict.button.add) }
    )

    const pasteButton = h(ElButton,
      { icon: 'el-icon-document-copy', onClick: () => clipboardy.read().then(updatePattern) },
      { default: () => t(msg => msg.dict.button.paste) }
    )

    const input = () => h(ElInput,
      {
        ref: inputRef,
        modelValue: _ctx.pattern,
        placeholder: t(msg => msg.dict.msg.urlPlaceholder),
        class: 'scope-input',
        clearable: true,
        onInput: updatePattern,
        onKeyup: (event: KeyboardEvent) => event.code === 'Enter' && save(_ctx),
        onClear: () => updatePattern(''),
      },
      {
        prepend: () => typeSelect,
        append: () => [saveButton, pasteButton]
      }
    )
    return h(ElRow, { gutter: 20 },
      () => [
        h(ElCol, { span: 2, class: 'reg-switch-cell' }, useRegSwitch),
        h(ElCol, { span: 22 }, input)
      ]
    )
  }
})