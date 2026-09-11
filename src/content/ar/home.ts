import type { HomePageContent } from "@/content/types";

/**
 * Arabic homepage pilot content (R9 Phase A). Professional-effort
 * Modern Standard Arabic; flagged for a native-speaker QA pass before
 * Phase B scales this pattern to the remaining priority pages (spec
 * §14, §30 of the master R9 brief).
 */
export const homeContentAr: HomePageContent = {
  hero: {
    eyebrow: "استشاري أمراض المسالك البولية والذكورة · أبوظبي",
    heading: "د. أليخاندرو مولينا",
    specialtyLine: "طب الذكورة · الصحة الجنسية للرجال · التجميل الذكوري",
    description:
      "رعاية متخصصة في الطب الجنسي، الصحة الهرمونية للرجال، جراحة القضيب، والتجميل الذكوري، مع خبرة خاصة في زيادة سماكة القضيب.",
    credentialLine: "FEBU · زميل المجلس الأوروبي لطب المسالك البولية",
    locationLine: "استشارات في مستشفى إن إم سي رويال، مدينة خليفة، أبوظبي",
    ctaLabel: "احجز استشارة",
  },
  trust: {
    eyebrow: "الخبرة والثقة",
    heading: "خبرة موثوقة في طب الذكورة",
    stats: [
      "+15 عامًا من الخبرة في طب المسالك البولية",
      "أكثر من 500 إجراء لزيادة سماكة القضيب",
      "يُجري إجراءات زيادة السماكة بحمض الهيالورونيك منذ عام 2018",
      "Top Doctors Spain 2020 · Doctoralia Awards Spain 2022",
    ],
  },
  faq: {
    eyebrow: "الأسئلة الشائعة",
    heading: "الأسئلة الشائعة",
    items: [
      {
        question: "ماذا يحدث خلال الاستشارة الأولى؟",
        answer:
          "تتضمن الاستشارة الأولى مناقشة سرية لحالتك الصحية وأهدافك، وقد يوصي د. مولينا بفحوصات إضافية حسب الحاجة. كل خطة علاجية تُبنى على تقييم فردي دقيق.",
      },
      {
        question: "هل تُعامل استشارتي بسرية تامة؟",
        answer: "نعم. جميع المعلومات التي تشاركها تُعامل بسرية تامة وفقًا لأعلى معايير الخصوصية الطبية.",
      },
      {
        question: "كيف يمكنني الحجز؟",
        answer:
          "يمكنك حجز استشارة عبر هذا الموقع، وستتم إحالتك إلى نظام الحجز الرسمي لمستشفى إن إم سي رويال لإتمام الموعد.",
      },
    ],
  },
  booking: {
    heading: "ابدأ استشارتك اليوم",
    description: "احجز استشارتك مع د. أليخاندرو مولينا للحصول على تقييم متخصص يراعي احتياجاتك الفردية.",
    supportingLine: "سيتم توجيهك إلى نظام حجز مستشفى إن إم سي رويال لإكمال الحجز.",
    ctaLabel: "احجز استشارة",
  },
};
