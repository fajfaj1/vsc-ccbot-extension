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
    
    writeFileSync('./language/assets/parser.json', JSON.stringify(data, null, 4))
})();