(async () => {
    const { writeFileSync } = require('node:fs')
    console.log('📨 Fetching parser.js at ccommandbot.com')
    const webmodule = await fetch('https://ccommandbot.com/public/js/parser.js?v=1', {
        headers: {
            "Content-Type": "application/javascript; charset=UTF-8"
        }
    })
    console.log(`🔧 Evaluating parser.js`)
    let data; eval(`${await webmodule.text()};data = Parser`)

    console.log(`🔩 Crafting data.json`)
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
                if(/((^|(\/| or ))[a-zA-Z ]+){2,}/gm.test(label)) {
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

    console.log(`📝 Saving data.json`);
    writeFileSync('./language/assets/data.json', JSON.stringify(newData, null, 4));
})();