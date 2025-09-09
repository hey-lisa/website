import DocsBreadcrumb from "@/components/docs-breadcrumb";
import Pagination from "@/components/pagination";
import Toc from "@/components/toc";
import { page_routes } from "@/lib/routes-config";
import { notFound } from "next/navigation";
import { getCompiledDocsForSlug, getDocFrontmatter } from "@/lib/markdown";
import { Typography } from "@/components/typography";
import Link from "next/link";

// Helper function to generate breadcrumb structured data
function generateBreadcrumbLD(slug: string[]) {
  const breadcrumbs = [
    { name: "Home", url: "https://hey-lisa.com" },
    { name: "Documentation", url: "https://hey-lisa.com/docs" },
  ];
  
  let currentPath = "/docs";
  slug.forEach((segment) => {
    currentPath += `/${segment}`;
    // Capitalize and format segment for display
    const name = segment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    breadcrumbs.push({
      name,
      url: `https://hey-lisa.com${currentPath}`,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url,
    })),
  };
}

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function DocsPage(props: PageProps) {
  const params = await props.params;
  const { slug = [] } = params;

  const pathName = slug.join("/");
  const res = await getCompiledDocsForSlug(pathName);

  if (!res) notFound();
  
  const breadcrumbLD = generateBreadcrumbLD(slug);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLD),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": res.frontmatter.title,
            "description": res.frontmatter.description,
            "url": `https://hey-lisa.com/docs/${pathName}`,
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "Hey LiSA Team",
            },
            "publisher": {
              "@type": "Organization",
              "name": "Hey LiSA",
              "logo": {
                "@type": "ImageObject",
                "url": "https://hey-lisa.com/opengraph-image.jpg",
              },
            },
            "isPartOf": {
              "@type": "WebSite",
              "name": "Hey LiSA Documentation",
              "url": "https://hey-lisa.com/docs",
            },
          }),
        }}
      />
      <div className="flex items-start gap-10">
        <div className="flex-[4.5] py-10 mx-auto">
          <div className="w-full mx-auto">
            <DocsBreadcrumb paths={slug} />
            <Typography>
            <div className="chg-notice">
              <div>
                LiSA is in pre‑alpha stage (
                <Link href="/docs/changelog" target="_blank" rel="noopener noreferrer">0.5</Link>
                ).
                <br />
                We&apos;re actively building and testing. Features are subject to change.
                <br />
                <Link href="https://x.com/HeyLisaAi" target="_blank" rel="noopener noreferrer">Follow updates on X</Link>.
              </div>
            </div>
            <h1 className="sm:text-3xl text-2xl !-mt-0.5">
              {res.frontmatter.title}
            </h1>
            <p className="-mt-4 text-muted-foreground sm:text-[16.5px] text-[14.5px]">
              {res.frontmatter.description}
            </p>
            <div>{res.content}</div>
            <Pagination pathname={pathName} />
          </Typography>
        </div>
      </div>

      <Toc path={pathName} />
      </div>
    </>
  );
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { slug = [] } = params;

  const pathName = slug.join("/");
  const res = await getDocFrontmatter(pathName);
  if (!res) return {};
  
  const { description } = res;
  const pageTitle = `Documentation | Hey LiSA`;
  const canonicalUrl = `https://hey-lisa.com/docs/${pathName}`;
  
  return {
    title: pageTitle,
    description: description || "Documentation for LiSA.",
    canonical: canonicalUrl,
    openGraph: {
      title: pageTitle,
      description: description || "Documentation for LiSA.",
      url: canonicalUrl,
      siteName: "Hey LiSA",
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description: description || "Documentation for LiSA.",
      creator: "@HeyLisaAi",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateStaticParams() {
  return page_routes.map((item) => ({
    slug: item.href.split("/").slice(1),
  }));
}
