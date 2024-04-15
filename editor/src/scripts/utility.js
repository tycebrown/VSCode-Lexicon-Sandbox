// TODO (FUTURE): turn this file into an import entries.

const DELIMITER = "@@";
const TRANSLATABLE_TEXT_PREFIX = "%";
const TAG_PREFIX = "#";

function createEntry(ref, rawContent) {
  const tagPattern = "<[^>]+>";
  const translatableTextPattern = "[a-zA-Z-]+(?:\\s[a-zA-Z-]+)*";
  const contentParsingRegex = new RegExp(
    `(${tagPattern})|(${translatableTextPattern})`,
    "g"
  );

  content = rawContent.replace(
    contentParsingRegex,
    (_, tagGroup, translatableTextGroup) =>
      `${DELIMITER}${
        !!tagGroup
          ? TAG_PREFIX + tagGroup
          : TRANSLATABLE_TEXT_PREFIX + translatableTextGroup
      }${DELIMITER}`
  );
  translatedContent = rawContent.replace(
    contentParsingRegex,
    (_, tagGroup, translatableTextGroup) =>
      `${DELIMITER}${
        !!tagGroup
          ? TAG_PREFIX + tagGroup
          : TRANSLATABLE_TEXT_PREFIX + "" /* no translated content yet */
      }${DELIMITER}`
  );

  return { ref, rawContent, content, translatedContent };
}

function tokenizeEntryContent(content) {
  return content
    .split(DELIMITER)
    .filter((subContent) => subContent !== "")
    .map((subContent) => {
      switch (subContent[0]) {
        case TAG_PREFIX:
          return {
            type: "tag",
            subContent: subContent
              .substring(1)
              .replace(/<\/?big[^>]*>/, "")
              .replace(/<\/?a[^>]*>/, "")
              .replace("/span", "/div")
              .replace("span", "div class='inline-block'"),
          };
        case TRANSLATABLE_TEXT_PREFIX:
          return { type: "english_text", subContent: subContent.substring(1) };
        default:
          return { type: "non_english_text", subContent: subContent };
      }
    });
}