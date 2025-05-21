import { Messages } from ".."

export type AppMessage = {
    name: string
    description: string
    iconTitle: string
}

/**
 * Use for chrome
 */
const _default: Messages<AppMessage> = {
    en: {
        name: 'Word Blocker',
        description: 'Replace the trigger words with other words or star signs',
        iconTitle: 'Dictionary Management'
    },
    zh_CN: {
        name: '相关法律法规',
        description: '谁还能没点精神洁癖？',
        iconTitle: '违禁词管理'
    }
}

export default _default