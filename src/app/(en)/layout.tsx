import { Fraunces, Inter } from "next/font/google";
import "../globals.css";
import { RootProviders } from "@/components/layout/RootProviders";
import { rootMetadata } from "@/lib/seo/metadata";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = rootMetadata;

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${inter.variable} h-full`}
    >
      <body className="h-full font-sans antialiased">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
