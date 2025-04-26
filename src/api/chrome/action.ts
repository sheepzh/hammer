import { IS_MV3 } from "@util/constant/environment"
import { handleError } from "./common"

const action = IS_MV3 ? chrome.action : chrome.browserAction

export function onIconClick(handler: () => void) {
    // Forbidden popup page first by setting popup empty string
    action.setPopup({ popup: '' }, () => handleError('setPopup'))
    action.onClicked.addListener(() => handler?.())
}