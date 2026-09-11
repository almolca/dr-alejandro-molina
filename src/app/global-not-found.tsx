import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist or hasn't been published yet.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="flex h-full flex-col items-center justify-center gap-4 bg-background px-gutter text-center font-sans antialiased">
        <p className="text-eyebrow font-medium uppercase tracking-[0.2em] text-accent-strong">404</p>
        <h1 className="font-display text-display-lg text-foreground">Page not found</h1>
        <p className="max-w-md text-body-lg text-muted-foreground">
          The page you&rsquo;re looking for doesn&rsquo;t exist or hasn&rsquo;t been published yet.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-sm bg-foreground px-6 text-sm font-medium text-background shadow-sm transition-colors hover:bg-foreground/90"
        >
          Return home
        </Link>
      </body>
    </html>
  );
}
