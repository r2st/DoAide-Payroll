import { describe, expect, it } from "vitest";
import { embedSnippet, fullUrl, twitterUrl, whatsappUrl } from "../lib/share";

describe("share utilities", () => {
  it("fullUrl joins origin and path", () => {
    expect(fullUrl("/calculator")).toContain("/calculator");
  });

  it("whatsappUrl encodes text and url", () => {
    const url = whatsappUrl("hello", "https://example.com");
    expect(url).toContain("wa.me");
    expect(url).toContain(encodeURIComponent("hello https://example.com"));
  });

  it("twitterUrl sets text and url params", () => {
    const url = twitterUrl("Check this", "https://example.com");
    expect(url).toContain("twitter.com/intent/tweet");
    expect(url).toContain("text=");
    expect(url).toContain("url=");
  });

  it("embedSnippet returns iframe tag", () => {
    const snippet = embedSnippet("calculator");
    expect(snippet).toContain("<iframe");
    expect(snippet).toContain("/embed/calculator");
    expect(snippet).toContain("DoAide Payroll");
  });
});
