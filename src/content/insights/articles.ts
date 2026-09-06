/**
 * Insights article content — spec §19/§20 ("MDX or structured local
 * content for Insights in MVP"). Structured TypeScript data was chosen
 * over MDX: no extra build tooling, fully type-checked, and sufficient
 * for a handful of initial articles.
 *
 * Every article here is a genuine first draft written from concepts
 * already established elsewhere on this site (the corresponding
 * treatment page) — not from external sourcing. `clinicalReviewRequired`
 * is `true` on all of them uniformly: no medical content on this site
 * has had clinical/compliance sign-off yet (see IMPLEMENTATION_REPORT.md),
 * and singling some articles out as "reviewed" without an actual review
 * having happened would be misleading. `datePublished` is the real date
 * this content was added to the site — not an invented historical date,
 * citation date, or study date (spec: "do not invent... publication
 * dates").
 */

export type InsightCategory =
  | "Erectile Dysfunction"
  | "Testosterone"
  | "Penile Surgery"
  | "Male Aesthetics"
  | "Fertility"
  | "Peyronie's Disease";

export type InsightSection = {
  heading: string;
  body: string[];
};

export type InsightArticle = {
  slug: string;
  title: string;
  category: InsightCategory;
  excerpt: string;
  datePublished: string;
  clinicalReviewRequired: boolean;
  relatedHref: string;
  relatedLabel: string;
  /**
   * Optional second contextual link — added for the Penile Girth
   * Enhancement cluster (Phase B), where an article's natural second
   * reference is the Penile Filler Correction page rather than a
   * treatment page. Additive/optional so the 5 pre-existing articles
   * (single-link) don't need to change.
   */
  secondaryRelatedHref?: string;
  secondaryRelatedLabel?: string;
  sections: InsightSection[];
};

const PUBLISHED = "2026-09-03";
/** Real date this batch of Phase B (Penile Girth Enhancement cluster) articles was added — not an invented or backdated value. */
const PUBLISHED_PHASE_B = "2026-09-06";

