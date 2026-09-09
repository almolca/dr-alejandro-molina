import styles from "./DopplerWaveformPanel.module.css";

export type DopplerPattern = "normal" | "arterial-insufficiency" | "veno-occlusive";

const PATTERN_CONFIG: Record<DopplerPattern, { peakY: number; troughY: number; psvLabel: string; edvLabel: string }> = {
  normal: { peakY: 18, troughY: 124, psvLabel: "PSV — adequate", edvLabel: "EDV — falls near zero" },
  "arterial-insufficiency": { peakY: 68, troughY: 120, psvLabel: "PSV — reduced", edvLabel: "EDV — falls near zero" },
  "veno-occlusive": { peakY: 18, troughY: 68, psvLabel: "PSV — adequate", edvLabel: "EDV — persistently elevated" },
};

const VIEW_WIDTH = 600;
const VIEW_HEIGHT = 160;
const CYCLES = 3;
const ZERO_LINE_Y = 130;

/** Hand-shaped pulsatile trace: steep systolic upstroke, rounded peak, decay to a per-pattern diastolic trough, held flat until the next cycle. */
function buildWaveformPath(peakY: number, troughY: number): string {
  const cycleWidth = VIEW_WIDTH / CYCLES;
  let d = `M0,${troughY}`;
  for (let i = 0; i < CYCLES; i++) {
    const x0 = i * cycleWidth;
    const xPeak = x0 + cycleWidth * 0.18;
    const xDecayEnd = x0 + cycleWidth * 0.5;
    const xCycleEnd = x0 + cycleWidth;
    d += ` C${x0 + cycleWidth * 0.06},${troughY} ${x0 + cycleWidth * 0.1},${peakY} ${xPeak},${peakY}`;
    d += ` C${xPeak + cycleWidth * 0.08},${peakY} ${x0 + cycleWidth * 0.32},${troughY} ${xDecayEnd},${troughY}`;
    d += ` L${xCycleEnd},${troughY}`;
  }
  return d;
}

export function DopplerWaveformPanel({
  pattern,
  label,
  description,
  className = "",
}: {
  pattern: DopplerPattern;
  label: string;
  description: string;
  className?: string;
}) {
  const { peakY, troughY, psvLabel, edvLabel } = PATTERN_CONFIG[pattern];
  const path = buildWaveformPath(peakY, troughY);

  return (
    <div className={`${styles.panel} ${className}`}>
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className={styles.trace}
        role="img"
        aria-label={`${label}: ${description}`}
      >
        <rect x="0" y="0" width={VIEW_WIDTH} height={VIEW_HEIGHT} className={styles.panelBg} />
        {[40, 80, 120].map((y) => (
          <line key={y} x1="0" x2={VIEW_WIDTH} y1={y} y2={y} className={styles.gridLine} />
        ))}
        <line x1="0" x2={VIEW_WIDTH} y1={ZERO_LINE_Y} y2={ZERO_LINE_Y} className={styles.floorLine} strokeDasharray="2 6" />
        <path d={path} className={styles.wave} />
        <text x="12" y={Math.max(peakY - 8, 14)} className={styles.annotation}>{psvLabel}</text>
        <text x="12" y={troughY + 16} className={styles.annotation}>{edvLabel}</text>
      </svg>
      <p className={styles.panelLabel}>{label}</p>
      <p className={styles.panelCaption}>{description}</p>
    </div>
  );
}
