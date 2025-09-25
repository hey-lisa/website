import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Space_Mono, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/footer";
import { getDictionary } from "@/lib/dictionaries";
import { ClientDictionary } from "@/components/contexts/dictionary-provider";
import { locales } from "@/lib/locale";
import { OrganizationStructuredData, WebsiteStructuredData } from "@/components/seo/structured-data";
import { GoogleAnalytics } from '@next/third-parties/google';
import "@/styles/globals.css";

const sansFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: "400",
});

const monoFont = Space_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: "400",
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");
  const baseUrl = "https://hey-lisa.com";
  
  return {
    title: dict.metadata.title,
    metadataBase: new URL(baseUrl),
    description: dict.metadata.description,
    authors: [{ name: "Hey LiSA Team" }],
    creator: "Hey LiSA",
    publisher: "Hey LiSA",
    
    // OpenGraph for social sharing
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      url: `${baseUrl}/${lang}`,
      siteName: "Hey LiSA",
      type: "website",
      locale: lang === 'en' ? 'en_US' : 'fr_FR',
      images: [
        {
          url: `${baseUrl}/logo_open_graph.jpg`,
          width: 1200,
          height: 630,
          alt: dict.metadata.title,
        },
      ],
    },
    
    // Twitter Cards
    twitter: {
      card: "summary_large_image",
      title: dict.metadata.title,
      description: dict.metadata.description,
      creator: "@HeyLisaAi",
      images: [`${baseUrl}/logo_open_graph.jpg`],
    },
    
    // Language alternatives (hreflang)
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'en': `${baseUrl}/en`,
        'fr': `${baseUrl}/fr`,
      },
    },
    
    // Robots and indexing
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

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");
  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${sansFont.variable} ${monoFont.variable} font-regular antialiased tracking-wide min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <OrganizationStructuredData />
        <WebsiteStructuredData lang={lang} />
        <ClientDictionary dict={dict}>
          <Navbar dict={dict} />
          <main className="sm:container mx-auto w-[90vw] h-auto scroll-smooth flex-grow">
            {children}
          </main>
          <Footer dict={dict} />
        </ClientDictionary>
        
        {/* Google Analytics Integration */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}
