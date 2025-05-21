import { type Messages } from ".."
import appMessages, { type AppMessage } from "../components/app"
import restoreMessages, { type RestoreMessage } from "../components/restore"

export type ChromeMessage = {
    app: AppMessage
    restore: RestoreMessage
}

const messages: Messages<ChromeMessage> = {
    zh_CN: {
        app: appMessages.zh_CN,
        restore: restoreMessages.zh_CN
    },
    en: {
        app: appMessages.en,
        restore: restoreMessages.en
    }
}

export default messages

const placeholder: ChromeMessage = {
    app: {
        name: '',
        description: '',
        iconTitle: ''
    },
    restore: {
        hideButton: '',
        restoreButton: ''
    }
}

function routerPath(root: any, parentPath = '') {
    Object.entries(root)
        .forEach(([key, value]) => {
            const currentPath = parentPath ? `${parentPath}_${key}` : key
            if (typeof value === 'string') {
                root[key] = currentPath
            } else {
                root[key] = routerPath(value, currentPath)
            }
        })
    return root
}

export const router: ChromeMessage = routerPath(placeholder) as unknown as ChromeMessage
