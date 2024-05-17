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
    const mainScriptSrc = webviewPanel.webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "src",
        "scripts",
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
          console.log(
            `VERY SUSPICIOUS: ${JSON.stringify(
              data.entries.find((entry: any) => entry.ref === e.ref)
                .contentBlocks[e.index],
              null,
              2
            )} vs ${JSON.stringify(e.updatedContentBlock)}`
          );
          data.entries.find((entry: any) => entry.ref === e.ref).contentBlocks[
            e.index
          ] = e.updatedContentBlock;

          edit.replace(
            document.uri,
            new vscode.Range(0, 0, document.lineCount, 0),
            JSON.stringify(data, null, 2)
          );
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
