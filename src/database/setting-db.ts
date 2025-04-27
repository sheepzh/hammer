import BaseDb from "./common/base-db"

const PREFIX = '_SETTING_'
const BUTTON_VISIBILITY = PREFIX + 'BUTTON_VISIBILITY_'
class SettingDb extends BaseDb {
    /**
     * Update the visibility of button
     * 
     * @param val val
     */
    async updateVisibilityOfButton(val: boolean): Promise<void> {
        await this.setByKey(BUTTON_VISIBILITY, val)
    }

    /**
     * Get the visibility of button
     * 
     * @param val val
     */
    async getVisibilityOfButton(): Promise<boolean> {
        const data: any = await this.storage.get(BUTTON_VISIBILITY)
        return data[BUTTON_VISIBILITY] || false
    }
}

const settingDb = new SettingDb(chrome.storage.local)

export default settingDb