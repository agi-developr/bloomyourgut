"use client"

import Link from "next/link"
import { useState } from "react"
import { Leaf, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"

const navLinks = [
  { href: "/articles", label: "Articles" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-green-500" />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-green-600">Bloom</span>
            <span className="text-gray-900">YourGut</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-green-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button
            asChild
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="flex items-center gap-2 px-2 pt-2">
              <Leaf className="h-5 w-5 text-green-500" />
              <span className="font-bold">
                <span className="text-green-600">Bloom</span>
                <span className="text-gray-900">YourGut</span>
              </span>
            </SheetTitle>
            <nav className="mt-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-600"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 border-t pt-4">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/sign-in" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button
                  className="mt-2 w-full bg-green-600 text-white hover:bg-green-700"
                  asChild
                >
                  <Link href="/sign-up" onClick={() => setOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
