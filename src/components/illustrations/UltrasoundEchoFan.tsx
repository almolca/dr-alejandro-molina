/**
 * Simulated grayscale B-mode ultrasound "sector fan" motif — spec
 * R7.1.3 §2A. Purely decorative/illustrative (pure SVG geometry, no
 * bitmap, no real scan data — matches the codebase's established
 * convention, see EditorialTexture.tsx), paired with
 * DopplerWaveformPanel on the Penile Doppler page's intro section so
 * the pairing reads closer to genuine clinical ultrasound imagery
 * while staying explicitly illustrative — never a real patient study.
 * `aria-hidden`: the caption text rendered alongside it in the page
 * ("Illustrative simulated ultrasound image") carries the meaning.
 */
export function UltrasoundEchoFan({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="echoFanGradient" cx="50%" cy="5%" r="95%">
          <stop offset="0%" stopColor="#484a43" />
          <stop offset="55%" stopColor="#26281f" />
          <stop offset="100%" stopColor="#121310" />
        </radialGradient>
        <filter id="echoFanGrain" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.07 0" />
        </filter>
      </defs>
      <rect x="0" y="0" width="240" height="200" fill="#0d0e0c" />
      <path d="M120,10 L13.9,161.6 A185,185 0 0 0 226.1,161.6 Z" fill="url(#echoFanGradient)" />
      <path d="M120,10 L13.9,161.6 A185,185 0 0 0 226.1,161.6 Z" fill="none" filter="url(#echoFanGrain)" opacity="0.5" />
      <path d="M79.9,67.3 A70,70 0 0 0 160.2,67.3" fill="none" stroke="#6b6d63" strokeWidth="0.5" opacity="0.3" />
      <path d="M51.2,108.3 A120,120 0 0 0 188.8,108.3" fill="none" stroke="#6b6d63" strokeWidth="0.5" opacity="0.3" />
      <path d="M22.5,149.3 A170,170 0 0 0 217.5,149.3" fill="none" stroke="#6b6d63" strokeWidth="0.5" opacity="0.3" />
      <path d="M120,10 L13.9,161.6 A185,185 0 0 0 226.1,161.6 Z" fill="none" stroke="#4a4c46" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}
