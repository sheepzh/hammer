import {
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElButton,
  ElTag,
  ElMessageBox,
  ElMessage,
  ElDialog,
  ElTooltip
} from 'element-plus'
import { defineComponent, h, reactive, toRaw } from 'vue'
import Word from './word'
import Scope from './scope'
import DictionaryDb from '../../../database/dictionary-db'
import ScopeList from './scope-list'
import { saveJSON } from "@util/file-util"
import { t } from '../../locale'

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

const align = 'center'

const wordRefName = 'word'
const scopeRefName = 'scope'

// Operations of table row
const renderOperationButton = (
  _ctx: any,
  name: string,
  callback: () => void
) => {
  return h(
    ElButton,
    { type: 'text', size: 'small', onClick: callback },
    () => name
  )
}

// Table
const renderTable = (_ctx: any) => {
  const children = [
    // Name
    h(ElTableColumn, { prop: 'name', align, minWidth: 40, label: t(msg => msg.item.name) }),
    // Quantity or words
    h(ElTableColumn, {
      align,
      minWidth: 40,
      label: t(msg => msg.item.wordCount),
      formatter: (row: XGFLFG.Dictionary) => `${Object.values(row.words).length ?? 0}`,
    }),
    // Scope of domain
    h(
      ElTableColumn,
      {
        align,
        minWidth: 40,
        label: t(msg => msg.item.scope)
      },
      {
        default(data: any) {
          const row: XGFLFG.Dictionary = data.row
          const full = !row.scopes || !Object.values(row.scopes).length

          const tag = () => h(
            ElTag,
            { type: full ? 'info' : 'primary', size: 'small' },
            { default: () => t(msg => full ? msg.item.scopeResult.all : msg.item.scopeResult.some) }
          )
          const content = () => h(ScopeList, { scopes: row.scopes || {}, tooltipEffect: 'light' })

          return full ? tag() : h(ElTooltip, { placement: 'top', effect: 'light' }, { default: tag, content })
        }
      }
    ),
    // Remark
    h(ElTableColumn, { prop: 'remark', align, minWidth: 80, label: t(msg => msg.item.remark) }),
    // Enabled
    h(
      ElTableColumn,
      {
        align,
        minWidth: 30,
        label: t(msg => msg.item.enabled)
      },
      {
        default: (data: any) => {
          const row: XGFLFG.Dictionary = data.row
          const id = row.id
          return h(ElSwitch, {
            modelValue: row && !!row.enabled,
            onChange: val => {
              id && db.updateEnabled(id, !!val).then(() => (row.enabled = !!val))
            }
          })
        }
      }
    ),
    // Operations
    h(
      ElTableColumn,
      { align, minWidth: 70, label: t(msg => msg.item.operation) },
      {
        default: (data: any) => {
          const row: XGFLFG.Dictionary = data.row
          return [
            // Word management
            renderOperationButton(_ctx, t(msg => msg.item.words), () => {
              _ctx.current = row
              _ctx.wordOpen = true
              _ctx.$refs[wordRefName] && _ctx.$refs[wordRefName].closeInput()
            }),
            // Scope management
            renderOperationButton(_ctx, t(msg => msg.item.scope), () => {
              _ctx.current = row
              _ctx.scopeOpen = true
            }),
            // Edit
            renderOperationButton(_ctx, t(msg => msg.dict.button.edit), () => _ctx.$emit('edit', row)),
            // Delete
            renderOperationButton(_ctx, t(msg => msg.dict.button.delete), () => {
              ElMessageBox.confirm(
                t(msg => msg.dict.msg.deleteConfirmMsg, { name: row.name }),
                t(msg => msg.dict.msg.operationConfirmation),
                {
                  cancelButtonText: t(msg => msg.dict.button.giveUp),
                  confirmButtonText: t(msg => msg.dict.button.ok),
                  type: 'warning'
                }
              )
                .then(() =>
                  db.delete(row.id || 0).then(() => {
                    ElMessage.success(t(msg => msg.dict.msg.deletedSuccessfully))
                    _ctx.query()
                  })
                )
                .catch(() => { })
            }),
            // Export
            renderOperationButton(_ctx, t(msg => msg.dict.button.export), () => {
              const toExport = toRaw(row)
              delete toExport['id']
              delete toExport['enabled']
              saveJSON(toExport, `${t(msg => msg.app.name)}_${row.name || 'UNNAMED'}.json`)
            })
          ]
        }
      }
    )
  ]
  return h(
    ElTable,
    {
      data: _ctx.list,
      style: { width: '100%' },
      size: 'small',
      border: true,
      fit: true
    },
    { default: () => children }
  )
}

// Word
const renderWord = (_ctx: any) => {
  const dict: XGFLFG.Dictionary = _ctx.current
  return h(
    ElDialog,
    {
      title: `${t(msg => msg.item.words)} - ${dict.name} `,
      modelValue: _ctx.wordOpen,
      destroyOnClose: true,
      onClosed: () => (_ctx.wordOpen = false)
    },
    { default: () => h(Word, { ref: wordRefName, dict }) }
  )
}

// Scope
const renderScope = (_ctx: any) => {
  const dict: XGFLFG.Dictionary = _ctx.current
  return h(ElDialog,
    {
      title: `${t(msg => msg.item.scope)} - ${dict.name} `,
      modelValue: _ctx.scopeOpen,
      destroyOnClose: true,
      onClosed: () => (_ctx.scopeOpen = false)
    },
    { default: () => h(Scope, { ref: scopeRefName, dict }) })
}

export default defineComponent({
  name: 'list-table',
  setup() {
    return reactive({
      list: [],
      current: null,
      wordOpen: false,
      scopeOpen: false
    } as { list: XGFLFG.Dictionary[]; current: XGFLFG.Dictionary | null; wordOpen: boolean, scopeOpen: boolean })
  },
  emits: ['edit'],
  created() {
    this.query()
  },
  methods: {
    query() {
      db.listAll().then((dictionaries) => (this.list = dictionaries))
    }
  },
  render(_ctx: any) {
    const children = [renderTable(_ctx)]
    if (_ctx.current) {
      children.push(renderScope(_ctx), renderWord(_ctx))
    }
    return h('div', { style: 'width:100%; margin-top:20px;' }, children)
  }
})
