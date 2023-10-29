const vscode = require('vscode');
const commands = require('./modules/commands.js');
const fs = require('fs');
const path = require('path');

/**
 * This function is called when the extension is activated.
 *
 * @param {vscode.ExtensionContext} context - The extension context.
 */
async function activate(context) {
    const parser = require('./modules/parser.js');
    await parser.parse(context);

    // Attach the context to the vscode object
    vscode.extensionContext = context
    const start = Date.now()

    // Create a storage folder if it doesn't exist
    const storagePath = context.globalStorageUri.fsPath;
    if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);

    const providers = []

    // Register Commands
    try {
        providers.push(...commands)
    } catch (e) {
        console.error(`An error occured when registering the reloadFunctions command: ${e}`)
    }

    // Register Completion Provider
    const completionProvider = require('./modules/completion.js')
    try {
        providers.push(vscode.languages.registerCompletionItemProvider(
            'ccbot',
            completionProvider,
            ['$']
        ))
    } catch (e) {
        console.error(`An error occured when registering the completion provider: ${e}`)
    }

    const signatureProvider = require('./modules/signature.js');
    try {
        providers.push(vscode.languages.registerSignatureHelpProvider(
            'ccbot',
            signatureProvider,
            ['[', ';']
        ))
    } catch (e) {
        console.error(`An error occured when registering the signature provider: ${e}`)
    }

    context.subscriptions.push(...providers)

    const bootTime = Date.now() - start
    console.log(`ccbot extension activated in ${bootTime}ms`)

}


module.exports = {
    activate
}