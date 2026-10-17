// ---------------------------------------------------------------------
// Entity types — mirrors the normalized data model discussed in the
// system design: Post/User/Media are canonical records referenced by
// id; Feed is an ordered list of post ids plus pagination/freshness
// metadata, not a nested array of full post objects.
// ---------------------------------------------------------------------

export type EntityType = "mention" | "hashtag" | "link";

export interface PostEntityRange {
  type: EntityType;
  start: number; // inclusive
  end: number; // exclusive (String.prototype.slice semantics)
  userId?: string; // present for "mention"
  url?: string; // present for "link"
}

export interface PostBody {
  text: string;
  entities: PostEntityRange[];
}

export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry";

export interface EngagementSummary {
  reactions: Record<ReactionType, number>;
  totalReactions: number;
  commentCount: number;
  shareCount: number;
}

export type PostStatus = "pending" | "confirmed" | "failed";

export interface Post {
  id: string;
  authorId: string;
  body: PostBody;
  mediaIds: string[];
  engagementSummary: EngagementSummary;
  viewerReaction: ReactionType | null;
  viewerHasShared: boolean;
  createdAt: number;
  status?: PostStatus; // client-only: optimistic/outbox state
}

export interface RelationshipToViewer {
  isFriend?: boolean;
  isFollowing?: boolean;
  isMuted?: boolean;
  isBlocked?: boolean;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  profilePhotoUrl: string;
  isVerified: boolean;
  relationshipToViewer: RelationshipToViewer;
}

export interface Media {
  id: string;
  src: string;
  previewSrc?: string;
  alt: string;
  width: number;
  height: number;
}

export interface Feed {
  id: string;
  postIds: string[];
  olderCursor: string | null;
  newerCursor: string | null;
  hasOlder: boolean;
  hasNewer: boolean;
  lastFetchedAt: number | null;
}

export interface ComposerDraft {
  body: PostBody;
  mediaIds: string[];
  uploadState: "idle" | "uploading" | "failed";
  submitState: "idle" | "submitting" | "submitted" | "failed";
}

export interface NormalizedStore {
  feedsById: Record<string, Feed>;
  postsById: Record<string, Post>;
  usersById: Record<string, User>;
  mediaById: Record<string, Media>;
}

// Server response shapes --------------------------------------------

export interface FeedPageResponse {
  postIds: string[];
  posts: Post[];
  users: User[];
  media: Media[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CreatePostResponse {
  post: Post;
  users: User[];
  media: Media[];
}