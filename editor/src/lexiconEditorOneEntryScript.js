(function () {
  window.addEventListener("message", function (e) {
    switch (e.data.messageType) {
      case "updateView":
        const data = JSON.parse(e.data.json);
        data.entries.forEach((entry) => entry["translatedContent"]);
        const main = document.getElementById("main");

        const header = document.createElement("h1");
        header.innerText = data.lexiconName;

        const entry = document.createElement("p");
        entry.innerHTML = interlineate(data.entries[0].content).join("");

        entry.classList.add("entry");

        main.replaceChildren(header, entry);
        break;
    }
  });

  function interlineate(content) {
    return content
      .replace(
        /(<[^>]+>)|([a-zA-Z-]+(?:\s[a-zA-Z-]+)*)/g,
        (match, tagGroup, textGroup) =>
          tagGroup ? `@@#${match}@@` : `@@%${match}@@`
      )
      .split("@@")
      .filter((value) => value !== "")
      .map((node, index) =>
        node[0] === "#"
          ? `${node.substring(1)}`
          : node[0] === "%"
          ? /* html */ `
            <div class="inline-flex flex-col">
                <div class="inline-block">${node.substring(1)}</div>
                <span class="custom-input" role="textbox" contenteditable="true" />
            </div>`
          : /* html */ `
            <div class="inline-flex flex-col">
                <div class="inline-block">${node}</div>
                <div class="inline-block">${node}</div>
            </div>`
      );
  }
})();
