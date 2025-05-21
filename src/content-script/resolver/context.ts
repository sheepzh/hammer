/**
 * Context of the replacer
 */
type ContextResultItem = {
    origin: string
    replaced: string
}

type ContentResult = { [index: number]: ContextResultItem }

export default class Context {

    /**
     * Key of node, which is stored in the attribute named [ORIGIN_TEXT_ATTR_NAME]
     */
    nodeKey = 0
    container: Map<string, ContentResult> = new Map()

    /**
     * Set the value of node key and increase 
     * 
     * @returns current node key
     * @param origin  origin node value
     */
    append(nodeKey: string, indexOfChildren: number, origin: string, replaced: string): void {
        let result = this.container.get(nodeKey) || {}
        result[indexOfChildren] = { origin, replaced }
        this.container.set(nodeKey, result)
    }

    get(nodeKey: string, indexOfChildren: number): ContextResultItem | undefined {
        const item = this.container.get(nodeKey)
        return item?.[indexOfChildren]
    }

    getOrigin(nodeKey: string, indexOfChildren: number): string {
        const result = this.get(nodeKey, indexOfChildren)
        return result ? result.origin || '' : ''
    }

    getReplaced(nodeKey: string, indexOfChildren: number): string {
        const result = this.get(nodeKey, indexOfChildren)
        return result ? result.replaced || '' : ''
    }

    increaseKey(): string {
        return String(this.nodeKey++)
    }
}