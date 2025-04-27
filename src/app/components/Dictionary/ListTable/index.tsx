import { t } from '@app/locale'
import dictionaryDb from '@db/dictionary-db'
import { useRequest } from "@src/hooks/useRequest"
import { saveJSON } from "@util/file-util"
import type { ElTableRowScope } from "element"
import { ElButton, ElDialog, ElMessage, ElMessageBox, ElSwitch, ElTable, ElTableColumn } from 'element-plus'
import { defineComponent, ref, toRaw } from 'vue'
import Scope from './Scope'
import ScopeList from './Scope/ScopeList'
import Words, { WordsInstance } from './Words'

const OperationButton = defineComponent<{ name: string, onClick: () => void }>(({ name, onClick }) => {
    return () => <ElButton type='primary' link onClick={onClick}>{name}</ElButton>
}, { props: ['name', 'onClick'] })

export type ListTableInstance = { refresh: () => void }

type Props = {
    onEdit: (dict: XGFLFG.Dictionary) => void
}

const ListTable = defineComponent<Props>(({ onEdit }, ctx) => {
    const current = ref<XGFLFG.Dictionary>()
    const editState = ref<'scope'>()

    const { data: list, refreshAsync, refresh } = useRequest(() => dictionaryDb.listAll())

    const updateEnabled = async (id: number, newEnabled: boolean) => {
        await dictionaryDb.updateEnabled(id, newEnabled)
        await refreshAsync()
    }

    ctx.expose({ refresh } satisfies ListTableInstance)

    const words = ref<WordsInstance>()

    const handleWordsChange = (id: number, words: XGFLFG.BannedWords) => {
        const exist = list.value.find(item => item.id === id)
        if (!exist) return
        exist.words = words
    }

    return () => (
        <div style={{ width: '100%', marginTop: '20px' }}>
            <ElTable data={list.value} width="100%" border fit>
                <ElTableColumn prop="name" align="center" minWidth={40} label={t(msg => msg.item.name)} />
                <ElTableColumn
                    align="center"
                    minWidth={40}
                    label={t(msg => msg.item.wordCount)}
                    formatter={({ words }: XGFLFG.Dictionary) => `${Object.values(words).length ?? 0}`}
                />
                <ElTableColumn align="center" minWidth={40} label={t(msg => msg.item.scope)}>
                    {(data: any) => <ScopeList scopes={(data.row as XGFLFG.Dictionary).scopes ?? {}} />}
                </ElTableColumn>
                <ElTableColumn prop="remark" align="center" minWidth={80} label={t(msg => msg.item.remark)} />
                <ElTableColumn align="center" minWidth={30} label={t(msg => msg.item.enabled)}>
                    {(data: any) => {
                        const row = data.row as XGFLFG.Dictionary
                        return (
                            <ElSwitch modelValue={row.enabled} onChange={val => updateEnabled(row.id, !!val)} />
                        )
                    }}
                </ElTableColumn>
                <ElTableColumn align="center" minWidth={70} label={t(msg => msg.item.operation)}>
                    {({ row }: ElTableRowScope<XGFLFG.Dictionary>) => <>
                        <OperationButton
                            name={t(msg => msg.item.words)}
                            onClick={() => words.value?.show(toRaw(row))}
                        />
                        <OperationButton
                            name={t(msg => msg.item.scope)}
                            onClick={() => {
                                current.value = toRaw(row)
                                editState.value = 'scope'
                            }}
                        />
                        <OperationButton name={t(msg => msg.dict.button.edit)} onClick={() => onEdit(toRaw(row))} />
                        <OperationButton
                            name={t(msg => msg.dict.button.delete)}
                            onClick={() => {
                                ElMessageBox.confirm(
                                    t(msg => msg.dict.msg.deleteConfirmMsg, { name: row.name }),
                                    t(msg => msg.dict.msg.operationConfirmation),
                                    {
                                        cancelButtonText: t(msg => msg.dict.button.giveUp),
                                        confirmButtonText: t(msg => msg.dict.button.ok),
                                        type: 'warning'
                                    }
                                ).then(() =>
                                    dictionaryDb.delete(row.id || 0).then(() => {
                                        ElMessage.success(t(msg => msg.dict.msg.deletedSuccessfully))
                                        refresh()
                                    })
                                ).catch(() => { })
                            }}
                        />
                        <OperationButton
                            name={t(msg => msg.dict.button.export)}
                            onClick={() => {
                                const toExport = toRaw(row) as any
                                delete toExport.id
                                delete toExport.enabled
                                saveJSON(toExport, `${t(msg => msg.app.name)}_${row.name || 'UNNAMED'}.json`)
                            }}
                        />
                    </>}
                </ElTableColumn>
            </ElTable>
            <ElDialog
                title={`${t(msg => msg.item.scope)} - ${current.value?.name}`}
                modelValue={editState.value === 'scope'}
                onClosed={() => editState.value = undefined}
                destroyOnClose
            >
                <Scope
                    scopes={current.value?.scopes ?? {}}
                    onScopeAdd={(scope: XGFLFG.Scope) => {
                        const dict = current.value
                        if (!dict) return
                        if (!dict.scopes) {
                            dict.scopes = {}
                        }
                        dict.scopes[scope.type + scope.pattern] = scope
                        dictionaryDb.update(toRaw(dict) as XGFLFG.Dictionary).then(() => {
                            ElMessage.success(t(msg => msg.dict.msg.savedSuccessfully))
                        })
                    }}
                    onScopeDelete={(key: string) => {
                        const dict = current.value
                        if (!dict) return
                        dict.scopes && delete dict.scopes[key]
                        dictionaryDb.update(dict).then(() => ElMessage.success('删除成功'))
                    }}
                />
            </ElDialog>
            <Words ref={words} onChanged={handleWordsChange} />
        </div>
    )
}, { props: ['onEdit'] })

export default ListTable
