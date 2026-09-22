"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Overview" },
    { href: "/demo", label: "Explore Demo" },
    { href: "/client", label: "Client Studio" },
    { href: "/worker", label: "Contributor" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] bg-white/80 backdrop-blur-md transition-all">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0066cc] flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
              MG
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base tracking-tight text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors">
                Micro-Gig Network
              </span>
              <span className="text-[10px] text-neutral-500 font-medium tracking-wide uppercase">
                Trust-First Creative Protocol
              </span>
            </div>
          </Link>
          <Badge tone="verified" className="hidden sm:inline-flex text-[10px] py-0 px-2">
            Devnet
          </Badge>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]",
                  isActive
                    ? "text-[#0066cc] bg-[#0066cc]/10 font-semibold"
                    : "text-neutral-600 hover:text-[#1d1d1f] hover:bg-neutral-100/70"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action CTAs */}
        <div className="hidden md:flex items-center gap-2.5">
          <Button href="/demo" variant="secondary" size="sm">
            Try Demo
          </Button>
          <Button href="/client" variant="primary" size="sm">
            Create a Gig
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg text-neutral-600 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg transition-opacity">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium",
                    isActive
                      ? "bg-[#0066cc]/10 text-[#0066cc] font-semibold"
                      : "text-neutral-700 hover:bg-neutral-100"
                  )}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            <Button
              href="/demo"
              variant="secondary"
              size="md"
              className="w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore Demo Hub
            </Button>
            <Button
              href="/client"
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create a Gig
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
