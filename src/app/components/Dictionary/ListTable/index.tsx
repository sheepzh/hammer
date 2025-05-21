import Box from '@app/layout/Box'
import Flex from '@app/layout/Flex'
import { t } from '@app/locale'
import dictionaryDb from '@db/dictionary-db'
import { useRequest } from "@src/hooks/useRequest"
import { saveJSON } from "@util/file-util"
import type { ElTableRowScope } from "element"
import { ElButton, ElMessage, ElMessageBox, ElSwitch, ElTable, ElTableColumn, ElTag, ElTooltip } from 'element-plus'
import { defineComponent, ref, toRaw } from 'vue'
import Scope, { type ScopeInstance } from './Scope'
import ScopeTag from './Scope/ScopeTag'
import Words, { type WordsInstance } from './Words'

const OperationButton = defineComponent<{ name: string, onClick: () => void }>(({ name, onClick }) => {
    return () => <ElButton type='primary' link onClick={onClick}>{name}</ElButton>
}, { props: ['name', 'onClick'] })

export type ListTableInstance = { refresh: () => void }

type ColData = ElTableRowScope<XGFLFG.Dictionary>

const ListTable = defineComponent<{ onEdit: ArgCallback<XGFLFG.Dictionary> }>(({ onEdit }, ctx) => {
    const scopeInst = ref<ScopeInstance>()
    const wordsInst = ref<WordsInstance>()

    const { data: list, refreshAsync, refresh, ts } = useRequest(() => dictionaryDb.listAll())

    const updateEnabled = async (id: number, newEnabled: boolean) => {
        await dictionaryDb.updateEnabled(id, newEnabled)
        await refreshAsync()
    }

    ctx.expose({ refresh } satisfies ListTableInstance)

    const handleDelete = (row: XGFLFG.Dictionary) => {
        ElMessageBox.confirm(
            t(msg => msg.dict.msg.deleteConfirmMsg, { name: row.name }),
            t(msg => msg.dict.msg.operationConfirmation),
            {
                cancelButtonText: t(msg => msg.dict.button.giveUp),
                confirmButtonText: t(msg => msg.dict.button.ok),
                type: 'warning'
            }
        ).then(() =>
            dictionaryDb.delete(row.id ?? 0).then(() => {
                ElMessage.success(t(msg => msg.dict.msg.deletedSuccessfully))
                refresh()
            })
        ).catch(() => { })
    }
    const handleExport = (row: XGFLFG.Dictionary) => {
        const toExport: any = { ...row }
        delete toExport.id
        delete toExport.enabled
        saveJSON(toExport, `${t(msg => msg.app.name)}_${row.name || 'UNNAMED'}.json`)
    }

    return () => (
        <Box width="100%" marginTop={20}>
            <ElTable data={list.value} width="100%" border fit>
                <ElTableColumn prop="name" align="center" minWidth={40} label={t(msg => msg.item.name)} />
                <ElTableColumn
                    align="center"
                    minWidth={40}
                    label={t(msg => msg.item.wordCount)}
                    formatter={({ words }: XGFLFG.Dictionary) => `${Object.values(words).length ?? 0}`}
                />
                <ElTableColumn align="center" minWidth={40} label={t(msg => msg.item.scope)}>
                    {({ row: { scopes } }: ColData) => Object.keys(scopes).length ? (
                        <ElTooltip
                            placement="top"
                            effect="light"
                            v-slots={{
                                content: () => <Flex gap={2}>{Object.values(scopes).map(s => <ScopeTag value={s} />)}</Flex>,
                                default: () => <ElTag type="primary">{t(msg => msg.item.scopeResult.some)}</ElTag>,
                            }}
                        />
                    ) : (
                        <ElTag type='success' size='small'>{t(msg => msg.item.scopeResult.all)}</ElTag>
                    )}
                </ElTableColumn>
                <ElTableColumn prop="remark" align="center" minWidth={80} label={t(msg => msg.item.remark)} />
                <ElTableColumn align="center" minWidth={30} label={t(msg => msg.item.enabled)}>
                    {({ row: { enabled, id } }: ColData) => <ElSwitch modelValue={enabled} onChange={val => updateEnabled(id, !!val)} />}
                </ElTableColumn>
                <ElTableColumn align="center" minWidth={70} label={t(msg => msg.item.operation)} key={ts.value}>
                    {({ row }: ColData) => <>
                        <OperationButton name={t(msg => msg.item.words)} onClick={() => wordsInst.value?.open(toRaw(row))} />
                        <OperationButton name={t(msg => msg.item.scope)} onClick={() => scopeInst.value?.open(toRaw(row))} />
                        <OperationButton name={t(msg => msg.dict.button.edit)} onClick={() => onEdit(toRaw(row))} />
                        <OperationButton name={t(msg => msg.dict.button.delete)} onClick={() => handleDelete(toRaw(row))} />
                        <OperationButton name={t(msg => msg.dict.button.export)} onClick={() => handleExport(toRaw(row))} />
                    </>}
                </ElTableColumn>
            </ElTable>
            <Scope ref={scopeInst} onClose={refresh} />
            <Words ref={wordsInst} onClose={refresh} />
        </Box>
    )
}, { props: ['onEdit'] })

export default ListTable
