import Flex from '@app/layout/Flex'
import { t } from '@app/locale'
import dictionaryDb from '@db/dictionary-db'
import { DocumentCopy, Search } from '@element-plus/icons-vue'
import { matchScope } from '@src/common/matcher'
import { useRequest } from '@src/hooks/useRequest'
import clipboardy from 'clipboardy'
import { ElAlert, ElButton, ElDialog, ElInput } from "element-plus"
import { defineComponent, ref, StyleValue } from "vue"

const url2Host = (urlStr: string) => {
    const url = new URL(urlStr)
    return url.host
}

type TestResult = {
    type: 'info' | 'success' | 'error',
    msg: string
}

const noMsgRes = () => ({ type: 'info', msg: t(msg => msg.dict.testResult.noTestUrl) } satisfies TestResult)

export type TestInstance = { show: () => void }

const APPEND_BTN_STYLE: StyleValue = {
    marginInline: 0,
    padding: 0,
    display: 'flex',
}

const ScopeTest = defineComponent((_, ctx) => {
    const visible = ref(false)
    const { data: dicts } = useRequest(async () => {
        const list = await dictionaryDb.listAll()
        return list.filter(l => l.enabled)
    }, { deps: visible, defaultValue: [] })

    ctx.expose({ show: () => visible.value = true } satisfies TestInstance)

    const { data: result, refresh: test } = useRequest(async (): Promise<TestResult> => {
        if (!dicts.value.length) {
            return { type: 'info', msg: t(msg => msg.dict.testResult.ineffective) }
        }
        for (const { scopes } of dicts.value) {
            if (!Object.values(scopes ?? {}).length) {
                return { type: 'success', msg: t(msg => msg.dict.testResult.effectiveNoWord) }
            }
            const url = targetUrl.value
            if (!url) return noMsgRes()

            const host = url2Host(url)
            for (const index in scopes) {
                const scope: XGFLFG.Scope = scopes[index]
                try {
                    if (matchScope(scope, host, url)) {
                        return {
                            type: 'success',
                            msg: t(msg => msg.dict.testResult.effectiveWithPattern, { pattern: scope.pattern }),
                        }
                    }
                } catch {
                    return { type: 'error', msg: t(msg => msg.dict.testResult.wrongRegular) }
                }
            }
        }

        return { type: 'error', msg: t(msg => msg.dict.testResult.wrongRegular) }
    }, { defaultValue: noMsgRes() })
    const targetUrl = ref('')

    const handleCopy = () => clipboardy.read()
        .then(val => targetUrl.value = val?.trim?.() ?? '')
        .catch(() => { })

    return () => (
        <ElDialog
            width="80%"
            modelValue={visible.value}
            onUpdate:modelValue={val => visible.value = val}
        >
            <Flex gap={20} column>
                <Flex>
                    <ElInput
                        modelValue={targetUrl.value}
                        clearable
                        placeholder='https://www.github.com/sheepzh'
                        onInput={val => targetUrl.value = val.trim()}
                        onKeydown={(ev: KeyboardEvent | Event) => (ev as KeyboardEvent).code === 'Enter' && test()}
                        onClear={() => targetUrl.value = ''}
                        v-slots={{
                            append: () => (
                                <Flex gap={10} align="center" marginInline={-10}>
                                    <ElButton icon={Search} onClick={test} style={APPEND_BTN_STYLE}>
                                        {t(msg => msg.dict.button.test)}
                                    </ElButton>
                                    <ElButton icon={DocumentCopy} onClick={handleCopy} style={APPEND_BTN_STYLE}>
                                        {t(msg => msg.dict.button.paste)}
                                    </ElButton>
                                </Flex>
                            )
                        }}
                    />
                </Flex>
                <Flex>
                    <ElAlert
                        showIcon
                        title={result.value.msg}
                        type={result.value.type}
                        closable={false}
                    />
                </Flex>
            </Flex>
        </ElDialog>
    )
})

export default ScopeTest