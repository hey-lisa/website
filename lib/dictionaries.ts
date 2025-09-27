import { cache } from "react";
import { Locale } from "./locale";

export type LangProps = { params: Promise<{ lang: Locale }> };

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  fr: () => import("@/dictionaries/fr.json").then((module) => module.default),
};

const getDictionaryUncached = async (locale: Locale) => {
  const dictionary = dictionaries[locale];
  if (!dictionary || typeof dictionary !== 'function') {
    return dictionaries.en();
  }
  return dictionary();
};

export const getDictionary = cache(getDictionaryUncached);

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
