const parser = require('./parser.js')
const vscode = require('vscode')

const commands = []
commands.push(vscode.commands.registerCommand('ccbot.reloadFunctions', async () => {
    const response = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Reloading functions...',
        cancellable: false
    },
        async (progress) => {
            return await parser.parse(vscode.extensionContext, progress)
        }
    )

    switch (response.status) {
        case 'ok':
            vscode.window.showInformationMessage(`${response.count} Custom Command functions have been loaded successfully.
            Reload the editor to see the changes.`)
            break;
        case 'cooldown':
            vscode.window.showWarningMessage(`The parser is on cooldown, please wait ${response.readable} before updating the parser again.`)
            break;
    }

}))

module.exports = commands