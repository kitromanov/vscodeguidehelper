"use strict";
const vscode = require('vscode');
const util = require('util');
const { window, workspace, Uri } = require('vscode');
const wordsMarker = ['password', 'key', 'seed'];

let baseFileName = undefined;
let myStatusBarItem = vscode.StatusBarItem;


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

function updateStatusBarItem() {
	var n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
	if (n > 0) {
		myStatusBarItem.text = "$(megaphone) ".concat(n, " line(s) selected");
		myStatusBarItem.show();
	}
	else {
		myStatusBarItem.hide();
	}
}

function getNumberOfSelectedLines(editor) {
	var lines = 0;
	if (editor) {
		lines = editor.selections.reduce(function (prev, curr) { return prev + (curr.end.line - curr.start.line); }, 0);
	}
	return lines + 1;
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

	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = 'guide-helper.addSnippet';

	context.subscriptions.push(myStatusBarItem);
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));

	updateStatusBarItem();

	context.subscriptions.push(setBaseFileNameCommand);
	context.subscriptions.push(addSnippetCommand);
}

module.exports = {
	activate
}