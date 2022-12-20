"use strict";
const vscode = require('vscode');
let util = require('util');
const { window, workspace, Uri } = require('vscode');
let baseFileName = undefined;

const wordsMarker = ['password', 'key', 'seed'];

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

function security_check(snippet) {
	wordsMarker.forEach((word) => {
		if (snippet.toLowerCase().includes(word)) {
			vscode.window.showWarningMessage('Please note that the code may contains secret data ' + '(' + word + ')');
		}
	});
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
			security_check(snippet);
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
