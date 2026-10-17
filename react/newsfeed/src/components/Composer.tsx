import { useState, useCallback, useEffect } from "react";
import type { PostBody } from "../types";
import { useStoreDispatch } from "../store/StoreContext";
import { createPost } from "../api/feedApi";
import { outbox, generateIdempotencyKey, type OutboxEntry } from "../utils/outbox";

interface PendingPost {
  idempotencyKey: string;
  body: PostBody;
}

export function Composer({ feedId }: { feedId: string }) {
  const dispatch = useStoreDispatch();
  const [text, setText] = useState("");

  const attemptSend = useCallback(
    async (entry: OutboxEntry<PendingPost>) => {
      const optimisticId = `optimistic-${entry.idempotencyKey}`;
      try {
        const { post, users, media } = await createPost(entry.payload.body, [], entry.idempotencyKey);
        dispatch({ type: "MERGE_ENTITIES", posts: [post], users, media });
        dispatch({ type: "REPLACE_POST_ID", feedId, oldId: optimisticId, newId: post.id });
        outbox.remove(entry.idempotencyKey);
      } catch {
        dispatch({ type: "SET_POST_STATUS", postId: optimisticId, status: "failed" });
      }
    },
    [dispatch, feedId]
  );

  const submitPost = useCallback(async () => {
    if (!text.trim()) return;
    const idempotencyKey = generateIdempotencyKey();
    const optimisticId = `optimistic-${idempotencyKey}`;
    const body: PostBody = { text, entities: [] };

    dispatch({
      type: "MERGE_ENTITIES",
      posts: [
        {
          id: optimisticId,
          authorId: "u1",
          body,
          mediaIds: [],
          engagementSummary: { reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 }, totalReactions: 0, commentCount: 0, shareCount: 0 },
          viewerReaction: null,
          viewerHasShared: false,
          createdAt: Date.now(),
          status: "pending",
        },
      ],
    });
    dispatch({ type: "PREPEND_POST", feedId, postId: optimisticId });
    setText("");

    outbox.add<PendingPost>({ idempotencyKey, payload: { idempotencyKey, body } });
    await attemptSend({ idempotencyKey, payload: { idempotencyKey, body } });
  }, [text, dispatch, feedId, attemptSend]);

  const flushOutbox = useCallback(async () => {
    for (const entry of outbox.getAll()) {
      await attemptSend(entry as OutboxEntry<PendingPost>);
    }
  }, [attemptSend]);

  useEffect(() => {
    window.addEventListener("online", flushOutbox);
    return () => window.removeEventListener("online", flushOutbox);
  }, [flushOutbox]);

  return (
    <div className="composer">
      <label htmlFor="composer-input">What's on your mind?</label>
      <textarea id="composer-input" value={text} onChange={(e) => setText(e.target.value)} />
      <button type="button" onClick={submitPost} disabled={!text.trim()}>
        Post
      </button>
    </div>
  );
}