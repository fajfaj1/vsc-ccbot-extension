const vscode = require("vscode");
// const backuper = require("./backuper.js");

const introText = `// Welcome to your brand new Custom Command!\n// Make sure you paste your code to the dasboard\nYour code goes here`;
/**
 * A collection of all the command handlers. They will be pushed into context.subscriptions
 *
 * @type {vscode.Disposable[]}
 */
const commands = [];
commands.push(
	vscode.commands.registerCommand("ccbot.createFile", async () => {
		const path = (vscode.workspace.workspaceFolders || [
			{ uri: undefined },
		])[0].uri;

		if (path !== undefined) {
			// Find an available file name
			const dirEntries = await vscode.workspace.fs.readDirectory(path);
			const untitledCommands = dirEntries
				.filter(
					entry =>
						entry[0].match(/^untitled( \(\d+\))?\.ccbot$/i) &&
						entry[1] === vscode.FileType.File
				)
				.map(e => e[0]);

			let availableFileName = undefined;
			let i = 0;
			while (availableFileName === undefined) {
				const fileName =
					i === 0 ? "untitled.ccbot" : `untitled (${i}).ccbot`;
				if (!untitledCommands.includes(fileName))
					availableFileName = fileName;
				i++;
			}

			// Create & open the file
			const newFile = vscode.Uri.joinPath(path, availableFileName);
			await vscode.workspace.fs.writeFile(
				newFile,
				Buffer.from(introText)
			);
			const textEditor = await vscode.window.showTextDocument(
				newFile,
				vscode.ViewColumn.Active,
				false
			);
			// Select "Your code goes here"
			const startPos = new vscode.Position(2, 0);
			const endPos = new vscode.Position(
				2,
				textEditor.document.lineAt(2).text.length
			);

			textEditor.selection = new vscode.Selection(startPos, endPos);
		} else {
			//
			vscode.workspace
				.openTextDocument({ language: "ccbot", content: introText })
				.then(doc => {
					vscode.window.showTextDocument(
						doc,
						vscode.ViewColumn.Active
					);
				});
		}
	})
);

commands.push(
	vscode.commands.registerCommand("ccbot.openDashboard", async () => {
		await vscode.env.openExternal(
			vscode.Uri.parse("https://ccommandbot.com/dashboard")
		);
		vscode.window.showInformationMessage("Check your browser!");
	})
);
commands.push(
	vscode.commands.registerCommand("ccbot.openDocs", async () => {
		await vscode.env.openExternal(
			vscode.Uri.parse("https://doc.ccommandbot.com/")
		);
		vscode.window.showInformationMessage("Check your browser!");
	})
);

// commands.push(
// 	vscode.commands.registerCommand("ccbot.generateBackup", backuper)
// );

// commands.push(vscode.commands.registerCommand('ccbot.reloadFunctions', async () => {
//     const response = await vscode.window.withProgress({
//         location: vscode.ProgressLocation.Notification,
//         title: 'Reloading functions...',
//         cancellable: false
//     },
//         async (progress) => {
//             return await parser.parse(vscode.extensionContext, progress)
//         }
//     )

//     switch (response.status) {
//         case 'ok':
//             vscode.window.showInformationMessage(`${response.count} Custom Command functions have been loaded successfully.
//             Reload the editor to see the changes.`)
//             break;
//         case 'cooldown':
//             vscode.window.showWarningMessage(`The parser is on cooldown, please wait ${response.readable} before updating the parser again.`)
//             break;
//     }

// }))

// commands.push(vscode.commands.registerCommand('ccbot.login', async (context) => {
//     const cookie = await vscode.window.showInputBox({
//         prompt: "Enter your cookie",
//         placeHolder: "Cookie"
//     })
//     vscode.window.withProgress({
//         location: vscode.ProgressLocation.Notification,
//         title: "Cookie validation",
//         cancellable: false,
//         message: "Validating..."
//     }, async (progress) => {
//         const response = await fetch('https://ccommandbot.com/dashboard', {
//             headers: {
//                 cookie: cookie
//             }
//         })
//         progress.report(100)
//         vscode.window.showInformationMessage(response.url)

//     })
// }))

module.exports = commands;
