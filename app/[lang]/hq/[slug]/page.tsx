import { Metadata } from "next";
import { Typography } from "@/components/typography";
import { Author, getAllBlogStaticPaths, getBlogForSlug } from "@/lib/markdown";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { getDictionary } from "@/lib/dictionaries";
import LocalizedLink from "@/components/localized-link";
import { NewsArticleStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data";

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { slug, lang } = params;
  
  const res = await getBlogForSlug(slug, lang as "en" | "fr");
  if (!res) return {};
  
  const { frontmatter } = res;
  const baseUrl = "https://hey-lisa.com";
  const canonicalUrl = `${baseUrl}/${lang}/hq/${slug}`;
  const pageTitle = `${frontmatter.title} | Hey LiSA`;
  
  // Format publication date
  const publishDate = new Date(frontmatter.date.split('-').reverse().join('-')).toISOString();
  
  // Get cover image URL
  const coverImageUrl = frontmatter.cover.startsWith('http') 
    ? frontmatter.cover 
    : `${baseUrl}${frontmatter.cover}`;
  
  return {
    title: pageTitle,
    description: frontmatter.description,
    
    // OpenGraph for articles/blog posts
    openGraph: {
      title: pageTitle,
      description: frontmatter.description,
      url: canonicalUrl,
      siteName: "Hey LiSA",
      type: "article",
      locale: lang === 'en' ? 'en_US' : 'fr_FR',
      publishedTime: publishDate,
      authors: frontmatter.authors.map((author: Author) => author.username),
      images: [
        {
          url: coverImageUrl,
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
    },
    
    // Twitter Cards
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: frontmatter.description,
      creator: "@HeyLisaAi",
      images: [coverImageUrl],
    },
    
    // Language alternatives and canonical
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `${baseUrl}/en/hq/${slug}`,
        'fr': `${baseUrl}/fr/hq/${slug}`,
      },
    },
    
    // SEO optimization for articles
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
    authors: frontmatter.authors.map((author: Author) => ({ name: author.username })),
    category: "Blog",
  };
}

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const val = await getAllBlogStaticPaths(lang as "en" | "fr");
  if (!val) return [];
  return val.map((it) => ({ slug: it }));
}

export default async function BlogPage(props: PageProps) {
  const params = await props.params;

  const { slug, lang } = params;

  const res = await getBlogForSlug(slug, lang as "en" | "fr");
  // Validate locale
  const validLang = (lang === "en" || lang === "fr") && !lang.includes('.') ? lang : "en";
  const dict = await getDictionary(validLang);

  if (!res) notFound();
  
  const baseUrl = "https://hey-lisa.com";
  const canonicalUrl = `${baseUrl}/${lang}/hq/${slug}`;
  const publishDate = new Date(res.frontmatter.date.split('-').reverse().join('-')).toISOString();
  const coverImageUrl = res.frontmatter.cover.startsWith('http') 
    ? res.frontmatter.cover 
    : `${baseUrl}${res.frontmatter.cover}`;
  
  // Generate breadcrumb data
  const breadcrumbItems = [
    {
      position: 1,
      name: "Hey LiSA",
      item: `${baseUrl}/${lang}`,
    },
    {
      position: 2,
      name: "HQ",
      item: `${baseUrl}/${lang}/hq`,
    },
    {
      position: 3,
      name: res.frontmatter.title,
      item: canonicalUrl,
    },
  ];
  
  return (
    <>
      <NewsArticleStructuredData
        headline={res.frontmatter.title}
        description={res.frontmatter.description}
        url={canonicalUrl}
        datePublished={publishDate}
        dateModified={publishDate}
        author={res.frontmatter.authors.map((author: Author) => ({
          name: author.username,
          url: author.handleUrl,
        }))}
        publisher={{
          name: "Hey LiSA",
          url: "https://hey-lisa.com",
          logo: "https://hey-lisa.com/logo_open_graph.jpg",
          sameAs: ["https://x.com/HeyLisaAi", "https://github.com/hey-lisa"]
        }}
        image={{
          url: coverImageUrl,
          width: 1200,
          height: 630,
        }}
        articleSection="HQ"
      />
      <BreadcrumbStructuredData itemListElement={breadcrumbItems} />
      
      <div className="lg:w-[60%] sm:[95%] md:[75%] mx-auto">
        <LocalizedLink
          className="btn-back-link"
          href="/hq"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1.5" /> {dict.blog.back_to_blog}
        </LocalizedLink>
      <div className="flex flex-col gap-3 pb-7 w-full mb-2">
        <p className="text-muted-foreground text-sm">
          {formatDate(res.frontmatter.date)}
        </p>
        <h1 className="sm:text-4xl text-3xl font-extrabold">
          {res.frontmatter.title}
        </h1>
        <div className="mt-6 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">{dict.blog.posted_by}</p>
          <Authors authors={res.frontmatter.authors} />
        </div>
      </div>
      <div className="!w-full">
        <div className="w-full mb-7">
          <Image
            src={res.frontmatter.cover}
            alt="cover"
            width={700}
            height={400}
            className="w-full h-[400px] rounded-md border object-cover"
          />
        </div>
        <Typography>{res.content}</Typography>
      </div>
    </div>
    </>
  );
}

function Authors({ authors }: { authors: Author[] }) {
  return (
    <div className="flex items-center gap-8 flex-wrap">
      {authors.map((author) => {
        return (
          <Link
            href={author.handleUrl}
            className="flex items-center gap-2 no-underline"
            key={author.username}
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>
                {author.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <p className="text-sm font-medium">{author.username}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
