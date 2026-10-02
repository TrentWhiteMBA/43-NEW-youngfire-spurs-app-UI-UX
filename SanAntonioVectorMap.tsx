import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface SanAntonioVectorMapProps {
  className?: string;
  opacity?: number;
  maskId?: string;
  show3dDepth?: boolean;
}

export const SanAntonioVectorMap: React.FC<SanAntonioVectorMapProps> = ({
  className = '',
  opacity = 0.85
}) => {
  const [imgSrc, setImgSrc] = useState<string>('/san_antonio_dark_map.png');
  const [imgError, setImgError] = useState<boolean>(false);

  const content = (
    <div 
      id="san-antonio-stationary-background"
      className={`fixed inset-0 pointer-events-none select-none overflow-hidden bg-black ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity
      }}
      aria-hidden="true"
    >
      {/* 1. Real High-Resolution Dark Monochrome Street Grid (Strictly fixed to viewport) */}
      <img
        src={imgSrc}
        alt="San Antonio City Street Network"
        className="w-full h-full object-cover object-center filter grayscale contrast-[145%] brightness-[90%] pointer-events-none select-none"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          pointerEvents: 'none'
        }}
        onError={() => {
          if (!imgError) {
            setImgError(true);
            setImgSrc('/san_antonio_dark_map.png');
          }
        }}
      />

      {/* 2. Vector Highway & Street Geometry Overlay (Loop 1604, Loop 410, I-10, I-35, Downtown Grid) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="saGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.18" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Center Glow (San Antonio Downtown Sanctuary Core) */}
        <circle cx="500" cy="500" r="320" fill="url(#saGlow)" />

        {/* Outer Loop 1604 (Charles W. Anderson Loop) */}
        <ellipse cx="500" cy="500" rx="420" ry="380" fill="none" stroke="#64748B" strokeWidth="2.2" strokeDasharray="8 4" opacity="0.6" />
        
        {/* Inner Loop 410 (Connally Loop) */}
        <ellipse cx="500" cy="500" rx="250" ry="230" fill="none" stroke="#94A3B8" strokeWidth="2.8" opacity="0.75" />
        
        {/* Interstate 10 (Northwest to East Corridor) */}
        <path d="M 120 180 Q 320 360, 500 500 T 920 620" fill="none" stroke="#CBD5E1" strokeWidth="3" opacity="0.8" />
        
        {/* Interstate 35 (Northeast to Southwest Corridor) */}
        <path d="M 880 150 Q 660 340, 500 500 T 150 860" fill="none" stroke="#CBD5E1" strokeWidth="3" opacity="0.8" />
        
        {/* US-281 / I-37 (North-South Axis) */}
        <path d="M 500 80 L 500 500 L 580 920" fill="none" stroke="#CBD5E1" strokeWidth="2.4" opacity="0.75" />
        
        {/* US-90 / I-10 West-East Corridor */}
        <path d="M 80 540 L 500 500 L 920 540" fill="none" stroke="#94A3B8" strokeWidth="2" opacity="0.65" />

        {/* Downtown San Antonio Street Grid Network */}
        <g stroke="#64748B" strokeWidth="0.8" opacity="0.45">
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={`sa-h-${i}`} x1="410" y1={430 + i * 11} x2="590" y2={430 + i * 11} />
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={`sa-v-${i}`} x1={410 + i * 13} y1="430" x2={410 + i * 13} y2={580} />
          ))}
        </g>

        {/* YoungFire Sanctuary Holy Beacon Pin (San Antonio, TX) */}
        <circle cx="500" cy="500" r="6" fill="#F59E0B" />
        <circle cx="500" cy="500" r="14" fill="none" stroke="#F59E0B" strokeWidth="1.5" opacity="0.8" className="animate-ping" />
      </svg>

      {/* 3. Subtle Edge Vignette (Softens outer boundary without obscuring center roads) */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 75%, #000000 98%)'
        }}
      />
    </div>
  );

  // Render via portal directly into document.body to bypass ANY CSS perspective/transform containing blocks
  if (typeof document !== 'undefined' && document.body) {
    return createPortal(content, document.body);
  }

  return content;
};

export default SanAntonioVectorMap;
