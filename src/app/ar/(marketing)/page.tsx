import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { homeContentAr } from "@/content/ar/home";
import { HomePageTemplate } from "@/components/templates/HomePageTemplate";

export const metadata: Metadata = buildMetadata({
  title: "د. أليخاندرو مولينا — استشاري أمراض المسالك البولية والذكورة، أبوظبي",
  description:
    "رعاية متخصصة في الطب الجنسي، الصحة الهرمونية للرجال، جراحة القضيب، الخصوبة، والتجميل الذكوري في أبوظبي، الإمارات العربية المتحدة.",
  path: "/ar",
});

export default function ArabicHomePage() {
  return <HomePageTemplate content={homeContentAr} />;
}
