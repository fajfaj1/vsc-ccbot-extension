// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {


    // const cultivator = webmodule
    // let data; eval(`${cultivator}; data = Parser;`)
    // console.log(data)
    // vscode.window.showInformationMessage(data)
    
    // const provider = vscode.languages.registerCompletionItemProvider('ccbot', {
    //     provideCompletionItems(document, position, token) {
    //         const items = []
            
    //         Object.keys(data).forEach(key => {
    //             console.log(key)
    //             const funcInfo = data[key].split(';')
    //             const item = new vscode.CompletionItem(key)
    //             item.detail = funcInfo.shift()
    //             item.insertText = key
    //             items.push(item)
    //         })

    //         return items
    //     }
    // })
    // context.subscriptions.push(provider)
    console.log(`Custom Command bot extension is active!`)

}

// this method is called when your extension is deactivated
function deactivate() { }

// eslint-disable-next-line no-undef
module.exports = {
    activate,
    deactivate
}