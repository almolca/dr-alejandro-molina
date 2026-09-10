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

/**
 * Optional video metadata for an Insights article — Phase C video-ready
 * architecture. Every field is populated only when a real, owner-supplied
 * video exists; nothing here should ever be invented (no placeholder
 * YouTube/Vimeo URLs). `ArticleVideoBlock` renders nothing when an
 * article has no `video` field at all.
 */
export type InsightVideo = {
  title: string;
  /** Real hosted video URL (YouTube, Vimeo, or self-hosted file) — never invented. */
  url: string;
  thumbnailUrl?: string;
  /** Short summary shown near the video, distinct from the full transcript. */
  summary?: string;
  /** Full transcript text, for accessibility and search — not auto-generated filler. */
  transcript?: string;
  durationMinutes?: number;
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
  /** Optional physician video — see `InsightVideo`. Omitted on every article until a real video exists. */
  video?: InsightVideo;
  /**
   * Slugs of 2-4 other `insightArticles` this one is most thematically
   * related to, for the on-page "Related Insights" section (Phase C).
   * Optional/additive — pre-existing articles without a natural cluster
   * don't need it.
   */
  relatedArticleSlugs?: string[];
  /** Optional short "key takeaway" callout, rendered near the top of the article — additive, most articles won't set it. */
  keyTakeaway?: string;
  sections: InsightSection[];
};

