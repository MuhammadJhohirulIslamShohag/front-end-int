import {Post, Media}  from './post.types';
import {User}  from './users.types';


// feed typee shape
export interface Feed {
  id: string;
  postIds: string[];
  newerCursor:string | null;
  olderCursor:string | null;
  hasNewer:boolean;
  hasOlder:boolean;
  lastFetchedAt: number;
}

// server response
export interface FeedPageResponse {
  postIds: string[];
  posts: Post[];
  media: Media[];
  users: User[];
}