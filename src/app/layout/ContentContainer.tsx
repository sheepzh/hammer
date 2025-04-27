/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard, ElScrollbar } from "element-plus"
import { defineComponent, h, type StyleValue, useSlots } from "vue"
import ContentCard from "./ContentCard"

const CONTAINER_STYLE: StyleValue = {
    marginTop: '40px',
    marginBottom: '40px',
    height: 'calc(100% - 40px)',
    padding: '0 10px',
    overflow: 'hidden',
}

const FILTER_CONTAINER_STYLE: StyleValue = {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
}

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
            <div style={CONTAINER_STYLE}>
                {filter && (
                    <ElCard
                        class="filter-container"
                        style={FILTER_CONTAINER_STYLE}
                        bodyStyle={FILTER_BODY_STYLE}
                        v-slots={filter}
                    />
                )}
                {!!default_ && h(default_)}
                {!default_ && content && <ContentCard v-slots={content} />}
            </div>
        </ElScrollbar>
    )
})

export default ContentContainer