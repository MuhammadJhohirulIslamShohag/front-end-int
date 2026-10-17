import type { CreatePostResponse, EngagementSummary, FeedPageResponse, Media, Post, PostBody, ReactionType, User } from "../types";

// ---------------------------------------------------------------------
// Data access layer. In a real product these functions call the real
// HTTP endpoints discussed in the design:
//   GET  /feed?cursor=...&count=...&direction=older|newer
//   POST /posts
//   PUT  /posts/{id}/reaction
//   DELETE /posts/{id}/reaction
//
// Identity comes from the authenticated session (cookies), never a
// client-supplied userId.
//
// Since this demo has no real backend, a small in-memory mock stands
// in for the server below.
// ---------------------------------------------------------------------

const MOCK_USERS: User[] = [
  { id: "u1", name: "John Doe", handle: "johndoe", profilePhotoUrl: "https://i.pravatar.cc/80?u=u1", isVerified: false, relationshipToViewer: { isFriend: true } },
  { id: "u2", name: "Jane Smith", handle: "janesmith", profilePhotoUrl: "https://i.pravatar.cc/80?u=u2", isVerified: true, relationshipToViewer: { isFollowing: true } },
];

const MOCK_MEDIA: Media[] = [
  { id: "m1", src: "https://picsum.photos/seed/m1/800/500", previewSrc: "https://picsum.photos/seed/m1/40/25", alt: "Scenic photo", width: 800, height: 500 },
];

function makeMockPost(index: number): Post {
  const hasMedia = index % 3 === 0;
  return {
    id: `p${index}`,
    authorId: index % 2 === 0 ? "u1" : "u2",
    body: {
      text: `Post #${index} — check out @janesmith and #webdev at https://example.com`,
      entities: [
        { type: "mention", start: 16, end: 26, userId: "u2" },
        { type: "hashtag", start: 31, end: 38 },
        { type: "link", start: 42, end: 61, url: "https://example.com" },
      ],
    },
    mediaIds: hasMedia ? ["m1"] : [],
    engagementSummary: {
      reactions: { like: 10, love: 2, haha: 0, wow: 0, sad: 0, angry: 0 },
      totalReactions: 12,
      commentCount: 3,
      shareCount: 1,
    },
    viewerReaction: null,
    viewerHasShared: false,
    createdAt: Date.now() - index * 60_000,
  };
}

const ALL_MOCK_POSTS: Post[] = Array.from({ length: 50 }, (_, i) => makeMockPost(i + 1));

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchFeedPage(opts: {
  cursor: string | null;
  count?: number;
}): Promise<FeedPageResponse> {
  await delay(400);
  const count = opts.count ?? 10;
  const startIndex = opts.cursor ? parseInt(opts.cursor, 10) : 0;
  const slice = ALL_MOCK_POSTS.slice(startIndex, startIndex + count);
  const hasMore = startIndex + count < ALL_MOCK_POSTS.length;

  return {
    postIds: slice.map((p) => p.id),
    posts: slice,
    users: MOCK_USERS,
    media: MOCK_MEDIA,
    nextCursor: hasMore ? String(startIndex + count) : null,
    hasMore,
  };
}

export async function createPost(
  body: PostBody,
  mediaIds: string[],
  idempotencyKey: string
): Promise<CreatePostResponse> {
  await delay(500);
  const post: Post = {
    id: `new-${idempotencyKey}`,
    authorId: "u1",
    body,
    mediaIds,
    engagementSummary: { reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 }, totalReactions: 0, commentCount: 0, shareCount: 0 },
    viewerReaction: null,
    viewerHasShared: false,
    createdAt: Date.now(),
  };
  return { post, users: [MOCK_USERS[0]], media: [] };
}

export async function setReaction(
  postId: string,
  reaction: ReactionType
): Promise<{ viewerReaction: ReactionType; engagementSummary: EngagementSummary }> {
  await delay(300);
  const base = ALL_MOCK_POSTS.find((p) => p.id === postId)?.engagementSummary ?? {
    reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
    totalReactions: 0,
    commentCount: 0,
    shareCount: 0,
  };
  return { viewerReaction: reaction, engagementSummary: base };
}