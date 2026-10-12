import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fetchRedditPosts, filterValidRedditPosts, type RedditRawPost } from "../src/lib/reddit/fetcher";

describe("Reddit Fetcher Module", () => {
  it("should filter out spam, empty, or removed posts", () => {
    const rawSample: RedditRawPost[] = [
      {
        id: "1",
        title: "I wish someone made an offline CLI proxy for Cloudflare Workers",
        selftext: "Testing webhooks offline is painfully slow because third-party providers rate-limit us. I need a tool that intercepts and replays payloads locally.",
        author: "dev_user",
        url: "https://reddit.com/r/SomebodyMakeThis/comments/1/cloudflare_proxy",
        permalink: "/r/SomebodyMakeThis/comments/1/cloudflare_proxy",
        subreddit: "SomebodyMakeThis",
        score: 45,
        createdAt: 1700000000,
      },
      {
        id: "2",
        title: "Check out my new AI agency discount!!",
        selftext: "[removed]",
        author: "spammer",
        url: "https://reddit.com/r/SomebodyMakeThis/comments/2/spam",
        permalink: "/r/SomebodyMakeThis/comments/2/spam",
        subreddit: "SomebodyMakeThis",
        score: 0,
        createdAt: 1700000001,
      },
      {
        id: "3",
        title: "Too short",
        selftext: "yo",
        author: "lazy_user",
        url: "https://reddit.com/r/SomebodyMakeThis/comments/3/short",
        permalink: "/r/SomebodyMakeThis/comments/3/short",
        subreddit: "SomebodyMakeThis",
        score: 2,
        createdAt: 1700000002,
      },
    ];

    const valid = filterValidRedditPosts(rawSample, { minSelftextLength: 30 });
    assert.equal(valid.length, 1);
    assert.equal(valid[0].id, "1");
    assert.equal(valid[0].subreddit, "SomebodyMakeThis");
  });

  it("should return mock posts when mock mode is enabled", async () => {
    const posts = await fetchRedditPosts({ useMock: true, limit: 3 });
    assert.ok(Array.isArray(posts));
    assert.equal(posts.length, 3);
    assert.ok(posts[0].title.length > 0);
    assert.ok(posts[0].selftext.length > 0);
    assert.ok(Boolean(posts[0].subreddit));
    assert.ok(/^https:\/\/(www\.)?reddit\.com\/r\//.test(posts[0].url));
  });

  it("should support diverse subreddits and custom sort options", async () => {
    const posts = await fetchRedditPosts({
      subreddits: ["SomebodyMakeThis", "SideProject", "Entrepreneur", "webdev"],
      useMock: true,
      limit: 5,
      sort: "top",
    });
    assert.ok(Array.isArray(posts));
    assert.equal(posts.length, 5);
  });
});
