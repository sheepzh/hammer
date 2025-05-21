import { ORIGIN_TEXT_ATTR_NAME, REPLACED_CLASS_NAME } from "../constant/element"
import Context from "./context"
import mergeChildren from "./merger"

const ignoredTags = ['SCRIPT', 'LINK', 'STYLE', 'IFRAME', 'IMG', 'INPUT']

/**
 * Replacer of html nodes
 */
class Replacer {

    words: XGFLFG.BannedWordUseReg[]
    context: Context
    usedTime: number

    constructor(words: XGFLFG.BannedWordUseReg[], context: Context) {
        this.usedTime = 0
        this.words = words
        this.context = context
    }

    /**
     * Replace the text
     * 
     * @param str original string
     * @returns replaced string
     */
    public replaceStr(str: string): string {
        this.words.forEach(word => str = str.replace(word.origin, word.mask))
        return str
    }

    public replaceNode(node: Node) {
        mergeChildren(node)
        this.replaceChildren(node)
    }

    private replaceChildren(node: Node) {
        if (ignoredTags.includes(node.nodeName)) {
            return
        }
        const nodeKey = this.getNodeKey(node)
        if (!nodeKey) return
        Array.from(node.childNodes).forEach((child, i) => {
            if (child.nodeName === '#text') {
                this.processTextNode(child, i, nodeKey)
            } else {
                this.replaceChildren(child)
            }
        })
    }

    private getNodeKey(node: Node) {
        if (!(node instanceof HTMLElement)) {
            return undefined
        }
        const ele = node as HTMLElement
        const nodeKey = ele.getAttribute(ORIGIN_TEXT_ATTR_NAME) || this.context.increaseKey()
        ele.classList.add(REPLACED_CLASS_NAME)
        ele.setAttribute(ORIGIN_TEXT_ATTR_NAME, nodeKey)
        return nodeKey
    }

    private processTextNode(textNode: Node, index: number, nodeKey: string) {
        const origin = textNode.nodeValue
        if (!origin) {
            return
        }
        const replaced = this.replaceStr(origin)
        if (replaced === origin) {
            // Nothing changed
            return
        }
        // Tail process
        textNode.nodeValue = replaced
        this.context.append(nodeKey, index, origin, replaced)
    }
}

export default Replacer