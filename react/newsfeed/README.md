প্রতিটা file কীভাবে কাজ করে, ধাপে ধাপে বাংলায় ব্যাখ্যা করছি।

---

**১. `package.json` / `tsconfig.json` / `vite.config.ts` / `index.html`**

এগুলো প্রজেক্টের **setup/configuration** file — কোনো business logic নেই।
- `package.json` — কোন library (React, Vite, TypeScript) লাগবে তার তালিকা, আর `npm run dev` চালালে কী command চলবে।
- `tsconfig.json` — TypeScript কীভাবে code check করবে (strict mode চালু আছে, যাতে type error আগেই ধরা পড়ে)।
- `vite.config.ts` — Vite হলো build tool, এটা React plugin চালু করে।
- `index.html` — ব্রাউজার প্রথমে এই file-টাই খোলে, এটা শুধু একটা `<div id="root">` আর `main.tsx`-কে script হিসেবে load করে।

---

**২. `src/main.tsx` — Entry Point**

এটা পুরো app-এর **শুরুর বিন্দু**। এটা `<App />` component-কে নিয়ে HTML-এর `#root` div-এর ভেতরে বসিয়ে দেয় (`ReactDOM.createRoot(...).render(...)`)। এটা শুধু একটা "bootstrap" ফাইল — এখানে কোনো feed logic নেই।

---

**৩. `src/types.ts` — Data-এর Blueprint**

এই file-এ কোনো কাজ (function) নেই, শুধু **TypeScript interface/type** আছে — মানে প্রতিটা data কেমন দেখতে হবে তার নকশা।

- `Post`, `User`, `Media`, `Feed` — আগে আলোচিত **normalized entity model**। যেমন `Post`-এ `authorId` (string) থাকে, পুরো `User` object না — কারণ author-এর তথ্য আলাদা জায়গায় (store-এ) থাকবে, এখানে শুধু তার id reference থাকে।
- `PostBody` + `PostEntityRange` — mention/hashtag/link কোথায় আছে (character position দিয়ে) তা বলার format।
- `NormalizedStore` — পুরো client store-এর shape: চারটা dictionary (`feedsById`, `postsById`, `usersById`, `mediaById`)।

**এই file-এর কাজ:** বাকি সব file যখন `Post` বা `User` type ব্যবহার করে, TypeScript এখান থেকেই জানে সেগুলোর ভেতরে কী কী field থাকা বাধ্যতামূলক — ভুল field নাম লিখলে বা কিছু বাদ দিলে compile-time-এই error ধরা পড়ে।

---

**৪. `src/store/StoreContext.tsx` — কেন্দ্রীয় State Management (সবচেয়ে গুরুত্বপূর্ণ file)**

এটাই "Store" layer — পুরো app-এর data-এর **একমাত্র সত্য উৎস (single source of truth)**।

**কীভাবে কাজ করে:**
- `useReducer` ব্যবহার করা হয়েছে — এটা React-এর built-in hook, যেখানে একটা central `state` আর একটা `dispatch(action)` function থাকে। `dispatch` কল করলে `reducer` function চলে, যা পুরনো state আর action দেখে **নতুন state** বানায়।
- `reducer` function-এর ভেতরে `switch` দিয়ে বিভিন্ন action type handle হয়:
  - **`MERGE_ENTITIES`** — server থেকে post/user/media এলে, সেগুলোকে `postsById`/`usersById`/`mediaById`-তে **merge** করে (নতুন হলে যোগ, পুরনো থাকলে update)।
  - **`SET_FEED_PAGE`** — feed-এর `postIds` list-এ নতুন page-এর id যোগ করে (append) অথবা replace করে, আর cursor/hasMore আপডেট করে।
  - **`PREPEND_POST`** — নতুন post লেখা হলে তার id feed-এর একদম উপরে বসায় (optimistic insert-এর জন্য)।
  - **`REPLACE_POST_ID`** — temporary "optimistic-xxx" id-কে server-এর দেওয়া আসল id দিয়ে বদলে দেয়, এবং যেসব feed-এ এই id আছে, সবগুলোতে replace করে।
  - **`APPLY_OPTIMISTIC_REACTION`** — ইউজার reaction click করলে সাথে সাথে count/viewerReaction বদলে দেয়, server-এর response আসার আগেই।
  - **`RECONCILE_REACTION`** — server response এলে, optimistic guess-কে আসল server data দিয়ে **প্রতিস্থাপন** করে (server সবসময় শেষ কথা বলে)।

