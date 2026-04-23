// minimal markdown-lite: **bold**, *em*, line breaks, `code`, bullets, numbered
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
export function renderMarkdown(input: string): string {
  const escaped = escapeHtml(input);
  // split into paragraphs (blank-line separated)
  const blocks = escaped.split(/\n\n+/);
  const html = blocks
    .map((block) => {
      const lines = block.split(/\n/);
      // numbered list
      if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
        return "<ol>" + lines.map((l) => "<li>" + inline(l.replace(/^\s*\d+\.\s+/, "")) + "</li>").join("") + "</ol>";
      }
      // bullet list
      if (lines.every((l) => /^\s*[-•]\s+/.test(l))) {
        return "<ul>" + lines.map((l) => "<li>" + inline(l.replace(/^\s*[-•]\s+/, "")) + "</li>").join("") + "</ul>";
      }
      return "<p>" + inline(lines.join("<br/>")) + "</p>";
    })
    .join("");
  return html;
}
function inline(s: string) {
  return s
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*(?!\*)([^*]+)\*/g, "<em>$1</em>");
}
