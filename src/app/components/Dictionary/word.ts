import { defineComponent, h, reactive, toRaw } from 'vue'
import { ElButton, ElInput, ElMessage, ElMessageBox, ElTag } from 'element-plus'
import { getDefaultMask, getRealMask } from '../../../common/default-word'
import './style/word'
import BannedWordDb from '../../../database/dictionary-db'
import { t } from '../../locale'

interface Props {
  dict: XGFLFG.Dictionary
  formData: XGFLFG.BannedWord
  isAdding: boolean
}

const db = new BannedWordDb(chrome.storage.local)

/**
 * Save word
 * 
 * If exists, rewrite or give up, Or add new one
 * 
 * @param _ctx vm
 */
const saveWord = (_ctx: any) => {
  const origin = _ctx.formData.origin
  const words = _ctx.dict.words
  if (!origin) {
    ElMessage.error(t(msg => msg.dict.msg.noOriginWordError))
    return
  }

  const current = { origin, mask: getRealMask(origin, _ctx.formData.mask) }

  const update = () => {
    words[origin] = current
    db.update(toRaw(_ctx.dict) as XGFLFG.Dictionary).then(() => {
      _ctx.formData.origin = _ctx.formData.mask = ''
      _ctx.$refs.originInput.focus()
    })
  }

  const existing = words[origin]
  if (existing) {
    ElMessageBox.confirm(
      t(msg => msg.dict.msg.wordExistConfirmation, { word: origin, oldMask: existing.mask, newMask: current.mask }),
      t(msg => msg.dict.msg.operationConfirmation),
      {
        confirmButtonText: t(msg => msg.dict.button.replace),
        cancelButtonText: t(msg => msg.dict.button.giveUp)
      }
    ).then(update).catch(() => { })
  } else {
    update()
  }
}

export default defineComponent({
  props: {
    dict: {
      type: Object,
      default: {}
    }
  },
  setup(_prop) {
    return reactive({
      dict: _prop.dict,
      isAdding: false,
      formData: { origin: '', mask: '' }
    } as Props)
  },
  computed: {
    maskPlaceholder(_ctx: any) {
      return getDefaultMask(_ctx.formData.origin)
    }
  },
  methods: {
    delete(origin: string) {
      delete this.dict.words[origin]
      db.update(this.dict).then(() => {
        ElMessage.success(t(msg => msg.dict.msg.wordDeleteConfirmMsg, { origin }))
      })
    },
    closeInput() {
      this.isAdding = false
    },
    showInput() {
      this.isAdding = true
    }
  },
  name: 'banned-word-list',
  render(_ctx: any) {
    const dict = _ctx.dict as XGFLFG.Dictionary
    const words = dict.words
    const tags = Array.from(Object.values(words)).map((word: any) => {
      const origin: string = word.origin || ''
      const mask: string = word.mask || ''
      return h(
        ElTag,
        {
          closable: true,
          size: 'small',
          class: 'word-item',
          onClose: () => this.delete(origin)
        },
        { default: () => `${origin} => ${getRealMask(origin, mask)}` }
      )
    })
    const saveEnterKey = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        // Enter
        saveWord(_ctx)
      }
    }
    let inputArea: any
    if (_ctx.isAdding) {
      inputArea = []
      inputArea.push(
        h(ElInput, {
          modelValue: _ctx.formData.origin,
          placeholder: t(msg => msg.item.word.original),
          clearable: true,
          size: 'small',
          ref: 'originInput',
          onClear: () => (_ctx.formData.origin = _ctx.formData.mask = ''),
          class: 'word-input-left',
          onInput: (val: string) => (_ctx.formData.origin = val.trim()),
          onKeyup: saveEnterKey
        }),
        h(
          ElInput,
          {
            modelValue: _ctx.formData.mask,
            placeholder: t(msg => msg.item.word.mask),
            clearable: true,
            size: 'small',
            onClear: () => (_ctx.formData.mask = ''),
            class: 'word-input-right ',
            onInput: (val: string) => (_ctx.formData.mask = val.trim()),
            onKeyup: saveEnterKey
          },
          {
            append: () =>
              h('span', [
                h(ElButton, {
                  icon: 'el-icon-check',
                  size: 'small',
                  onClick: () => saveWord(_ctx)
                }),
                h(ElButton, {
                  icon: 'el-icon-close',
                  size: 'small',
                  onClick: _ctx.closeInput
                })
              ])
          }
        )
      )
    } else {
      inputArea = h(
        ElButton,
        {
          icon: 'el-icon-plus',
          size: 'small',
          onClick: _ctx.showInput
        },
        { default: () => t(msg => msg.dict.button.add) }
      )
    }

    return h('div', [tags, inputArea])
  }
})
