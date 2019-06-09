"use strict";
import * as nconf from "nconf";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";

const LOGGING_PREFIX: string = "[CONFIG]";

class Config {
    private store: any;

    constructor(store: any) {
        this.store = store;
    }

    /**
     * Sets the value for a key.
     */
    setKey = (key: string, value: any) => {
        console.log(LOGGING_PREFIX, `Setting key "${key}" to value "${value}"`);
        this.store.set(key, value);
    }

    /**
     * Returns the value for a key.
     */
    getKey = (key: string): string => {
        const value = this.store.get(key);
        console.log(LOGGING_PREFIX, `Getting value of key "${key}": ${value}`);

        return value;
    }

    /**
     * Persists the config to the disk.
     */
    saveConfig = () => {
        this.store.save(function (err: any) {
            if (err) {
                console.error(LOGGING_PREFIX, err);
            }
        });
    }
}

const homedir: string = os.homedir();
const globalSettingsFileName = ".texterify.json";
const globalSettingsFile = path.join(homedir, globalSettingsFileName);
const projectSettingsFileName = "texterify.json";
if (vscode.workspace.workspaceFolders === undefined) {
    throw new Error("No workspace found");
}
const projectSettingsFile = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, projectSettingsFileName);

console.log(LOGGING_PREFIX, "Home directory:", homedir);
console.log(LOGGING_PREFIX, "Reading global config from:", globalSettingsFile);
console.log(LOGGING_PREFIX, "Reading project config from:", projectSettingsFile);

const globalStore = new nconf.Provider();
globalStore.file({ file: globalSettingsFile });

const projectStore = new nconf.Provider();
projectStore.file({ file: projectSettingsFile });

const globalConfig = new Config(globalStore);
const projectConfig = new Config(projectStore);

export { globalConfig, projectConfig };
