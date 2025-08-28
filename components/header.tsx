"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isEventPageOrSpotListPage = pathname.startsWith("/event") || pathname.startsWith("/spot-list");

  return (
    <header className={`fixed top-0 left-0 right-0 z-10 border-b ${isEventPageOrSpotListPage ? "bg-[var(--color-header-background)]" : "bg-[var(--color-background)]"}`}>
      <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <Link href="/" className="text-lg font-bold text-[var(--color-header-text)]">
                GourCommu
            </Link>
        </div>
      </nav>
    </header>
  );
}
