
import { GithubIcon, TwitterIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import LisaLogo from "@/components/LisaLogo";
import { buttonVariants } from "./ui/button";
import Anchor from "./anchor";
import { SheetLeftbar } from "./leftbar";
import { page_routes } from "@/lib/routes-config";
import { SheetClose } from "@/components/ui/sheet";

export const NAVLINKS = [
  {
    title: "Docs",
    href: `/docs${page_routes[0].href}`,
  },
  {
    title: "HQ",
    href: "/hq",
  },
  {
    title: "Lab",
    href: "/lab",
  },
];


export function Navbar() {
  return (
    <nav className="w-full border-b h-16 sticky top-0 z-50 bg-background">
      <div className="sm:container mx-auto w-[95vw] h-full flex items-center justify-between md:gap-2">
        <div className="flex items-center sm:gap-5 gap-2.5">
          <SheetLeftbar />
          {/* Logo visible on all screen sizes, but positioned differently */}
          <Link href="/" className="md:hidden flex navbar-logo group">
            <LisaLogo />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="md:flex hidden navbar-logo group">
              <LisaLogo />
            </Link>
            <div className="md:flex hidden items-center gap-4 text-sm font-medium text-muted-foreground">
              <NavMenu />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <Link
            href="https://github.com/hey-lisa"
            className={`${buttonVariants({
              variant: "ghost",
              size: "icon",
            })} hover:!text-[var(--lisa-green)] hover:![text-shadow:0_0_6px_var(--lisa-green-dim)]`}
          >
            <GithubIcon className="h-[1.1rem] w-[1.1rem]" />
          </Link>
          <Link
            href="https://x.com/HeyLisaAi"
            className={`${buttonVariants({
              variant: "ghost",
              size: "icon",
            })} hover:!text-[var(--lisa-green)] hover:![text-shadow:0_0_6px_var(--lisa-green-dim)]`}
          >
            <TwitterIcon className="h-[1.1rem] w-[1.1rem]" />
          </Link>
          <Link
            href="/contact"
            className={`${buttonVariants({
              variant: "ghost",
              size: "icon",
            })} hover:!text-[var(--lisa-green)] hover:![text-shadow:0_0_6px_var(--lisa-green-dim)]`}
            title="Secure Contact"
          >
            <MailIcon className="h-[1.1rem] w-[1.1rem]" />
          </Link>
        </div>
      </div>
    </nav>
  );
}


export function NavMenu({ isSheet = false }) {
  return (
    <>
      {NAVLINKS.map((item) => {
        const Comp = (
          <Anchor
            key={item.title + item.href}
            activeClassName="!text-primary font-medium font-semibold"
            absolute
            className="flex items-center gap-1 sm:text-sm text-[14.5px] text-stone-300/85"
            href={item.href}
          >
            {item.title}
          </Anchor>
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
