import type { PostBody } from "./types/types";
import { sanitizeUrl } from "../utils/sanitizeUrl";

function SafeLink({ url, children }: { url: string; children: React.ReactNode }) {
  const safeHref = sanitizeUrl(url);
  if (!safeHref) return <span>{children}</span>;

  const isExternal = new URL(safeHref).origin !== window.location.origin;
  return (
    <a href={safeHref} {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}>
      {children}
    </a>
  );
}

export function RichPostText({ body }: { body: PostBody }) {
  const { text, entities } = body;
  if (entities.length === 0) return <>{text}</>;

  const sorted = [...entities].sort((a, b) => a.start - b.start);
  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  sorted.forEach((entity, i) => {
    if (entity.start > cursor) {
      nodes.push(<span key={`t-${i}`}>{text.slice(cursor, entity.start)}</span>);
    }
    const entityText = text.slice(entity.start, entity.end);

    switch (entity.type) {
      case "mention":
        nodes.push(
          <SafeLink key={`e-${i}`} url={`/profile/${entity.userId}`}>
            {entityText}
          </SafeLink>
        );
        break;
      case "hashtag":
        nodes.push(
          <SafeLink key={`e-${i}`} url={`/hashtag/${encodeURIComponent(entityText.replace(/^#/, ""))}`}>
            {entityText}
          </SafeLink>
        );
        break;
      case "link":
        nodes.push(
          <SafeLink key={`e-${i}`} url={entity.url ?? ""}>
            {entityText}
          </SafeLink>
        );
        break;
      default:
        nodes.push(<span key={`e-${i}`}>{entityText}</span>);
    }
    cursor = entity.end;
  });

  if (cursor < text.length) nodes.push(<span key="t-end">{text.slice(cursor)}</span>);
  return <>{nodes}</>;
}