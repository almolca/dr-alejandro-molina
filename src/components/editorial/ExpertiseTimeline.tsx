import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./Editorial.module.css";

type Milestone = { eyebrow: string; heading: string; body: string; href?: string; linkLabel?: string };

const summariesEn = [
  "Medical training in Spain, with clinical experience shaped by Hospital Clínic Barcelona.",
  "Tertiary urology, advanced laparoscopic surgery and renal transplantation, alongside uro-oncology and functional urology.",
  "A dedicated focus on andrology and men's sexual, hormonal and reproductive health.",
  "Male genital aesthetics within a specialist urological practice, informed by individual anatomy.",
  "Clinical practice alongside medical education through AndroMax Training.",
];

const summariesAr = [
  "تدريب طبي في إسبانيا، مع خبرة سريرية تشكّلت في مستشفى كلينيك برشلونة.",
  "طب مسالك بولية ثالثي، وجراحة متقدمة بالمنظار، وزراعة كلى، إلى جانب أورام المسالك البولية وطب المسالك البولية الوظيفي.",
  "تركيز متخصص على طب الذكورة وصحة الرجل الجنسية والهرمونية والإنجابية.",
  "تجميل ذكوري ضمن ممارسة متخصصة في طب المسالك البولية، مبني على التشريح الفردي.",
  "ممارسة سريرية إلى جانب التعليم الطبي من خلال برنامج AndroMax Training.",
];

export function ExpertiseTimeline({ items, locale }: { items: Milestone[]; locale?: "ar" }) {
  const summaries = locale === "ar" ? summariesAr : summariesEn;
  return <ol className={styles.timeline}>
    {items.map((item, index) => <li className={styles.milestone} key={item.heading}>
      <span className={styles.marker} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <Reveal className={styles.story}>
        <p className={`text-xs uppercase text-muted-foreground ${locale === "ar" ? "" : "tracking-widest"}`}>{item.eyebrow}</p>
        <h3 className="mt-3 font-display text-2xl">{item.heading}</h3>
        <p className="mt-4 text-sm text-muted-foreground">{summaries[index] ?? item.body}</p>
        <details><summary>{locale === "ar" ? "الخلفية السريرية" : "Clinical background"}</summary><p className="text-sm text-muted-foreground">{item.body}</p></details>
        {item.href && <Link href={item.href} className="mt-5 inline-flex text-sm underline underline-offset-4">{item.linkLabel}</Link>}
      </Reveal>
    </li>)}
  </ol>;
}
