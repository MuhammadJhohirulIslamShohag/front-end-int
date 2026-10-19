export interface NormalaizedState{
  feedById: Record<string, Feed>;
  postById: Record<string, Post>;
  mediaById:Record<string, Media>;
  userById:Record<string, User>;
}