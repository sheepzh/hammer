import { onIconClick } from "@api/chrome/action"
import { onInstalled } from "@api/chrome/runtime"

function openAppPage() {
    const url = 'static/app.html'
    chrome.tabs.create({ url })
}

onIconClick(openAppPage)
onInstalled(reason => reason === 'install' && openAppPage())