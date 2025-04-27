import { Messages } from "@util/i18n"

export type DictMessage = {
    button: {
        add: string
        import: string
        feedback: string
        word: string
        scope: string
        edit: string
        delete: string
        export: string
        confirm: string
        cancel: string
        ok: string
        giveUp: string
        paste: string
        test: string
        addScope: string
        addWord: string
    }
    msg: {
        nameBlankError: string
        savedSuccessfully: string
        importedSuccessfully: string
        deleteConfirmMsg: string
        operationConfirmation: string
        deletedSuccessfully: string
        noUrlError: string
        invalidRegularError: string
        useRegularMsg: string
        urlPlaceholder: string
        testUrlPlaceholder: string
        noOriginWordError: string
        wordDeleteConfirmMsg: string
    }
    testResult: {
        noTestUrl: string
        effectiveNoWord: string
        effectiveWithPattern: string
        wrongRegular: string
        ineffective: string
    }
}

const _default: Messages<DictMessage> = {
    zh_CN: {
        button: {
            add: '新增词典',
            import: '导入词典',
            feedback: '使用反馈',
            word: '违禁词',
            scope: '生效范围',
            edit: '编辑',
            delete: '删除',
            export: '导出',
            confirm: '确认',
            cancel: '取消',
            ok: '是的',
            giveUp: '放弃',
            paste: '粘贴',
            test: '测试',
            addScope: '新增范围',
            addWord: '新增违禁词',
        },
        msg: {
            nameBlankError: '词典名称不能为空',
            savedSuccessfully: '保存成功',
            importedSuccessfully: '导入成功',
            deleteConfirmMsg: '是否删除词典[{name}]？',
            operationConfirmation: '操作提示',
            deletedSuccessfully: '删除成功',
            noUrlError: '未输入网址或域名',
            invalidRegularError: '无效的正则表达式',
            useRegularMsg: '是否启用正则匹配？',
            urlPlaceholder: '输入字典的有效范围，网址或者域名。需要使用正则表达式，请打开左侧开关',
            testUrlPlaceholder: '输入网址判断词典是否生效：https://www.baidu.com/?q=xxx',
            noOriginWordError: '未填写敏感词',
            wordDeleteConfirmMsg: '违禁词[{origin}]删除成功！'
        },
        testResult: {
            noTestUrl: '请输入待测试网址',
            effectiveNoWord: '字典有效，未指定范围。',
            effectiveWithPattern: '字典有效：{pattern}',
            wrongRegular: '错误的正则表达式',
            ineffective: '字典在该网址下无效'
        }
    },
    en: {
        button: {
            add: 'New One',
            import: 'Import',
            feedback: 'Feedback',
            word: 'Words',
            scope: 'Scope',
            edit: 'Edit',
            delete: 'Remove',
            export: 'Export',
            confirm: 'Confirm',
            cancel: 'Cancel',
            ok: 'OK',
            giveUp: 'Give up',
            paste: 'Paste',
            test: 'Test',
            addScope: 'New one',
            addWord: 'New word',
        },
        msg: {
            nameBlankError: 'The name can\'t be blank!',
            savedSuccessfully: 'Saved successfully!',
            importedSuccessfully: 'Imported successfully!',
            deleteConfirmMsg: 'The dictionary named [{name}] will be removed.',
            operationConfirmation: 'Operation confirmation',
            deletedSuccessfully: 'Removed successfully!',
            noUrlError: 'No URL or domain name entered',
            invalidRegularError: 'Invalid regular expression',
            useRegularMsg: 'Whether to enable regular matching?',
            urlPlaceholder: 'Input the scope to add, URL or domain name',
            testUrlPlaceholder: 'URL to test, like https://www.chorme.com/',
            noOriginWordError: 'No origin word entered',
            wordDeleteConfirmMsg: 'Remove word [{origin}] successfully!'
        },
        testResult: {
            noTestUrl: 'Input URL to test, pls',
            effectiveNoWord: 'Effective, no scope',
            effectiveWithPattern: 'Effective: {pattern}',
            wrongRegular: 'Wrong regular expression',
            ineffective: 'Ineffective'
        }
    }
}

export default _default