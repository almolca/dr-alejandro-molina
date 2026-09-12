import type { FaqItem } from "@/components/ui/Faq";

/**
 * The Arabic homepage's FAQ block — additive relative to the English
 * homepage (which has no homepage FAQ section at all), carried over
 * unchanged from the R9 Phase A pilot. See spec §1 (Arabic-only row)
 * and §9 (FAQPage schema is unaffected — same 3 items, same wording).
 */
export const homeFaqItemsAr: FaqItem[] = [
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
];
