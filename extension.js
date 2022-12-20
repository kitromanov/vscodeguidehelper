"use strict";
const vscode = require('vscode');
let util = require('util');
const { window, workspace, Uri } = require('vscode');
let baseFileName = undefined;

async function addSnippet(fileName, snippet) {
	if (baseFileName !== undefined) {
		fileName = baseFileName;
	}
	if (fileName !== undefined && fileName.length != 0) {
		let old_text = await workspace.fs.readFile(Uri.parse(vscode.workspace.workspaceFolders[0].uri + '/' + fileName));
		workspace.fs.writeFile(Uri.parse(vscode.workspace.workspaceFolders[0].uri + '/' + fileName), new util.TextEncoder().encode(old_text + snippet));
		vscode.window.showInformationMessage('Moved successfully to the file ' + fileName);
	} else {
		vscode.window.showErrorMessage('Specify the file to move.');
	}
}


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let setBaseFileNameCommand = vscode.commands.registerCommand('guide-helper.setBaseFileName', function () {
		window.showInputBox({
			placeHolder: "Please enter a file name",
		}).then((fileName) => {
			baseFileName = fileName;
			vscode.window.showInformationMessage('Base file name is set as ' + fileName);
		})
	});

	let addSnippetCommand = vscode.commands.registerCommand('guide-helper.addSnippet', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			const snippet = '\n```\n' + document.getText(selection) + '\n```';
			if (baseFileName !== undefined) {
				addSnippet(baseFileName, snippet);
			} else {
				window.showInputBox({
					placeHolder: "Please enter a file name",
				}).then(async function (fileName) {
					addSnippet(fileName, snippet);
				});
			}
		}
	});

	context.subscriptions.push(setBaseFileNameCommand);
	context.subscriptions.push(addSnippetCommand);
}

module.exports = {
	activate
}
