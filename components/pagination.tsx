import { getPreviousNext } from "@/lib/markdown";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import LocalizedLink from "./localized-link";
import { Dictionary } from "@/lib/dictionaries";

export default function Pagination({
  pathname,
  dict,
}: {
  pathname: string;
  dict: Dictionary;
}) {
  const res = getPreviousNext(pathname);

  return (
    <div className="grid grid-cols-2 flex-grow sm:py-10 py-7 gap-3">
      <div>
        {res.prev && (
          <LocalizedLink
            className="btn-pagination btn-pagination-prev"
            href={`/docs${res.prev.href}`}
          >
            <span className="btn-pagination-label">
              <ChevronLeftIcon className="w-[1rem] h-[1rem] mr-1" />
              {dict.docs.previous}
            </span>
            <span className="btn-pagination-title">
              {dict.leftbar[res.prev.title as keyof typeof dict.leftbar]}
            </span>
          </LocalizedLink>
        )}
      </div>
      <div>
        {res.next && (
          <LocalizedLink
            className="btn-pagination btn-pagination-next"
            href={`/docs${res.next.href}`}
          >
            <span className="btn-pagination-label">
              {dict.docs.next}
              <ChevronRightIcon className="w-[1rem] h-[1rem] ml-1" />
            </span>
            <span className="btn-pagination-title">
              {dict.leftbar[res.next.title as keyof typeof dict.leftbar]}
            </span>
          </LocalizedLink>
        )}
      </div>
    </div>
  );
}
