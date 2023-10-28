const process = require('node:process')
const path = require('node:path')
const fs = require('node:fs')
let globalStoragePath
// If the env.home is undefined, the extension is probably running in vscode so it's still gonna use the context
if (process.env.HOME !== undefined) {
    globalStoragePath = path.join(process.env.HOME, 'AppData', 'Roaming', 'Code', 'User', 'globalStorage', 'fajfaj.ccbot')
}

module.exports = {
    /**
     * Saves parsed functions to data.json
     * 
     * @param {vscode.ExtensionContext} context 
     */
    parse: async (context, progress) => {
        // Ensure context.globalStorageUri.fsPath exists in case of manual execution
        context = context || { globalStorageUri: { fsPath: globalStoragePath } }
        const dataPath = path.join(context.globalStorageUri.fsPath, 'data.json')

        // Make progress eat reports if not provided
        progress = progress || { report: () => { } }


        /**
         * Returns a cooldown duration
         * 
         * @returns {number}
         */
        function cooldown() {
            let data;
            try {
                data = require(dataPath)
            } catch {
                data = { timestamp: 0 }
            }
            const cooldown = 1000 * 60 * 60 * 24 * 7 // 7 days
            return cooldown - Math.abs((Date.now() - data.timestamp))
        }

        const cd = cooldown();
        if (cd > 0) {
            const readableCooldown = `${Math.floor(cd / 1000 / 60 / 60 / 24)} days, ${Math.floor(cd / 1000 / 60 / 60 % 24)} hours, ${Math.floor(cd / 1000 / 60 % 60)} minutes and ${Math.floor(cd / 1000 % 60)} seconds`
            console.log(`⏳ The parser is on cooldown, please wait ${readableCooldown} before updating the parser again.`)
            return { status: 'cooldown', ms: cd, readable: readableCooldown }
        };

        const { writeFileSync, existsSync } = require('node:fs')
        console.log('📨 Fetching parser.js at ccommandbot.com'); progress.report(25);
        const webmodule = await fetch('https://ccommandbot.com/public/js/parser.js?v=1', {
            headers: {
                "Content-Type": "application/javascript; charset=UTF-8"
            }
        })
        console.log(`🔧 Evaluating parser.js`); progress.report(50);
        let data; eval(`${await webmodule.text()};data = Parser`)

        console.log(`🔩 Crafting data.json`); progress.report(75);
        const functions = {}
        let funcCount = 0;
        Object.keys(data).forEach(func => {
            // Register $function suggestion
            const info = (data[func] || '').split(';');
            const desc = info.shift();

            // Remove "$xxx or [...]" from the code snippets
            let code = info.join(';').split('\n').shift() || func;
            code = code.replace(/(?<funcname>\$[a-zA-Z_]+) or (?=\k<funcname>\[)/, "")

            let kind = 3;

            // Get the parameters
            let params = [];
            const paramsSpace = code.match(/\[.+\]/)
            if (paramsSpace !== null) {
                const justParams = paramsSpace[0].replaceAll(/[[\]]/g, '')
                justParams.split(';').forEach(param => {
                    const label = param.replaceAll(/( \((yes\/no )?optional\))|( \(yes\/no\))/g, '')
                    // Check if the parameter has choices 
                    let choices = [];
                    if (/((^|(\/| or ))[a-zA-Z ]+){2,}/gm.test(label)) {
                        choices = label.split(/\/| or /)
                    }
                    // Push a parameter object
                    params.push({
                        label,
                        isOptional: /optional/.test(param) || param === '...',
                        isBolean: /yes\/no/.test(param),
                        choices
                    })
                })

            } else {
                kind = 4;
            };

            funcCount++;
            functions[func] = {
                name: func,
                description: desc,
                code,
                kind,
                params
            };
        })

        const newData = {
            count: funcCount,
            timestamp: Date.now(),
            functions
        }

        console.log(`📝 Saving data.json`); progress.report(100);
        writeFileSync(dataPath, JSON.stringify(newData, null, 4), { flag: "w" });
        return { status: 'ok', count: funcCount }
    }
}