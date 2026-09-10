import Link from "next/link";
import { Layers3, Scan, Pipette, Ruler, Activity, CalendarCheck } from "lucide-react";
import styles from "./Editorial.module.css";

const steps = [
  ["Consultation", "Discuss your goals, medical history and expectations."],
  ["Anatomical assessment", "Assess individual anatomy and any previous treatment."],
  ["Individual treatment planning", "Discuss suitability, options, limitations and risks."],
  ["Procedure", "Proceed only after assessment and an agreed treatment plan."],
  ["Settling / tissue adaptation period", "Follow the aftercare guidance specific to your procedure."],
  ["Follow-up", "Review your progress and any concerns with your clinician."],
];
export function ClinicalPathway() {
  return <ol className={styles.pathway}>{steps.map(([title,body],index)=><li className={styles.step} key={title}>
    <span className={styles.stepNumber}>{String(index+1).padStart(2,"0")}</span>
    <h3 className="mt-3 font-display text-xl">{title}</h3><p className="mt-3 max-w-xs text-sm text-muted-foreground">{body}</p>
  </li>)}</ol>;
}
export function ProcedureFramework() {
  return <figure className={styles.framework}>
    <p className="text-xs uppercase tracking-widest text-accent-strong">The planning framework</p>
    <svg viewBox="0 0 500 360" className={styles.contour} fill="none" aria-hidden="true">
      {[0,1,2,3,4].map(i=><ellipse key={i} cx="250" cy="170" rx={60+i*26} ry={45+i*21} transform={`rotate(-25 250 170)`} stroke="currentColor" strokeWidth={i===2?2:1} />)}
      <path d="M55 170H445M250 20V320" stroke="currentColor" strokeDasharray="3 7" opacity=".5" />
      <circle cx="250" cy="170" r="5" fill="currentColor" />
    </svg>
    <figcaption className="text-sm text-muted-foreground">Anatomy · Tissue characteristics · Previous treatment<br /><span className="mt-2 block text-xs">Abstract planning illustration</span></figcaption>
  </figure>;
}
const variabilityFactors = [
  { label: "Anatomy", Icon: Scan },
  { label: "Technique", Icon: Layers3 },
  { label: "Product", Icon: Pipette },
  { label: "Volume", Icon: Ruler },
  { label: "Tissue response", Icon: Activity },
  { label: "Follow-up", Icon: CalendarCheck },
];
export function VariabilityFactors() {
  return <ul className={styles.variables}>{variabilityFactors.map(({ label, Icon }) => <li key={label}>
    <Icon aria-hidden="true" strokeWidth={1.25} /><p className="font-display text-xl">{label}</p>
  </li>)}</ul>;
}
type CareStage = {title:string;description:string;href?:string;linkLabel?:string};
export function CareStages({items}: {items:CareStage[]}) {
  return <ol className={styles.care}>{items.map((item,index)=><li key={item.title}>
    <span className={styles.stepNumber}>{String(index+1).padStart(2,"0")}</span>
    <div><p className="text-xs uppercase tracking-widest text-foreground">{["Understand before treatment","Care during recovery","Assess concerns individually"][index]}</p><h3 className="mt-2 font-display text-2xl">{item.title}</h3><p className="mt-3 text-sm text-muted-foreground">{item.description}</p>{item.href && <Link className="mt-4 inline-block text-sm underline decoration-accent-strong underline-offset-4" href={item.href}>{item.linkLabel}</Link>}</div>
  </li>)}</ol>;
}
