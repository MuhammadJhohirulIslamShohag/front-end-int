/**
 * Defines the social connection status between the currently authenticated viewer
 * and another user profile.
 */
export interface RelationshipToViewer {
  /** Indicates whether the viewer is friends with this user */
  isFriend?: boolean;
  /** Indicates whether the viewer has muted this user's content updates */
  isMuted?: boolean;
  /** Indicates whether the viewer is currently following this user */
  isFollowed?: boolean;
  /** Indicates whether the viewer has blocked this user */
  isBlocked?: boolean;
}

/**
 * Represents a user profile within the application, including core identity details
 * and their connection status relative to the current viewer.
 */
export interface User {
  /** Unique identifier of the user */
  id: string;
  /** Display name of the user */
  name: string;
  /** Public URL pointing to the user's avatar or profile image */
  profilePhotoUrl: string;
  /** Unique social handle or username (e.g., @username) */
  handle: string;
  /** Whether the user account has an official verified badge */
  isVerified: boolean;
  /** Social relationship states between this user and the current viewer */
  relationshipToViewer: RelationshipToViewer;
}
