import { ElMessage, ElSpace } from 'element-plus'
import { defineComponent, h, reactive, toRaw } from 'vue'
import DictionaryDb from '../../../database/dictionary-db'
import { t } from '../../locale'
import ScopeAdd from './scope-add'
import ScopeList from './scope-list'
import ScopeTest, { ScopeTestProps } from './scope-test'
import './style/scope'

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

interface Props {
  dict: XGFLFG.Dictionary
}

export default defineComponent({
  name: 'word-scope',
  props: {
    dict: {
      type: Object,
      default: {}
    }
  },
  setup(_prop: any) {
    const dict = (_prop.dict || {}) as XGFLFG.Dictionary
    if (!dict.scopes) {
      dict.scopes = {}
    }
    return reactive({
      dict
    } as Props)
  },
  render(_ctx: any) {
    const scopes = _ctx.dict.scopes || {}
    return h(ElSpace,
      { direction: 'vertical', style: 'width:100%' },
      () => [
        h<ScopeTestProps>(ScopeTest, { scopes }),
        h(ScopeAdd, {
          onSaved: (scope: XGFLFG.Scope) => {
            const dict: XGFLFG.Dictionary = _ctx.dict
            if (!dict.scopes) {
              dict.scopes = {}
            }
            dict.scopes[scope.type + scope.pattern] = scope
            db.update(toRaw(dict) as XGFLFG.Dictionary).then(() => {
              ElMessage.success(t(msg => msg.dict.msg.savedSuccessfully))
            })
          }
        }),
        h('div', { style: 'height:15px; width:100%;' }),
        h(ScopeList, {
          scopes,
          closable: true,
          onDeleted: (key: string) => {
            const dict: XGFLFG.Dictionary = _ctx.dict
            dict.scopes && delete dict.scopes[key]
            db.update(dict).then(() => {
              ElMessage.success('删除成功')
            })
          }
        })
      ]
    )
  }
})