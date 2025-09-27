import LocalizedLink from "@/components/localized-link";
import { getDictionary, LangProps } from "@/lib/dictionaries";
import { page_routes } from "@/lib/routes-config";

export default async function Home({ params }: LangProps) {
  const { lang } = await params;
  // Validate locale
  const validLang = (lang === "en" || lang === "fr") && !lang.includes('.') ? lang : "en";
  const dict = await getDictionary(validLang);
  return (
    <div className="flex flex-col items-center justify-center text-center px-2">
      <h1 className="text-xl font-semibold mb-8 sm:text-2xl text-foreground">
        {dict.home.main_header}
      </h1>
      <div className="flex flex-row items-center gap-5">
        <LocalizedLink
          href={`/docs${page_routes[0].href}`}
          className="btn-content"
        >
          {dict.home.get_started}
        </LocalizedLink>
      </div>
    </div>
  );
}
