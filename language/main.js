const vscode = require('vscode');
const completionProvider = require('./modules/completionProvider.js')
const parser = require('./modules/parser.js')
const fs = require('fs')
// const signatureProvider = require('./signatureProvider.js')


/**
 * This function is called when the extension is activated.
 *
 * @param {vscode.ExtensionContext} context - The extension context.
 */
async function activate(context) {
    const start = Date.now()

    // Create a storage folder if it doesn't exist
    const storagePath = context.globalStorageUri.fsPath;
    if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);

    // Register Completion Provider
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

    // Register Commands
    try {
        providers.push(vscode.commands.registerCommand('ccbot.reloadFunctions', async () => {
            const response = await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Reloading functions...',
                cancellable: false
            },
                async (progress) => {
                    return await parser.parse(context, progress)
                }
            )

            switch (response.status) {
                case 'ok':
                    vscode.window.showInformationMessage(`${response.count} Custom Command functions have been loaded`)
                    break;
                case 'cooldown':
                    vscode.window.showWarningMessage(`The parser is on cooldown, please wait ${response.readable} before updating the parser again.`)
                    break;
            }



        }))
    } catch (e) {
        console.error(`An error occured when registering the reloadFunctions command: ${e}`)
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