'use client';

import Link from "next/link"
import { usePathname } from 'next/navigation'

const SiteHeader = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Division Orderly</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className={`${
                pathname === '/dashboard'
                  ? 'border-blue-500 text-foreground/80'
                  : 'border-transparent text-foreground/50 hover:border-foreground/30 hover:text-foreground/70'
              } inline-flex items-center px-1 pt-1 border-b-2`}
            >
              Dashboard
            </Link>
            <Link
              href="/sign"
              className={`${
                pathname === '/sign'
                  ? 'border-blue-500 text-foreground/80'
                  : 'border-transparent text-foreground/50 hover:border-foreground/30 hover:text-foreground/70'
              } inline-flex items-center px-1 pt-1 border-b-2`}
            >
              Sign
            </Link>
            <Link
              href="/entities"
              className={`${
                pathname === '/entities'
                  ? 'border-blue-500 text-foreground/80'
                  : 'border-transparent text-foreground/50 hover:border-foreground/30 hover:text-foreground/70'
              } inline-flex items-center px-1 pt-1 border-b-2`}
            >
              Entities
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader;
