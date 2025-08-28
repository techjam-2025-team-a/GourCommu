import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background border-b">
      <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <Link href="/" className="text-lg font-bold">
                GourCommu
            </Link>
        </div>
      </nav>
    </header>
  );
}
