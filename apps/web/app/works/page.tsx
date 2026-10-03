import type { Metadata } from "next";
import { HoverPreviewList } from "@/components/hover-preview";
import { PageHeader } from "@/components/prose";
import { ProjectRow } from "@/components/list-rows";
import { getProjectPreviews } from "@/lib/previews";
import { primaryProjectUrl, PROJECTS } from "@/lib/projects";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, PERSON_ID, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Works and Projects",
  description:
    "Projects built by Binit Gupta: Composter, a component vault for React teams; Authingo, headless auth for React and Go; Hackersquare; and Munshi.",
  path: "/works",
});

export default async function WorkPage() {
  const media = await getProjectPreviews(PROJECTS);

  return (
    <>
      <JsonLd
        nodes={[
          {
            "@type": "CollectionPage",
            "@id": `${absoluteUrl("/works")}#page`,
            url: absoluteUrl("/works"),
            name: "Works and Projects by Binit Gupta",
            author: { "@id": PERSON_ID },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: PROJECTS.map((project, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "SoftwareSourceCode",
                  name: project.name,
                  description: project.description,
                  url: primaryProjectUrl(project),
                  ...(project.githubUrl && { codeRepository: project.githubUrl }),
                  author: { "@id": PERSON_ID },
                },
              })),
            },
          },
          breadcrumbSchema([{ name: "Works", path: "/works" }]),
        ]}
      />
      <PageHeader title="Works">Things I&apos;ve built, from developer tools to hackathon products.</PageHeader>

      <HoverPreviewList media={media} className="mt-8">
        <ul aria-label="Projects">
          {PROJECTS.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </ul>
      </HoverPreviewList>
    </>
  );
}
