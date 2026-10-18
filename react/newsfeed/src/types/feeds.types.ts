import {Post, Media}  from './post.types';
import {User}  from './users.types';

// server response
export interface FeedPageResponse {
  postIds: string[];
  posts: Post[];
  media: Media[];
  users: User[];
}