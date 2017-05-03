import * as cp from "copy-paste";
import * as vscode from "vscode";

import * as cgu from "./copy-github-URL";

export function activate(context: vscode.ExtensionContext) {

    const disposable = vscode.commands.registerCommand("extension.copyGithubURL", () => {

        const activeTextEditor = vscode.window.activeTextEditor;

        if (activeTextEditor && vscode.workspace.rootPath) {
            cgu.copyGithubURL({
                copy: cp.copy,
                execGitCommand: cgu.execGitCommand,
                filePath: vscode.workspace.asRelativePath(activeTextEditor.document.fileName),
                line: {
                    end: activeTextEditor.selection.end.line,
                    start: activeTextEditor.selection.start.line,
                },
                rootDir: vscode.workspace.rootPath,
                showInformationMessage: vscode.window.showInformationMessage,
            });
        }

    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    return;
}
