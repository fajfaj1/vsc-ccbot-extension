const process = require('node:process')
const fs = require('node:fs')

const args = process.argv.slice(2)

const types = ['major', 'minor', 'patch']
const type = args.shift()
if (!types.includes(type)) throw Error(`Invalid update type, valid types: ${types.join('/')}\nPlease use: npm run build [type] [message]`)

const message = args.join(' ')
if (message.length === 0) throw Error('You have to provide a changelog message.\nPlease use: npm run build [type] [message]')

const version = require('../package.json').version || "0.0.0"
const versionSplit = version.split('.').map(Number)
versionSplit[types.indexOf(type)] += 1
const newVersion = versionSplit.join('.')

const today = new Date()
const date = today.getUTCDate() + "/" + today.getUTCMonth() + "/" + today.getUTCFullYear()
const log = `| ${message} | \`${newVersion}\` | \`${date}\` |`

let changelog = fs.readFileSync('./changelog.md', { encoding: "utf-8" })
changelog += "\n" + log
fs.writeFileSync('./changelog.md', changelog)

console.log('📋 Patchnote added successfully!')
console.log(`You can now use the following command to proceed:\ngit add . && git commit -m "Release ${newVersion}: ${message}" && git push && vsce publish ${type}`)