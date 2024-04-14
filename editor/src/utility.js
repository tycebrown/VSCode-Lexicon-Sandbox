function interlineate(entry) {
  const contentPieces = entry.content
    .split("@@")
    .filter((value) => value !== "");
  const translatedContentPieces = entry.translatedContent
    .split("@@")
    .filter((value) => value !== "");
  return zip(contentPieces, translatedContentPieces).map(
    ([contentPiece, translatedContentPiece]) =>
      contentPiece[0] === "#"
        ? `${contentPiece.substring(1)}`
        : contentPiece[0] === "%"
        ? /* html */ `
            <div class="inline-flex flex-col">
                <div class="inline-block">${contentPiece.substring(1)}</div>
                <span class="custom-input" role="textbox" contenteditable="true">${translatedContentPiece.substring(
                  1
                )}</span>
            </div>`
        : /* html */ `
            <div class="inline-flex flex-col">
                <div class="inline-block">${contentPiece}</div>
                <div class="inline-block">${translatedContentPiece}</div>
            </div>`
  );
}

function zip(a1, a2) {
  return a1.map((value, index) => [value, a2[index]]);
}

function createEntry(ref, content) {
  const entry = { ref, _unparsedContent: content };
  entry.translatedContent = content
    ?.replace(/@@(#|%)?/g, "")
    .replace(
      /(<[^>]+>)|([a-zA-Z-]+(?:\s[a-zA-Z-]+)*)/g,
      (match, tagGroup, textGroup) => (tagGroup ? `@@#${tagGroup}@@` : `@@%@@`)
    );
  entry.content = content
    ?.replace(/@@(#|%)?/g, "")
    .replace(
      /(<[^>]+>)|([a-zA-Z-]+(?:\s[a-zA-Z-]+)*)/g,
      (match, tagGroup, textGroup) =>
        tagGroup ? `@@#${tagGroup}@@` : `@@%${textGroup}@@`
    );
  return entry;
}
