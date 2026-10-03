import { buildSearchIndex } from "@/lib/search";

// Built once at build time; the palette fetches it the first time it opens.
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchIndex());
}
