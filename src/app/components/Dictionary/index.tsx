import { Edit, Refresh, Upload } from '@element-plus/icons-vue'
import { FEEDBACK_LINK } from "@util/constant/link"
import { checkJSON } from "@util/file-util"
import { locale } from "@util/i18n"
import { ElButton, ElLink, ElMessage, ElSpace } from 'element-plus'
import { defineComponent, ref } from 'vue'
import DictionaryDb from '../../../database/dictionary-db'
import { t } from '../../locale'
import DictEdit from './dict-edit'
import ListTable from './list-table'

const db: DictionaryDb = new DictionaryDb(chrome.storage.local)

const Dictionary = defineComponent(() => {
    const edit = ref()
    const fileInput = ref<HTMLInputElement>()
    const table = ref()

    const handleFileSelected = () => {
        const files = fileInput.value?.files
        if (!files?.length) return

        const file = files[0]
        file.text()
            .then(str => checkJSON(str))
            .then(dict => db.import(dict))
            .then(() => {
                ElMessage.success(t(msg => msg.dict.msg.importedSuccessfully))
                table.value.query()
            })
            .catch(ElMessage.error)
    }

    return () => (
        <div class="app-container">
            <div class="filter-container">
                <ElSpace size="large">
                    <ElButton
                        size="small"
                        type="primary"
                        icon={Refresh}
                        onClick={() => table.value.query()}
                    >
                        {t(msg => msg.dict.button.add)}
                    </ElButton>
                    <ElButton
                        size='small'
                        type='primary'
                        icon={Upload}
                        onClick={() => fileInput.value?.click()}
                    >
                        {t(msg => msg.dict.button.import)}
                        <input
                            ref={fileInput}
                            type='file'
                            accept='.json'
                            style={{ display: 'none' }}
                            onChange={handleFileSelected}
                        />
                    </ElButton>
                    {locale === 'zh_CN' && (
                        <ElLink icon={Edit} href={FEEDBACK_LINK} target="_blank">
                            {t(msg => msg.dict.button.feedback)}
                        </ElLink>
                    )}
                </ElSpace>
            </div>
            <ListTable ref={table} onEdit={(row: XGFLFG.Dictionary) => edit.value.edit(row)} />
            <DictEdit ref={edit} onSaved={() => table.value.query()} />
        </div>
    )
})

export default Dictionary