- **`React Context`** (`StoreStateContext`, `StoreDispatchContext`) দিয়ে এই state/dispatch পুরো app-এর যেকোনো component থেকে access করা যায়, props দিয়ে বারবার না পাঠিয়েই।
- শেষে কিছু **convenience hook** (`usePost`, `useUser`, `useFeed`) দেওয়া আছে, যাতে কোনো component শুধু `usePost("p1")` লিখলেই সেই post-এর current data পেয়ে যায়।

**মূল ধারণা:** যেকোনো component কোথাও একটা post update করলে (যেমন reaction দিলে), সেই post যেখানেই দেখানো হচ্ছে (home feed-এ), সেটা **automatically** নতুন data দেখাবে — কারণ সবাই একই central store থেকে পড়ছে।

---

**৫. `src/api/feedApi.ts` — Data Access Layer**

এটা server-এর সাথে communication-এর কাজ করে (বাস্তবে `fetch()` কল করবে, কিন্তু যেহেতু আসল backend নেই, একটা **mock server** বানানো হয়েছে)।

- `ALL_MOCK_POSTS` — ৫০টা fake post আগে থেকেই বানানো (array-তে), যেন backend-এর মতো আচরণ করে।
- **`fetchFeedPage({ cursor, count })`** — cursor থেকে পরের `count`-টা post কেটে (slice) নেয়, `nextCursor` আর `hasMore` হিসাব করে ফেরত দেয়। এটাই আগে আলোচিত **cursor-based pagination**-এর বাস্তবায়ন (যদিও এখানে cursor আসলে একটা array index, real backend-এ এটা post ID বা timestamp হতো)।
- **`createPost(...)`** — নতুন post বানানোর request simulate করে, `idempotencyKey` নেয় (যদিও mock-এ dedupe logic নেই, বাস্তবে server এটা দিয়ে duplicate ঠেকায়)।
- **`setReaction(...)`** — reaction set করার request simulate করে।
- প্রতিটা function-এ `await delay(400)` এর মতো আছে — এটা **network latency simulate** করার জন্য, যাতে loading state/optimistic update বাস্তবে কেমন দেখায় সেটা বোঝা যায়।

**মূল কথা:** এই file-টাকে বদলে শুধু `fetch("/feed?...")` দিয়ে replace করলেই এটা real backend-এর সাথে কাজ করবে — বাকি কোনো component বদলাতে হবে না, কারণ return করা data-এর shape একই থাকবে।

---

**৬. `src/utils/sanitizeUrl.ts` — XSS Defense**

একটা ছোট কিন্তু গুরুত্বপূর্ণ function — `new URL()` দিয়ে একটা URL parse করে, তার scheme (`http:`, `https:`, `mailto:`) **allowlist**-এর সাথে মিলিয়ে দেখে। মিললে safe URL ফেরত দেয়, না মিললে (যেমন `javascript:`) `null` ফেরত দেয়।

**কোথায় ব্যবহার হয়:** `RichPostText.tsx`-এ, প্রতিটা mention/hashtag/link render করার **ঠিক আগে** — এটা render-time check, submission-time না।

---

**৭. `src/utils/outbox.ts` — Offline-Resilient Write Queue**

একটা simple `Map` দিয়ে বানানো **pending mutation-এর queue**। 

- `outbox.add(entry)` — কোনো post submit করলে, network call করার **আগেই** এখানে entry যোগ হয়।
- `outbox.remove(key)` — server confirm করলে এখান থেকে মুছে ফেলা হয়।
- `outbox.getAll()` — connection ফিরে এলে, যা কিছু এখনো pending আছে তার list বের করা।
- `generateIdempotencyKey()` — `crypto.randomUUID()` দিয়ে একটা unique key বানায়, যেটা retry হলেও একই থাকে।

**বাস্তবে:** এটা IndexedDB দিয়ে হওয়া উচিত (যাতে tab বন্ধ করলেও data না হারায়), কিন্তু demo-তে সরলতার জন্য memory-তে `Map` ব্যবহার করা হয়েছে।

---

**৮. `src/hooks/useInfiniteScroll.ts` — Intersection Observer Hook**

একটা custom React hook, যেটা একটা `markerRef` (একটা invisible div-এর reference) ফেরত দেয়।

**ভেতরে কী হচ্ছে:**
- `IntersectionObserver` তৈরি হয়, `rootMargin: "0px 0px ${window.innerHeight}px 0px"` দিয়ে — এটা viewport-এর নিচের অংশ এক স্ক্রিন বাড়িয়ে ধরে, তাই marker আসলে screen-এ আসার **আগেই** intersect হয়ে যায়।
- Marker visible (intersect) হলে এবং `isLoading` false হলে, `onLoadMore()` call হয়।
- Component unmount হলে `observer.disconnect()` দিয়ে cleanup হয় (memory leak আটকাতে)।

