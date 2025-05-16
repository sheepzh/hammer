/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard, ElScrollbar } from "element-plus"
import { defineComponent, h, type StyleValue, useSlots } from "vue"
import ContentCard from "./ContentCard"
import Flex from "./Flex"

const FILTER_BODY_STYLE: StyleValue = {
    paddingBottom: '18px',
    paddingTop: '18px',
    boxSizing: 'border-box',
    width: '100%',
}

const ContentContainer = defineComponent(() => {
    const { default: default_, filter, content } = useSlots()
    return () => (
        <ElScrollbar>
            <Flex width="100%" column gap={15}>
                {filter && (
                    <ElCard
                        style={{ alignItems: 'center', userSelect: 'none' } satisfies StyleValue}
                        bodyStyle={FILTER_BODY_STYLE}
                        v-slots={filter}
                    />
                )}
                {!!default_ && h(default_)}
                {!default_ && content && <ContentCard v-slots={content} />}
            </Flex>
        </ElScrollbar>
    )
})

export default ContentContainer