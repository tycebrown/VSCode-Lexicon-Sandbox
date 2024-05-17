"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
class LexiconEditorOneEntryProvider {
    context;
    constructor(context) {
        this.context = context;
    }
    async resolveCustomTextEditor(document, webviewPanel, token) {
        const styleSrc = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src", "styles", "lexiconEditorOneEntryStyles.css"));
        const mainScriptSrc = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src", "scripts", "lexiconEditorOneEntryScript.js"));
        webviewPanel.webview.options = { enableScripts: true };
        webviewPanel.webview.html = /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <link rel="stylesheet" href="${styleSrc}">
            <script defer src="${mainScriptSrc}"></script>
        </head>
        <body id="main">
        </body>
        </html>
    `;
        vscode.workspace.onDidSaveTextDocument((e) => {
            if (e.uri.toString() === document.uri.toString()) {
                webviewPanel.webview.postMessage({
                    messageType: "updateView",
                    json: e.getText(),
                });
            }
        });
        webviewPanel.webview.onDidReceiveMessage((e) => {
            switch (e.messageType) {
                case "updateEntry":
                    console.log("################################## updateEntry");
                    const edit = new vscode.WorkspaceEdit();
                    const data = JSON.parse(document.getText());
                    console.log(`VERY SUSPICIOUS: ${JSON.stringify(data.entries.find((entry) => entry.ref === e.ref)
                        .contentBlocks[e.index], null, 2)} vs ${JSON.stringify(e.updatedContentBlock)}`);
                    data.entries.find((entry) => entry.ref === e.ref).contentBlocks[e.index] = e.updatedContentBlock;
                    edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), JSON.stringify(data, null, 2));
                    vscode.workspace.applyEdit(edit);
                    break;
            }
        });
        webviewPanel.webview.postMessage({
            messageType: "updateView",
            json: document.getText(),
        });
    }
}
exports.default = LexiconEditorOneEntryProvider;
//# sourceMappingURL=lexiconEditorOneEntry.js.map