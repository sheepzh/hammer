import Flex from '@app/layout/Flex'
import { t } from '@app/locale'
import dictionaryDb from '@db/dictionary-db'
import { Check } from '@element-plus/icons-vue'
import { getRealMask } from '@src/common/default-word'
import { ElButton, ElDialog, ElDivider, ElInput, ElMessage, ElTag, type InputInstance } from 'element-plus'
import { defineComponent, reactive, ref, StyleValue, toRaw, watch } from 'vue'

type Props = {
    onChanged: (dictId: number, words: XGFLFG.BannedWords) => void
}

export type WordsInstance = {
    show(dict: XGFLFG.Dictionary): void
}

const Words = defineComponent<Props>((props, ctx) => {
    const dictId = ref<number>()
    const dictName = ref<string>()
    const words = ref<XGFLFG.BannedWord[]>([])
    const visible = ref(false)

    watch(words, () => {
        if (!dictId.value) return
        const newVal: XGFLFG.BannedWords = {}
        words.value.forEach(w => newVal[w.origin] = w)
        props.onChanged(dictId.value, newVal)
    })

    const show = (dict: XGFLFG.Dictionary) => {
        dictId.value = dict.id
        words.value = Object.values(dict.words)
        visible.value = true
    }
    ctx.expose({ show } satisfies WordsInstance)

    const formData = reactive<XGFLFG.BannedWord>({ origin: '', mask: '' })
    const handleKeyDown = (ev: KeyboardEvent | Event) => (ev as KeyboardEvent).key === 'Enter' && saveWord()

    const originInput = ref<InputInstance>()

    const saveWord = async () => {
        const { origin, mask } = toRaw(formData)
        if (!origin) return ElMessage.error(t(msg => msg.dict.msg.noOriginWordError))

        const dictIdVal = dictId.value
        if (!dictIdVal) return ElMessage.error('Unexpected error: the dict is null')

        const toUpdate = [...toRaw(words.value)]
        const realMask = getRealMask(origin, mask)
        const existing = toUpdate.find(w => w.origin === origin)
        if (existing) {
            existing.mask = realMask
        } else {
            toUpdate.push({ origin, mask: realMask })
        }
        await dictionaryDb.updateWords(dictIdVal, toUpdate)
        ElMessage.success(t(msg => msg.dict.msg.savedSuccessfully, { origin }))
        words.value = toUpdate
        formData.origin = formData.mask = ''
        originInput.value?.focus()
    }

    const deleteWord = async (origin: string) => {
        const dictIdVal = dictId.value
        if (!dictIdVal) return ElMessage.error('Unexpected error: the dict is null')

        const toUpdate = toRaw(words.value).filter(w => w.origin !== origin)
        await dictionaryDb.updateWords(dictIdVal, toUpdate)
        ElMessage.success(t(msg => msg.dict.msg.wordDeleteConfirmMsg, { origin }))
        words.value = toUpdate
    }

    return () => (
        <ElDialog
            title={`${t(msg => msg.item.words)} - ${dictName.value}`}
            modelValue={visible.value}
            onClosed={() => visible.value = false}
            destroyOnClose
        >
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
                </Flex>
                <ElDivider />
                <Flex gap={10} wrap key={words.value.map(w => w.origin + w.mask).join('')}>
                    {words.value.map(({ origin = '', mask = '' }) => (
                        <ElTag size="large" closable onClose={() => deleteWord(origin)}>
                            {`${origin} => ${getRealMask(origin, mask)}`}
                        </ElTag>
                    ))}
                </Flex>
            </Flex>
        </ElDialog>
    )
}, { props: ['onChanged'] })

export default Words