export const insightArticles: InsightArticle[] = [
  {
    slug: "penile-implant-when-considered",
    title: "When Is a Penile Implant Considered for Erectile Dysfunction?",
    category: "Penile Surgery",
    excerpt:
      "Penile implant surgery sits at the end of the erectile dysfunction treatment ladder, not the start. Here's how that decision is actually reached.",
    datePublished: PUBLISHED,
    clinicalReviewRequired: true,
    relatedHref: "/penile-implant",
    relatedLabel: "Penile Implant Surgery",
    sections: [
      {
        heading: "Erectile dysfunction has many possible causes",
        body: [
          "Erectile dysfunction can have vascular, hormonal, metabolic, neurological, medication-related and psychosexual contributors. Before any treatment is discussed, assessment aims to understand which of these are relevant for a given patient — because treatment that ignores the cause is unlikely to be the right treatment.",
        ],
      },
      {
        heading: "Why implants are considered later, not first",
        body: [
          "A penile prosthesis is a surgical option, and surgery is generally not the first step for erectile dysfunction. The treatment ladder typically moves through lifestyle and risk-factor management, oral medication such as PDE5 inhibitors, hormonal treatment where indicated, device options, and selected injectable or shockwave therapy before surgery is discussed.",
          "A penile implant becomes a relevant conversation specifically when erectile dysfunction is severe or refractory — meaning other appropriate treatments have been tried and have not provided reliable results.",
        ],
      },
      {
        heading: "What makes someone a candidate",
        body: [
          "Candidacy depends on the cause and severity of erectile dysfunction, which treatments have already been tried, and overall health. It is not a decision made from a single consultation or a symptom checklist — it follows from the fuller assessment described above.",
        ],
      },
      {
        heading: "What to discuss at consultation",
        body: [
          "If a penile implant is a relevant option, consultation covers the difference between inflatable and malleable devices, what the surgical pathway and recovery involve, and the realistic — not guaranteed — expectations for sexual function afterward.",
        ],
      },
    ],
  },
  {
    slug: "low-testosterone-symptoms-diagnosis",
    title: "Low Testosterone: Symptoms, Diagnosis and When Treatment Is Appropriate",
    category: "Testosterone",
    excerpt:
      "Fatigue and low libido can be associated with testosterone deficiency — but symptoms alone are not a diagnosis. Here's what a proper assessment actually involves.",
    datePublished: PUBLISHED,
    clinicalReviewRequired: true,
    relatedHref: "/mens-health/testosterone",
    relatedLabel: "Testosterone & Male Hormonal Health",
    sections: [
      {
        heading: "Symptoms are a starting point, not an answer",
        body: [
          "Low energy, reduced libido and sexual symptoms can be associated with testosterone deficiency, but they can also have many other causes — sleep problems, mood, thyroid function, and general metabolic health among them. Not every man with these symptoms needs testosterone.",
        ],
      },
      {
        heading: "What a full assessment includes",
        body: [
          "Diagnosis is made through a combination of symptoms and biochemistry, not either alone. Assessment typically looks at total and free testosterone, SHBG, LH and FSH, prolactin, thyroid function, and broader metabolic health and sleep — since these markers interact with each other.",
        ],
      },
      {
        heading: "When treatment may be considered",
        body: [
          "Testosterone treatment is considered only after appropriate clinical and biochemical assessment, and only when there is a clear indication for it — never as a default response to symptoms, and not for bodybuilding or performance enhancement.",
          "Where treatment is appropriate, ongoing monitoring and safety review are part of the plan, not a one-time decision.",
        ],
      },
    ],
  },
  {
    slug: "penile-girth-enhancement-assessment",
    title: "Penile Girth Enhancement: What a Medical Assessment Should Consider",
    category: "Male Aesthetics",
    excerpt:
      "Penile girth enhancement is approached very differently within an andrology context than as a generic cosmetic procedure. Here's what that distinction actually means in practice.",
    datePublished: PUBLISHED,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-girth-enhancement",
    relatedLabel: "Penile Girth Enhancement",
    sections: [
      {
        heading: "Why anatomy-led assessment matters",
        body: [
          "Penile anatomy varies significantly between individuals. Treatment planned without a proper anatomical and medical assessment carries a greater risk of asymmetry, irregularity or dissatisfaction — which is why this is approached within an andrology and urology context, not as a generic walk-in cosmetic procedure.",
        ],
      },
      {
        heading: "Options considered",
        body: [
          "Non-surgical approaches, particularly hyaluronic acid-based augmentation, are typically the first point of discussion for suitable candidates. Surgical approaches are only offered where currently approved and clinically appropriate, and are never assumed as a starting point.",
        ],
      },
      {
        heading: "Why specific size gains aren't quoted",
        body: [
          "Results vary between individuals, depending on anatomy, technique and the option chosen. Specific outcome measurements aren't published as general claims — they're discussed individually, and in context, at consultation, rather than promised in advance.",
        ],
      },
      {
        heading: "Aftercare and revision",
        body: [
          "Aftercare guidance is specific to the option chosen. For men who have had a previous procedure elsewhere and are not satisfied with the result, revision is assessed individually, considering the original treatment and current anatomy.",
        ],
      },
    ],
  },
  {
    slug: "shockwave-therapy-ed-who-may-benefit",
    title: "Shockwave Therapy for ED: Who May Benefit?",
    category: "Erectile Dysfunction",
    excerpt:
      "Low-Intensity Shockwave Therapy is one option on the erectile dysfunction treatment ladder — not a stand-alone cure. Here's where it actually fits.",
    datePublished: PUBLISHED,
    clinicalReviewRequired: true,
    relatedHref: "/erectile-dysfunction/shockwave-therapy",
    relatedLabel: "Shockwave Therapy",
    sections: [
      {
        heading: "What Li-SWT is",
        body: [
          "Low-Intensity Shockwave Therapy (Li-SWT) delivers low-intensity acoustic wave pulses to penile tissue. The rationale is to stimulate a localised tissue response that may support erectile function in appropriately selected patients.",
        ],
      },
      {
        heading: "Who it may be considered for",
        body: [
          "Shockwave therapy may be considered for selected patients — particularly where a vascular contributor is relevant and first-line options have already been discussed. It is not appropriate for every cause of erectile dysfunction, and assessment always comes first.",
        ],
      },
      {
        heading: "Where the evidence and its limitations sit",
        body: [
          "Evidence for Li-SWT is still evolving, and protocols vary between devices and providers. Response to treatment is not guaranteed and varies between individuals — this is discussed openly, alongside alternatives, rather than presented as a certainty.",
        ],
      },
    ],
  },
  {
    slug: "peyronies-disease-when-to-seek-assessment",
    title: "Peyronie's Disease: When Should You Seek Specialist Assessment?",
    category: "Peyronie's Disease",
    excerpt:
      "Penile curvature doesn't always need immediate treatment — but understanding your phase and severity early can shape which options stay open later.",
    datePublished: PUBLISHED,
    clinicalReviewRequired: true,
    relatedHref: "/peyronies-disease",
    relatedLabel: "Peyronie's Disease",
    sections: [
      {
        heading: "Recognising the signs",
        body: [
          "Peyronie's disease involves the development of fibrous plaque within the penis, which can cause curvature and, in some men, pain or effects on erectile function during the active phase.",
        ],
      },
      {
        heading: "Why phase matters",
        body: [
          "Peyronie's disease often has an active phase, where curvature and pain may still be changing, followed by a stable phase once it has settled. Which phase you're in affects which treatments are appropriate — which is why earlier assessment, rather than waiting, can be useful for understanding your situation.",
        ],
      },
      {
        heading: "What assessment involves",
        body: [
          "Assessment includes a history and relevant examination. Ultrasound may be used where appropriate, particularly to assess plaque and blood flow when erectile function is also affected.",
        ],
      },
      {
        heading: "Not every case needs active treatment",
        body: [
          "Mild curvature without functional impact may simply be monitored. Where treatment is appropriate, options range from conservative management through procedural and, for stable and significant curvature, surgical correction — matched to phase and severity rather than assumed in advance.",
        ],
      },
    ],
  },

  // --- Penile Girth Enhancement cluster (Phase B) ---

  {
    slug: "how-much-girth-can-penile-filler-add",
    title: "How Much Girth Can Penile Filler Actually Add?",
    category: "Male Aesthetics",
    excerpt:
      "There's no single number that applies to every patient. Here's why girth outcomes are described in terms of variables, not a fixed figure — and what a consultation actually assesses.",
    datePublished: PUBLISHED_PHASE_B,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-girth-enhancement",
    relatedLabel: "Penile Girth Enhancement",
    secondaryRelatedHref: "/male-aesthetics/penile-filler-correction",
    secondaryRelatedLabel: "Penile Filler Correction",
    sections: [
      {
        heading: "Why there's no fixed answer",
        body: [
          "The change in girth a given patient experiences depends on several interacting factors — baseline anatomy, the technique used, the volume and type of product, and how an individual's own tissue responds. A figure that describes one patient's result doesn't reliably transfer to another, which is why this is discussed as a range of possibilities rather than a promised outcome.",
        ],
      },
      {
        heading: "What actually influences the result",
        body: [
          "Baseline circumference and skin elasticity, the specific treatment plan (including whether it's completed in one session or staged over more than one), and the product and technique used all play a role. In clinical experience, these variables interact enough that two patients with a similar starting point can still reasonably expect somewhat different outcomes.",
        ],
      },
      {
        heading: "Why exact figures aren't published here",
        body: [
          "This is a deliberate choice, not an omission — the Penile Girth Enhancement page explains the same reasoning. Publishing a specific size-gain number as a general claim would misrepresent how individualised the actual result is for any one patient.",
        ],
      },
      {
        heading: "What a consultation actually assesses",
        body: [
          "Consultation starts with an anatomical assessment and a discussion of what's realistic for that anatomy specifically — before any option or expectation is discussed in more concrete terms. If a previous treatment (here or elsewhere) didn't meet expectations, that's assessed on its own terms as a separate question from a first treatment.",
        ],
      },
    ],
  },
  {
    slug: "how-much-hyaluronic-acid-used-penile-girth-enhancement",
    title: "How Much Hyaluronic Acid Is Used for Penile Girth Enhancement?",
    category: "Male Aesthetics",
    excerpt:
      "Volume is planned individually, not standardised. Here's what actually determines how much product is used — and why a fixed number isn't quoted in advance.",
    datePublished: PUBLISHED_PHASE_B,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-girth-enhancement",
    relatedLabel: "Penile Girth Enhancement",
    sections: [
      {
        heading: "Volume is planned, not standardised",
        body: [
          "The amount of hyaluronic acid used is planned around an individual's baseline anatomy, the change being discussed, and the specific product and technique chosen — it isn't a single standard quantity applied to every patient.",
        ],
      },
      {
        heading: "Single session or staged treatment",
        body: [
          "Some patients are treated in one session; others are planned across more than one, for reasons related to anatomy, the scale of change being considered, or a more conservative, staged approach. Which applies is a planning decision made at consultation, not a default.",
        ],
      },
      {
        heading: "Why a fixed number isn't quoted in advance",
        body: [
          "Quoting a specific volume before an individual assessment has taken place would suggest a level of standardisation that doesn't reflect how this is actually planned. The relevant figure for a given patient is discussed as part of their own treatment plan, not as a general published quantity.",
        ],
      },
      {
        heading: "What determines volume over time",
        body: [
          "If maintenance or touch-up treatment is considered later, the volume for that is planned the same way — individually, based on the current anatomy and goals at that point, not a fixed top-up amount.",
        ],
      },
    ],
  },
  {
    slug: "how-long-does-penile-filler-last",
    title: "How Long Does Penile Filler Last?",
    category: "Male Aesthetics",
    excerpt:
      "Hyaluronic acid-based penile filler isn't a permanent result. Here's what actually affects how long it lasts, discussed as a range rather than a promise.",
    datePublished: PUBLISHED_PHASE_B,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-girth-enhancement",
    relatedLabel: "Penile Girth Enhancement",
    secondaryRelatedHref: "/male-aesthetics/penile-filler-correction",
    secondaryRelatedLabel: "Penile Filler Correction",
    sections: [
      {
        heading: "Not a permanent result",
        body: [
          "Hyaluronic acid is gradually broken down by the body over time — this is a general property of the material, not specific to how or where it's used. Penile girth enhancement with hyaluronic acid should be understood as a temporary, maintainable result rather than a one-time permanent change.",
        ],
      },
      {
        heading: "What affects how long it lasts",
        body: [
          "Duration varies between individuals and depends on factors including the specific product used, the technique, and individual metabolic and tissue factors. This is why a single expected duration isn't quoted as a general figure — it's discussed in the context of the specific treatment plan.",
        ],
      },
      {
        heading: "What happens as it fades",
        body: [
          "The change is typically gradual rather than sudden. See our related article on what happens to penile filler over time for more on this specifically — and if a change feels uneven, sudden, or otherwise different from a gradual fade, that's worth having assessed rather than assumed.",
        ],
      },
      {
        heading: "When re-treatment might be discussed",
        body: [
          "Whether and when to consider further treatment is an individual decision made at follow-up, based on the current result and the patient's own goals — not on a fixed schedule.",
        ],
      },
    ],
  },
  {
    slug: "what-happens-to-penile-filler-over-time",
    title: "What Happens to Penile Filler Over Time?",
    category: "Male Aesthetics",
    excerpt:
      "Penile filler doesn't stay static after treatment. Here's what tends to happen in the weeks, months and years afterward — and when a change is worth having assessed.",
    datePublished: PUBLISHED_PHASE_B,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-girth-enhancement",
    relatedLabel: "Penile Girth Enhancement",
    secondaryRelatedHref: "/male-aesthetics/penile-filler-correction",
    secondaryRelatedLabel: "Penile Filler Correction",
    sections: [
      {
        heading: "The early settling period",
        body: [
          "In the first weeks after treatment, some swelling and settling is expected as part of the normal process — see our related article on why penile filler can take several weeks to settle. The appearance during this period isn't the final result.",
        ],
      },
      {
        heading: "The maintenance phase",
        body: [
          "Once settled, hyaluronic acid gradually breaks down over a longer period, and the result tends to soften or reduce gradually rather than disappear all at once. The pace of this varies between individuals.",
        ],
      },
      {
        heading: "Signs worth having assessed",
        body: [
          "A gradual, even change over time is a different pattern from new asymmetry, an unusual lump, firmness in one area, or a change that appears suddenly rather than gradually. The second pattern is what specialist assessment — including at our Penile Filler Correction page — is for; the first is generally an expected part of the process.",
        ],
      },
      {
        heading: "Why follow-up matters",
        body: [
          "Periodic review, rather than a one-time treatment with no further contact, is part of how change over time is properly monitored and, where relevant, acted on.",
        ],
      },
    ],
  },
  {
    slug: "when-can-you-have-sex-after-penile-girth-enhancement",
    title: "When Can You Have Sex After Penile Girth Enhancement?",
    category: "Male Aesthetics",
    excerpt:
      "There's a general recovery pattern discussed at consultation — but exact timing depends on healing and the specific treatment plan. Here's how that decision is actually made.",
    datePublished: PUBLISHED_PHASE_B,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-girth-enhancement",
    relatedLabel: "Penile Girth Enhancement",
    sections: [
      {
        heading: "Why timing isn't one-size-fits-all",
        body: [
          "How quickly it's appropriate to resume sexual activity depends on individual healing, the extent of swelling, and the specific treatment performed. This is generally discussed as a pattern rather than a fixed universal rule, and confirmed individually rather than assumed from a general guide.",
        ],
      },
      {
        heading: "What the general recovery period typically involves",
        body: [
          "Most patients experience an initial period of swelling and tenderness, followed by a settling period, before activity is resumed. A period of abstinence is typically advised during the initial recovery phase, with the exact timing confirmed individually at follow-up rather than fixed in advance.",
        ],
      },
      {
        heading: "Signs it may be too early",
        body: [
          "Ongoing swelling, tenderness, or a result that hasn't yet settled are generally signs that more healing time is needed before resuming activity — these are reviewed at follow-up rather than judged by the patient alone.",
        ],
      },
      {
        heading: "This is confirmed individually",
        body: [
          "The specific timing for any one patient is confirmed at consultation and follow-up, based on their own healing and treatment plan — not taken from a general article such as this one.",
        ],
      },
    ],
  },
  {
    slug: "why-penile-filler-takes-weeks-to-settle",
    title: "Why Can Penile Filler Take Several Weeks to Settle?",
    category: "Male Aesthetics",
    excerpt:
      "The result immediately after treatment isn't the final result. Here's why swelling and settling are a normal part of the process — and why judging the outcome too early can be misleading.",
    datePublished: PUBLISHED_PHASE_B,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-girth-enhancement",
    relatedLabel: "Penile Girth Enhancement",
    sections: [
      {
        heading: "Initial swelling is expected",
        body: [
          "Some swelling following injection is a normal, expected tissue response to the treatment itself — not a sign that something has gone wrong. It's generally most noticeable in the first days afterward.",
        ],
      },
      {
        heading: "Why the final shape takes time to reveal itself",
        body: [
          "As swelling resolves and the product settles and integrates with the surrounding tissue over the following weeks, the appearance and feel gradually change from the immediate post-treatment state to the settled result.",
        ],
      },
      {
        heading: "Why judging the result too early can be misleading",
        body: [
          "The appearance in the first days or even weeks after treatment isn't necessarily representative of the eventual settled outcome. Forming a judgement of the final result before swelling has resolved can lead to an inaccurate impression in either direction.",
        ],
      },
      {
        heading: "When to have the result properly reviewed",
        body: [
          "Follow-up timing is planned individually as part of the treatment plan, specifically so the result can be reviewed once it has genuinely settled, rather than while it's still changing.",
        ],
      },
    ],
  },
];

export function getInsightArticle(slug: string): InsightArticle | undefined {
  return insightArticles.find((article) => article.slug === slug);
}
