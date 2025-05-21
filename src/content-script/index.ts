import settingDb from '@db/setting-db'
import { listWords } from '../service/dictionary-service'
import Context from './resolver/context'
import filter from './resolver/filter'
import Replacer from './resolver/replacer'
import generateSwitcher from './resolver/switcher'

const config: MutationObserverInit = { attributes: false, childList: true, subtree: true }

const context = new Context()

const generateDocumentObserver = (replacer: Replacer) => {
    return new MutationObserver((records: MutationRecord[]) =>
        records.forEach(record => record.addedNodes.forEach(node => replacer.replaceNode(node)))
    )
}

async function processSwitcher() {
    const showVisibilityButton = await settingDb.getVisibilityOfButton()
    if (!showVisibilityButton) {
        return
    }

    const switcher = generateSwitcher(context)
    window.addEventListener('load', () => document.body.append(switcher))
}

async function main() {
    const host = window.location.host
    const href = window.location.href

    const ignored = filter(host, href)
    if (ignored) {
        return
    }

    const originWords: XGFLFG.BannedWord[] = await listWords(host, href)
    if (!originWords?.length) {
        return
    }

    const words: XGFLFG.BannedWordUseReg[] = originWords.map(word => ({
        origin: new RegExp(word.origin.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'g'),
        mask: word.mask
    }))

    const replacer = new Replacer(words, context)
    document.title = replacer.replaceStr(document.title)

    if (document.body) {
        // Resolve static dom nodes
        document.body.childNodes.forEach(node => replacer.replaceNode(node))
    }

    const observer = generateDocumentObserver(replacer)

    observer.observe(document, config)
    tryDisconnect(observer)

    processSwitcher()
}

const tryDisconnect = (observer: MutationObserver) => {
    try {
        window.addEventListener('beforeunload', () => observer.disconnect())
    } catch { }
}

main()
