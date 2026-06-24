'use client';

import { useId } from 'react';
import type { ReactNode, CSSProperties, ElementType } from 'react';

interface GlassSurfaceProps {
  children?: ReactNode;
  className?: string;
  borderRadius?: number;
  /** feTurbulence baseFrequency — controls grain density */
  displace?: number;
  /** feDisplacementMap scale — controls refraction warp strength */
  distortionScale?: number;
  /** Chromatic shift on red channel (px) */
  redOffset?: number;
  /** Chromatic shift on green channel (px) */
  greenOffset?: number;
  /** Chromatic shift on blue channel (px) */
  blueOffset?: number;
  /** White-layer brightness (0–1) */
  brightness?: number;
  /** Overall opacity */
  opacity?: number;
  /** CSS mix-blend-mode for the distortion overlay */
  mixBlendMode?: CSSProperties['mixBlendMode'];
  style?: CSSProperties;
  as?: ElementType;
}

export default function GlassSurface({
  children,
  className = '',
  borderRadius = 24,
  displace = 0.55,
  distortionScale = 28,
  redOffset = 0,
  greenOffset = 8,
  blueOffset = 16,
  brightness = 0.12,
  opacity = 1,
  mixBlendMode = 'screen',
  style,
  as: Tag = 'div',
}: GlassSurfaceProps) {
  const uid = useId().replace(/:/g, '');
  const fR = `gs-r-${uid}`;
  const fG = `gs-g-${uid}`;
  const fB = `gs-b-${uid}`;

  return (
    <Tag
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius, opacity, ...style }}
    >
      {/* Backdrop blur base layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: 'blur(28px) saturate(170%)',
          WebkitBackdropFilter: 'blur(28px) saturate(170%)',
          background: 'rgba(255,255,255,0.18)',
          borderRadius,
          zIndex: 0,
        }}
      />

      {/* SVG chromatic-aberration distortion overlay — simulates glass refraction */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none"
        width="100%"
        height="100%"
        style={{ zIndex: 1, borderRadius, mixBlendMode }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Red channel distortion */}
          <filter id={fR} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency={`${displace} ${displace * 0.75}`} numOctaves="4" seed="3" stitchTiles="stitch" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={distortionScale + redOffset} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* Green channel distortion */}
          <filter id={fG} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency={`${displace} ${displace * 0.75}`} numOctaves="4" seed="3" stitchTiles="stitch" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={distortionScale + greenOffset} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* Blue channel distortion */}
          <filter id={fB} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency={`${displace} ${displace * 0.75}`} numOctaves="4" seed="3" stitchTiles="stitch" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={distortionScale + blueOffset} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        {/* Three semi-transparent layers, each with different displacement = chromatic aberration */}
        <rect width="100%" height="100%" fill={`rgba(255,${Math.round(brightness * 120)},${Math.round(brightness * 120)},${brightness})`} filter={`url(#${fR})`} rx={borderRadius} />
        <rect width="100%" height="100%" fill={`rgba(${Math.round(brightness * 120)},255,${Math.round(brightness * 120)},${brightness})`} filter={`url(#${fG})`} rx={borderRadius} />
        <rect width="100%" height="100%" fill={`rgba(${Math.round(brightness * 120)},${Math.round(brightness * 120)},255,${brightness})`} filter={`url(#${fB})`} rx={borderRadius} />
      </svg>

      {/* Top-edge highlight — bright rim that looks like light catching the glass */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: '45%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.08) 55%, transparent 100%)',
          borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
          zIndex: 2,
        }}
      />

      {/* Bottom subtle inner shadow */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '40%',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.06) 0%, transparent 100%)',
          borderRadius: `0 0 ${borderRadius}px ${borderRadius}px`,
          zIndex: 2,
        }}
      />

      {/* Glass border */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          border: '1px solid rgba(255,255,255,0.5)',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          borderRadius,
          zIndex: 3,
        }}
      />

      {/* Content */}
      <div className="relative" style={{ zIndex: 4 }}>
        {children}
      </div>
    </Tag>
  );
}
