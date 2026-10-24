import DOMPurify from "isomorphic-dompurify";

const LOOKS_LIKE_HTML = /<\/?[a-z][\s\S]*>/i;

// Anyone who can post can put a script in the content, so strip everything but
// basic formatting before it is rendered as HTML.
export const sanitizeRichText = (html: string) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li", "h1", "h2", "h3", "h4", "blockquote", "a", "img", "span"],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt"],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i,
  });

export const isHtml = (value: string) => LOOKS_LIKE_HTML.test(value);

export const plainLength = (value: string) =>
  (isHtml(value) ? value.replace(/<[^>]*>/g, "") : value).length;

// Entries written before the editor existed are plain text with newlines.
export const plainTextToHtml = (value: string) =>
  value
    .split(/\n{2,}/)
    .map(
      (paragraph) =>
        `<p>${paragraph
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>")}</p>`,
    )
    .join("");

interface RichContentProps {
  value: string;
  className?: string;
}

export default function RichContent({ value, className = "" }: RichContentProps) {
  if (!isHtml(value)) {
    return (
      <div className={`whitespace-pre-wrap ${className}`}>{value}</div>
    );
  }

  return (
    <div
      className={`rich-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(value) }}
    />
  );
}
