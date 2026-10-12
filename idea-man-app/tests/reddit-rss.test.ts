import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseRedditRssXml } from "../src/lib/reddit/fetcher";

describe("Reddit RSS Parser", () => {
  const sampleAtomRss = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <author>
      <name>/u/OBSERVERTHINGS</name>
      <uri>https://www.reddit.com/user/OBSERVERTHINGS</uri>
    </author>
    <category term="SomebodyMakeThis" label="r/SomebodyMakeThis"/>
    <content type="html">&lt;!-- SC_OFF --&gt;&lt;div class="md"&gt;&lt;p&gt;I’m researching problems that people genuinely face in their everyday life, work, business, studies, etc.&lt;/p&gt;&lt;p&gt;Please describe the actual problem, not the solution.&lt;/p&gt;&lt;/div&gt;&lt;!-- SC_ON --&gt;</content>
    <id>t3_1wvvzss</id>
    <link href="https://www.reddit.com/r/SomebodyMakeThis/comments/1wvvzss/im_looking_for_real_problems_not_startup_ideas/" />
    <published>2026-10-02T14:58:47+00:00</published>
    <title>I’m looking for real problems, not startup ideas.</title>
  </entry>
  <entry>
    <author>
      <name>/u/QuickTester</name>
    </author>
    <category term="SideProject" label="r/SideProject"/>
    <content type="html">&lt;p&gt;Short&lt;/p&gt;</content>
    <id>t3_short123</id>
    <link href="https://www.reddit.com/r/SideProject/comments/short123/short_title/" />
    <published>2026-10-02T15:00:00+00:00</published>
    <title>Short post</title>
  </entry>
</feed>`;

  it("should parse Reddit Atom RSS XML into structured RedditRawPost items", () => {
    const posts = parseRedditRssXml(sampleAtomRss, "SomebodyMakeThis");
    assert.equal(posts.length, 2);

    const first = posts[0];
    assert.equal(first.id, "1wvvzss");
    assert.equal(first.title, "I’m looking for real problems, not startup ideas.");
    assert.equal(first.author, "OBSERVERTHINGS");
    assert.equal(
      first.url,
      "https://www.reddit.com/r/SomebodyMakeThis/comments/1wvvzss/im_looking_for_real_problems_not_startup_ideas/"
    );
    assert.equal(first.subreddit, "SomebodyMakeThis");
    assert.ok(first.selftext.includes("I’m researching problems that people genuinely face"));
    assert.ok(!first.selftext.includes("&lt;div"));
    assert.ok(!first.selftext.includes("<p>"));
  });

  it("should extract correct subreddit if present in category term or fallback to provided subreddit", () => {
    const posts = parseRedditRssXml(sampleAtomRss, "DefaultSub");
    assert.equal(posts[0].subreddit, "SomebodyMakeThis");
    assert.equal(posts[1].subreddit, "SideProject");
  });
});
