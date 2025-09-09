import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import {
  Author,
  getAllHQStaticPaths,
  getCompiledHQForSlug,
  getHQFrontmatter,
} from "@/lib/markdown";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { slug } = params;
  const res = await getHQFrontmatter(slug);
  if (!res) return {};
  
  const { title, description, authors, date, cover } = res;
  const pageTitle = `HQ | Hey LiSA`;
  const canonicalUrl = `https://hey-lisa.com/hq/${slug}`;
  const publishDate = new Date(date.split('-').reverse().join('-')).toISOString();
  
  return {
    title: pageTitle,
    description: description || "Updates and thoughts from the team.",
    canonical: canonicalUrl,
    authors: authors.map(author => ({ name: author.username })),
    publishedTime: publishDate,
    openGraph: {
      title: pageTitle,
      description: description || "Updates and thoughts from the team.",
      url: canonicalUrl,
      siteName: "Hey LiSA",
      type: "article",
      locale: "en_US",
      publishedTime: publishDate,
      authors: authors.map(author => author.username),
      images: [
        {
          url: cover.startsWith('http') ? cover : `https://hey-lisa.com${cover}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: description || "Updates and thoughts from the team.",
      creator: "@HeyLisaAi",
      images: [cover.startsWith('http') ? cover : `https://hey-lisa.com${cover}`],
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

export async function generateStaticParams() {
  const val = await getAllHQStaticPaths();
  if (!val) return [];
  return val.map((it) => ({ slug: it }));
}

export default async function HQPage(props: PageProps) {
  const params = await props.params;

  const { slug } = params;

  const res = await getCompiledHQForSlug(slug);
  if (!res) notFound();
  
  const publishDate = new Date(res.frontmatter.date.split('-').reverse().join('-')).toISOString();
  const canonicalUrl = `https://hey-lisa.com/hq/${slug}`;
  const imageUrl = res.frontmatter.cover.startsWith('http') 
    ? res.frontmatter.cover 
    : `https://hey-lisa.com${res.frontmatter.cover}`;
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": res.frontmatter.title,
            "description": res.frontmatter.description,
            "url": canonicalUrl,
            "datePublished": publishDate,
            "dateModified": publishDate,
            "author": res.frontmatter.authors.map(author => ({
              "@type": "Person",
              "name": author.username,
              "url": author.handleUrl,
            })),
            "publisher": {
              "@type": "Organization",
              "name": "Hey LiSA",
              "logo": {
                "@type": "ImageObject",
                "url": "https://hey-lisa.com/opengraph-image.jpg",
              },
            },
            "image": {
              "@type": "ImageObject",
              "url": imageUrl,
              "width": 1200,
              "height": 630,
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl,
            },
            "isPartOf": {
              "@type": "WebSite",
              "name": "LiSA HQ",
              "url": "https://hey-lisa.com/hq",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://hey-lisa.com",
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "LiSA HQ",
                "item": "https://hey-lisa.com/hq",
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": res.frontmatter.title,
                "item": canonicalUrl,
              },
            ],
          }),
        }}
      />
      <div className="lg:w-[60%] sm:[95%] md:[75%] mx-auto">
      <Link
        className={buttonVariants({
          variant: "link",
          className: "!mx-0 !px-0 mb-7 !-ml-1 ",
        })}
        href="/hq"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1.5" /> Back to HQ
      </Link>
      <div className="flex flex-col gap-3 pb-7 w-full mb-2">
        <p className="text-muted-foreground text-sm">
          {formatDate(res.frontmatter.date)}
        </p>
        <h1 className="sm:text-3xl text-2xl font-extrabold">
          {res.frontmatter.title}
        </h1>
        <div className="mt-6 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">Posted by</p>
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
            className="flex items-center gap-2"
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
              <p className="font-code text-[13px] text-muted-foreground">
                @{author.handle}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
