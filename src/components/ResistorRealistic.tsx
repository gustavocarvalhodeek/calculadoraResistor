import React from 'react';
import { BandsState } from '../App';
import { COLOR_HEX } from '../lib/colorCode';
import { DirectResult } from '../lib/compute';

interface Props {
  bands: BandsState;
  result: DirectResult;
}

// Anéis: até 6
export default function ResistorRealistic({ bands, result }: Props) {
  const rings: string[] = [];
  rings.push(bands.d1);
  rings.push(bands.d2);
  if (bands.count >= 5) rings.push(bands.d3!);
  rings.push(bands.mult);
  rings.push(bands.tol);
  if (bands.count === 6 && bands.tcr) rings.push(bands.tcr);

  const label = `Resistor ${bands.count} bandas: ${rings.join(', ')} — ${result.formatted}`;

  const ringPositions = (
    bands.count === 4 ? [35, 45, 70, 80] : bands.count === 5 ? [30, 40, 50, 72, 82] : [28, 38, 48, 64, 78, 88]
  );

  return (
    <figure className="w-full rounded-xl bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-4 shadow-soft">
      <svg
        role="img"
        aria-label={label}
        viewBox="0 0 300 120"
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="lead" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b8bcc2" />
            <stop offset="50%" stopColor="#f0f3f6" />
            <stop offset="100%" stopColor="#9aa0a6" />
          </linearGradient>
          <linearGradient id="bodyShine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e9e3d5" />
            <stop offset="50%" stopColor="#d9cfb5" />
            <stop offset="100%" stopColor="#c9bd9a" />
          </linearGradient>
          <radialGradient id="specular" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Sombra */}
        <ellipse cx="150" cy="92" rx="120" ry="8" fill="#000" opacity="0.15" />

        {/* Leads */}
        <rect x="10" y="56" width="80" height="8" rx="4" fill="url(#lead)" />
        <rect x="210" y="56" width="80" height="8" rx="4" fill="url(#lead)" />

        {/* Corpo */}
        <g filter="url(#shadow)">
          <rect x="80" y="34" width="140" height="52" rx="26" fill="url(#bodyShine)" />
          <rect x="80" y="34" width="140" height="52" rx="26" fill="url(#specular)" />
        </g>

        {/* Anéis */}
        {ringPositions.map((x, i) => {
          const colorKey = rings[i] as keyof typeof COLOR_HEX | undefined;
          if (!colorKey) return null;
          const fill = COLOR_HEX[colorKey];
          return (
            <g key={i}>
              <rect x={x + 70} y="34" width="8" height="52" rx="2" fill="#000" opacity="0.15" />
              <rect x={x + 68} y="34" width="8" height="52" rx="2" fill={fill} />
              {/* brilho sutil no anel */}
              <rect x={x + 68} y="34" width="8" height="20" rx="2" fill="#fff" opacity="0.15" />
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-sm opacity-80">{label}</figcaption>
    </figure>
  );
}
