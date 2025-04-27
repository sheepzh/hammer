import { DocumentCopy, Search } from '@element-plus/icons-vue'
import { useRequest } from '@src/hooks/useRequest'
import clipboardy from 'clipboardy'
import { ElAlert, ElButton, ElCol, ElInput, ElRow } from "element-plus"
import { defineComponent, ref } from "vue"
import { matchScope } from "../../../../../common/matcher"
import { t } from "../../../../locale"

const url2Host = (urlStr: string) => {
    const url = new URL(urlStr)
    return url.host
}

type TestResult = {
    type: 'info' | 'success' | 'error',
    msg: string
}

const noMsgRes: () => TestResult = () => { return { type: 'info', msg: t(msg => msg.dict.testResult.noTestUrl) } }

type Props = {
    scopes: XGFLFG.Scopes
}

const ScopeTest = defineComponent<Props>(props => {
    const { data: result, refresh: test } = useRequest((): TestResult => {
        const scopes = props.scopes
        if (!Object.values(scopes).length) {
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
        return { type: 'error', msg: t(msg => msg.dict.testResult.wrongRegular) }
    }, { defaultValue: noMsgRes() })
    const targetUrl = ref('')

    const handleCopy = () => clipboardy.read()
        .then(val => targetUrl.value = val?.trim?.() ?? '')
        .catch(() => { })

    return () => (
        <ElRow gutter={20}>
            <ElCol span={10}>
                <ElAlert
                    showIcon
                    title={result.value.msg}
                    type={result.value.type}
                    closable={false}
                />
            </ElCol>
            <ElCol span={14}>
                <ElInput
                    modelValue={targetUrl.value}
                    clearable
                    placeholder={t(msg => msg.dict.msg.testUrlPlaceholder)}
                    onInput={val => targetUrl.value = val.trim()}
                    onKeydown={(ev: KeyboardEvent | Event) => (ev as KeyboardEvent).code === 'Enter' && test()}
                    onClear={() => targetUrl.value = ''}
                    v-slots={{
                        append: () => <>
                            <ElButton icon={Search} onClick={test}>
                                {t(msg => msg.dict.button.test)}
                            </ElButton>,
                            <ElButton icon={DocumentCopy} onClick={handleCopy}>
                                {t(msg => msg.dict.button.paste)}
                            </ElButton>
                        </>
                    }}
                />
            </ElCol>
        </ElRow>
    )
})

export default ScopeTest