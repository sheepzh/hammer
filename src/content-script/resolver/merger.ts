import { ORIGIN_TEXT_ATTR_NAME } from "../constant/element"

const mergedTags = ['EM', 'B', 'I', 'U', '#text']

const needMerge = () => {
    const host = window.location.host
    return ['s.weibo.com'].includes(host)
}

/**
 * Judge the same format nodes
 * 
 * @param left one
 * @param right another
 */
const canMerge = (left: Node, right: Node) => {
    const lt = left.nodeName, rt = right.nodeName
    // Type must be the same
    if (typeof left !== typeof right || lt !== rt) {
        return false
    }
    // Specific types
    if (!mergedTags.includes(lt) || !mergedTags.includes(rt)) {
        return false
    }
    // If html nodes, must own the same length attributes
    if (left instanceof HTMLElement) {
        const lEle = left as HTMLElement, rEle = right as HTMLElement
        const lAttr = lEle.attributes, rAttr = rEle.attributes
        for (let index in lAttr) {
            const rA = rAttr[index]
            if (!rA) return false
            if (rA.name === ORIGIN_TEXT_ATTR_NAME) {
                continue
            }
            const lA = lAttr[index]
            if (!lA) return false
            if (lA.value !== rA.value) return false
        }
    }
    return true
}

const merge = (left: Node, right: Node) => {
    if (left.nodeName === '#text') {
        left.nodeValue = (left.nodeValue || '') + (right.nodeValue || '')
    } else {
        right.childNodes.forEach(c => left.appendChild(c))
    }
}

export default function mergeChildren(node: Node): void {
    // Only merge on specific sites
    if (!needMerge()) {
        return
    }

    const children = node.childNodes

    let lastElement: Node | null = null
    for (let index = 0; index < children.length; index++) {
        const child = children[index]

        if (lastElement === null) {
            // No the last element
            lastElement = child
        } else {
            if (canMerge(lastElement, child)) {
                // Merge and remove the right one
                merge(lastElement, child)
                node.removeChild(child)
            } else {
                // Recursion for this child
                mergeChildren(lastElement)
                lastElement = child
            }
        }
    }
}
