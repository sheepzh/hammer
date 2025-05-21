import type { Messages } from "@util/i18n"
import resource from "./dict-resource.json"

export type DictMessage = {
    button: {
        add: string
        import: string
        feedback: string
        word: string
        scope: string
        edit: string
        delete: string
        export: string
        confirm: string
        cancel: string
        ok: string
        giveUp: string
        paste: string
        test: string
        addScope: string
    }
    msg: {
        nameBlankError: string
        savedSuccessfully: string
        importedSuccessfully: string
        deleteConfirmMsg: string
        operationConfirmation: string
        deletedSuccessfully: string
        noUrlError: string
        invalidRegularError: string
        useRegularMsg: string
        noOriginWordError: string
        wordDeleteConfirmMsg: string
    }
    testResult: {
        noTestUrl: string
        effectiveNoWord: string
        effectiveWithPattern: string
        wrongRegular: string
        ineffective: string
    }
}

export default resource satisfies Messages<DictMessage>