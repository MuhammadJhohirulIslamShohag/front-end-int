import { User } from './users.types';

// ==========================================
// MEDIA & CONTENT ENTITIES
// ==========================================

/**
 * Metadata representing a media asset attached to a post (e.g., image, video thumbnail).
 */
export interface Media {
  /** Public URL where the media file is hosted */
  url: string;
  /** Accessibility alt text description for screen readers */
  alt: string;
  /** Lightweight preview/blur image data URL or thumbnail link */
  previewSrc: string;
  /** Original width of the media in pixels */
  width: number;
  /** Original height of the media in pixels */
  height: number;
}

/**
 * Categories of inline rich text content highlighted within a post.
 */
export type EntityType = 'mention' | 'hastag' | 'link';

/**
 * Positional metadata for tagged entities (mentions, hashtags, links) inside post text.
 */
export interface PostEntityRange {
  /** The classification of the entity */
  type: EntityType;
  /** Zero-based starting character index in the text string */
  start: number;
  /** Zero-based ending character index in the text string */
  end: number;
  /** Target hyper-link destination (populated if `type` is 'link') */
  url?: string;
  /** Target user identifier (populated if `type` is 'mention') */
  userId?: string;
}

/**
 * Structured body content of a post including raw text and embedded metadata.
 */
export interface PostBody {
  /** Raw text content of the post */
  text: string;
  /** Range index metadata for clickable entities, tags, and links */
  entities: PostEntityRange;
}

// ==========================================
// ENGAGEMENT & STATUS TYPES
// ==========================================

/**
 * Supported reaction types for a post.
 * Matches standard social media engagement categories.
 */

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

/**
 * Lifecycle status of a post submission.
 * - `pending`: Post is currently being sent or processed on the server (Optimistic UI state).
 * - `confirmed`: Post was successfully published and verified by the server.
 * - `failed`: Post submission encountered an error and was not published.
 */

export type PostStatus = 'pending' | 'confirmed' | 'failed';

/**
 * Minimal user profile information required to display recent or prominent reactors.
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
  /** Aggregate total of all reactions received across all types */
  totalReaction: number;
}

// ==========================================
// POST & COMPOSER DOMAIN MODELS
// ==========================================

/**
 * Represents a social feed post along with metadata, media, status, and viewer-specific state.
 */

export interface Post {
  /** Unique identifier of the post */
  id: string;
  /** Main textual content and embedded entities of the post */
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

/**
 * Transient state for unsubmitted post drafts in the post composer UI.
 */

export interface ComposerDarft {
  /** Text content and rich entity annotations currently being drafted */
  body: PostBody;
  /** Identifiers of media assets currently attached to the draft */
  mediaIds: string[];
  /** Progress status of background media uploads attached to this draft */
  uploadState: 'idle' | 'uploading' | 'failed';
  /** Lifecycle phase of the post submission request */
  submitState: 'idle' | 'submitting' | 'submited' | 'failed';
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

/**
 * Server response returned after successfully creating a new post.
 * Includes normalized relational data (users and media assets) for local cache hydration.
 */

export interface CreatePostResponse {
  /** List of associated user entities (e.g., author, mentioned users) */
  users: User[];
  /** The newly created post model */
  post: Post;
  /** Complete media objects referenced by the post */
  media: Media[];
}
