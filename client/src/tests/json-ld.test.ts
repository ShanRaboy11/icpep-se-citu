import { describe, it, expect } from "vitest";
import { jsonLd } from "../app/utils/json-ld";

describe("jsonLd", () => {
  it("escapes markup so content cannot close the script tag", () => {
    const out = jsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
  });
});
