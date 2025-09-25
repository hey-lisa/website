import { notFound } from "next/navigation";

// This catch-all route ensures any unmatched paths trigger the not-found page
export default function CatchAllPage() {
  // Always trigger not found for any unmatched route
  notFound();
}