**ব্যবহার:** `VirtualizedFeedList`-এ, একদম নিচে এই marker বসানো থাকে।

---

**৯. `src/components/RichPostText.tsx` — Entity Rendering**

`body.text` আর `body.entities` নিয়ে text-কে টুকরো টুকরো (`span`, `a`) করে render করে।

- `entities`-কে `start`-অনুযায়ী sort করে, তারপর একটা `cursor` variable দিয়ে text-এর মধ্য দিয়ে এগোয়।
- প্রতিটা entity-র **আগের** plain text একটা `<span>`-এ, আর entity নিজে তার `type` (mention/hashtag/link) অনুযায়ী `<SafeLink>`-এ রেন্ডার হয়।
- `SafeLink` ভেতরে `sanitizeUrl` কল করে URL safe কিনা check করে — unsafe হলে শুধু plain `<span>` (link না) রেন্ডার করে।
- External link হলে (`origin` আলাদা হলে) `target="_blank"` + `rel="noopener noreferrer"` যোগ হয়।

---

**১০. `src/components/PostTimestamp.tsx` — Smart Timestamp**

- `createdAt` আর বর্তমান সময় (`now`, state-এ রাখা) থেকে বয়স (`ageMs`) হিসাব করে।
- `isRecent` (< ১ ঘণ্টা) হলে, `useEffect`-এ `setInterval(... 15000)` দিয়ে প্রতি ১৫ সেকেন্ডে `now` আপডেট হয় — এতে component re-render হয়ে নতুন সময় দেখায়।
- `getRelativeUnit` function সঠিক unit (second/minute/hour/day...) ঠিক করে।
- `Intl.RelativeTimeFormat` / `Intl.DateTimeFormat` দিয়ে locale-অনুযায়ী সঠিক ভাষায় format হয় (bundle-এ আলাদা translation লাগে না)।

---

**১১. `src/components/FeedImage.tsx` — Optimized Image**

- `loading={isFirst ? "eager" : "lazy"}` — প্রথম post-এর image (likely LCP) সাথে সাথে লোড হয়, বাকিগুলো lazy।
- `aspectRatio` CSS দিয়ে image-এর জায়গা আগে থেকেই reserve হয় (CLS কমানো)।
- `backgroundImage: previewSrc` — ছোট blurred preview background হিসেবে বসে, আসল image load হওয়া পর্যন্ত।

---

**১২. `src/components/PostActions.tsx` — Reaction Logic**

- `applyReaction(reaction)` function-এ তিনটা ধাপ:
  ১. `dispatch({ type: "APPLY_OPTIMISTIC_REACTION", ... })` — সাথে সাথে UI বদলায়
  ২. `await setReaction(...)` — server call
  ৩. সফল হলে `RECONCILE_REACTION` (server data দিয়ে নিশ্চিত করা), fail হলে আবার `APPLY_OPTIMISTIC_REACTION` কল করে **revert** করা (reaction আর previous উল্টে দিয়ে)।
- `.reaction-picker-trigger` button-এ `onFocus`/`onBlur` দেওয়া আছে — CSS-এর সাথে মিলিয়ে keyboard ব্যবহারকারীও menu খুলতে পারে, শুধু hover না।
- Comment/Share button-এ `aria-label` দেওয়া, কারণ এগুলো icon-only (emoji ব্যবহার করা হয়েছে এখানে, বাস্তবে SVG হতো)।

---

**১৩. `src/components/FeedPost.tsx` — একটা Post-এর পুরো কাঠামো**

- `useUser(post.authorId)` দিয়ে store থেকে author-এর তথ্য বের করে।
- `role="article"`, `aria-labelledby`, `aria-posinset`/`aria-setsize` — accessibility attribute।
- `post.status === "pending"` হলে opacity কমে ও "sending…" দেখায়; `"failed"` হলে লাল error text দেখায়।
- `RichPostText`, `PostTimestamp`, `FeedImage`, `PostActions` — সব আগের component একত্রিত করে।

---

**১৪. `src/components/VirtualizedFeedList.tsx` — সবচেয়ে জটিল Component**

