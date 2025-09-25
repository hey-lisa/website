import { GithubIcon, TwitterIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { SheetLeftbar } from "./leftbar";
import { page_routes } from "@/lib/routes-config";
import { SheetClose } from "@/components/ui/sheet";
import LangSelect from "./lang-select";
import { Dictionary } from "@/lib/dictionaries";
import LocalizedLink from "./localized-link";
import LisaLogo from "./lisa-logo";

export const NAVLINKS = [
  {
    title: "docs",
    href: `/docs${page_routes[0].href}`,
    absolute: true,
  },
  {
    title: "hq",
    href: "/hq",
  },
  {
    title: "lab",
    href: "/lab",
  },
];

export function Navbar({ dict }: { dict: Dictionary }) {
  return (
    <nav className="w-full header-border h-16 sticky top-0 z-50 bg-background">
      <div className="sm:container mx-auto w-[95vw] h-full flex items-center justify-between md:gap-2">
        <div className="flex items-center gap-5">
          <SheetLeftbar dict={dict} />
          <div className="flex items-center gap-6">
            <div className="flex">
              <Logo />
            </div>
            <div className="lg:flex hidden items-center gap-4 text-sm font-medium text-gray-400">
              <NavMenu dict={dict} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex ml-2.5 sm:ml-0">
              <LangSelect />
              <Link
                href="https://github.com/hey-lisa"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
              >
                <GithubIcon className="h-[1.1rem] w-[1.1rem]" />
              </Link>
              <Link
                href="https://x.com/HeyLisaAi"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
              >
                <TwitterIcon className="h-[1.1rem] w-[1.1rem]" />
              </Link>
              <LocalizedLink
                href="/contact"
                className="btn-icon"
                activeClassName="btn-icon-active"
              >
                <MailIcon className="h-[1.1rem] w-[1.1rem]" />
              </LocalizedLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Logo() {
  return (
    <LocalizedLink href="/" className="flex items-center gap-2.5">
      <h2 className="text-md font-bold font-code">
        <LisaLogo />
      </h2>
    </LocalizedLink>
  );
}

export function NavMenu({
  isSheet = false,
  dict,
}: {
  isSheet?: boolean;
  dict: Dictionary;
}) {
  return (
    <>
      {NAVLINKS.map((item) => {
        const Comp = (
          <LocalizedLink
            key={item.title + item.href}
            className="navbar-link flex items-center gap-1 text-stone-300/85"
            activeClassName="navbar-active-link"
            href={item.href}
            absolute={item.absolute}
          >
            {dict.navbar.links[item.title as keyof typeof dict.navbar.links]}
          </LocalizedLink>
        );
        return isSheet ? (
          <SheetClose key={item.title + item.href} asChild>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        );
      })}
    </>
  );
}
