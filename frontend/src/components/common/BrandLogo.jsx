import React from 'react';

/**
 * Perfynix AI — Futuristic Cybersecurity & AI Brand Mark Logo
 * Features a sharp angular metallic cyber shield with a quantum AI core aperture (No Lock, No Letters).
 */
export default function BrandLogo({
  size = 36,
  className = '',
  showText = true,
  textClassName = '',
  titleClassName = 'text-lg sm:text-[20px]',
  subtitleClassName = 'text-[9.5px] sm:text-[10.5px]',
  subtitle = "AI Security Platform"
}) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Sharp Angular Cyber Shield & Quantum AI Aperture Emblem */}
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transition-transform duration-300 hover:scale-105"
        >
          <defs>
            {/* Outer Shield Metallic Cyber Gradient */}
            <linearGradient id="pfxShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>

            {/* Dark Metallic Shield Fill Gradient */}
            <linearGradient id="pfxShieldFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Quantum Core Neon Gradient */}
            <linearGradient id="pfxCoreGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>

            {/* Core Glow Filter */}
            <filter id="pfxGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Sharp Cyber Security Shield Boundary */}
          <path
            d="M 50 6 L 86 18 L 86 46 C 86 72 50 94 50 94 C 50 94 14 72 14 46 L 14 18 Z"
            fill="url(#pfxShieldFill)"
            stroke="url(#pfxShieldGrad)"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Inner Geometric Shield Accent */}
          <path
            d="M 50 14 L 78 24 L 78 45 C 78 64 50 82 50 82 C 50 82 22 64 22 45 L 22 24 Z"
            fill="none"
            stroke="url(#pfxCoreGrad)"
            strokeWidth="1.8"
            strokeDasharray="6 3"
            opacity="0.65"
          />

          {/* Circuit Trace Connectors */}
          <line x1="50" y1="14" x2="50" y2="26" stroke="#00F0FF" strokeWidth="2" opacity="0.85" />
          <line x1="50" y1="70" x2="50" y2="82" stroke="#A855F7" strokeWidth="2" opacity="0.85" />
          <line x1="22" y1="48" x2="35" y2="48" stroke="#3B82F6" strokeWidth="1.8" opacity="0.75" />
          <line x1="78" y1="48" x2="65" y2="48" stroke="#06B6D4" strokeWidth="1.8" opacity="0.75" />

          {/* Outer Rotating Quantum Aperture Ring */}
          <circle
            cx="50"
            cy="48"
            r="22"
            fill="none"
            stroke="url(#pfxCoreGrad)"
            strokeWidth="2.5"
            strokeDasharray="18 6 5 6"
            opacity="0.9"
          />

          {/* Inner Radar Scanner Iris Ring */}
          <circle
            cx="50"
            cy="48"
            r="14"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="1.6"
            strokeDasharray="10 4"
            opacity="0.85"
          />

          {/* Central AI Quantum Core Diamond Aperture (NO LOCK) */}
          <polygon
            points="50,36 60,48 50,60 40,48"
            fill="url(#pfxCoreGrad)"
            fillOpacity="0.85"
            stroke="#00F0FF"
            strokeWidth="1.5"
            filter="url(#pfxGlow)"
          />

          {/* Quantum AI Bright Center Lens Node */}
          <circle cx="50" cy="48" r="4" fill="#FFFFFF" filter="url(#pfxGlow)" />

          {/* Peripheral Circuit Nodes */}
          <circle cx="50" cy="26" r="2.5" fill="#00F0FF" />
          <circle cx="50" cy="70" r="2.5" fill="#A855F7" />
          <circle cx="35" cy="48" r="2.5" fill="#3B82F6" />
          <circle cx="65" cy="48" r="2.5" fill="#06B6D4" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className={`flex flex-col justify-center text-left ${textClassName}`}>
          <span className={`${titleClassName} font-black tracking-tight text-slate-900 dark:text-white leading-none flex items-center gap-1`}>
            <span>Perfynix</span>
            <span className="bg-gradient-to-r from-brand-600 via-cyan-500 to-accent-600 bg-clip-text text-transparent font-black">
              AI
            </span>
          </span>
          <span className={`${subtitleClassName} font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 whitespace-nowrap`}>
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
}
