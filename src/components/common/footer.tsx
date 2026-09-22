import * as React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-[#f5f5f7] text-[#333333] transition-colors">
      <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Thesis */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#0066cc] text-white flex items-center justify-center font-bold text-xs">
                MG
              </div>
              <span className="font-semibold text-sm tracking-tight text-[#1d1d1f]">
                Micro-Gig Network
              </span>
            </div>
            <p className="text-xs text-[#7a7a7a] leading-relaxed">
              A trust-first demo foundation for locked terms, private deliverables, planned escrow, and future verifiable receipts.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1d1d1f]">
              Platform Shells
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-[#333333] hover:text-[#0066cc] transition-colors">
                  Overview & Architecture
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-[#333333] hover:text-[#0066cc] transition-colors">
                  Explore Demo Hub
                </Link>
              </li>
              <li>
                <Link href="/client" className="text-[#333333] hover:text-[#0066cc] transition-colors">
                  Studio Portal (/client)
                </Link>
              </li>
              <li>
                <Link href="/worker" className="text-[#333333] hover:text-[#0066cc] transition-colors">
                  Contributor Portal (/worker)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1d1d1f]">
              Architecture Standards
            </h4>
            <ul className="space-y-2 text-xs text-[#7a7a7a]">
              <li>Locked Terms before funding</li>
              <li>Private off-chain deliverables</li>
              <li>Atomic integer token accounting</li>
              <li>Future verifiable receipt direction</li>
              <li>Advisory-only human-in-loop AI</li>
            </ul>
          </div>

          {/* Col 4: Environment Disclosure */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1d1d1f] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>Network Environment</span>
            </h4>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 space-y-1">
              <div className="font-semibold">Solana Devnet Hackathon MVP</div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Operating strictly with simulated assets and test tokens. No real-world funds, fiat deposits, or mainnet transactions are accepted.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal row */}
        <div className="pt-8 border-t border-black/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7a7a7a]">
          <p>
            Micro-Gig Network &copy; 2026. Built for Best Product &amp; Business competition.
          </p>
          <p className="text-center sm:text-right">
            The IP License Receipt is cryptographic technical evidence and does not constitute automatic legal copyright ownership.
          </p>
        </div>
      </div>
    </footer>
  );
}
