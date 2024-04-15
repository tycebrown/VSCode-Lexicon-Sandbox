(function () {
  window.addEventListener("message", function (e) {
    switch (e.data.messageType) {
      case "updateView":
        const data = JSON.parse(e.data.json);
        data.entries.forEach((entry) => entry["translatedContent"]);
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
    const contentTokens = tokenizeEntryContent(entry.content);
    const translatedContentTokens = tokenizeEntryContent(
      entry.translatedContent
    );
    // return [`<div>${JSON.stringify(contentTokens, null, 2)}</div>`];
    return contentTokens
      .map((value, index) => [value, translatedContentTokens[index]])
      .map(([contentToken, translatedContentToken]) => {
        switch (contentToken.type) {
          case "tag": {
            return contentToken.subContent;
          }
          case "english_text": {
            return /* html */ `
              <div class="inline-flex flex-col">
                  <div class="inline-block">${contentToken.subContent}</div>
                  <span class="custom-input" role="textbox" contenteditable="true">${translatedContentToken.subContent}</span>
              </div>`;
          }
          case "non_english_text": {
            return /*html*/ `
              <div class="inline-flex flex-col">
                  <div class="inline-block">${contentToken.subContent}</div>
                  <div class="inline-block">${translatedContentToken.subContent}</div>
              </div>`;
          }
        }
      });
  }
})();
