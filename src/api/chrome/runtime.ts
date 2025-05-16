export function onInstalled(handler: (reason: `${chrome.runtime.OnInstalledReason}`) => void): void {
    chrome.runtime.onInstalled.addListener(detail => handler(detail.reason))
}

export const EXTENSION_ID = chrome.runtime.id