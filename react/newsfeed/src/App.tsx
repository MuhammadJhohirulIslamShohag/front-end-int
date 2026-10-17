import { useCallback, useEffect, useState } from "react";
import { StoreProvider, useFeed, useStoreDispatch, useStoreState } from "./store/StoreContext";
import { fetchFeedPage } from "./api/feedApi";
import { VirtualizedFeedList } from "./components/VirtualizedFeedList";
import { FeedPost } from "./components/FeedPost";
import { Composer } from "./components/Composer";
import { SkipLink, NewPostsBanner } from "./components/SkipLinkAndBanner";

const FEED_ID = "home";

function HomeFeed() {
  const dispatch = useStoreDispatch();
  const feed = useFeed(FEED_ID);
  const postsById = useStoreState().postsById;
  const [isLoading, setIsLoading] = useState(false);
  const [newPostsCount, setNewPostsCount] = useState(0);

  const loadMore = useCallback(async () => {
    setIsLoading(true);
    try {
      const page = await fetchFeedPage({ cursor: feed?.olderCursor ?? null });
      dispatch({ type: "MERGE_ENTITIES", posts: page.posts, users: page.users, media: page.media });
      dispatch({
        type: "SET_FEED_PAGE",
        feedId: FEED_ID,
        postIds: page.postIds,
        append: Boolean(feed),
        nextCursor: page.nextCursor,
        hasMore: page.hasMore,
      });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, feed]);

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setNewPostsCount(3), 15_000);
    return () => clearTimeout(timer);
  }, []);

  const postIds = feed?.postIds ?? [];

  return (
    <>
      <NewPostsBanner
        count={newPostsCount}
        onClick={() => {
          setNewPostsCount(0);
        }}
      />

      <VirtualizedFeedList
        postIds={postIds}
        hasMore={feed?.hasOlder ?? true}
        isLoading={isLoading}
        onLoadMore={loadMore}
        renderPost={(id, meta) => {
          const post = postsById[id];
          return post ? <FeedPost post={post} posinset={meta.posinset} setsize={meta.setsize} /> : null;
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <SkipLink />
      <header className="app-header">
        <h1>News Feed</h1>
      </header>
      <main>
        <Composer feedId={FEED_ID} />
        <HomeFeed />
      </main>
    </StoreProvider>
  );
}