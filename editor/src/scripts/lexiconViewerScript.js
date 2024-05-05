(function () {
  window.addEventListener("message", (e) => {
    switch (e.data.messageType) {
      case "updateView":
        const data = JSON.parse(e.data.json);
        const main = document.getElementById("main");

        const header = document.createElement("h1");
        header.innerText = data.lexiconName;

        const lexiconEntryList = document.createElement("ol");
        lexiconEntryList.append(
          ...data.entries.map((entry) => {
            const refElement = document.createElement("h3");
            refElement.innerText = entry.ref;

            const contentElement = document.createElement("div");
            contentElement.innerHTML = entry.rawContent;

            const lexiconEntryListItem = document.createElement("li");
            lexiconEntryListItem.append(refElement, contentElement);

            return lexiconEntryListItem;
          })
        );

        main.replaceChildren(header, lexiconEntryList);
        break;
    }
  });
})();
