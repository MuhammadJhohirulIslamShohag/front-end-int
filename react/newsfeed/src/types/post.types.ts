import { User } from './users.types'


// media
export interface Media {
  url: string;
  alt: string;
  previewSrc: string;
  width: number;
  height: number;
}
export type EntityType = 'mention' | 'hastag' | 'link';

export interface PostEntityRange{
  type: EntityType;
  start: number;
  end: number;
  url?: string;
  userId?: string;
}

export interface PostBody{
  text: string;
  entities: PostEntityRange;
}

/**
 * Supported reaction types for a post.
 * Matches standard social media engagement categories.
 */
export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry";

/**
 * Lifecycle status of a post submission.
 * - `pending`: Post is currently being sent or processed on the server.
 * - `confirmed`: Post was successfully published and verified.
 * - `failed`: Post submission encountered an error and was not published.
 */
export type PostStatus = 'pending' | 'confirmed' | 'failed';

/**
 * Minimal user profile information required to display recent or prominent reacters.
 */
export interface RectorPreview {
  /** Unique user identifier of the reactor */
  id: string;
  /** Display name of the reactor */
  name: string;
}

/**
 * Aggregated metrics and summary of user interactions on a specific post.
 */
export interface EngagementSummary {
  /** Breakdown of reaction counts grouped by reaction type */
  reactions: Record<ReactionType, number>;
  /** Preview list of notable or recent users who reacted to this post */
  topRectors: RectorPreview[];
  /** Total number of times this post has been shared */
  shareCount: number;
  /** Total number of comments posted under this post */
  commentCount: number;
  /** Sum of all reactions received across all reaction types */
  totalReaction: number;
}

/**
 * Represents a social feed post along with metadata, media, status, and viewer-specific state.
 */
export interface Post {
  /** Unique identifier of the post */
  id: string;
  /** Main textual content of the post */
  body: PostBody;
  /** Unique identifier of the user who created the post */
  authorId: string;
  /** List of attached media asset IDs (images, videos, etc.) */
  mediaIds: string[];
  /** Creation timestamp in milliseconds (Unix epoch time) */
  createdAt: number;
  /** Whether the currently authenticated user has shared this post */
  viewerHasShared: boolean;
  /** Aggregated engagement statistics for this post */
  engagementSummary: EngagementSummary;
  /** The reaction type applied by the current viewer, or `null` if no reaction was made */
  viewerHasReaction: ReactionType | null;
  /** Current state of the post in the optimistic UI lifecycle */
  status: PostStatus;
}


// create response
export interface CreatePostResponse{
  users: User[];
  post: Post;
  media: Media[];
}
