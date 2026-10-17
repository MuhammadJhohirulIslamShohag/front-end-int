import React, { createContext, useContext, useReducer, type ReactNode } from "react";
import type {
  NormalizedStore,
  Feed,
  Post,
  User,
  Media,
  EngagementSummary,
  ReactionType,
} from "../types";

// ---------------------------------------------------------------------
// This is the "Store" layer: source of truth for client-side state.
// Entities are normalized (stored once, referenced by id) so a single
// update to a post is reflected everywhere that post appears — home
// feed, post detail, etc.
// ---------------------------------------------------------------------

type Action =
  | { type: "MERGE_ENTITIES"; posts?: Post[]; users?: User[]; media?: Media[] }
  | { type: "SET_FEED_PAGE"; feedId: string; postIds: string[]; append: boolean; nextCursor: string | null; hasMore: boolean }
  | { type: "PREPEND_POST"; feedId: string; postId: string }
  | { type: "REPLACE_POST_ID"; feedId: string; oldId: string; newId: string }
  | { type: "SET_POST_STATUS"; postId: string; status: Post["status"] }
  | { type: "APPLY_OPTIMISTIC_REACTION"; postId: string; reaction: ReactionType | null; previous: ReactionType | null }
  | { type: "RECONCILE_REACTION"; postId: string; viewerReaction: ReactionType | null; engagementSummary: EngagementSummary };

const initialState: NormalizedStore = {
  feedsById: {},
  postsById: {},
  usersById: {},
  mediaById: {},
};

function reducer(state: NormalizedStore, action: Action): NormalizedStore {
  switch (action.type) {
    case "MERGE_ENTITIES": {
      const postsById = { ...state.postsById };
      const usersById = { ...state.usersById };
      const mediaById = { ...state.mediaById };
      action.posts?.forEach((p) => (postsById[p.id] = { ...postsById[p.id], ...p }));
      action.users?.forEach((u) => (usersById[u.id] = u));
      action.media?.forEach((m) => (mediaById[m.id] = m));
      return { ...state, postsById, usersById, mediaById };
    }

    case "SET_FEED_PAGE": {
      const existing: Feed = state.feedsById[action.feedId] ?? {
        id: action.feedId,
        postIds: [],
        olderCursor: null,
        newerCursor: null,
        hasOlder: true,
        hasNewer: false,
        lastFetchedAt: null,
      };
      const postIds = action.append
        ? [...existing.postIds, ...action.postIds]
        : action.postIds;
      return {
        ...state,
        feedsById: {
          ...state.feedsById,
          [action.feedId]: {
            ...existing,
            postIds,
            olderCursor: action.nextCursor,
            hasOlder: action.hasMore,
            lastFetchedAt: Date.now(),
          },
        },
      };
    }

    case "PREPEND_POST": {
      const feed = state.feedsById[action.feedId];
      if (!feed) return state;
      return {
        ...state,
        feedsById: {
          ...state.feedsById,
          [action.feedId]: { ...feed, postIds: [action.postId, ...feed.postIds] },
        },
      };
    }

    case "REPLACE_POST_ID": {
      const { [action.oldId]: oldPost, ...restPosts } = state.postsById;
      const newFeedsById: Record<string, Feed> = {};
      for (const [id, feed] of Object.entries(state.feedsById)) {
        newFeedsById[id] = {
          ...feed,
          postIds: feed.postIds.map((pid) => (pid === action.oldId ? action.newId : pid)),
        };
      }
      return {
        ...state,
        feedsById: newFeedsById,
        postsById: oldPost ? { ...restPosts, [action.newId]: { ...oldPost, id: action.newId } } : restPosts,
      };
    }

    case "SET_POST_STATUS": {
      const post = state.postsById[action.postId];
      if (!post) return state;
      return {
        ...state,
        postsById: { ...state.postsById, [action.postId]: { ...post, status: action.status } },
      };
    }

    // Optimistic reaction: flip the viewer's reaction and adjust the
    // count locally. The server response is authoritative and will
    // overwrite this via RECONCILE_REACTION.
    case "APPLY_OPTIMISTIC_REACTION": {
      const post = state.postsById[action.postId];
      if (!post) return state;
      const reactions = { ...post.engagementSummary.reactions };
      let total = post.engagementSummary.totalReactions;

      if (action.previous) {
        reactions[action.previous] = Math.max(0, (reactions[action.previous] ?? 0) - 1);
        total -= 1;
      }
      if (action.reaction) {
        reactions[action.reaction] = (reactions[action.reaction] ?? 0) + 1;
        total += 1;
      }

      return {
        ...state,
        postsById: {
          ...state.postsById,
          [action.postId]: {
            ...post,
            viewerReaction: action.reaction,
            engagementSummary: { ...post.engagementSummary, reactions, totalReactions: total },
          },
        },
      };
    }

    // Server is authoritative: overwrite with the real counts even if
    // they differ from the optimistic prediction.
    case "RECONCILE_REACTION": {
      const post = state.postsById[action.postId];
      if (!post) return state;
      return {
        ...state,
        postsById: {
          ...state.postsById,
          [action.postId]: {
            ...post,
            viewerReaction: action.viewerReaction,
            engagementSummary: action.engagementSummary,
          },
        },
      };
    }

    default:
      return state;
  }
}

const StoreStateContext = createContext<NormalizedStore | null>(null);
const StoreDispatchContext = createContext<React.Dispatch<Action> | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreStateContext.Provider value={state}>
      <StoreDispatchContext.Provider value={dispatch}>{children}</StoreDispatchContext.Provider>
    </StoreStateContext.Provider>
  );
}

export function useStoreState(): NormalizedStore {
  const ctx = useContext(StoreStateContext);
  if (!ctx) throw new Error("useStoreState must be used within StoreProvider");
  return ctx;
}

export function useStoreDispatch(): React.Dispatch<Action> {
  const ctx = useContext(StoreDispatchContext);
  if (!ctx) throw new Error("useStoreDispatch must be used within StoreProvider");
  return ctx;
}

// Convenience selectors
export function usePost(postId: string): Post | undefined {
  return useStoreState().postsById[postId];
}
export function useUser(userId: string): User | undefined {
  return useStoreState().usersById[userId];
}
export function useFeed(feedId: string): Feed | undefined {
  return useStoreState().feedsById[feedId];
}