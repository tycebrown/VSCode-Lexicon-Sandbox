import * as vscode from "vscode";

export default class LexiconEditorOneEntryProvider
  implements vscode.CustomTextEditorProvider
{
  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    const styleSrc = webviewPanel.webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "src",
        "styles",
        "lexiconEditorOneEntryStyles.css"
      )
    );
    const scriptSrc = webviewPanel.webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "src",
        "lexiconEditorOneEntryScript.js"
      )
    );
    webviewPanel.webview.options = { enableScripts: true };
    webviewPanel.webview.html = /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <link rel="stylesheet" href="${styleSrc}">
            <script defer src="${scriptSrc}"></script>
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

    webviewPanel.webview.postMessage({
      messageType: "updateView",
      json: document.getText(),
    });
  }
}
