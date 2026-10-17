import { useState, useCallback } from "react";
import type { Post, ReactionType } from "../types";
import { useStoreDispatch } from "../store/StoreContext";
import { setReaction } from "../api/feedApi";

const REACTIONS: ReactionType[] = ["like", "love", "haha", "wow", "sad", "angry"];

export function PostActions({ post }: { post: Post }) {
  const dispatch = useStoreDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const applyReaction = useCallback(
    async (reaction: ReactionType) => {
      const previous = post.viewerReaction;
      dispatch({ type: "APPLY_OPTIMISTIC_REACTION", postId: post.id, reaction, previous });
      setMenuOpen(false);

      try {
        const { viewerReaction, engagementSummary } = await setReaction(post.id, reaction);
        dispatch({ type: "RECONCILE_REACTION", postId: post.id, viewerReaction, engagementSummary });
      } catch {
        dispatch({ type: "APPLY_OPTIMISTIC_REACTION", postId: post.id, reaction: previous, previous: reaction });
      }
    },
    [dispatch, post.id, post.viewerReaction]
  );

  return (
    <div className="post-actions">
      <div className="reaction-control" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
        <button type="button" aria-pressed={post.viewerReaction === "like"} onClick={() => applyReaction("like")}>
          {post.viewerReaction ? `${post.viewerReaction} (${post.engagementSummary.totalReactions})` : `Like (${post.engagementSummary.totalReactions})`}
        </button>

        <button
          type="button"
          className="reaction-picker-trigger"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onFocus={() => setMenuOpen(true)}
          onBlur={() => setMenuOpen(false)}
        >
          More reactions
        </button>

        {menuOpen && (
          <div role="menu" aria-label="Reactions" className="reaction-menu">
            {REACTIONS.map((type) => (
              <button key={type} type="button" role="menuitem" onClick={() => applyReaction(type)}>
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      <button type="button" aria-label="Comment on this post">
        💬 {post.engagementSummary.commentCount}
      </button>
      <button type="button" aria-label="Share this post">
        ↗️ {post.engagementSummary.shareCount}
      </button>
    </div>
  );
}