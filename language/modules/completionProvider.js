const vscode = require('vscode');
let data = {}
try {
    data = require('../assets/data.json');
} catch {
    data = {count: 0, timestamp: 0, functions: {}}
}

const { loadVariablesFromDocument, fileVariables } = require('./variables.js');

/**
 * Takes an object and returns a CompletionItem
 * 
 * @param {Object} func 
 * @property {string} func.name
 * @property {string} func.description
 * @property {string} func.code
 * @property {number} func.kind
 * @property {Object[]} func.params
 * 
 * @returns {vscode.CompletionItem}
 */
function completionItem(func) {
    const bareName = func.name.replace('$', '');
    const snippet = new vscode.MarkdownString(`\`\`\`ccbot\n${func.code}\n\`\`\``);
    const item = new vscode.CompletionItem(func.name, func.kind)
        item.detail = func.description
        item.insertText = bareName
        item.filterText = bareName
        item.sortText = bareName
        item.documentation = snippet
    return item
}
/**
 * A collection of all function completion items
 * 
 * @type {vscode.CompletionItem[]}
 * @default []
 */

const functions = []
Object.values(data.functions).forEach(func => {
    functions.push(completionItem(func))
})

try {
    // Index on change, open and init
    vscode.workspace.onDidChangeTextDocument((e) => {
        const newText = e.contentChanges[0].text
        if (newText !== '\r\n') return;
        loadVariablesFromDocument(e.document)
    })
    vscode.workspace.onDidOpenTextDocument((document) => {
        loadVariablesFromDocument(document)
    })
    vscode.workspace.textDocuments.forEach(document => {
        loadVariablesFromDocument(document)
    })
} catch (e) {
    console.error(`An error occured when loading variables from a document: ${e}`)
}

module.exports = {
    provideCompletionItems(doc, pos, token) {
        // Ensure the string starts with $
        const word = doc.getText(doc.getWordRangeAtPosition(pos, /\$?[a-zA-Z_][a-zA-Z0-9_]*/))
        if (!word.startsWith('$')) return [];

        // Get variable completion items
        let variables = fileVariables[doc.fileName] || []
        variables = variables.map(variable => {
            const snippet = `$let[${Object.values(variable).filter(par => par !== undefined).join(';')}]`
            return completionItem({
                kind: 5,
                name: "$" + variable.name,
                description: `Value of a variable ${variable.name} defined somewhere in this file`,
                code: snippet
            })
        })
        return [...functions, ...variables]
    }
}
