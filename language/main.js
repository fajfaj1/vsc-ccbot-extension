const vscode = require('vscode');
const completionProvider = require('./modules/completionProvider.js')
// const signatureProvider = require('./signatureProvider.js')


/**
 * This function is called when the extension is activated.
 *
 * @param {vscode.ExtensionContext} context - The extension context.
 */
async function activate(context) {
    const start = Date.now()
    const providers = []
    try {
        providers.push(vscode.languages.registerCompletionItemProvider(
            'ccbot', 
            completionProvider, 
            ['$']
        ))
    } catch (e) {
        console.error(`An error occured when registering the completion provider: ${e}`)
    }

    // const signatureProvited = vscode.languages.registerSignatureHelpProvider('ccbot', {
    //     provideSignatureHelp(doc, pos) {
    //         try {
    //             console.log(params)
    //             console.log('Signature help requested')
    //             const signatureHelp = new vscode.SignatureHelp()
    //             signatureHelp.activeSignature = 0
    //             signatureHelp.activeParameter = 0

    //             signatureHelp.signatures = params
    //             return Object.values(signatureHelp)
    //         } catch (e) {
    //             console.error(e)
    //         }

    //     }
    // }, ['[', ';'])

    context.subscriptions.push(...providers)
    const bootTime = Date.now() - start
    console.log(`ccbot extension activated in ${bootTime}ms`)

}

// this method is called when your extension is deactivated
// function deactivate() { }

// eslint-disable-next-line no-undef
module.exports = {
    activate
    // deactivate
}