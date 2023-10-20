const scope = 'ccbot,cb,customcommand,customcommandbot'
const format = 'snippets'
const contentDocs = document.getElementById('contentdocs')
const cardTools = contentDocs.parentElement.parentElement.querySelector('div:first-child > div > div.card-tools')
cardTools.style.display = 'flex'
cardTools.style.alignItems = 'stretch'

const btn = document.createElement('button')
btn.innerText = 'Scrape'
btn.classList = 'btn info-warning info-hover'
btn.style.height = '31px'
btn.style.display = 'flex'
btn.style.alignItems = 'center'
cardTools.prepend(btn)

const scrape = () => {
    const funcs = document.querySelectorAll('#contentdocs > a')
    const snippets = {}
    const descs = []
    
    
    funcs.forEach( (element, index) => {
        const func = {}
        try {
            func.name = element.querySelector('div > h5').innerText
            func.name = func.name.replace('[', '')
            func.desc = element.querySelector('p').innerText
            func.syntax = element.querySelector('code').innerText

            if(func.syntax == '') func.syntax = func.name
        } catch (error) {
            console.error('failed ', element)
        }
        
        function bodify(syntax) {
            return syntax.replace(/\$/, '\\$').replace(/\[.+\]/, (match) => {
                let parameters = match.slice(1, match.length - 1).split(';')

                parameters = parameters.map((param, index) => `\${${index + 1}:${param}}`)
                
                return `[${parameters.join(';')}]`
            })
        }

        switch(format) {
            case 'snippets':
                const snippet = {}
                
                snippet.scope = scope
                snippet.prefix = func.name
                snippet.body = [func.name.replace('$', '\\$')]
                snippet.description = func.desc

                const bareName = func.name.replace('$', '')
                snippets[bareName] = snippet

                const snippet2 = {}
                snippet2.scope = scope
                snippet2.prefix = `${func.name}[`
                snippet2.body = bodify(func.syntax).split('\n')
                snippet2.description = func.desc
                const bareName2 = `${func.name.replace('$', '')}[`
                snippets[bareName2] = snippet2
                break;
            case 'desc':
                let desc
                desc = func.desc + "```" + func.syntax + "```"
                console.log(index + desc)
                if(index<100) {
                    descs[index] = desc
                }
                
        }
        
        
    })
    if(format == 'snippets') {
        // console.log(snippets)
        return snippets
    } else if (format == 'desc') {
        return descs.join(`\n`)
    }
    
}
btn.addEventListener('click', () => {
    function state(state) {
        const cs = btn.className.split(' ')
        cs[1] = 'info-' + state
        btn.className = cs.join(' ')

        let label
        switch (state) {
            case 'success':
                label = 'Copied'
                break
            case 'danger':
                label = 'Failed'
            default:
                label = 'Scrape'
        }
        btn.innerText = label
    }
    
    navigator.clipboard.writeText(JSON.stringify(scrape())).then(
        () => {
          state('success')
          setTimeout(() => {state('warning')}, '1500')
        },
        () => {
          state('danger')
          setTimeout(() => {state('warning')}, '1500')
        }
      );
})