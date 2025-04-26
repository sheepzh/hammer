import { DocumentCopy } from '@element-plus/icons-vue'
import { FEEDBACK_LINK } from "@util/constant/link"
import { checkJSON } from "@util/file-util"
import { locale } from "@util/i18n"
import { ElButton, ElLink, ElMessage, ElSpace } from 'element-plus'
import { defineComponent, h, Ref, ref } from 'vue'
import DictionaryDb from '../../../database/dictionary-db'
import { t } from '../../locale'
import DictEdit from './dict-edit'
import ListTable from './list-table'

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

// Ref of data edit dialog
const editRef = ref()
// Ref of file input
const fileInputRef = ref() as Ref<HTMLInputElement>
// Ref of table
const tableRef = ref()

// Handle after the file to import is selected
function handleFileSelected() {
  const files: FileList | null = fileInputRef.value.files
  if (!files || !files.length) {
    return
  }
  const file: File = files[0]
  file.text()
    .then(str => checkJSON(str))
    .then(dict => db.import(dict))
    .then(() => {
      ElMessage.success(t(msg => msg.dict.msg.importedSuccessfully))
      tableRef.value.query()
    })
    .catch(ElMessage.error)
}

const addButton = () => h(
  ElButton,
  {
    size: 'small',
    type: 'primary',
    icon: 'el-icon-plus',
    onClick: () => editRef.value.add()
  },
  { default: () => t(msg => msg.dict.button.add) }
)

// Input with file type, which hide in the import button
const fileInputProps = {
  ref: fileInputRef,
  type: 'file',
  accept: '.json',
  style: { display: 'none' },
  onChange: handleFileSelected
}
const fileInput = () => h('input', fileInputProps)

const importButton = () => h(ElButton, {
  size: 'small',
  type: 'primary',
  icon: DocumentCopy,
  onClick: () => fileInputRef.value.click()
},
  { default: () => [t(msg => msg.dict.button.import), fileInput()] }
)

const feedbackLink = () => h(ElLink,
  {
    icon: "el-icon-edit-outline",
    href: FEEDBACK_LINK,
    target: '_blank'
  },
  () => t(msg => msg.dict.button.feedback)
)

const filterItems = () => {
  const result = [addButton(), importButton()]
  locale === 'zh_CN' && result.push(feedbackLink())
  return result
}

const children = () => [
  h(
    'div',
    { class: 'filter-container' },
    h(ElSpace, { size: 'large' }, filterItems())
  ),
  h(ListTable, { ref: tableRef, onEdit: (row: XGFLFG.Dictionary) => editRef.value.edit(row) }),
  h(DictEdit, {
    ref: editRef,
    onSaved: () => tableRef.value.query()
  })
]

export default defineComponent(() => {
  return () => h('div', { class: 'app-container' }, children())
})