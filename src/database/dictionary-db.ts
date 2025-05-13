import BaseDb from './common/base-db'

const KEY = '_DICT_'
const ID_KEY = '_DICT_ID'
const INITIAL_ID = 1

const keyOf = (id: number) => KEY + id.toString()

/**
 * @since 0.0.1
 */
class DictionaryDb extends BaseDb {
    private async getCurrentId(): Promise<number> {
        const data: any = await this.storage.get(ID_KEY)
        const before = data[ID_KEY]
        if (!before) {
            return INITIAL_ID
        } else {
            return (before as number) + 1
        }
    }

    private async updateId(id: number): Promise<void> {
        await this.setByKey(ID_KEY, id)
    }

    async getById(id: number): Promise<XGFLFG.Dictionary> {
        const key = keyOf(id)
        const data = await this.storage.get(key)
        const row = data[key]
        return row ? row as XGFLFG.Dictionary : Promise.reject(new Error('Not found'))
    }

    /**
     * List all the records
     * 
     * @param callback 
     */
    async listAll(): Promise<XGFLFG.Dictionary[]> {
        const allData = await this.storage.get()
        return Object.entries(allData)
            .filter(([key]) => key.startsWith(KEY) && key !== ID_KEY)
            .map(([_key, value]) => value as XGFLFG.Dictionary)
    }

    /**
     * Add new record 
     */
    async add(data: Pick<XGFLFG.Dictionary, 'name' | 'remark'>): Promise<void> {
        const { name, remark } = data
        const id = await this.getCurrentId()
        const key = keyOf(id)
        const toAdd: XGFLFG.Dictionary = {
            id, name, remark,
            words: {},
            enabled: true,
        }
        await this.setByKey(key, toAdd)
        await this.updateId(id)
    }

    /**
     * Import from file 
     * 
     * @param toImport the record to import, without uuid in it
     * @since 0.0.5
     */
    async import(toImport: XGFLFG.Dictionary): Promise<void> {
        const id = await this.getCurrentId()
        const key = keyOf(id)
        toImport.id = id
        toImport.enabled = true
        await this.setByKey(key, toImport)
        await this.updateId(id)
    }

    /**
     * Delete by id
     * 
     * @since 0.0.1
     */
    async delete(id: number): Promise<void> {
        await this.storage.remove(keyOf(id))
    }

    /**
     * Update enabled
     * 
     * @param id id
     * @param enabled enabled
     */
    async updateEnabled(id: number, enabled: boolean,): Promise<void> {
        const exist = await this.getById(id)
        exist.enabled = enabled
        this.setByKey(keyOf(id), exist)
    }

    /**
     * Update the info
     */
    async update(dict: XGFLFG.Dictionary): Promise<void> {
        const id = dict.id
        if (!id) {
            return
        }
        await this.setByKey(keyOf(id), dict)
    }

    async updateBaseInfo(dict: Pick<XGFLFG.Dictionary, 'id' | 'name' | 'remark'>): Promise<void> {
        const { id, name, remark } = dict
        const exist = await this.getById(id)
        if (!exist) return
        exist.name = name
        exist.remark = remark
        await this.setByKey(keyOf(id), exist)
    }

    async updateWords(id: number, wordArr: XGFLFG.BannedWord[]) {
        const exist = await this.getById(id)
        const words: XGFLFG.BannedWords = {}
        wordArr.forEach(w => words[w.origin] = w)
        exist.words = words
        await this.setByKey(keyOf(id), exist)
    }

    async updateScopes(id: number, scopes: XGFLFG.Scopes): Promise<void> {
        const exist = await this.getById(id)
        if (!exist) return
        exist.scopes = scopes
        await this.setByKey(keyOf(id), exist)
    }
}

export default new DictionaryDb(chrome.storage.local)