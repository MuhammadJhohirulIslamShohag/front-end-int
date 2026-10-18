export interface RelationshipToViewer {
  isFriend?: boolean;
  isMuted?: boolean;
  isFollowed?: boolean;
  isBlocked?: boolean;
}

export interface User {
  id: string;
  name: string;
  profilePhotoUrl: string;
  handle: string;
  isVerified: boolean;
  relationshipToViewer: RelationshipToViewer;
}
