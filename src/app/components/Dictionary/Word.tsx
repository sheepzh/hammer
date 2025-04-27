import Flex from '@app/layout/Flex'
import { t } from '@app/locale'
import dictionaryDb from '@db/dictionary-db'
import { Check, Close } from '@element-plus/icons-vue'
import { getRealMask } from '@src/common/default-word'
import { ElButton, ElDivider, ElInput, ElMessage, ElMessageBox, ElTag, type InputInstance } from 'element-plus'
import { defineComponent, reactive, ref, StyleValue, toRaw } from 'vue'

export type WordInstance = {
    closeInput: () => void
}

type Props = {
    dict: XGFLFG.Dictionary | undefined
}

const Word = defineComponent<Props>(({ dict }, ctx) => {
    const adding = ref(false)
    const formData = reactive<XGFLFG.BannedWord>({ origin: '', mask: '' })

    const closeInput = () => adding.value = false
    ctx.expose({ closeInput } satisfies WordInstance)

    const deleteOrigin = (origin: string) => {
        const words = dict?.words
        if (!words) return
        delete words[origin]
        dictionaryDb.update(dict).then(() => ElMessage.success(t(msg => msg.dict.msg.wordDeleteConfirmMsg, { origin })))
    }

    const handleKeyDown = (ev: KeyboardEvent | Event) => (ev as KeyboardEvent).key === 'Enter' && saveWord()

    const originInput = ref<InputInstance>()

    const saveWord = () => {
        if (!dict) return ElMessage.error('Unexpected error: the dict is null')

        const origin = formData.origin
        if (!origin) return ElMessage.error(t(msg => msg.dict.msg.noOriginWordError))

        const words = dict.words

        const current = { origin, mask: getRealMask(origin, formData.mask) }

        const update = async () => {
            words[origin] = current
            console.log(toRaw(dict))
            await dictionaryDb.update(toRaw(dict))
            formData.origin = formData.mask = ''
            originInput.value?.focus()
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

    return () => (
        <Flex direction="column">
            <Flex>
                <ElInput
                    ref={originInput}
                    style={{ width: '120px' } as StyleValue}
                    modelValue={formData.origin}
                    placeholder={t(msg => msg.item.word.original)}
                    clearable
                    onClear={() => formData.origin = formData.mask = ''}
                    onInput={val => formData.origin = val.trim()}
                    onKeydown={handleKeyDown}
                />
                <ElInput
                    style={{ width: '120px' } as StyleValue}
                    modelValue={formData.mask}
                    placeholder={t(msg => msg.item.word.mask)}
                    clearable
                    onClear={() => formData.mask = ''}
                    onInput={val => formData.mask = val.trim()}
                    onKeydown={handleKeyDown}
                />
                <ElButton icon={Check} onClick={saveWord} />
                <ElButton style={{ marginInlineStart: '0' } as StyleValue} icon={Close} onClick={closeInput} />
            </Flex>
            <ElDivider />
            <Flex gap={10} wrap>
                {Object.values(dict?.words || {}).map(({ origin = '', mask = '' }) => (
                    <ElTag size="large" closable onClose={() => deleteOrigin(origin)}>
                        {`${origin} => ${getRealMask(origin, mask)}`}
                    </ElTag>
                ))}
            </Flex>
        </Flex>
    )
}, { props: ['dict'] })

export default Word