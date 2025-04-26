import clipboardy from 'clipboardy'
import { ElAlert, ElButton, ElCol, ElInput, ElRow } from "element-plus"
import { defineComponent, h, reactive, watchEffect, type SetupContext, type UnwrapRef, type VNode } from "vue"
import { matchScope } from "../../../common/matcher"
import { t } from "../../locale"

const url2Host = (urlStr: string) => {
  const url = new URL(urlStr)
  return url.host
}

type TestResult = {
  type: 'info' | 'success' | 'error',
  msg: string
}

type RawBinding = {
  targetUrl: string,
  scopes: XGFLFG.Scopes
  testResult: TestResult
}

type Props = {
  scopes: XGFLFG.Scopes
}

const NO_MSG_RESULT: () => TestResult = () => { return { type: 'info', msg: t(msg => msg.dict.testResult.noTestUrl) } }

const comp = defineComponent(
  (_props: Props, context: SetupContext) => {
    const scopes: XGFLFG.Scopes = (context.attrs.scopes || {}) as XGFLFG.Scopes
    const binding: UnwrapRef<RawBinding> = reactive({
      targetUrl: '',
      scopes,
      testResult: NO_MSG_RESULT()
    })


    // Methods 
    const wrapByCol = (span: number, cell: VNode) => h(ElCol, { span }, () => cell)
    const updateTargetUrl = (val: string) => binding.targetUrl = (val || '').trim()
    const test: () => TestResult = () => {
      const scopes = binding.scopes
      if (!scopes || !Object.values(scopes).length) {
        return { type: 'success', msg: t(msg => msg.dict.testResult.effectiveNoWord) }
      }
      const url = binding.targetUrl
      if (!url || url === '') {
        return NO_MSG_RESULT()
      }
      const host = url2Host(url)
      for (const index in scopes) {
        const scope: XGFLFG.Scope = scopes[index]
        try {
          if (matchScope(scope, host, url)) {
            return { type: 'success', msg: t(msg => msg.dict.testResult.effectiveWithPattern, { pattern: scope.pattern }) }
          }
        } catch {
          return { type: 'error', msg: t(msg => msg.dict.testResult.wrongRegular) }
        }
      }
      return { type: 'error', msg: t(msg => msg.dict.testResult.wrongRegular) }
    }

    const handleTestResult = (result: TestResult) => {
      binding.testResult.msg = result.msg
      binding.testResult.type = result.type
    }
    // Watch the target url
    watchEffect(() => !binding.targetUrl && handleTestResult(NO_MSG_RESULT()))

    const testResult: TestResult = binding.testResult

    return () => h('div',
      h(ElRow, { gutter: 20 },
        () => [
          wrapByCol(10, h(ElAlert, { showIcon: true, title: testResult.msg, type: testResult.type, closable: false })),
          wrapByCol(14,
            h(ElInput,
              {
                modelValue: binding.targetUrl,
                clearable: true,
                placeholder: t(msg => msg.dict.msg.testUrlPlaceholder),
                onInput: updateTargetUrl,
                onKeyup: (event: KeyboardEvent) => event.code === 'Enter' && handleTestResult(test()),
                onClear: () => updateTargetUrl('')
              },
              // Button to paste
              {
                append: () => [
                  h(ElButton, {
                    icon: 'el-icon-search', onClick: () => handleTestResult(test())
                  }, () => t(msg => msg.dict.button.test)),
                  h(ElButton,
                    {
                      icon: 'el-icon-document-copy',
                      onClick: () => clipboardy.read().then(updateTargetUrl)
                    },
                    () => t(msg => msg.dict.button.paste)
                  )
                ]
              }
            )
          )
        ]
      )
    )
  }
)

export default comp

export type ScopeTestProps = Props