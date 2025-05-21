import ContentContainer from "@app/layout/ContentContainer"
import { t } from "@app/locale"
import settingDb from "@db/setting-db"
import { ElRow, ElSwitch } from "element-plus"
import { defineComponent, onBeforeMount, ref, watch } from "vue"

const Setting = defineComponent(() => {
    const showButton = ref(false)
    onBeforeMount(() => settingDb.getVisibilityOfButton().then(val => showButton.value = !!val))
    watch(showButton, () => settingDb.updateVisibilityOfButton(!!showButton.value))

    return () => (
        <ContentContainer>
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
        </ContentContainer>
    )
})

export default Setting
