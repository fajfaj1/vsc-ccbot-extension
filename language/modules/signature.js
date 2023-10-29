const vscode = require('vscode')
const path = require('path')
const dataPath = path.join(vscode.extensionContext.globalStorageUri.fsPath, 'data.json')

/**
 * @type {Object} 
 * @property {number} count
 * @property {number} timestamp
 * @property {Object} functions
 */
let data = {}
try {
        data = require(dataPath)
}
catch {
        data = { count: 0, timestamp: 0, functions: {} }
}

/**
 * Takes an object and returns a CompletionItem
 * 
 * @param {Object} func
 * @property {string} func.name
 * @property {string} func.description
 * @property {string} func.code
 * @property {number} func.kind
 * @property {Object[]} func.params
 */
function signatureInformation(func) {
        const parameters = []
        func.params.forEach(param => {
                const parameter = new vscode.ParameterInformation(param.label)
                        parameter.documentation = param.label
                parameters.push(parameter)
                // console.log(parameter)
        })

        const syntax = `${func.name}[${func.params.map(param => param.label).join(';')}]`

        const item = new vscode.SignatureInformation(
                syntax, 
                func.description,
        )
                item.parameters = parameters

        return item

}

module.exports = {

        /**
         * Return a list of signatures for the function at the given position
         * 
         * @param {vscode.TextDocument} doc 
         * @param {vscode.Position} pos 
         */
        provideSignatureHelp(doc, pos) {
                const wordRange = doc.getWordRangeAtPosition(pos, /\$[a-zA-Z]+\[[^[\]]*/gm)
                const wordText = doc.getText(wordRange) // Like $test[1;] or $test[
                const wordArr = wordText.split('[')

                const funcName = wordArr.shift()
                const func = data.functions[funcName]

                const rest = wordArr.join('[').replace(/\]$/, '')
                const innerFunctionLess = rest.replace(/\$[a-zA-Z_]+\[.+\]/, '%FUNC%')
                const params = innerFunctionLess.split(';')

                const currentParam = params.length - 1

                const sigHelp = new vscode.SignatureHelp()
                        sigHelp.activeSignature = 0
                        sigHelp.activeParameter = currentParam
                        sigHelp.signatures = [
                                signatureInformation(func)
                        ]
                
                return sigHelp
        }
}