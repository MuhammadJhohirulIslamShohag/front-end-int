
// rections type 
export type ReactionType =  "like" | "love" | "haha" | "wow" | "sad" | "angry";

// post status
export type PostStatus = 'pending' | 'confirmed' | 'failed';

// top reactors type
export interface RectorPreview {
  id: string;
  name: string;
}

// engagementSummary where you csn see total post rections, share, comment
export interface EngagementSummary{
  reactions: Record<ReactionType, number>;
  topRectors: RectorPreview[];
  shareCount: number;
  commentCount: number;
  totalReaction: number;
};

// shape of the post for newsfeed
export interface Post {
  id: string;
  body: string;
  authorId: string;
  mediaIds: string[];
  createdAt:number;
  viewerHasShared:boolean;
  engagementSummary: EngagementSummary;
  viewerHasReaction: ReactionType | null;
  status: PostStatus;
}