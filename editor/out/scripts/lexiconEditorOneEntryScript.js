"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    const vscode = acquireVsCodeApi();
    let entries;
    document.getElementById("main").addEventListener("input", (e) => {
        const [index, ref] = e.target.id.split("-");
        let updatedContentBlock = entries.find((entry) => entry.ref === ref)
            .contentBlocks[+index];
        updatedContentBlock = {
            ...updatedContentBlock,
            translatedSubContent: e.target.textContent,
        };
        vscode.postMessage({
            messageType: "updateEntry",
            index,
            ref,
            updatedContentBlock,
        });
    });
    window.addEventListener("message", function (e) {
        switch (e.data.messageType) {
            case "updateView":
                const data = JSON.parse(e.data.json);
                entries = data.entries;
                const main = document.getElementById("main");
                const header = document.createElement("h1");
                header.innerText = data.lexiconName;
                const entry = createEditableEntryElement(data.entries[0]);
                main.replaceChildren(header, entry);
                break;
        }
    });
    function createEditableEntryElement(entry) {
        const element = document.createElement("p");
        element.innerHTML = interlineate(entry).join("");
        element.classList.add("text-2m");
        return element;
    }
    function interlineate(entry) {
        return entry.contentBlocks.map((block, index) => {
            switch (block.type) {
                case "tag": {
                    return block.subContent;
                }
                case "translatable-text": {
                    return /* html */ `
              <div class="inline-flex flex-col mb-0.5">
                  <div class="inline-block">${block.subContent}</div>
                  <span id="${index}-${entry.ref}" class="custom-input" role="textbox" contenteditable="true">${block.translatedSubContent}</span>
              </div>`;
                }
                case "non-translatable-text": {
                    return /*html*/ `
              <div class="inline-flex flex-col mb-0.5">
                  <div class="inline-block">${block.subContent}</div>
                  <div class="inline-block">${block.subContent}</div>
              </div>`;
                }
            }
        });
    }
})();
//# sourceMappingURL=lexiconEditorOneEntryScript.js.map