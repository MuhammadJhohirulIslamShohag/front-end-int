import { Feed } from './feeds.types';
import { Post, Media } from './post.types';
import { User } from './users.types';

// ==========================================
// CLIENT STORE & NORMALIZED STATE
// ==========================================

/**
 * Represents the global normalized application state (e.g., Redux, Zustand store).
 * Entities are indexed by their unique IDs to prevent data duplication and ensure O(1) lookups.
 */
export interface NormalaizedState {
  /** Hash map of feed instances indexed by their unique feed ID */
  feedById: Record<string, Feed>;
  /** Hash map of post entities indexed by post ID */
  postById: Record<string, Post>;
  /** Hash map of media assets indexed by media ID */
  mediaById: Record<string, Media>;
  /** Hash map of user profiles indexed by user ID */
  userById: Record<string, User>;
}
