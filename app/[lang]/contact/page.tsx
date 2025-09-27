import { getDictionary, LangProps } from "@/lib/dictionaries";
import PgpCopyButton from "@/components/contact/pgp-copy-button";
import { readFileSync } from "fs";
import { join } from "path";
import { Metadata } from "next";

type PageProps = {} & LangProps;

export default async function ContactPage(props: PageProps) {
  const params = await props.params;
  const { lang } = params;
  // Validate locale
  const validLang = (lang === "en" || lang === "fr") && !lang.includes('.') ? lang : "en";
  const dict = await getDictionary(validLang);
  
  // Load PGP key from public directory
  let pgpKey = "";
  let pgpError = false;
  
  try {
    const pgpPath = join(process.cwd(), "public", "pgp-key.asc");
    pgpKey = readFileSync(pgpPath, "utf-8");
  } catch (error) {
    console.error("Failed to load PGP key:", error);
    pgpError = true;
  }

  return (
    <div className="container max-w-4xl py-16">
      {/* Email */}
      <div className="mb-8">
        <a 
          href="mailto:lisa@hey-lisa.com"
          className="text-lg font-mono hover:underline"
        >
          lisa@hey-lisa.com
        </a>
      </div>

      {/* PGP Key */}
      {pgpError ? (
        <div className="text-red-500">
          Failed to load PGP key.
        </div>
      ) : (
        <div>
          <div className="mb-2">
            <PgpCopyButton pgpKey={pgpKey} dict={dict} />
          </div>
          
          <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {pgpKey}
          </pre>
        </div>
      )}
    </div>
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { lang } = params;
  
  const dict = await getDictionary(lang);
  const baseUrl = "https://hey-lisa.com";
  const canonicalUrl = `${baseUrl}/${lang}/contact`;
  const pageTitle = `${dict.contact.title} | Hey LiSA`;
  
  return {
    title: pageTitle,
    description: dict.contact.description,
    
    // OpenGraph for contact page
    openGraph: {
      title: pageTitle,
      description: dict.contact.description,
      url: canonicalUrl,
      siteName: "Hey LiSA",
      type: "website",
      locale: lang === 'en' ? 'en_US' : 'fr_FR',
      images: [
        {
          url: `${baseUrl}/logo_open_graph.jpg`,
          width: 1200,
          height: 630,
          alt: dict.contact.title,
        },
      ],
    },
    
    // Twitter Cards
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: dict.contact.description,
      creator: "@HeyLisaAi",
    },
    
    // Language alternatives and canonical
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `${baseUrl}/en/contact`,
        'fr': `${baseUrl}/fr/contact`,
      },
    },
    
    // SEO optimization
    robots: {
      index: true,
      follow: true,
    },
  };
}
