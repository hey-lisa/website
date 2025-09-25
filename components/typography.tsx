import { PropsWithChildren } from "react";

export function Typography({ children }: PropsWithChildren) {
  return (
    <div className="prose prose-zinc prose-invert prose-headings:scroll-m-20 w-[85vw] sm:w-full sm:mx-auto pt-2 !min-w-full prose-img:rounded-md prose-img:border !max-w-[500px] prose-img:my-3 prose-h2:my-4 prose-h2:mt-8">
      {children}
    </div>
  );
}
