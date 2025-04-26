import { defineComponent, h, reactive, toRaw } from 'vue'
import { ElButton, ElDialog, ElInput, ElMessage } from 'element-plus'
import './style/dict-add'
import DictionaryDb from '../../../database/dictionary-db'
import { t } from '../../locale'

interface Props {
  isOpen: boolean
  formData: XGFLFG.Dictionary
  title: string
}

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

export default defineComponent({
  name: 'dict-edit',
  emits: ['saved'],
  methods: {
    add() {
      this.title = t(msg => msg.dict.button.add)
      this.isOpen = true
    },
    edit(row: XGFLFG.Dictionary) {
      this.title = t(msg => msg.dict.button.edit)
      this.formData = row
      this.isOpen = true
    },
    save() {
      const data: XGFLFG.Dictionary = toRaw(this.formData) as XGFLFG.Dictionary
      if (!data.name) {
        ElMessage.error(t(msg => msg.dict.msg.nameBlankError))
      } else {
        // Update if ID exists, or add it
        const toDo: (dict: XGFLFG.Dictionary) => Promise<void> = data.id ? data => db.update(data) : data => db.add(data)

        toDo(data).then(() => {
          ElMessage.success(t(msg => msg.dict.msg.savedSuccessfully)),
            this.$emit('saved', data)

          // Clear all the form items
          this.formData.name = this.formData.remark = ''
          this.isOpen = false
        })
      }
    }
  },
  setup() {
    return reactive({
      isOpen: false,
      formData: {
        name: '',
        remark: ''
      },
      title: '',
    } as Props)
  },
  render(_ctx: any) {
    const dialogBody = () =>
      h('div', [
        h(ElInput, {
          placeholder: t(msg => msg.item.name),
          modelValue: _ctx.formData.name,
          onInput: (val: string) => (_ctx.formData.name = val.trim()),
          onClear: () => (_ctx.formData.name = _ctx.formData.remark = ''),
          clearable: true,
          class: 'dict-field'
        }),
        h(ElInput, {
          type: 'textarea',
          rows: 4,
          class: 'dict-field',
          placeholder: t(msg => msg.item.remark),
          modelValue: _ctx.formData.remark,
          onInput: (val: string) => (_ctx.formData.remark = val.trim()),
          clearable: true,
          onClear: () => (_ctx.formData.remark = '')
        })
      ])
    const dialogFooter = () =>
      h('div', { style: 'text-align:center' }, [
        h(
          ElButton,
          {
            type: 'success',
            size: 'small',
            icon: 'el-icon-check',
            onClick: _ctx.save
          },
          () => t(msg => msg.dict.button.confirm)
        ),
        h(
          ElButton,
          {
            icon: 'el-icon-close',
            size: 'small',
            onClick: () => (_ctx.isOpen = false)
          },
          () => t(msg => msg.dict.button.cancel)
        )
      ])

    return h(
      ElDialog,
      {
        title: _ctx.title,
        closeOnClickModal: false,
        width: 400,
        modelValue: _ctx.isOpen,
        onClosed: () => (_ctx.isOpen = false)
      },
      {
        default: dialogBody,
        footer: dialogFooter
      }
    )
  }
})
