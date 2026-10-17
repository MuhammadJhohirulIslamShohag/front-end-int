export function SkipLink() {
  return (
    <a href="#feed" className="skip-link">
      Skip to feed
    </a>
  );
}

export function NewPostsBanner({ count, onClick }: { count: number; onClick: () => void }) {
  if (count === 0) return null;
  return (
    <div aria-live="polite" className="new-posts-banner">
      <button type="button" onClick={onClick}>
        {count} new post{count > 1 ? "s" : ""} available
      </button>
    </div>
  );
}