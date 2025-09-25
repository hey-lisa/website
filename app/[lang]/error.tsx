"use client";

import { useDictionary } from "@/components/contexts/dictionary-provider";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const dict = useDictionary();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="px-2 sm:py-28 py-36 flex flex-col gap-4 items-center">
      <div className="text-center flex flex-col items-center justify-center w-fit gap-2">
        <h2 className="text-7xl font-bold pr-1">{dict.error.oops}</h2>
        <p className="text-muted-foreground text-md font-medium">
          {dict.error.something_went_wrong} {":`("}
        </p>
        <p>{dict.error.sub_text}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="btn-error-reload"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          {dict.error.reload_page}
        </button>
        <Link href="/" className="btn-error-home">
          {dict.error.back_to_homepage}
        </Link>
      </div>
    </div>
  );
}
