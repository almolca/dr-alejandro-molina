import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { ConsentBanner } from "@/components/ui/ConsentBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { personSchema, physicianSchema } from "@/lib/seo/json-ld";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${inter.variable} h-full`}
    >
      <body className="h-full font-sans antialiased">
        <JsonLd data={[personSchema(), physicianSchema()]} />
        <MotionProvider>
          <ConsentBanner />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
