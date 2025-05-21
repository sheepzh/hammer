import { getI18nVal, I18nKey } from "."

export type I18nResultItem<Node> = Node | string

const findParamAndReplace = <Node,>(resultArr: I18nResultItem<Node>[], [key, value]: any) => {
    const paramPlacement = `{${key}}`
    const temp: I18nResultItem<Node>[] = []
    resultArr.forEach((item) => {
        if (typeof item === 'string' && item.includes(paramPlacement)) {
            // 将 string 替换成具体的 VNode
            let splits: I18nResultItem<Node>[] = (item as string).split(paramPlacement)
            splits = splits.reduce<I18nResultItem<Node>[]>((left, right) => left.length ? left.concat(value, right) : left.concat(right), [])
            temp.push(...splits)
        } else {
            temp.push(item)
        }
    })
    return temp
}
export type NodeTranslateProps<MessageType, Node> = {
    key: I18nKey<MessageType>,
    param: { [key: string]: I18nResultItem<Node> }
}

/**
 * Translate with slots for vue
 * 
 * @param key key path
 * @param param param, slot vnodes
 * @returns The array of vnodes or strings
 */
export const tN = <MessageType, Node>(messages: MessageType, props: NodeTranslateProps<MessageType, Node>): I18nResultItem<Node>[] => {
    const { key, param } = props
    const result = getI18nVal(messages, key)
    let resultArr: I18nResultItem<Node>[] = [result]
    if (param) {
        resultArr = Object.entries(param).reduce(findParamAndReplace, resultArr)
    }
    return resultArr
}
