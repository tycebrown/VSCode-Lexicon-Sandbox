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
})();
