import { Metadata } from "next";
import { readFile } from "fs/promises";
import path from "path";
import ContactClient from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact | Hey LiSA",
  description: "Get in touch.",
  openGraph: {
    title: "Contact Hey LiSA",
    description: "Get in touch.",
    url: "https://hey-lisa.com/contact",
    siteName: "Hey LiSA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Hey LiSA",
    description: "Get in touch.",
    creator: "@HeyLisaAi",
  },
};

// Function to read PGP key from public file
async function getPGPKey(): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'pgp-key.asc');
    const pgpKey = await readFile(filePath, 'utf-8');
    return pgpKey;
  } catch (error) {
    console.error('Error loading PGP key:', error);
    return 'PGP key temporarily unavailable';
  }
}

export default async function ContactPage() {
  const pgpKey = await getPGPKey();

  return <ContactClient pgpKey={pgpKey} />;
}
