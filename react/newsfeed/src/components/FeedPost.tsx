import type { Post } from "../types";
import { useUser, useStoreState } from "../store/StoreContext";
import { RichPostText } from "./RichPostText";
import { PostTimestamp } from "./PostTimestamp";
import { FeedImage } from "./FeedImage";
import { PostActions } from "./PostActions";

interface Props {
  post: Post;
  posinset: number;
  setsize: number;
}

export function FeedPost({ post, posinset, setsize }: Props) {
  const author = useUser(post.authorId);
  const mediaById = useStoreState().mediaById;
  const headingId = `post-author-${post.id}`;

  if (!author) return null;

  return (
    <article
      role="article"
      aria-labelledby={headingId}
      aria-posinset={posinset}
      aria-setsize={setsize}
      className="feed-post"
      aria-busy={post.status === "pending"}
      style={{ opacity: post.status === "pending" ? 0.6 : 1 }}
    >
      <header className="feed-post-header">
        <img src={author.profilePhotoUrl} alt="" width={40} height={40} className="avatar" />
        <div>
          <span id={headingId}>
            {author.name}
            {author.isVerified && <span aria-label="Verified"> ✔️</span>}
          </span>
          <div>
            <PostTimestamp createdAt={post.createdAt} />
            {post.status === "pending" && <span> · sending…</span>}
            {post.status === "failed" && <span style={{ color: "crimson" }}> · failed to send</span>}
          </div>
        </div>
      </header>

      <p>
        <RichPostText body={post.body} />
      </p>

      {post.mediaIds.map((id, i) => {
        const media = mediaById[id];
        return media ? <FeedImage key={id} media={media} isFirst={posinset === 1 && i === 0} /> : null;
      })}

      <PostActions post={post} />
    </article>
  );
}