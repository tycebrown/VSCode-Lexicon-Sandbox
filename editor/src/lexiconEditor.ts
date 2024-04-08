import * as vscode from "vscode";

export default class LexiconEditorProvider
  implements vscode.CustomTextEditorProvider
{
  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    const scriptSrc = webviewPanel.webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "src",
        "lexiconEditorScript.js"
      )
    );

    webviewPanel.webview.html = /*html*/ `
        <html>
            <head>
                <meta charset="UTF-8" />
                <script defer src="${scriptSrc}"></script>
            </head>
            <body id="main">
                
            </body>
        </html>
    `;
  }
}
