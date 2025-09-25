import Link from "next/link";
import { Dictionary } from "@/lib/dictionaries";

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="w-full py-6">
      <div className="container flex justify-center">
        <p className="text-gray-400 text-sm text-center">
          {dict.footer.crafted_with} <span className="heart">♥</span> {dict.footer.by}{" "}
          <Link
            className="branded-link"
            href="https://x.com/0xLalice"
            target="_blank"
            rel="noopener noreferrer"
          >
            0xLalice
          </Link>
        </p>
      </div>
    </footer>
  );
}

