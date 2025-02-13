"use client";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="py-8 lg:py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <p className="font-medium text-lg sm:text-xl">Legal</p>
              <ul className="mt-6 space-y-4 text-sm sm:text-base">
                <li>
                  <Link href="/privacy" className="transition hover:opacity-75">
                    Privacy Policy & Terms
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="transition hover:opacity-75">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guidelines"
                    className="transition hover:opacity-75"
                  >
                    Community Guidelines
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-lg sm:text-xl">The Stack</p>
              <ul className="mt-6 space-y-4 text-sm sm:text-base">
                <li>
                  <Link
                    href="https://www.linkedin.com/in/arslankamchybekov/"
                    target="_blank"
                    className="flex items-center gap-2 transition hover:opacity-75"
                  >
                    <Linkedin size={16} />
                    Arslan Kamchybekov
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.linkedin.com/in/akuppili/"
                    target="_blank"
                    className="flex items-center gap-2 transition hover:opacity-75"
                  >
                    <Linkedin size={16} />
                    Anirudh Kupili
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.linkedin.com/in/isaac-alazar-17b949311/"
                    target="_blank"
                    className="flex items-center gap-2 transition hover:opacity-75"
                  >
                    <Linkedin size={16} />
                    Isaac Alazar
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.linkedin.com/in/joshjonathanjungjr/"
                    target="_blank"
                    className="flex items-center gap-2 transition hover:opacity-75"
                  >
                    <Linkedin size={16} />
                    Josh Jung
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.linkedin.com/in/pranav-shridhar/"
                    target="_blank"
                    className="flex items-center gap-2 transition hover:opacity-75"
                  >
                    <Linkedin size={16} />
                    Pranav Shridhar
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t pt-8">
            <p className="text-xs text-muted-foreground sm:text-sm">
              &copy; {new Date().getFullYear()} Raydar. The Stack. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
