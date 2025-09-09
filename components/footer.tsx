
export function Footer() {
  return (
    <footer className="py-3">
      <div className="sm:container mx-auto w-[95vw]">
        <div className="h-12 flex items-center justify-center">
          <div className="flex items-center gap-2 text-[11px] tracking-wide">
            <span className="text-zinc-300/90">crafted with</span>
            <span className="lisa-heart" aria-hidden="true">♥</span>
            <span className="text-zinc-300/90">by</span>
            <a
              href="https://x.com/0xLalice"
              target="_blank"
              rel="noreferrer"
              className="lisa-link"
            >0xLalice</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

