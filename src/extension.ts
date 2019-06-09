"use strict";
import * as _ from "lodash";
import * as path from "path";
import * as shelljs from "shelljs";
import * as vscode from "vscode";
import { locales } from "./locales";

const LOGGING_PREFIX: string = "[EXTENSION]";

// This method is called when your extension is activated.
// Your extension is activated the very first time the command is executed.
export function activate(context: vscode.ExtensionContext) {
    const commands = [
        vscode.commands.registerCommand("insert.key", insertKey),
        vscode.commands.registerCommand("download.keys", downloadKeys)
    ];

    commands.forEach(function (command: vscode.Disposable) {
        context.subscriptions.push(command);
    });
}

// This method is called when the extension is deactivated.
export function deactivate() {
    // :(
}

async function insertKey(key: string) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        // Get the new key from the user.
        let enteredKey = await vscode.window.showInputBox();

        // Insert the new key in the editor.
        editor.edit(async (edit) => {
            if (editor) {
                if (!_.isUndefined(enteredKey) && !_.isEmpty(enteredKey.trim())) {
                    enteredKey = enteredKey.trim();

                    console.log(LOGGING_PREFIX, "Entered key:", enteredKey);

                    const selections = editor.selections;
                    for (const selection of selections) {
                        console.log(LOGGING_PREFIX, "Inserting key:", enteredKey);
                        edit.insert(selection.start, enteredKey as string);
                    }

                    shelljs.exec(
                        `texterify add ${enteredKey} --project-path ${vscode.workspace.rootPath}`,
                        { cwd: path.dirname(editor.document.uri.fsPath) },
                        (code, stdout, stderr) => {
                            if (code === 0) {
                                console.log(stdout);
                                console.log(stderr);
                                console.log(LOGGING_PREFIX, "Successfully uploaded key:", enteredKey);
                                vscode.window.showInformationMessage(`Successfully uploaded key: "${enteredKey}"`);
                            } else {
                                console.error(stdout);
                                console.error(stderr);
                                console.error(LOGGING_PREFIX, "Error while adding key:", enteredKey);
                                vscode.window.showErrorMessage(`Error while adding key: "${enteredKey}"`);
                            }
                        }
                    );
                } else {
                    console.log(LOGGING_PREFIX, "Entered key is empty.");
                }
            }
        });
    } else {
        vscode.window.showErrorMessage(locales["error.no_active_editor"]);
    }
}

async function downloadKeys() {
    shelljs.exec(
        `texterify download --project-path ${vscode.workspace.rootPath}`,
        {},
        (code, stdout, stderr) => {
            if (code === 0) {
                console.log(stdout);
                console.log(stderr);
                console.log(LOGGING_PREFIX, "Successfully downloaded keys.");
                vscode.window.showInformationMessage("Successfully downloaded keys.");
            } else {
                console.error(stdout);
                console.error(stderr);
                console.error(LOGGING_PREFIX, "Error while pulling keys.");
                vscode.window.showErrorMessage("Error while pulling keys.");
            }
        }
    );
}
