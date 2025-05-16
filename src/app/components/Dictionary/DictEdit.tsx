import Flex from '@app/layout/Flex'
import { t } from '@app/locale'
import dictionaryDb from '@db/dictionary-db'
import { Check, Close } from '@element-plus/icons-vue'
import { ElButton, ElDialog, ElInput, ElMessage } from 'element-plus'
import { computed, defineComponent, reactive, ref, toRaw } from 'vue'

type Props = {
    onSaved: () => void
}

const defaultDict = (): Required<XGFLFG.Dictionary> => ({
    id: 0,
    name: '',
    remark: '',
    words: {},
    scopes: {},
    enabled: true,
    priority: 0,
})

export type DictEditInstance = {
    add: () => void
    edit: (dict: XGFLFG.Dictionary) => void
}

const DictEdit = defineComponent<Props>((props, ctx) => {
    const state = ref<'edit' | 'add' | 'hidden'>('hidden')
    const formData = reactive<XGFLFG.Dictionary>(defaultDict())
    const title = computed(() => t(msg => msg.dict.button[state.value === 'edit' ? 'edit' : 'add']))

    const close = () => state.value = 'hidden'
    const copyToFormData = (source: XGFLFG.Dictionary) => {
        Object.entries(toRaw(source)).forEach(([key, value]) => {
            (formData as any)[key] = value
        })
    }

    const add = () => {
        copyToFormData(defaultDict())
        state.value = 'add'
    }

    const edit = (row: XGFLFG.Dictionary) => {
        copyToFormData(defaultDict())
        copyToFormData(row)
        state.value = 'edit'
    }

    ctx.expose({ add, edit } satisfies DictEditInstance)

    const save = async () => {
        const data = toRaw(formData)
        if (!data.name) return ElMessage.error(t(msg => msg.dict.msg.nameBlankError))
        const toDo: (dict: XGFLFG.Dictionary) => Promise<void> = state.value === 'edit'
            ? data => dictionaryDb.updateBaseInfo(data)
            : data => dictionaryDb.add(data)

        try {
            await toDo(data)
            props.onSaved()
            ElMessage.success(t(msg => msg.dict.msg.savedSuccessfully))
            close()
        } catch { }
    }

    return () => (
        <ElDialog
            title={title.value}
            closeOnClickModal={false}
            width={400}
            modelValue={state.value !== 'hidden'}
            onClosed={close}
            v-slots={{
                default: () => (
                    <Flex gap={10} direction="column">
                        <ElInput
                            placeholder={t(msg => msg.item.name)}
                            modelValue={formData.name}
                            onInput={(val: string) => (formData.name = val.trim())}
                            clearable
                            onClear={() => formData.name = ''}
                        />
                        <ElInput
                            type="textarea"
                            rows={4}
                            placeholder={t(msg => msg.item.remark)}
                            modelValue={formData.remark}
                            onInput={val => formData.remark = val.trim()}
                        />
                    </Flex>
                ),
                footer: () => (
                    <Flex justify="center">
                        <ElButton type="info" icon={Close} onClick={close}>
                            {t(msg => msg.dict.button.cancel)}
                        </ElButton>
                        <ElButton type="primary" icon={Check} onClick={save}>
                            {t(msg => msg.dict.button.confirm)}
                        </ElButton>
                    </Flex>
                )
            }}
        />
    )
}, { props: ['onSaved'] })

export default DictEdit
