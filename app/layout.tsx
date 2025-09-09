import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import { Space_Mono, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/footer";
import { GoogleAnalytics } from '@next/third-parties/google';
import "@/styles/index.css";

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

export const metadata: Metadata = {
  title: "Hey LiSA - Intelligence for Your Wallet | AI Web3 Agent",
  metadataBase: new URL("https://hey-lisa.com/"),
  description: "Intelligence for ur wallets. Non-custodial crypto assistant.",
  authors: [{ name: "Hey LiSA Team" }],
  creator: "Hey LiSA",
  publisher: "Hey LiSA",
  openGraph: {
    title: "Hey LiSA - Intelligence for Your Wallet",
    description: "Intelligence for ur wallets. Non-custodial crypto assistant.",
    url: "https://hey-lisa.com",
    siteName: "Hey LiSA",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hey LiSA - Intelligence for Your Wallet",
    description: "Intelligence for ur wallets. Non-custodial crypto assistant.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Hey LiSA",
              "description": "LiSA, intelligence for your wallet. AI Web3 Agent powered by $LISA token.",
              "url": "https://hey-lisa.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://hey-lisa.com/opengraph-image.jpg"
              },
              "sameAs": [
                "https://twitter.com/HeyLisaAi",
                "https://x.com/HeyLisaAi",
                "https://github.com/hey-lisa"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "en"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Hey LiSA",
              "description": "AI Web3 Agent powered by $LISA token. Swap, bridge, and manage your DeFi, all from chat. Non custodial.",
              "url": "https://hey-lisa.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://hey-lisa.com/docs?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`${sansFont.variable} ${monoFont.variable} font-regular antialiased tracking-wide`}
        suppressHydrationWarning
      >

          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="sm:container mx-auto w-[90vw] h-auto scroll-smooth flex-1">
              {children}
            </main>
            <Footer />
          </div>
          
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}
