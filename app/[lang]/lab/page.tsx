import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locale";
import LabClient from "@/components/lab/LabClient";
import { Metadata } from "next";

interface LabPageProps {
  params: Promise<{
    lang: Locale;
  }>;
}

export async function generateMetadata({
  params,
}: LabPageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.lab.title,
    description: dict.lab.description,
  };
}

export default async function LabPage({ params }: LabPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return <LabClient dict={dict} />;
}
