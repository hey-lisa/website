import { Metadata } from "next";
import Pagination from "@/components/pagination";
import Toc from "@/components/toc";
import DocsBreadcrumb from "@/components/docs-breadcrumb";
import DocsNotice from "@/components/docs-notice";
import { page_routes } from "@/lib/routes-config";
import { notFound } from "next/navigation";
import { getDocsForSlug } from "@/lib/markdown";
import { Typography } from "@/components/typography";
import { getDictionary, LangProps } from "@/lib/dictionaries";
import { TechArticleStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data";

type PageProps = {
  params: Promise<{ slug: string[] }>;
} & LangProps;

export default async function DocsPage(props: PageProps) {
  const params = await props.params;

  const { slug = [], lang } = params;
  const slugWithLang = [lang, ...slug];
  const dict = await getDictionary(lang);
  const pathName = slugWithLang.join("/");
  const res = await getDocsForSlug(pathName);

  if (!res) notFound();
  
  const baseUrl = "https://hey-lisa.com";
  const slugPath = slug.join("/");
  const canonicalUrl = `${baseUrl}/${lang}/docs${slugPath ? `/${slugPath}` : ""}`;
  const currentDate = new Date().toISOString();
  
  // Generate breadcrumb data
  const breadcrumbItems = [
    {
      position: 1,
      name: "Hey LiSA",
      item: `${baseUrl}/${lang}`,
    },
    {
      position: 2,
      name: "Documentation",
      item: `${baseUrl}/${lang}/docs`,
    },
    ...(slug.length > 0 ? [{
      position: 3,
      name: res.frontmatter.title,
      item: canonicalUrl,
    }] : []),
  ];
  
  return (
    <>
      <TechArticleStructuredData
        headline={res.frontmatter.title}
        description={res.frontmatter.description}
        url={canonicalUrl}
        datePublished={currentDate}
        dateModified={currentDate}
        author={[{ name: "Hey LiSA Team" }]}
        publisher={{
          name: "Hey LiSA",
          url: "https://hey-lisa.com",
          logo: "https://hey-lisa.com/logo_open_graph.jpg",
          sameAs: ["https://x.com/HeyLisaAi", "https://github.com/hey-lisa"]
        }}
        image={{
          url: `${baseUrl}/logo_open_graph.jpg`,
          width: 1200,
          height: 630
        }}
        about="LiSA AI cryptocurrency assistant documentation"
      />
      <BreadcrumbStructuredData itemListElement={breadcrumbItems} />
      
      <div className="flex items-start gap-10">
        <div className="flex-[4.5] pt-10">
          <DocsNotice dict={dict} lang={lang} />
          <DocsBreadcrumb slug={slug} dict={dict} lang={lang} />
          <Typography>
            <h1 className="text-3xl !-mt-1.5">{res.frontmatter.title}</h1>
            <p className="-mt-4 text-muted-foreground text-[16.5px]">
              {res.frontmatter.description}
            </p>
            <div>{res.content}</div>
            <Pagination pathname={slug.join("/")} dict={dict} />
          </Typography>
        </div>
        <Toc path={pathName} dict={dict} />
      </div>
    </>
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { slug = [], lang } = params;
  const slugWithLang = [lang, ...slug];
  const pathName = slugWithLang.join("/");
  const res = await getDocsForSlug(pathName);
  
  if (!res) return {};
  
  const { frontmatter } = res;
  const baseUrl = "https://hey-lisa.com";
  const slugPath = slug.join("/");
  const canonicalUrl = `${baseUrl}/${lang}/docs${slugPath ? `/${slugPath}` : ""}`;
  const pageTitle = `${frontmatter.title} | Documentation | Hey LiSA`;
  
  return {
    title: pageTitle,
    description: frontmatter.description,
    
    // OpenGraph for documentation
    openGraph: {
      title: pageTitle,
      description: frontmatter.description,
      url: canonicalUrl,
      siteName: "Hey LiSA",
      type: "article",
      locale: lang === 'en' ? 'en_US' : 'fr_FR',
      images: [
        {
          url: `${baseUrl}/logo_open_graph.jpg`,
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
    },
    
    // Twitter Cards
    twitter: {
      card: "summary",
      title: pageTitle,
      description: frontmatter.description,
      creator: "@HeyLisaAi",
    },
    
    // Language alternatives and canonical
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `${baseUrl}/en/docs${slugPath ? `/${slugPath}` : ""}`,
        'fr': `${baseUrl}/fr/docs${slugPath ? `/${slugPath}` : ""}`,
      },
    },
    
    // SEO optimization for documentation
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
    
    // Article-specific metadata
    authors: [{ name: "Hey LiSA Team" }],
    category: "Documentation",
  };
}

export function generateStaticParams() {
  return page_routes.map((item) => ({
    slug: item.href.split("/").slice(1),
  }));
}
