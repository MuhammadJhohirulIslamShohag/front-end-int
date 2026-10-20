import { Post, Media } from './post.types';
import { User } from './users.types';

// ==========================================
// FEED STATE & PAGINATION MODELS
// ==========================================

/**
 * Represents a localized or customized feed state managed in the client store
 * (e.g., Home Feed, Explore, User Profile timeline).
 */

export interface Feed {
  /** Unique identifier for this specific feed instance or query key */
  id: string;
  /** Ordered list of post identifiers currently loaded in this feed */
  postIds: string[];
  /** Pagination cursor used to fetch newer posts newer than the current top item, or `null` if none */
  newerCursor: string | null;
  /** Pagination cursor used to fetch older posts below the current bottom item, or `null` if none */
  olderCursor: string | null;
  /** Indicates whether there are newer posts available to fetch */
  hasNewer: boolean;
  /** Indicates whether there are older posts available to paginate through */
  hasOlder: boolean;
  /** Unix timestamp in milliseconds indicating when this feed was last successfully synchronized */
  lastFetchedAt: number;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

/**
 * Server pagination response returned when fetching a chunk of feed posts.
 * Includes normalized relational data entities (posts, media, users) to hydrate the client store.
 */

export interface FeedPageResponse {
  /** Ordered list of post identifiers included in this specific page result */
  postIds: string[];
  /** Full post objects corresponding to the returned post IDs */
  posts: Post[];
  /** Complete media asset objects referenced by the fetched posts */
  media: Media[];
  /** Complete user profile objects associated with the posts (e.g., authors, reactors) */
  users: User[];
}