- `heightsRef` (Map) প্রতিটা post-এর measured height cache করে রাখে।
- `offsets` array হিসাব করে প্রতিটা post কোন `top` position-এ বসবে (cumulative height যোগ করে)।
- `visibleStart`/`visibleEnd` বর্তমান scroll + overscan (800px) দিয়ে বের করে কোনটা "visible"।
- যে post visible, সেটা আসল content রেন্ডার করে, না হলে শুধু height-matched খালি `<div>` (spacer)।
- `measureRef` — post mount হলে তার real height measure করে cache আপডেট করে, আর `forceRerender` দিয়ে offset recalculate করায়।
- `useInfiniteScroll` hook থেকে পাওয়া `markerRef` নিচে বসানো, যা prefetch trigger করে।
- `role="feed"`, `aria-busy={isLoading}` — পুরো container-এর accessibility।

---

**১৫. `src/components/Composer.tsx` — Post লেখার Box**

- `submitPost` — `idempotencyKey` generate করে, optimistic post বানিয়ে store-এ `MERGE_ENTITIES` + `PREPEND_POST` দিয়ে সাথে সাথে দেখায়, তারপর `outbox.add` করে, তারপর `attemptSend` কল করে।
- `attemptSend` — সফল হলে `REPLACE_POST_ID` দিয়ে optimistic id-কে server id দিয়ে বদলায় এবং outbox থেকে মুছে ফেলে; fail হলে `SET_POST_STATUS` দিয়ে "failed" মার্ক করে, entry outbox-এ থেকে যায়।
- `flushOutbox` — `window.addEventListener("online", ...)` দিয়ে network ফিরলে সব pending entry আবার পাঠানোর চেষ্টা করে।

---

**১৬. `src/components/SkipLinkAndBanner.tsx`**

- `SkipLink` — `href="#feed"` দিয়ে একটা link, CSS-এর `.skip-link:focus` rule-এর কারণে focus না পেলে স্ক্রিনের বাইরে লুকানো থাকে।
- `NewPostsBanner` — `aria-live="polite"` দিয়ে wrap করা, ইউজার click করলেই `onClick` callback চলে (feed-এ merge হয়), চুপচাপ prepend হয় না।

---

**১৭. `src/App.tsx` — সবকিছু একসাথে জোড়া লাগানো**

- `HomeFeed` component:
  - `loadMore` — `fetchFeedPage` কল করে, response আসলে `MERGE_ENTITIES` (entity store-এ) আর `SET_FEED_PAGE` (feed-এর postIds আপডেট) dispatch করে।
  - প্রথম `useEffect`-এ একবার `loadMore()` কল হয় (initial load)।
  - দ্বিতীয় `useEffect`-এ ১৫ সেকেন্ড পর `newPostsCount` সেট হয় — এটা **simulate** করছে stale-feed check (বাস্তবে background fetch বা server push হতো)।
  - `VirtualizedFeedList`-কে `postIds`, `hasMore`, `renderPost` পাঠানো হয়, যেটা প্রতিটা id-এর জন্য `FeedPost` রেন্ডার করে।
- `App` — `StoreProvider` দিয়ে পুরো tree-কে wrap করে (যাতে ভেতরের সব component store access করতে পারে), আর `SkipLink`, `Composer`, `HomeFeed` সাজিয়ে রাখে।

---

**১৮. `src/styles.css`**

- `.skip-link` — position/top দিয়ে লুকানো, `:focus`-এ দৃশ্যমান।
- `button:focus-visible` — visible focus ring সবসময় বজায় রাখা।
- `.post-actions button { min-width/height: 44px }` — touch target size।
- `.reaction-picker-trigger` — opacity 0, কিন্তু `:hover`/`:focus`-এ 1 — keyboard parity।
- `@media (prefers-reduced-motion: reduce)` — সব animation/transition বন্ধ করে দেয়।

---

**সারসংক্ষেপে পুরো Data Flow:**

```
App চালু হয়
  → StoreProvider সব component-কে store access দেয়
  → HomeFeed mount হয়, loadMore() চলে
  → feedApi.fetchFeedPage() (mock server) থেকে data আসে
  → dispatch(MERGE_ENTITIES) + dispatch(SET_FEED_PAGE) → store আপডেট
  → VirtualizedFeedList re-render হয় নতুন postIds নিয়ে
  → visible postId-গুলোর জন্য FeedPost render হয় (store থেকে post/user পড়ে)
  → ইউজার scroll করলে → marker intersect → loadMore() আবার চলে (pagination)
  → ইউজার reaction দিলে → optimistic update → server call → reconcile
  → ইউজার post লিখলে → optimistic insert → outbox → server call → id replace
```