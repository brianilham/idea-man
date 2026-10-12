import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  mineAndPersistIdeas,
  deduplicatePostsAgainstUrls,
  type MiningResult,
} from "../src/lib/ingestion/orchestrator";
import type { RedditRawPost } from "../src/lib/reddit/fetcher";

describe("Ingestion Orchestrator Module", () => {
  it("should filter out already existing URLs from raw Reddit posts", () => {
    const rawPosts: RedditRawPost[] = [
      {
        id: "post_1",
        title: "Test Idea 1",
        selftext: "This is test idea 1 with sufficient selftext length.",
        author: "author_1",
        url: "https://reddit.com/r/SomebodyMakeThis/1",
        permalink: "/r/SomebodyMakeThis/1",
        subreddit: "SomebodyMakeThis",
        score: 10,
        createdAt: 1000,
      },
      {
        id: "post_2",
        title: "Test Idea 2",
        selftext: "This is test idea 2 with sufficient selftext length.",
        author: "author_2",
        url: "https://reddit.com/r/SomebodyMakeThis/2",
        permalink: "/r/SomebodyMakeThis/2",
        subreddit: "SomebodyMakeThis",
        score: 20,
        createdAt: 2000,
      },
      {
        id: "post_3",
        title: "Test Idea 3",
        selftext: "This is test idea 3 with sufficient selftext length.",
        author: "author_3",
        url: "https://reddit.com/r/SomebodyMakeThis/3",
        permalink: "/r/SomebodyMakeThis/3",
        subreddit: "SomebodyMakeThis",
        score: 30,
        createdAt: 3000,
      },
    ];

    const existingUrls = [
      "https://reddit.com/r/SomebodyMakeThis/1",
      "https://reddit.com/r/SomebodyMakeThis/3",
    ];

    const unique = deduplicatePostsAgainstUrls(rawPosts, existingUrls);
    assert.equal(unique.length, 1);
    assert.equal(unique[0].id, "post_2");
    assert.equal(unique[0].url, "https://reddit.com/r/SomebodyMakeThis/2");
  });

  it("should execute mining pipeline and return structured summary in mock mode", async () => {
    const result: MiningResult = await mineAndPersistIdeas({
      useMock: true,
      limit: 2,
      forceFallbackAI: true,
    });

    assert.equal(result.success, true);
    assert.ok(result.scannedCount >= 2);
    assert.equal(typeof result.duplicatesSkipped, "number");
    assert.equal(typeof result.newIdeasAdded, "number");
    assert.ok(Array.isArray(result.ideas));

    if (result.ideas.length > 0) {
      const first = result.ideas[0];
      assert.ok(Boolean(first.title));
      assert.ok(Boolean(first.problem_summary));
      assert.ok(Boolean(first.proposed_solution));
      assert.ok(Boolean(first.url));
      assert.ok(Boolean(first.subreddit));
      assert.equal(first.is_new, true);
    }
  });
});
