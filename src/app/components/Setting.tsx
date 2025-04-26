import { t } from "@app/locale"
import SettingDb from "@db/setting-db"
import { ElRow, ElSwitch } from "element-plus"
import { defineComponent, onBeforeMount, ref, watch } from "vue"

const DB = new SettingDb(chrome.storage.local)

const Setting = defineComponent(() => {
    const showButton = ref(false)
    onBeforeMount(() => DB.getVisibilityOfButton().then(val => showButton.value = !!val))
    watch(showButton, () => DB.updateVisibilityOfButton(!!showButton.value))

    return () => (
        <div class="app-container">
            <ElRow>
                <ElSwitch
                    modelValue={showButton.value}
                    onChange={val => showButton.value = !!val}
                    style={{
                        lineHeight: '50px',
                        height: '50px',
                        paddingRight: '20px',
                    }}
                />
                <p>
                    {t(msg => msg.setting.restoreLabel, { buttonText: t(msg => msg.restore.restoreButton) })}
                </p>
            </ElRow>
        </div>
    )
})

export default Setting
