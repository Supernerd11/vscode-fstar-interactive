// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { FStarProtocolClient } from './FStarProtocol';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
class FStarCompletionItemProvider implements vscode.CompletionItemProvider {
	private protocol: FStarProtocolClient

	constructor(protocol: FStarProtocolClient) {
		this.protocol = protocol;
	}

	public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<CompletionItem[] | CompletionItem> {
		// this.protocol.autocomplete
		let wordRange = document.getWordRangeAtPosition(position);
		let currentWord = document.getText(wordRange);

		this.protocol.autocomplete({
			"partial-symbol": currentWord
		});
	}
}

export function activate(context: vscode.ExtensionContext) {
	var fstarPath = "fstar.exe";
	var protocol = new FStarProtocolClient(fstarPath);

	context.subscriptions.push(protocol);

	var dispose = vscode.commands.registerCommand("extension.helloWorld", async () => {
		var result = await protocol.query("push", { "kind": "full", "code": "module Test\n", "line": 1, "column": 0 });

		console.log(result);

	});
	context.subscriptions.push(dispose);

	var disposeOpen = vscode.workspace.onDidOpenTextDocument(doc => {
		if (doc.uri.scheme === "file") {
			let name = doc.fileName


		}
	})
	context.subscriptions.push(disposeOpen);

	vscode.languages.registerCompletionItemProvider("fstar", new FStarCompletionItemProvider(protocol));
}

// this method is called when your extension is deactivated
export function deactivate() { }
