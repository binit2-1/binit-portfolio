import { jsonLd } from "@/lib/seo";

/** schema.org structured data as one @graph (see lib/seo.ts for the node builders). */
export function JsonLd({ nodes }: { nodes: object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(...nodes) }} />;
}
