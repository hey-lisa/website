"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo, NavMenu } from "./navbar";
import { AlignLeftIcon } from "lucide-react";
import { DialogTitle } from "./ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import DocsMenu from "./docs-menu";
import { Dictionary } from "@/lib/dictionaries";

export function Leftbar() {
  return (
    <aside className="md:flex hidden flex-[1.5] min-w-[238px] sticky top-16 flex-col h-[93.75vh] overflow-y-auto">
      <ScrollArea className="py-4">
        <DocsMenu />
      </ScrollArea>
    </aside>
  );
}

export function SheetLeftbar({ dict }: { dict: Dictionary }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="btn-mobile-menu">
          <AlignLeftIcon />
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 px-0" side="left">
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <SheetDescription className="sr-only">
          Navigation menu for mobile devices
        </SheetDescription>
        <SheetHeader className="sr-only">
          Menu
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-2.5 mx-2 px-5 pt-4">
            <SheetClose className="navbar-link flex items-center gap-1 text-stone-300/85" asChild>
              <Logo />
            </SheetClose>
          </div>
          <div className="flex flex-col gap-2.5 mt-3 mx-2 px-5">
            <NavMenu isSheet dict={dict} />
          </div>
          <div className="mx-2 px-5">
            <DocsMenu isSheet />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
