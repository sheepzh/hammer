const { userAgent } = navigator
export const IS_FIREFOX = /Firefox[\/\s](\d+\.\d+)/.test(userAgent)

export const IS_EDGE = userAgent.includes('Edg')

export const IS_CHROME = userAgent.includes('Chrome') && !userAgent.includes('Edg')

export const IS_MV3 = chrome.runtime.getManifest().manifest_version === 3