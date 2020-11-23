"use strict";
import * as _ from "lodash";
import * as path from "path";
import * as shelljs from "shelljs";
import * as vscode from "vscode";
import { translations } from "./translations";

const LOGGING_PREFIX: string = "[EXTENSION]";

// This method is called when your extension is activated.
// Your extension is activated the very first time the command is executed.
export function activate(context: vscode.ExtensionContext) {
    const commands = [
        vscode.commands.registerCommand("add.key", addKeyCommand),
        vscode.commands.registerCommand("add.key.with.translation", addKeyWithTranslationCommand),
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

async function addKeyCommand() {
    await addKey();
}

async function addKeyWithTranslationCommand() {
    await addKey({
        withTranslation: true
    });
}

async function addKey(options?: {
    withTranslation: boolean;
}) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        // Get the new key from the user.
        let enteredKey = await vscode.window.showInputBox({
            prompt: "Enter the key name",
            placeHolder: "Key name"
        });

        let translation: string | undefined;
        if (options && options.withTranslation) {
            translation = await vscode.window.showInputBox({
                prompt: "Enter the translation for the default language",
                placeHolder: "Translation for default language"
            });
        }

        // Insert the new key in the editor.
        editor.edit(async (edit) => {
            if (editor) {
                if (!_.isUndefined(enteredKey) && !_.isEmpty(enteredKey.trim())) {
                    enteredKey = enteredKey.trim();

                    console.log(LOGGING_PREFIX, "Entered key:", enteredKey);

                    const selections = editor.selections;
                    for (const selection of selections) {
                        console.log(LOGGING_PREFIX, "Adding key:", enteredKey);
                        edit.insert(selection.start, enteredKey);
                    }

                    const addTranslation = options && options.withTranslation && translation;

                    const command = addTranslation ?
                        `texterify add "${enteredKey}" "${translation}" --project-path ${vscode.workspace.rootPath}` :
                        `texterify add "${enteredKey}" --project-path ${vscode.workspace.rootPath}`;

                    shelljs.exec(
                        command,
                        { cwd: path.dirname(editor.document.uri.fsPath) },
                        (code, stdout, stderr) => {
                            if (code === 0) {
                                console.log("stdout:", stdout);
                                console.log("stderr:", stderr);
                                console.log(LOGGING_PREFIX, "Successfully uploaded key:", enteredKey);
                                if (addTranslation) {
                                    vscode.window.showInformationMessage(`Successfully uploaded key "${enteredKey}" with translation "${translation}"`);
                                } else {
                                    vscode.window.showInformationMessage(`Successfully uploaded key "${enteredKey}"`);
                                }
                            } else {
                                console.error("stdout:", stdout);
                                console.error("stderr:", stderr);
                                console.error(LOGGING_PREFIX, `Failed to add key "${enteredKey}"`, code, stderr);
                                vscode.window.showErrorMessage(`Failed to add key "${enteredKey}"`, stderr);
                            }
                        }
                    );
                } else {
                    console.log(LOGGING_PREFIX, "Entered key is empty.");
                }
            }
        });
    } else {
        vscode.window.showErrorMessage(translations["error.no_active_editor"]);
    }
}

async function downloadKeys() {
    shelljs.exec(
        `texterify download --project-path ${vscode.workspace.rootPath}`,
        {},
        (code, stdout, stderr) => {
            if (code === 0) {
                console.log("stdout:", stdout);
                console.log("stderr:", stderr);
                console.log(LOGGING_PREFIX, "Successfully downloaded keys.");
                vscode.window.showInformationMessage("Successfully downloaded keys.");
            } else {
                console.error("stdout:", stdout);
                console.error("stderr:", stderr);
                console.error(LOGGING_PREFIX, `Failed to download keys`, code, stderr);
                vscode.window.showErrorMessage(`Failed to download keys`, stderr);
            }
        }
    );
}
