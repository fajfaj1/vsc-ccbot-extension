/**
 * @fileoverview Utilities module.
 */

/**
 * A collection of variables from a handful of files
 * 
 * @type {Object<string, Object[]>}
 */

const fileVariables = {}

/**
 * Get all variables from a document
 * 
 * @param {vscode.TextDocument} doc - The document to get the variables from
 * @returns {Object[]}
 */
function loadVariablesFromDocument(doc) {
    // Only for ccbot files
    if (doc.languageId !== 'ccbot') return;

    /**
     * A list of all variable declarations
     * 
     * @type {Object[]}
     * @property {string} name - The variable name
     */
    const variables = []

    // Find all $let declarations
    const lets = doc.getText().match(/\$let\[([^$;[\]]+);([^;]+)(;(yes|no))?\]/g) || []
    
    lets.forEach(let => {
        const match = let.match(/\$let\[(?<name>[^$;[\]]+);(?<value>[^;]+)(;(?<persistent>yes|no))?\]/)
        const name = match.groups.name
        variables.push(match.groups) // Push varnames
    })
    
    fileVariables[doc.fileName] = variables
}


module.exports = {
    loadVariablesFromDocument,
    fileVariables
}