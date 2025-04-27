/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard } from "element-plus"
import { defineComponent, type StyleValue, useSlots } from "vue"

const ContentCard = defineComponent(() => {
    return () => (
        <ElCard
            style={{ minHeight: '640px' } satisfies StyleValue}
            bodyStyle={{ height: '100%' }}
            v-slots={useSlots()}
        />
    )
})

export default ContentCard