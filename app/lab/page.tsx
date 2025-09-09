import LabClient from "@/components/lab/LabClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab | Hey LiSA",
  description: "Projects from LiSA's labs.",
  openGraph: {
    title: "LiSA Lab - Projects",
    description: "Projects from LiSA's labs.",
    url: "https://hey-lisa.com/lab",
    siteName: "Hey LiSA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LiSA Lab - Projects", 
    description: "Projects from LiSA's labs.",
    creator: "@HeyLisaAi",
  },
};

export default function LabPage() {
  return <LabClient />;
}




