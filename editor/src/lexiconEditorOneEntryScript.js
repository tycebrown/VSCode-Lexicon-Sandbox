(function () {
  window.addEventListener("message", function (e) {
    switch (e.data.messageType) {
      case "updateView":
        const data = JSON.parse(e.data.json);
        const main = document.getElementById("main");

        const header = document.createElement("h1");
        header.innerText = data.lexiconName;

        const entry = document.createElement("p");
        entry.innerHTML = interlineate(data.entries[0].content)
          .flatMap((node) => `${node}`)
          .join("");

        entry.classList.add("entry");

        main.replaceChildren(header, entry);
        break;
    }
  });

  function interlineate(content) {
    const temp = document.createElement("div");
    temp.innerHTML = content;
    return temp.innerText
      .replace(
        /[a-zA-Z-]+(?:\s[a-zA-Z-]+)*/g,
        "@@<span style='background-color: red'>$&</span>@@"
      )
      .split("@@")
      .map((node, index) =>
        index % 2 === 0
          ? /* html */ `
            <div class="inline-flex flex-col">
                <div class="inline-block">${node}</div>
                <div class="inline-block">${node}</div>
            </div>`
          : /* html */ `
            <div class="inline-flex flex-col">
                <div class="inline-block">${node}</div>
                <span class="custom-input" role="textbox" contenteditable="true" />
            </div>`
      );
  }
})();
