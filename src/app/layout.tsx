import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Micro-Gig Network",
  description: "A trust-first creative marketplace foundation for indie game studios and contributors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased text-foreground flex flex-col">
        <div className="flex min-h-screen flex-col">
          <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-center text-xs font-medium text-amber-800">
            <strong>Devnet and test assets only.</strong> No real funds or mainnet transactions are used.
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
