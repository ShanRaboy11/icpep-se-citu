import { redirect } from "next/navigation";

// The site's real home page lives at /home; redirect at the server so
// crawlers and first paint see it immediately instead of a blank page that
// only redirects once client JS runs.
export default function RootPage() {
  redirect("/home");
}
