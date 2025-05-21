import { Messages } from "@util/i18n"
import resource from "./item-resource.json"

export type ItemMessage = {
    name: string
    wordCount: string
    scope: string
    scopeResult: {
        all: string
        some: string
    }
    scopeType: { [type in XGFLFG.ScopeType]: string },
    useRegSuffix: string
    remark: string
    enabled: string
    operation: string
    words: string
    word: {
        original: string
        mask: string
    }
}

export default resource satisfies Messages<ItemMessage>