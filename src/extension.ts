import * as vscode from 'vscode';

import * as cgu from './copy-github-URL';
import * as cp from 'copy-paste';

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.copyGithubURL', () => {

        const activeTextEditor = vscode.window.activeTextEditor;

        if (activeTextEditor && vscode.workspace.rootPath) {
            cgu.copyGithubURL({
                execGitCommand: cgu.execGitCommand,
                copy: cp.copy,
                rootDir: vscode.workspace.rootPath,
                filePath: vscode.workspace.asRelativePath(activeTextEditor.document.fileName),
                line: {
                    start: activeTextEditor.selection.start.line,
                    end: activeTextEditor.selection.end.line
                },
                showInformationMessage: vscode.window.showInformationMessage
            });
        }

    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}