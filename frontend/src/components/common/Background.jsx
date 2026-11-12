import { useMemo } from 'react';
import FloatingIcons from './FloatingIcons';

/**
 * Unified Master Background Component.
 * Provides a dynamic, multi-layered HTML/CSS/SVG background system
 * across Auth screens, Application Shell, and Standalone pages.
 */
export default function Background() {
  const particles = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        top: `${(index * 61) % 100}%`,
        delay: `${(index % 11) * -0.8}s`,
        duration: `${8 + (index % 9)}s`,
        size: index % 3 === 0 ? '5px' : index % 3 === 1 ? '3px' : '2px',
        hue: index % 4,
      })),
    []
  );

  const nodes = useMemo(
    () => [
      { x: 8, y: 22, d: 0 },
      { x: 15, y: 55, d: 1.5 },
      { x: 6, y: 78, d: 3 },
      { x: 88, y: 18, d: 2 },
      { x: 92, y: 50, d: 0.8 },
      { x: 85, y: 82, d: 4 },
      { x: 22, y: 12, d: 2.5 },
      { x: 78, y: 88, d: 1.2 },
      { x: 12, y: 40, d: 3.5 },
    ],
    []
  );

  return (
    <div className="ambient" aria-hidden="true">
      {/* L1: Base Atmospheric Gradient */}
      <div className="ambient-base" />

      {/* L2: Atmospheric Glow Blobs */}
      <div className="ambient-glow glow-one" />
      <div className="ambient-glow glow-two" />
      <div className="ambient-glow glow-three" />
      <div className="ambient-glow glow-four" />
      <div className="ambient-glow glow-five" />

      {/* L3: Technical Grid Plane */}
      <div className="grid-plane" />

      {/* L4: Dot Matrices */}
      <div className="dot-matrix matrix-one" />
      <div className="dot-matrix matrix-two" />
      <div className="dot-matrix matrix-three" />

      {/* L5: Hexagonal Security Fields & Lock Badges */}
      <div className="hex-field hex-left">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="hex-field hex-right">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="hex-field hex-center-left">
        <span />
        <span />
        <span />
      </div>
      <div className="background-lock lock-left" />
      <div className="background-lock lock-right" />

      {/* L6: Circuit Traces with Pulsing Nodes */}
      <svg className="circuit circuit-left" viewBox="0 0 430 360" fill="none">
        <path d="M0 88h120l36 36h84l30-30h160" />
        <path d="M0 132h86l24 24h102l38 38h180" />
        <path d="M22 276h90l38-38h94l35-35h120" />
        <path d="M0 200h60l20-20h100l28 28h140" />
        <circle cx="120" cy="88" r="3" />
        <circle cx="240" cy="124" r="3" />
        <circle cx="250" cy="230" r="3" />
        <circle cx="342" cy="276" r="3" />
        <circle cx="80" cy="200" r="2.5" />
        <circle cx="208" cy="208" r="2.5" />
      </svg>
      <svg className="circuit circuit-right" viewBox="0 0 430 360" fill="none">
        <path d="M430 96H300l-28 28h-94l-34 34H0" />
        <path d="M430 166h-88l-40 40h-98l-30 30H20" />
        <path d="M430 280h-134l-38-38h-98l-40-40H0" />
        <path d="M430 220h-80l-24-24h-90l-32 32H10" />
        <circle cx="300" cy="96" r="3" />
        <circle cx="208" cy="124" r="3" />
        <circle cx="152" cy="230" r="3" />
        <circle cx="296" cy="280" r="3" />
        <circle cx="350" cy="220" r="2.5" />
        <circle cx="196" cy="196" r="2.5" />
      </svg>

      {/* L7: Network Node Connections */}
      <svg className="network network-left" viewBox="0 0 200 300" fill="none">
        <line x1="40" y1="50" x2="120" y2="120" />
        <line x1="120" y1="120" x2="60" y2="220" />
        <line x1="40" y1="50" x2="30" y2="160" />
        <line x1="30" y1="160" x2="120" y2="120" />
        <line x1="60" y1="220" x2="140" y2="260" />
        <circle cx="40" cy="50" r="4" />
        <circle cx="120" cy="120" r="5" />
        <circle cx="60" cy="220" r="3.5" />
        <circle cx="30" cy="160" r="3" />
        <circle cx="140" cy="260" r="3" />
      </svg>
      <svg className="network network-right" viewBox="0 0 200 300" fill="none">
        <line x1="160" y1="60" x2="80" y2="140" />
        <line x1="80" y1="140" x2="150" y2="240" />
        <line x1="160" y1="60" x2="170" y2="180" />
        <line x1="170" y1="180" x2="80" y2="140" />
        <line x1="150" y1="240" x2="60" y2="270" />
        <circle cx="160" cy="60" r="4" />
        <circle cx="80" cy="140" r="5" />
        <circle cx="150" cy="240" r="3.5" />
        <circle cx="170" cy="180" r="3" />
        <circle cx="60" cy="270" r="3" />
      </svg>

      {/* L8: Concentric Radar Security Rings */}
      <div className="radar radar-left">
        <i />
        <i />
        <i />
        <b />
      </div>
      <div className="radar radar-right">
        <i />
        <i />
        <i />
        <b />
      </div>
      <div className="radar radar-bottom-right">
        <i />
        <i />
        <i />
        <b />
      </div>

      {/* L9: Flowing Wave Particle Ribbons */}
      <svg
        className="flow-field flow-field-left"
        viewBox="0 0 720 360"
        preserveAspectRatio="none"
        fill="none"
      >
        <path d="M-30 218C95 255 166 320 290 250S490 42 750 154" />
        <path d="M-30 228C95 265 166 330 290 260S490 52 750 164" />
        <path d="M-30 238C95 275 166 340 290 270S490 62 750 174" />
        <path d="M-30 248C95 285 166 350 290 280S490 72 750 184" />
        <path d="M-30 258C95 295 166 360 290 290S490 82 750 194" />
        <path d="M-30 268C95 305 166 370 290 300S490 92 750 204" />
        <path d="M-30 278C95 315 166 380 290 310S490 102 750 214" />
        <path d="M-30 288C95 325 166 390 290 320S490 112 750 224" />
        <path d="M-30 298C95 335 166 400 290 330S490 122 750 234" />
        <path d="M-30 308C95 345 166 410 290 340S490 132 750 244" />
        <path d="M-30 318C95 355 166 420 290 350S490 142 750 254" />
        <path d="M-30 328C95 365 166 430 290 360S490 152 750 264" />
      </svg>
      <svg
        className="flow-field flow-field-right"
        viewBox="0 0 720 360"
        preserveAspectRatio="none"
        fill="none"
      >
        <path d="M-30 286C120 170 230 180 330 246S535 330 750 150" />
        <path d="M-30 296C120 180 230 190 330 256S535 340 750 160" />
        <path d="M-30 306C120 190 230 200 330 266S535 350 750 170" />
        <path d="M-30 316C120 200 230 210 330 276S535 360 750 180" />
        <path d="M-30 326C120 210 230 220 330 286S535 370 750 190" />
        <path d="M-30 336C120 220 230 230 330 296S535 380 750 200" />
        <path d="M-30 346C120 230 230 240 330 306S535 390 750 210" />
        <path d="M-30 356C120 240 230 250 330 316S535 400 750 220" />
        <path d="M-30 366C120 250 230 260 330 326S535 410 750 230" />
        <path d="M-30 376C120 260 230 270 330 336S535 420 750 240" />
        <path d="M-30 386C120 270 230 280 330 346S535 430 750 250" />
      </svg>
      <div className="wave wave-one" />
      <div className="wave wave-two" />
      <div className="wave wave-three" />

      {/* L10: Light Trails */}
      <div className="light-trail trail-one" />
      <div className="light-trail trail-two" />
      <div className="light-trail trail-three" />

      {/* L11: Floating Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className={`particle particle-hue-${p.hue}`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* L12: Pulsing Network Nodes */}
      {nodes.map((n, i) => (
        <span
          key={`node-${i}`}
          className="net-node"
          style={{ left: `${n.x}%`, top: `${n.y}%`, animationDelay: `${n.d}s` }}
        />
      ))}

      {/* L13: Floating Tech Icons */}
      <FloatingIcons />

      {/* L14: Foreground Depth Vignette (Keeps Center Clean) */}
      <div className="depth-vignette" />
    </div>
  );
}