const PUBLISHED = "2026-09-03";
/** Real date this batch of Phase B (Penile Girth Enhancement cluster) articles was added — not an invented or backdated value. */
const PUBLISHED_PHASE_B = "2026-09-06";
/** Real date this batch of Phase C (topical authority expansion) articles was added. */
const PUBLISHED_PHASE_C = "2026-09-06";
/** Real date this batch of R7 (Penile Implant + Testosterone cluster depth) articles was added. */
const PUBLISHED_R7 = "2026-09-09";

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
    relatedArticleSlugs: ["how-much-girth-can-penile-filler-add", "lessons-from-500-penile-girth-enhancement-procedures"],
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
    slug: "venous-leak-erectile-dysfunction",
    title: "Venous Leak and Erectile Dysfunction: What Penile Doppler Really Shows",
    category: "Erectile Dysfunction",
    excerpt:
      "\"Venous leak\" is a patient-friendly shorthand for something more nuanced — veno-occlusive dysfunction. Here's what Penile Doppler can and can't tell you about it.",
    datePublished: PUBLISHED_R7,
    clinicalReviewRequired: true,
    relatedHref: "/erectile-dysfunction/penile-doppler",
    relatedLabel: "Penile Doppler",
    secondaryRelatedHref: "/erectile-dysfunction",
    secondaryRelatedLabel: "Erectile Dysfunction",
    relatedArticleSlugs: ["penile-implant-when-considered"],
    keyTakeaway:
      "A Doppler result — including an elevated EDV — should be interpreted alongside the erection quality actually achieved during the study, not read from a single number in isolation.",
    sections: [
      {
        heading: "What people mean by \"venous leak\"",
        body: [
          "Patients often describe \"venous leak\" as blood draining out of the penis too quickly to sustain an erection. The description is intuitive, but the underlying physiology is more precise — the clinical term is veno-occlusive dysfunction, and it describes a failure of a mechanical process, not a permanently faulty valve.",
          "A normal erection depends on a short sequence: adequate arterial inflow, relaxation of the smooth muscle within the erectile tissue (the corpora cavernosa), full expansion of that tissue, and — as a direct mechanical result of that expansion — compression of the veins that would otherwise drain blood out. Rigidity is maintained because outflow is reduced, not because a valve has been consciously shut.",
        ],
      },
      {
        heading: "PSV and EDV — what a Doppler actually measures",
        body: [
          "Penile Doppler ultrasound measures blood-flow velocities during a pharmacologically stimulated erection. Peak systolic velocity (PSV) primarily reflects arterial inflow — how well blood is reaching the penis. End-diastolic velocity (EDV) helps assess how much outflow persists once the erection is established.",
          "A pattern of adequate PSV together with a persistently elevated EDV, in an erection that reached sufficient rigidity during the study, may suggest impaired veno-occlusion. But EDV is only informative in that context — it is not a stand-alone diagnostic number.",
        ],
      },
      {
        heading: "Why erection quality during the study matters",
        body: [
          "Full cavernosal expansion is what allows venous compression to happen at all. If rigidity during the scan is incomplete — because of insufficient stimulation, anxiety, heightened sympathetic tone, or a suboptimal response to the test injection — outflow can appear elevated simply because full compression was never mechanically achieved, independent of whether the veins themselves are structurally normal.",
          "This is why a single elevated EDV reading is not, on its own, evidence of a fixed structural venous leak. The erection quality actually reached during the study has to be part of how the number is read.",
        ],
      },
      {
        heading: "Functional patterns versus a structural venous leak",
        body: [
          "Not every apparent venous pattern represents a fixed structural venous leak. In some men, an apparent veno-occlusive pattern may reflect incomplete cavernosal relaxation or incomplete rigidity rather than a fixed structural defect — contributors can include insufficient stimulation, performance anxiety, metabolic factors, or hormonal factors.",
          "Distinguishing a functional pattern from a genuinely structural one matters directly for treatment: a functional pattern points toward addressing the underlying contributor, while a structural pattern is what would make surgical options a relevant conversation. Arterial insufficiency (reduced inflow, reflected in a lower PSV) is a separate mechanism again, and Doppler assessment is part of how the two are distinguished.",
        ],
      },
      {
        heading: "How the result is interpreted in context",
        body: [
          "A Penile Doppler result is read alongside clinical history, the erection quality achieved during the study, PSV, EDV, whether spontaneous or masturbatory erections differ from those with a partner, and relevant metabolic, hormonal and psychological context — not from a single velocity value taken in isolation.",
          "Treatment follows the mechanism actually identified. That may mean addressing a contributing factor rather than surgery — surgical options are only relevant for a genuinely confirmed structural pattern, discussed individually at consultation.",
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
    relatedArticleSlugs: ["how-much-hyaluronic-acid-used-penile-girth-enhancement", "penile-girth-enhancement-assessment"],
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
    relatedArticleSlugs: ["how-much-girth-can-penile-filler-add", "how-long-does-penile-filler-last"],
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
    relatedArticleSlugs: ["what-happens-to-penile-filler-over-time", "why-penile-filler-takes-weeks-to-settle"],
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
    relatedArticleSlugs: [
      "why-penile-filler-takes-weeks-to-settle",
      "penile-filler-migration-what-to-know",
      "penile-filler-nodules-and-irregularities",
    ],
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
    relatedArticleSlugs: ["why-penile-filler-takes-weeks-to-settle", "how-long-does-penile-filler-last"],
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
    relatedArticleSlugs: ["what-happens-to-penile-filler-over-time", "when-can-you-have-sex-after-penile-girth-enhancement"],
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

  // --- Phase C: topical authority expansion ---

  {
    slug: "penile-filler-migration-what-to-know",
    title: "Penile Filler Migration: What Patients Should Know",
    category: "Male Aesthetics",
    excerpt:
      "Product moving from where it was originally placed is one of the more specific reasons for assessment after penile filler. Here's what migration actually means, and how it differs from normal settling.",
    datePublished: PUBLISHED_PHASE_C,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-filler-correction",
    relatedLabel: "Penile Filler Correction",
    secondaryRelatedHref: "/male-aesthetics/penile-girth-enhancement",
    secondaryRelatedLabel: "Penile Girth Enhancement",
    relatedArticleSlugs: [
      "why-penile-filler-takes-weeks-to-settle",
      "what-happens-to-penile-filler-over-time",
      "penile-filler-nodules-and-irregularities",
    ],
    sections: [
      {
        heading: "What migration means",
        body: [
          "Migration refers to filler product moving away from where it was originally placed, rather than staying within the treated area as intended. It's a specific finding, distinct from the general softening and settling that's a normal part of the process for every patient.",
        ],
      },
      {
        heading: "Why it can happen",
        body: [
          "Several factors can contribute, including the technique used, the specific product's characteristics, how the tissue responds individually, and mechanical forces on the area over time. This is discussed in general terms because the relevant factors — and whether any of them apply — are specific to each presentation, not something a general article can determine.",
        ],
      },
      {
        heading: "How migration differs from normal settling",
        body: [
          "The early weeks after treatment involve expected swelling and settling — see our related article on why penile filler can take several weeks to settle. Migration is a different pattern: it tends to present as new asymmetry or a change in a specific area, and it can appear later, after the initial settling period is already complete, rather than during it.",
        ],
      },
      {
        heading: "What assessment and correction involve",
        body: [
          "If migration is suspected, assessment starts with history and examination, with ultrasound used where it helps clarify the location and extent of the finding. From there, options are considered individually — including observation, dissolution or revision — at our Penile Filler Correction page, rather than assumed in advance from this article alone.",
        ],
      },
    ],
  },
  {
    slug: "penile-filler-nodules-and-irregularities",
    title: "Penile Filler Nodules and Irregularities",
    category: "Male Aesthetics",
    excerpt:
      "A firm area or an uneven contour after penile filler isn't automatically a problem, but it's not something to self-diagnose either. Here's how these findings are actually assessed.",
    datePublished: PUBLISHED_PHASE_C,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-filler-correction",
    relatedLabel: "Penile Filler Correction",
    secondaryRelatedHref: "/male-aesthetics/penile-girth-enhancement",
    secondaryRelatedLabel: "Penile Girth Enhancement",
    relatedArticleSlugs: [
      "penile-filler-migration-what-to-know",
      "why-penile-filler-takes-weeks-to-settle",
    ],
    sections: [
      {
        heading: "What a nodule is",
        body: [
          "A nodule is a discrete firm area that can develop at or near an injection site. An irregularity more broadly can also mean an uneven contour or a texture that feels inconsistent with the surrounding tissue, rather than a single firm lump specifically.",
        ],
      },
      {
        heading: "Possible contributing factors",
        body: [
          "Product distribution during treatment, individual tissue response, and how the treated area has settled can all contribute to how a nodule or irregularity develops. As with migration, which factor is relevant for a given presentation is an individual question, not a general one.",
        ],
      },
      {
        heading: "Normal early firmness versus a reasonable trigger for assessment",
        body: [
          "Some firmness is expected in the early weeks as swelling resolves and the product integrates with surrounding tissue. A new nodule that appears well after that settling period, or an irregularity that doesn't gradually soften the way the rest of the result does, is a more reasonable trigger for assessment than firmness noticed in the first days or weeks.",
        ],
      },
      {
        heading: "What assessment and treatment may involve",
        body: [
          "Assessment starts with history and examination, with ultrasound used where it helps clarify a finding. From there, the same range of options considered for other presentations applies — observation, dissolution, or revision — set out in full at our Penile Filler Correction page, and chosen based on the specific finding rather than a fixed rule.",
        ],
      },
    ],
  },
  {
    slug: "can-penile-filler-be-dissolved",
    title: "Can Penile Filler Be Dissolved?",
    category: "Male Aesthetics",
    excerpt:
      "Short answer: hyaluronic acid-based penile filler can generally be dissolved, though whether it's the right option depends on assessment. Here's what dissolution actually involves.",
    datePublished: PUBLISHED_PHASE_C,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-filler-correction",
    relatedLabel: "Penile Filler Correction",
    secondaryRelatedHref: "/male-aesthetics/penile-girth-enhancement",
    secondaryRelatedLabel: "Penile Girth Enhancement",
    relatedArticleSlugs: [
      "penile-filler-nodules-and-irregularities",
      "penile-filler-migration-what-to-know",
    ],
    sections: [
      {
        heading: "The short answer",
        body: [
          "Hyaluronic acid-based penile filler can generally be dissolved using hyaluronidase, an enzyme that breaks down hyaluronic acid. Whether dissolution is the right option for a given presentation — rather than observation or revision — is an assessed decision, not an automatic one.",
        ],
      },
      {
        heading: "What dissolution actually involves",
        body: [
          "Hyaluronidase works specifically on hyaluronic acid-based products; it doesn't affect the body's own tissue the same way. In practice, this means dissolution is a targeted option for hyaluronic acid filler specifically, assessed and planned around the individual presentation rather than applied as a blanket first step.",
        ],
      },
      {
        heading: "What to expect afterward",
        body: [
          "The tissue moves gradually back toward its pre-treatment state rather than changing instantly. Whether any further treatment is considered afterward — and when — is a separate decision made at follow-up, based on the result and the patient's own goals, not assumed as an automatic next step.",
        ],
      },
      {
        heading: "When dissolution may not be the first choice",
        body: [
          "Not every finding needs dissolution. Some are better suited to observation, and others to revision rather than dissolution alone — the full range of options, and how the choice is actually made, is set out at our Penile Filler Correction page.",
        ],
      },
    ],
  },
  {
    slug: "why-penile-filler-feels-different-between-patients",
    title: "Why Can Penile Filler Feel Different Between Patients?",
    category: "Male Aesthetics",
    excerpt:
      "Two patients can have a broadly similar treatment and still describe the result differently. Here's why comparing texture and feel between patients isn't a reliable way to judge an outcome.",
    datePublished: PUBLISHED_PHASE_C,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-girth-enhancement",
    relatedLabel: "Penile Girth Enhancement",
    secondaryRelatedHref: "/male-aesthetics/penile-filler-correction",
    secondaryRelatedLabel: "Penile Filler Correction",
    relatedArticleSlugs: [
      "how-much-girth-can-penile-filler-add",
      "why-penile-filler-takes-weeks-to-settle",
    ],
    sections: [
      {
        heading: "Anatomy varies between patients",
        body: [
          "Baseline tissue thickness, elasticity and sensitivity all vary from one individual to another. Because filler integrates with a patient's own tissue, the same product and volume can reasonably feel different depending on that underlying anatomy — this isn't a sign that something has been done differently or incorrectly.",
        ],
      },
      {
        heading: "Technique and placement play a role",
        body: [
          "How and where product is placed also affects how it's felt afterward. This is one of the reasons treatment planning is anatomy-led rather than standardised — the plan for a given patient is built around their own anatomy, not a fixed technique applied uniformly.",
        ],
      },
      {
        heading: "Settling stage affects feel as much as appearance",
        body: [
          "Texture, like appearance, changes as swelling resolves and the product settles over the following weeks — see our related article on why penile filler can take several weeks to settle. Comparing feel before that process has completed adds another variable on top of individual anatomy.",
        ],
      },
      {
        heading: "Why comparing results between patients isn't meaningful",
        body: [
          "Given how many individual factors are involved, one patient's description of feel doesn't reliably predict another's experience — the same honest reasoning already applied to size outcomes on the Penile Girth Enhancement page applies here too. What matters for any one patient is discussed and reviewed individually, at consultation and follow-up.",
        ],
      },
    ],
  },
  {
    slug: "lessons-from-500-penile-girth-enhancement-procedures",
    title: "What I Have Learned From 500+ Penile Girth Enhancement Procedures",
    category: "Male Aesthetics",
    excerpt:
      "Clinical observations and practical considerations from substantial procedure experience — offered as personal clinical experience, not as published evidence or a guideline.",
    datePublished: PUBLISHED_PHASE_C,
    clinicalReviewRequired: true,
    relatedHref: "/male-aesthetics/penile-girth-enhancement",
    relatedLabel: "Penile Girth Enhancement",
    secondaryRelatedHref: "/male-aesthetics/penile-filler-correction",
    secondaryRelatedLabel: "Penile Filler Correction",
    keyTakeaway:
      "Anatomical variability, not technique alone, is the biggest driver of how different two patients' results can look and feel.",
    relatedArticleSlugs: [
      "penile-girth-enhancement-assessment",
      "why-penile-filler-feels-different-between-patients",
      "why-penile-filler-takes-weeks-to-settle",
    ],
    sections: [
      {
        heading: "Personal clinical experience, not a clinical study",
        body: [
          "What follows is drawn from personal clinical experience across a substantial number of penile girth enhancement procedures — observations and practical considerations, not findings from a controlled study. Experience of this kind is useful for informing how a practice is run and what a consultation focuses on, but it is not a substitute for, and shouldn't be read as, published guideline-level evidence.",
        ],
      },
      {
        heading: "Anatomical variability is the constant",
        body: [
          "The single most consistent observation across a large number of procedures is how much baseline anatomy varies between patients — which is the practical reason results, volumes and timelines are discussed as individual, anatomy-led decisions throughout this site rather than as fixed figures.",
        ],
      },
      {
        heading: "Why the same product doesn't behave identically twice",
        body: [
          "Even with a consistent technique and product, individual tissue response means two patients with a similar starting point can reasonably end up with a somewhat different result or feel. This is a practical observation, not a claim about how the product performs in general — see our related article on why penile filler can feel different between patients.",
        ],
      },
      {
        heading: "Settling time deserves patience",
        body: [
          "Judging a result before it has genuinely settled is one of the more common sources of unnecessary concern in practice — see our related article on why penile filler can take several weeks to settle for more on this specifically. Building adequate follow-up timing into the treatment plan, rather than reacting to an early impression, tends to serve patients better.",
        ],
      },
      {
        heading: "Patient selection and expectations shape outcomes as much as technique",
        body: [
          "In practice, a thorough anatomical assessment and an honest conversation about realistic expectations beforehand matter at least as much as the technical execution of the procedure itself — which is why assessment is treated as its own step, not a formality before treatment.",
        ],
      },
      {
        heading: "Why correction, when needed, requires specialist assessment",
        body: [
          "Where a previous result — here or elsewhere — hasn't met expectations, experience across a large number of cases has reinforced that a generic fix isn't appropriate: correction needs its own anatomical assessment, considering the original treatment and current presentation, set out at our Penile Filler Correction page.",
        ],
      },
    ],
  },
  {
    slug: "inflatable-vs-malleable-penile-implant",
    title: "Inflatable vs Malleable Penile Implant: What's the Difference?",
    category: "Penile Surgery",
    excerpt:
      "Two device types, two genuinely different mechanisms. Here's how they compare, and what actually determines which is right for a given patient.",
    datePublished: PUBLISHED_R7,
    clinicalReviewRequired: true,
    relatedHref: "/penile-implant",
    relatedLabel: "Penile Implant Surgery",
    relatedArticleSlugs: ["penile-implant-when-considered"],
    sections: [
      {
        heading: "Two mechanisms, not two versions of the same device",
        body: [
          "An inflatable prosthesis uses cylinders, a pump and a fluid reservoir to closely mirror natural rigidity when in use and flaccidity when not. A malleable prosthesis is a simpler design — semi-rigid rods with no pump, positioned by hand into a more or less rigid position. These are genuinely different mechanisms, not a premium-versus-basic version of the same device.",
        ],
      },
      {
        heading: "Why inflatable is the more commonly selected option",
        body: [
          "Because it mirrors the natural flaccid state when not activated, an inflatable device is the option most commonly selected among candidates. The trade-off is mechanical complexity: more moving parts means more that could, in principle, eventually need attention or revision.",
        ],
      },
      {
        heading: "When a malleable device may be preferred",
        body: [
          "A malleable device's simpler mechanical design — no pump, no reservoir — can be a reasonable preference where a more straightforward surgical approach is wanted, or where manual dexterity to operate a pump mechanism is a genuine practical consideration. It is a legitimate choice, not a lesser one.",
        ],
      },
      {
        heading: "What actually determines the choice",
        body: [
          "In practice, the decision depends on anatomy, general health, manual dexterity, and personal preference after both options have been properly explained — not a default recommendation applied to every patient. This is discussed directly as part of surgical planning, not assumed in advance.",
        ],
      },
    ],
  },
  {
    slug: "penile-implant-recovery-what-to-expect",
    title: "Penile Implant Recovery: What to Expect",
    category: "Penile Surgery",
    excerpt:
      "Recovery follows a structured pattern, even though the exact timeline is set individually. Here's how it generally unfolds.",
    datePublished: PUBLISHED_R7,
    clinicalReviewRequired: true,
    relatedHref: "/penile-implant",
    relatedLabel: "Penile Implant Surgery",
    relatedArticleSlugs: ["penile-implant-when-considered", "inflatable-vs-malleable-penile-implant"],
    sections: [
      {
        heading: "Recovery happens in phases, not as a single event",
        body: [
          "Recovery from penile implant surgery generally moves through three phases: an initial healing period with restricted activity, a gradual return to normal daily activity, and finally a guided introduction of device use once healing is sufficient. Thinking of it as a sequence, rather than a single countdown to 'fully recovered', is a more useful way to set expectations.",
        ],
      },
      {
        heading: "The initial healing period",
        body: [
          "Some swelling, discomfort and bruising in the early period is a normal part of surgical healing, not a sign that something has gone wrong. Activity is deliberately restricted during this phase to protect the surgical site while it heals.",
        ],
      },
      {
        heading: "Returning to normal activity",
        body: [
          "As healing progresses, activity is reintroduced gradually rather than all at once. The pace of this depends on how the individual patient is healing, not a fixed calendar applied to everyone.",
        ],
      },
      {
        heading: "When device use begins",
        body: [
          "Learning to use the device — activating and releasing an inflatable prosthesis, or positioning a malleable one — is introduced under guidance once healing is sufficient, not immediately after surgery. This staged approach protects the surgical result while the patient becomes confident using the device.",
        ],
      },
      {
        heading: "Why a specific number of days isn't quoted here",
        body: [
          "Healing pace, the surgical plan, and individual anatomy all vary between patients, which is why this page describes the structure of recovery rather than a single generic timeline — the specific timeline for your own recovery is set at consultation and reviewed as healing progresses.",
        ],
      },
    ],
  },
  {
    slug: "orgasm-ejaculation-after-penile-implant",
    title: "Can You Orgasm and Ejaculate With a Penile Implant?",
    category: "Penile Surgery",
    excerpt:
      "A penile implant restores the ability to achieve rigidity — not every aspect of sexual function. Here's what it does and doesn't change.",
    datePublished: PUBLISHED_R7,
    clinicalReviewRequired: true,
    relatedHref: "/penile-implant",
    relatedLabel: "Penile Implant Surgery",
    relatedArticleSlugs: ["penile-implant-when-considered"],
    sections: [
      {
        heading: "What the implant is designed to do",
        body: [
          "A penile implant is designed to allow a man to achieve a rigid erection when he wants one. That is its specific purpose — restoring the mechanical ability to achieve rigidity for penetration.",
        ],
      },
      {
        heading: "What it does not change",
        body: [
          "Orgasm, ejaculation and skin sensation are governed by separate nerve and hormonal pathways, independent of the mechanism that produces rigidity. Implant surgery does not directly alter these — it is not designed to, and does not claim to.",
        ],
      },
      {
        heading: "Why some men still notice a difference",
        body: [
          "The underlying cause of the original erectile dysfunction — nerve changes after pelvic surgery such as prostatectomy, diabetes-related nerve involvement, or longstanding vascular changes — can independently affect sensation, orgasm or ejaculation, separately from the implant itself. It matters to attribute any change to the underlying condition rather than assume the device is responsible.",
        ],
      },
      {
        heading: "Why this is discussed before surgery, not after",
        body: [
          "Realistic expectations about what an implant can and cannot restore are set out during assessment, specifically so a patient is not left drawing incorrect conclusions about the device after surgery. If sensation or ejaculation are a specific concern, they are a reasonable and expected topic to raise at consultation.",
        ],
      },
    ],
  },
  {
    slug: "trt-who-is-it-for",
    title: "Testosterone Replacement Therapy: Who Is It For?",
    category: "Testosterone",
    excerpt:
      "TRT is not appropriate for every man with a single low reading or a symptom of fatigue. Here's how candidacy is actually assessed.",
    datePublished: PUBLISHED_R7,
    clinicalReviewRequired: true,
    relatedHref: "/mens-health/testosterone",
    relatedLabel: "Testosterone & Male Hormonal Health",
    relatedArticleSlugs: ["low-testosterone-symptoms-diagnosis", "shbg-and-free-testosterone-explained"],
    sections: [
      {
        heading: "Confirmed deficiency, not a single low reading",
        body: [
          "A single low testosterone result is a reason to investigate further, not a diagnosis on its own. Levels fluctuate, and biochemical confirmation typically involves more than one measurement, read alongside symptoms rather than in isolation.",
        ],
      },
      {
        heading: "Symptoms that actually correlate with the biochemistry",
        body: [
          "Fatigue, low libido and reduced performance can have many causes besides testosterone deficiency. Candidacy depends on these symptoms genuinely aligning with confirmed low levels — not the presence of tiredness alone alongside a borderline number.",
        ],
      },
      {
        heading: "Ruling out reversible causes first",
        body: [
          "Untreated sleep apnoea, obesity, thyroid dysfunction and certain medications can all lower testosterone or produce similar symptoms. Where one of these is present and unaddressed, it is generally considered before treatment — because addressing it may change the picture entirely.",
        ],
      },
      {
        heading: "Who is generally not yet a candidate",
        body: [
          "Men actively planning to conceive without a fertility discussion first, those with a significant unaddressed contributing condition, and men seeking treatment purely for bodybuilding or performance enhancement without confirmed deficiency are generally not appropriate candidates at that point — though circumstances can change once the relevant factor is addressed.",
        ],
      },
      {
        heading: "An individual decision, not a protocol",
        body: [
          "Ultimately, whether TRT is appropriate is an individual decision made after the full picture — symptoms, repeat biochemistry, and contributing factors — has been assessed together, not a decision made from a single number.",
        ],
      },
    ],
  },
  {
    slug: "shbg-and-free-testosterone-explained",
    title: "SHBG and Free Testosterone Explained",
    category: "Testosterone",
    excerpt:
      "Total testosterone can look normal while free testosterone tells a different story. Here's why both figures matter.",
    datePublished: PUBLISHED_R7,
    clinicalReviewRequired: true,
    relatedHref: "/mens-health/testosterone",
    relatedLabel: "Testosterone & Male Hormonal Health",
    relatedArticleSlugs: ["low-testosterone-symptoms-diagnosis", "trt-who-is-it-for"],
    sections: [
      {
        heading: "What SHBG does",
        body: [
          "Sex hormone-binding globulin (SHBG) is a protein that binds to testosterone in the bloodstream. Testosterone bound to SHBG is not biologically available for the body to use — only the unbound portion is active.",
        ],
      },
      {
        heading: "Total testosterone vs free testosterone",
        body: [
          "Total testosterone measures everything in the blood — bound and unbound together. Free testosterone measures only the unbound, biologically active portion. A man can have a normal total testosterone reading while his free testosterone tells a different story, depending on his SHBG level.",
        ],
      },
      {
        heading: "Why SHBG shifts the picture",
        body: [
          "SHBG levels themselves vary with age, obesity, thyroid function and liver health, among other factors. Someone with high SHBG can have low free testosterone despite a normal-looking total figure, and vice versa — which is why SHBG is measured alongside testosterone, not assumed to be constant.",
        ],
      },
      {
        heading: "Why this matters for diagnosis",
        body: [
          "Relying on total testosterone alone can miss a genuine deficiency, or suggest one that isn't really there. This is part of why a full hormonal assessment looks at total and free testosterone together with SHBG, rather than treating a single number as the whole story.",
        ],
      },
    ],
  },
  {
    slug: "testosterone-and-erectile-dysfunction",
    title: "Testosterone and Erectile Dysfunction: How Are They Connected?",
    category: "Testosterone",
    excerpt:
      "Low testosterone can contribute to erectile dysfunction, but it is rarely the only factor. Here's how the two are assessed together.",
    datePublished: PUBLISHED_R7,
    clinicalReviewRequired: true,
    relatedHref: "/mens-health/testosterone",
    relatedLabel: "Testosterone & Male Hormonal Health",
    secondaryRelatedHref: "/erectile-dysfunction",
    secondaryRelatedLabel: "Erectile Dysfunction Assessment & Treatment",
    relatedArticleSlugs: ["low-testosterone-symptoms-diagnosis"],
    sections: [
      {
        heading: "Testosterone's role in erectile function",
        body: [
          "Testosterone contributes to libido and supports several aspects of the erectile process, but an erection itself depends primarily on vascular and neurological mechanisms — healthy blood flow and nerve signalling. Testosterone is a contributor, not the sole mechanism.",
        ],
      },
      {
        heading: "Why treating testosterone alone doesn't always resolve ED",
        body: [
          "When vascular, neurological or psychosexual factors are the primary driver of erectile dysfunction, testosterone treatment on its own is unlikely to fully resolve it. This is the practical reason the two are assessed together rather than assuming a low reading explains the whole picture.",
        ],
      },
      {
        heading: "When testosterone assessment is part of an ED work-up",
        body: [
          "Hormonal assessment is a standard part of a full erectile dysfunction evaluation, used to identify whether testosterone is a relevant contributor — not a routine justification for automatically prescribing it.",
        ],
      },
      {
        heading: "Two conditions, one assessment",
        body: [
          "Because erectile function, hormonal health and psychosexual context can all be relevant to the same presentation, both are considered within the same assessment rather than treated as entirely separate problems.",
        ],
      },
    ],
  },
];

export function getInsightArticle(slug: string): InsightArticle | undefined {
  return insightArticles.find((article) => article.slug === slug);
}

/**
 * Resolves `article.relatedArticleSlugs` to real `InsightArticle` objects,
 * capped at 4. Silently drops any slug that doesn't resolve (defensive —
 * matches the fail-safe pattern used elsewhere in this codebase, e.g.
 * `AuthorityStripSection`'s empty-array guard) rather than throwing, so a
 * future typo in a slug degrades gracefully instead of breaking the page.
 */
export function getRelatedArticles(article: InsightArticle): InsightArticle[] {
  if (!article.relatedArticleSlugs) return [];
  return article.relatedArticleSlugs
    .map((slug) => getInsightArticle(slug))
    .filter((related): related is InsightArticle => related !== undefined && related.slug !== article.slug)
    .slice(0, 4);
}
