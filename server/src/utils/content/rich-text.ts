import sanitizeHtml from "sanitize-html";

const LOOKS_LIKE_HTML = /<\/?[a-z][\s\S]*>/i;

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li", "h2", "h3", "blockquote", "a"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
  },
};

// Officers write formatted text in the editor; anything outside the allowed tags
// is dropped before it is stored. Older plain-text entries are left untouched so
// "Q&A" doesn't turn into "Q&amp;A".
export const sanitizeRichText = (value: string): string =>
  LOOKS_LIKE_HTML.test(value) ? sanitizeHtml(value, OPTIONS) : value;

export const isBlankRichText = (value: string): boolean =>
  sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .trim().length === 0;
