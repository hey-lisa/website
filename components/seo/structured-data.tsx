import Script from 'next/script';

interface OrganizationSchema {
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
}

interface ArticleSchema {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    url?: string;
  }[];
  publisher: OrganizationSchema;
  image: {
    url: string;
    width: number;
    height: number;
  };
  articleSection?: string;
}

interface TechArticleSchema extends Omit<ArticleSchema, 'articleSection'> {
  about?: string;
}

interface BreadcrumbSchema {
  itemListElement: {
    position: number;
    name: string;
    item: string;
  }[];
}

// Organization schema for LiSA
export function OrganizationStructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hey LiSA",
    "alternateName": "LiSA",
    "url": "https://hey-lisa.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://hey-lisa.com/logo_open_graph.jpg",
    },
    "sameAs": [
      "https://x.com/HeyLisaAi",
      "https://github.com/hey-lisa"
    ],
    "description": "Intelligence for ur wallets. Non-custodial crypto assistant.",
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationData),
      }}
    />
  );
}

// Documentation article schema
export function TechArticleStructuredData({ 
  headline, 
  description, 
  url, 
  datePublished, 
  dateModified,
  about 
}: TechArticleSchema) {
  const techArticleData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": headline,
    "description": description,
    "url": url,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": {
      "@type": "Organization",
      "name": "Hey LiSA Team",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hey LiSA",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hey-lisa.com/logo_open_graph.jpg",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
    "about": about || "LiSA AI cryptocurrency assistant documentation",
  };

  return (
    <Script
      id="tech-article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(techArticleData),
      }}
    />
  );
}

// Blog article schema
export function NewsArticleStructuredData({ 
  headline, 
  description, 
  url, 
  datePublished, 
  dateModified,
  author,
  image,
  articleSection = "Blog"
}: ArticleSchema) {
  const newsArticleData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": headline,
    "description": description,
    "url": url,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": author.map(a => ({
      "@type": "Person",
      "name": a.name,
      "url": a.url,
    })),
    "publisher": {
      "@type": "Organization",
      "name": "Hey LiSA",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hey-lisa.com/logo_open_graph.jpg",
      },
    },
    "image": {
      "@type": "ImageObject",
      "url": image.url,
      "width": image.width,
      "height": image.height,
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
    "articleSection": articleSection,
    "isPartOf": {
      "@type": "WebSite",
      "name": "LiSA HQ",
      "url": "https://hey-lisa.com/hq",
    },
  };

  return (
    <Script
      id="news-article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(newsArticleData),
      }}
    />
  );
}

// Breadcrumb schema
export function BreadcrumbStructuredData({ itemListElement }: BreadcrumbSchema) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement.map(item => ({
      "@type": "ListItem",
      "position": item.position,
      "name": item.name,
      "item": item.item,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbData),
      }}
    />
  );
}

// Website schema for homepage
export function WebsiteStructuredData({ lang }: { lang: string }) {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hey LiSA",
    "alternateName": "LiSA",
    "url": `https://hey-lisa.com/${lang}`,
    "description": lang === 'en' 
      ? "Intelligence for ur wallets. Non-custodial crypto assistant."
      : "Intelligence pour vos portefeuilles. Assistant crypto sans garde.",
    "publisher": {
      "@type": "Organization",
      "name": "Hey LiSA",
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://hey-lisa.com/${lang}/docs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    "inLanguage": lang === 'en' ? 'en-US' : 'fr-FR',
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteData),
      }}
    />
  );
}
