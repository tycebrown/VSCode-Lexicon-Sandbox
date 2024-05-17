(function () {
  const vscode = acquireVsCodeApi();
  let entries;
  document.getElementById("main").addEventListener("input", (e) => {
    const [index, ref] = e.target.id.split("-");
    let updatedContentBlock = entries.find((entry) => entry.ref === ref)
      .contentBlocks[+index];
    updatedContentBlock.translatedSubContent = e.target.innerText;

    vscode.setState({
      ...vscode.getState(),
      entries,
    });

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
        buildDocument(data);
        vscode.setState({ data });
    }
  });

  function buildDocument(data) {
    entries = data.entries;
    const main = document.getElementById("main");

    const header = document.createElement("h1");
    header.innerText = data.lexiconName;

    const entry = createEditableEntryElement(data.entries[0]);

    main.replaceChildren(header, entry);
  }

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
              <span id="${index}-${entry.ref}" class="custom-input" role="textbox" contenteditable="true" onbeforeinput="
                if (
                  event.inputType === 'insertParagraph' ||
                  event.inputType === 'insertLineBreak'
                ) {
                  event.preventDefault();
                }" >${block.translatedSubContent}</span>
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

  function preventNewlines(event) {}

  const state = vscode.getState();
  if (state) {
    buildDocument(state.data);
  }
})();
