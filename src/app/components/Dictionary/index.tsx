import ContentContainer from '@app/layout/ContentContainer'
import Flex from '@app/layout/Flex'
import { t } from '@app/locale'
import dictionaryDb from '@db/dictionary-db'
import { Checked, Edit, Plus, Upload } from '@element-plus/icons-vue'
import { FEEDBACK_LINK } from "@util/constant/link"
import { checkJSON } from "@util/file-util"
import { locale } from "@util/i18n"
import { ElButton, ElLink, ElMessage } from 'element-plus'
import { defineComponent, ref } from 'vue'
import DictEdit, { type DictEditInstance } from './DictEdit'
import ListTable, { type ListTableInstance } from './ListTable'
import Test, { type TestInstance } from './Test'

const Dictionary = defineComponent(() => {
    const edit = ref<DictEditInstance>()
    const fileInput = ref<HTMLInputElement>()
    const table = ref<ListTableInstance>()
    const test = ref<TestInstance>()

    const handleFileSelected = () => {
        const files = fileInput.value?.files
        if (!files?.length) return

        const file = files[0]
        file.text()
            .then(str => checkJSON(str))
            .then(dict => dictionaryDb.import(dict))
            .then(() => {
                ElMessage.success(t(msg => msg.dict.msg.importedSuccessfully))
                table.value?.refresh()
            })
            .catch(ElMessage.error)
    }

    return () => (
        <ContentContainer v-slots={{
            filter: () => (
                <Flex justify="end">
                    <ElButton type="success" icon={Plus} onClick={() => edit.value?.add()}>
                        {t(msg => msg.dict.button.add)}
                    </ElButton>
                    <ElButton type='primary' icon={Upload} onClick={() => fileInput.value?.click()}>
                        {t(msg => msg.dict.button.import)}
                    </ElButton>
                    <ElButton type="primary" icon={Checked} onClick={() => test.value?.show()}>
                        {t(msg => msg.dict.button.test)}
                    </ElButton>
                    {locale === 'zh_CN' && (
                        <ElLink icon={Edit} href={FEEDBACK_LINK} target="_blank">
                            {t(msg => msg.dict.button.feedback)}
                        </ElLink>
                    )}
                    <input
                        ref={fileInput}
                        type='file'
                        accept='.json'
                        style={{ display: 'none' }}
                        onChange={handleFileSelected}
                    />
                </Flex>
            ),
            content: () => <>
                <ListTable ref={table} onEdit={(row: XGFLFG.Dictionary) => edit.value?.edit(row)} />
                <DictEdit ref={edit} onSaved={() => table.value?.refresh()} />
                <Test ref={test} />
            </>
        }} />
    )
})

export default Dictionary