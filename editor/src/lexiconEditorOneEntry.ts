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

    const data = JSON.parse(document.getText());
    data.entries.forEach((entry: any) => {
      entry.translatedContent = entry.content?.replace(
        /(<[^>]+>)|([a-zA-Z-]+(?:\s[a-zA-Z-]+)*)/g,
        (match: string, tagGroup: string, textGroup: string) =>
          tagGroup ? match : "@@@@"
      );
    });

    const edit = new vscode.WorkspaceEdit();
    edit.replace(
      document.uri,
      new vscode.Range(0, 0, document.lineCount, 0),
      JSON.stringify(data)
    );
    vscode.workspace.applyEdit(edit);

    webviewPanel.webview.postMessage({
      messageType: "updateView",
      json: document.getText(),
    });
  }
}
