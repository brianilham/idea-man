import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createClient } from "../src/lib/supabase/client";

describe("Supabase Auth Integration", () => {
  it("should initialize Supabase browser client with auth namespace", () => {
    const supabase = createClient();
    assert.ok(supabase.auth);
    assert.equal(typeof supabase.auth.signUp, "function");
    assert.equal(typeof supabase.auth.signInWithPassword, "function");
    assert.equal(typeof supabase.auth.signOut, "function");
    assert.equal(typeof supabase.auth.getUser, "function");
  });

  it("should parse user display name from user metadata or email", () => {
    const mockUser1 = {
      email: "alex@example.com",
      user_metadata: { full_name: "Alex Rivers" },
    };
    const mockUser2 = {
      email: "builder@gmail.com",
      user_metadata: {},
    };

    const getName = (u: any) => u.user_metadata?.full_name || u.email?.split("@")[0] || "User";

    assert.equal(getName(mockUser1), "Alex Rivers");
    assert.equal(getName(mockUser2), "builder");
  });
});
