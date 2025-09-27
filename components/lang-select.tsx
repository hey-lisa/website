"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LanguagesIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const available_locales = [
  {
    title: "🇺🇸 English",
    code: "en",
  },
  {
    title: "🇫🇷 Français",
    code: "fr",
  },
];

export default function LangSelect() {
  const pathname = usePathname();
  const router = useRouter();

  // Extract current language from pathname
  const currentLanguage = pathname.split('/')[1] || 'en';

  function handleChangeLocale(newLocale: string) {
    router.push(pathname.replace(/\/[a-z]{2}/, `/${newLocale}`));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="btn-lang-select">
          <LanguagesIcon className="h-[1.1rem] w-[1.1rem]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dropdown-lang-glass">
        {available_locales.map((locale) => {
          const isActive = locale.code === currentLanguage;
          return (
            <DropdownMenuItem
              onClick={() => handleChangeLocale(locale.code)}
              key={locale.title}
              className={
                isActive 
                  ? "dropdown-lang-item dropdown-lang-item-active"
                  : "dropdown-lang-item"
              }
            >
              {locale.title}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
