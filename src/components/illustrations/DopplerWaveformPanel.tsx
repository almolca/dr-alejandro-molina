import { useId } from "react";
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

/** Closes the open wave trace down to the zero-line, for use as a fill area — spec R7.1.3 §2C: a filled "spectral envelope" reads closer to a real Doppler display than a bare stroked line. */
function buildFillPath(wavePath: string): string {
  return `${wavePath} L${VIEW_WIDTH},${ZERO_LINE_Y} L0,${ZERO_LINE_Y} Z`;
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
  const fillPath = buildFillPath(path);
  const uid = useId();

  return (
    <div className={`${styles.panel} ${className}`}>
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className={styles.trace}
        role="img"
        aria-label={`${label}: ${description}`}
      >
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cba876" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#cba876" stopOpacity="0.02" />
          </linearGradient>
          <filter id={`${uid}-grain`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0" />
          </filter>
        </defs>
        <rect x="0" y="0" width={VIEW_WIDTH} height={VIEW_HEIGHT} className={styles.panelBg} />
        <rect x="0" y="0" width={VIEW_WIDTH} height={VIEW_HEIGHT} filter={`url(#${uid}-grain)`} opacity="0.4" />
        {[40, 80, 120].map((y) => (
          <line key={y} x1="0" x2={VIEW_WIDTH} y1={y} y2={y} className={styles.gridLine} />
        ))}
        <line x1="0" x2={VIEW_WIDTH} y1={ZERO_LINE_Y} y2={ZERO_LINE_Y} className={styles.floorLine} strokeDasharray="2 6" />
        <path d={fillPath} fill={`url(#${uid}-fill)`} stroke="none" />
        <path d={path} className={styles.wave} />
        <text x="12" y={Math.max(peakY - 8, 14)} className={styles.annotation}>{psvLabel}</text>
        <text x="12" y={troughY + 16} className={styles.annotation}>{edvLabel}</text>
        <text x="8" y={VIEW_HEIGHT - 6} className={styles.axisLabel}>Time →</text>
        <text x={VIEW_WIDTH - 8} y="14" textAnchor="end" className={styles.axisLabel}>Velocity</text>
      </svg>
      <p className={styles.panelLabel}>{label}</p>
      <p className={styles.panelCaption}>{description}</p>
    </div>
  );
}
