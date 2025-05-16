import Flex from '@app/layout/Flex'
import { t } from '@app/locale'
import dictionaryDb from '@db/dictionary-db'
import { Plus } from '@element-plus/icons-vue'
import { getRealMask } from '@src/common/default-word'
import { useRequest } from '@src/hooks/useRequest'
import { ElButton, ElDivider, ElEmpty, ElInput, ElMessage, ElTag, ElText, type InputInstance } from 'element-plus'
import { defineComponent, reactive, ref, StyleValue, toRaw } from 'vue'

type Props = {
    dictId: number
    words: XGFLFG.BannedWords
}

const Words = defineComponent<Props>(props => {
    const words = ref(props.words ?? {})
    const { data: listKey } = useRequest(() => Date.now(), { deps: words })

    const formData = reactive<XGFLFG.BannedWord>({ origin: '', mask: '' })
    const handleKeyDown = (ev: KeyboardEvent | Event) => (ev as KeyboardEvent).key === 'Enter' && saveWord()

    const originInput = ref<InputInstance>()

    const saveWord = async () => {
        const { origin, mask } = toRaw(formData)
        if (!origin) return ElMessage.error(t(msg => msg.dict.msg.noOriginWordError))

        const toUpdate = { ...toRaw(words.value) }
        const realMask = getRealMask(origin, mask)
        let target = toUpdate[origin]
        if (target) {
            target.mask = realMask
        } else {
            toUpdate[origin] = target = { origin, mask: realMask }
        }
        await dictionaryDb.updateWords(props.dictId, toUpdate)
        ElMessage.success(t(msg => msg.dict.msg.savedSuccessfully, { origin }))
        words.value = toUpdate
        formData.origin = formData.mask = ''
        originInput.value?.focus()
    }

    const deleteWord = async (origin: string) => {
        const { [origin]: _, ...toUpdate } = toRaw(words.value)
        await dictionaryDb.updateWords(props.dictId, toUpdate)
        ElMessage.success(t(msg => msg.dict.msg.wordDeleteConfirmMsg, { origin }))
        words.value = toUpdate
    }

    return () => (
        <Flex direction="column">
            <Flex align="center" gap={5}>
                <Flex gap={3}>
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
                    <ElText>=&gt;</ElText>
                    <ElInput
                        style={{ width: '120px' } as StyleValue}
                        modelValue={formData.mask}
                        placeholder={t(msg => msg.item.word.mask)}
                        clearable
                        onClear={() => formData.mask = ''}
                        onInput={val => formData.mask = val.trim()}
                        onKeydown={handleKeyDown}
                    />
                </Flex>
                <ElButton type='primary' icon={Plus} onClick={saveWord} />
            </Flex>
            <ElDivider />
            <Flex key={listKey.value} gap={10} wrap>
                <Flex width="100%" minHeight="50vh" gap={10} wrap>
                    {Object.keys(words.value ?? {}).length ? Object.values(words.value).map(({ origin = '', mask = '' }) => (
                        <ElTag disableTransitions closable onClose={() => deleteWord(origin)}>
                            {`${origin} => ${getRealMask(origin, mask)}`}
                        </ElTag>
                    )) : (
                        <Flex justify="center" width="100%">
                            <ElEmpty />
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    )
}, { props: ['dictId', 'words'] })

export default Words