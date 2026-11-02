import React, { useState } from 'react';

/**
 * Fine Antique Gold Lotus Emblem
 */
export const RoyalLotusEmblem: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 120 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Outer aura */}
    <circle cx="60" cy="44" r="30" stroke="#C6A15B" strokeOpacity="0.25" strokeWidth="0.8" strokeDasharray="2 3" />
    {/* Side outer petals */}
    <path
      d="M60 58C38 58 20 48 14 36C26 34 38 40 46 48"
      stroke="#C6A15B"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M60 58C82 58 100 48 106 36C94 34 82 40 74 48"
      stroke="#C6A15B"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    {/* Mid petals */}
    <path
      d="M60 56C44 52 32 38 30 22C42 25 51 35 55 48"
      stroke="#E7D6AD"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M60 56C76 52 88 38 90 22C78 25 69 35 65 48"
      stroke="#E7D6AD"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    {/* Center sacred lotus bud */}
    <path
      d="M60 10C68 23 73 35 60 56C47 35 52 23 60 10Z"
      fill="#C6A15B"
      fillOpacity="0.18"
      stroke="#E7D6AD"
      strokeWidth="1.6"
    />
    {/* Base stem & bindu */}
    <path d="M42 63H78" stroke="#C6A15B" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M48 68H72" stroke="#C6A15B" strokeOpacity="0.6" strokeWidth="1" strokeLinecap="round" />
    <circle cx="60" cy="6" r="2" fill="#E7D6AD" />
    <circle cx="60" cy="73" r="1.8" fill="#C6A15B" />
  </svg>
);

/**
 * Animated Brass Diya Lamp with Warm Golden Flame
 */
export const GlowingDiya: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  className = '',
  size = 'md',
}) => {
  const dims = size === 'sm' ? 'w-10 h-12' : size === 'lg' ? 'w-16 h-20' : 'w-12 h-14';
  return (
    <div className={`relative inline-flex items-center justify-center ${dims} ${className}`} aria-hidden="true">
      {/* Warm radial glow */}
      <div className="absolute -top-2 w-8 h-8 rounded-full bg-[#E7D6AD]/30 blur-md animate-pulse" />
      <svg viewBox="0 0 64 72" fill="none" className="w-full h-full overflow-visible">
        {/* Flame */}
        <g className="animate-diya">
          <path
            d="M32 8C36 16 39 22 39 27C39 31.5 35.8 35 32 35C28.2 35 25 31.5 25 27C25 22 28 16 32 8Z"
            fill="url(#diyaFlameOuter)"
          />
          <path
            d="M32 16C34 21 35.5 24.5 35.5 27.5C35.5 30 33.9 32 32 32C30.1 32 28.5 30 28.5 27.5C28.5 24.5 30 21 32 16Z"
            fill="#FFFDF9"
          />
        </g>
        {/* Brass Lamp Bowl */}
        <path
          d="M12 38C18 39.5 46 39.5 52 38C49 49 41 55 32 55C23 55 15 49 12 38Z"
          fill="url(#brassBowl)"
          stroke="#E7D6AD"
          strokeWidth="1.2"
        />
        {/* Ornamental rim */}
        <path d="M10 38H54" stroke="#E7D6AD" strokeWidth="1.8" strokeLinecap="round" />
        {/* Pedestal */}
        <path d="M26 55L22 63H42L38 55" fill="#C6A15B" fillOpacity="0.5" stroke="#C6A15B" strokeWidth="1.2" />
        <path d="M18 64H46" stroke="#E7D6AD" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="diyaFlameOuter" x1="32" y1="8" x2="32" y2="35" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF6D6" />
            <stop offset="0.55" stopColor="#F5B041" />
            <stop offset="1" stopColor="#D35400" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="brassBowl" x1="12" y1="38" x2="52" y2="55" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E7D6AD" />
            <stop offset="0.5" stopColor="#C6A15B" />
            <stop offset="1" stopColor="#7E5E24" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

/**
 * Hand-Drawn Antique Gold Filigree Corner Ornament
 */
export const FloralCornerOrnament: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
  className?: string;
}> = ({ position, color = '#C6A15B', className = 'w-14 h-14 md:w-20 md:h-20' }) => {
  const rotationMap = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  };

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={`pointer-events-none select-none ${rotationMap[position]} ${className}`}
      aria-hidden="true"
    >
      <path d="M4 92V12C4 7.58172 7.58172 4 12 4H92" stroke={color} strokeWidth="1.5" />
      <path d="M10 78V16C10 12.6863 12.6863 10 16 10H78" stroke={color} strokeWidth="0.9" strokeOpacity="0.7" />
      {/* Corner paisley & lotus vine */}
      <path
        d="M10 10C24 10 34 20 34 34C20 34 10 24 10 10Z"
        fill={color}
        fillOpacity="0.12"
        stroke={color}
        strokeWidth="1.2"
      />
      <path
        d="M34 16C44 16 52 22 54 30C45 31 38 25 34 16Z"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.85"
      />
      <path
        d="M16 34C16 44 22 52 30 54C31 45 25 38 16 34Z"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.85"
      />
      <circle cx="22" cy="22" r="2.2" fill={color} />
      <circle cx="42" cy="14" r="1.5" fill={color} />
      <circle cx="14" cy="42" r="1.5" fill={color} />
      <circle cx="58" cy="14" r="1.2" fill={color} fillOpacity="0.6" />
      <circle cx="14" cy="58" r="1.2" fill={color} fillOpacity="0.6" />
    </svg>
  );
};

/**
 * Ornamental Chapter Divider inspired by Mughal Miniature & Rangoli Geometry
 */
export const ChapterDivider: React.FC<{ variant?: 'gold' | 'burgundy'; className?: string }> = ({
  variant = 'gold',
  className = '',
}) => {
  const stroke = variant === 'gold' ? '#C6A15B' : '#4A101D';
  const accent = variant === 'gold' ? '#E7D6AD' : '#C6A15B';

  return (
    <div className={`flex items-center justify-center w-full py-4 select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 420 36" fill="none" className="w-64 md:w-96 h-8">
        <line x1="10" y1="18" x2="155" y2="18" stroke={stroke} strokeOpacity="0.45" strokeWidth="1" />
        <line x1="265" y1="18" x2="410" y2="18" stroke={stroke} strokeOpacity="0.45" strokeWidth="1" />
        <circle cx="155" cy="18" r="2.5" fill={stroke} />
        <circle cx="265" cy="18" r="2.5" fill={stroke} />
        {/* Center diamond & lotus petals */}
        <path d="M210 4L224 18L210 32L196 18L210 4Z" stroke={stroke} strokeWidth="1.3" fill={stroke} fillOpacity="0.1" />
        <path d="M210 9L219 18L210 27L201 18L210 9Z" stroke={accent} strokeWidth="1" />
        <path d="M180 18C186 11 192 11 196 18C192 25 186 25 180 18Z" stroke={stroke} strokeWidth="1.1" />
        <path d="M240 18C234 11 228 11 224 18C228 25 234 25 240 18Z" stroke={stroke} strokeWidth="1.1" />
        <circle cx="210" cy="18" r="2.5" fill={accent} />
        <circle cx="170" cy="18" r="1.5" fill={stroke} />
        <circle cx="250" cy="18" r="1.5" fill={stroke} />
      </svg>
    </div>
  );
};

/**
 * Bespoke Indian Royal Architectural & Event Miniature Illustration Canvas
 * Renders a real photograph if `photoUrl` is provided and loads cleanly;
 * otherwise renders a finely detailed Rajasthani/Mughal palace SVG illustration.
 */
export const RoyalArchitecturalPlate: React.FC<{
  type:
    | 'courtyard'
    | 'archway'
    | 'mandap'
    | 'jharokha'
    | 'sheeshmahal'
    | 'procession'
    | 'haldi'
    | 'mehendi'
    | 'sangeet'
    | 'wedding'
    | 'reception';
  photoUrl?: string;
  alt: string;
  className?: string;
  badgeText?: string;
}> = ({ type, photoUrl, alt, className = '', badgeText }) => {
  const [imgError, setImgError] = useState(false);

  if (photoUrl && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-[#2A0812] ${className}`}>
        <img
          src={photoUrl}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A0812]/80 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // Palette variations per illustration mood
  const paletteMap: Record<
    string,
    { bgStart: string; bgEnd: string; primaryGold: string; secondaryGold: string; accent: string; glow: string }
  > = {
    courtyard: {
      bgStart: '#3B0C18',
      bgEnd: '#1E050C',
      primaryGold: '#C6A15B',
      secondaryGold: '#E7D6AD',
      accent: '#B87978',
      glow: 'rgba(231, 214, 173, 0.22)',
    },
    jharokha: {
      bgStart: '#4A101D',
      bgEnd: '#250710',
      primaryGold: '#E7D6AD',
      secondaryGold: '#C6A15B',
      accent: '#D49B35',
      glow: 'rgba(212, 155, 53, 0.2)',
    },
    archway: {
      bgStart: '#2D141B',
      bgEnd: '#19060C',
      primaryGold: '#C6A15B',
      secondaryGold: '#F8F0E3',
      accent: '#B87978',
      glow: 'rgba(198, 161, 91, 0.22)',
    },
    mandap: {
      bgStart: '#420D1A',
      bgEnd: '#1B040A',
      primaryGold: '#E7D6AD',
      secondaryGold: '#C6A15B',
      accent: '#B87978',
      glow: 'rgba(248, 240, 227, 0.24)',
    },
    sheeshmahal: {
      bgStart: '#24392D',
      bgEnd: '#111D16',
      primaryGold: '#E7D6AD',
      secondaryGold: '#C6A15B',
      accent: '#F8F0E3',
      glow: 'rgba(231, 214, 173, 0.2)',
    },
    haldi: {
      bgStart: '#54330E',
      bgEnd: '#2A0812',
      primaryGold: '#F5C45E',
      secondaryGold: '#E7D6AD',
      accent: '#E88D2A',
      glow: 'rgba(245, 196, 94, 0.26)',
    },
    mehendi: {
      bgStart: '#24392D',
      bgEnd: '#14221A',
      primaryGold: '#C6A15B',
      secondaryGold: '#E7D6AD',
      accent: '#689F7D',
      glow: 'rgba(198, 161, 91, 0.2)',
    },
    sangeet: {
      bgStart: '#310A1E',
      bgEnd: '#16040D',
      primaryGold: '#E7D6AD',
      secondaryGold: '#C6A15B',
      accent: '#B87978',
      glow: 'rgba(231, 214, 173, 0.25)',
    },
    wedding: {
      bgStart: '#4A101D',
      bgEnd: '#2A0812',
      primaryGold: '#E7D6AD',
      secondaryGold: '#C6A15B',
      accent: '#D96B68',
      glow: 'rgba(231, 214, 173, 0.28)',
    },
    reception: {
      bgStart: '#2A0812',
      bgEnd: '#140308',
      primaryGold: '#C6A15B',
      secondaryGold: '#F8F0E3',
      accent: '#E7D6AD',
      glow: 'rgba(198, 161, 91, 0.22)',
    },
    procession: {
      bgStart: '#3F0E1A',
      bgEnd: '#22060D',
      primaryGold: '#C6A15B',
      secondaryGold: '#E7D6AD',
      accent: '#B87978',
      glow: 'rgba(198, 161, 91, 0.2)',
    },
  };

  const p = paletteMap[type] || paletteMap.courtyard;

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        background: `radial-gradient(circle at 50% 38%, ${p.glow} 0%, transparent 65%), linear-gradient(180deg, ${p.bgStart} 0%, ${p.bgEnd} 100%)`,
      }}
      role="img"
      aria-label={alt}
    >
      {/* Intricate Mughal Palace Arch & Courtyard SVG Composition */}
      <svg
        viewBox="0 0 600 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      >
        {/* Starry Twilight Sky & Golden Dust */}
        <circle cx="110" cy="65" r="1.5" fill={p.secondaryGold} fillOpacity="0.6" />
        <circle cx="490" cy="55" r="1.8" fill={p.secondaryGold} fillOpacity="0.5" />
        <circle cx="300" cy="36" r="2.2" fill={p.secondaryGold} fillOpacity="0.8" />
        <circle cx="210" cy="48" r="1.2" fill={p.primaryGold} fillOpacity="0.5" />
        <circle cx="395" cy="52" r="1.4" fill={p.primaryGold} fillOpacity="0.6" />
        <circle cx="155" cy="95" r="1.2" fill={p.secondaryGold} fillOpacity="0.4" />
        <circle cx="445" cy="92" r="1.2" fill={p.secondaryGold} fillOpacity="0.4" />

        {/* Outer Palace Border Frame */}
        <rect
          x="18"
          y="18"
          width="564"
          height="404"
          stroke={p.primaryGold}
          strokeOpacity="0.35"
          strokeWidth="1.2"
        />
        <rect
          x="26"
          y="26"
          width="548"
          height="388"
          stroke={p.primaryGold}
          strokeOpacity="0.2"
          strokeWidth="0.8"
        />

        {/* Distant Palace Chhatri Domes */}
        <path
          d="M110 210C110 175 135 155 150 140C165 155 190 175 190 210H110Z"
          fill={p.primaryGold}
          fillOpacity="0.08"
          stroke={p.primaryGold}
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <path
          d="M410 210C410 175 435 155 450 140C465 155 490 175 490 210H410Z"
          fill={p.primaryGold}
          fillOpacity="0.08"
          stroke={p.primaryGold}
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <line x1="150" y1="125" x2="150" y2="140" stroke={p.primaryGold} strokeOpacity="0.5" strokeWidth="1.2" />
        <line x1="450" y1="125" x2="450" y2="140" stroke={p.primaryGold} strokeOpacity="0.5" strokeWidth="1.2" />

        {/* Grand Multi-Cusped Mughal Archway */}
        <path
          d="M75 390V170C75 110 165 55 300 38C435 55 525 110 525 170V390"
          stroke={p.primaryGold}
          strokeWidth="2"
          strokeOpacity="0.75"
        />
        <path
          d="M98 390V182C98 135 150 115 185 95C220 75 265 62 300 54C335 62 380 75 415 95C450 115 502 135 502 182V390"
          stroke={p.secondaryGold}
          strokeWidth="1.4"
          strokeOpacity="0.65"
        />

        {/* Hanging Marigold & Jasmine Toran Garlands from the Arch */}
        <path
          d="M100 175Q150 215 200 145Q250 205 300 135Q350 205 400 145Q450 215 500 175"
          stroke={p.primaryGold}
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        {/* Vertical flower malas */}
        {[150, 200, 250, 300, 350, 400, 450].map((xPos, i) => (
          <g key={xPos}>
            <line
              x1={xPos}
              y1={i % 2 === 0 ? 140 : 165}
              x2={xPos}
              y2={i === 3 ? 235 : i % 2 === 0 ? 220 : 205}
              stroke={p.secondaryGold}
              strokeOpacity="0.5"
              strokeWidth="1.2"
              strokeDasharray="2 4"
            />
            <circle
              cx={xPos}
              cy={i === 3 ? 238 : i % 2 === 0 ? 223 : 208}
              r="3.5"
              fill={p.accent}
              stroke={p.secondaryGold}
              strokeWidth="0.8"
            />
          </g>
        ))}

        {/* Central Feature Motif based on Illustration Type */}
        {(type === 'mandap' || type === 'wedding' || type === 'courtyard') && (
          <g>
            {/* Royal Four-Pillar Mandap Canopy */}
            <path
              d="M195 245C225 200 265 182 300 172C335 182 375 200 405 245H195Z"
              fill={p.primaryGold}
              fillOpacity="0.15"
              stroke={p.secondaryGold}
              strokeWidth="1.5"
            />
            <line x1="215" y1="245" x2="215" y2="355" stroke={p.primaryGold} strokeWidth="2.2" />
            <line x1="255" y1="245" x2="255" y2="355" stroke={p.primaryGold} strokeWidth="1.4" strokeOpacity="0.7" />
            <line x1="345" y1="245" x2="345" y2="355" stroke={p.primaryGold} strokeWidth="1.4" strokeOpacity="0.7" />
            <line x1="385" y1="245" x2="385" y2="355" stroke={p.primaryGold} strokeWidth="2.2" />
            {/* Sacred Agni / Lotus Altar */}
            <path
              d="M270 355H330L320 335H280L270 355Z"
              fill={p.primaryGold}
              fillOpacity="0.3"
              stroke={p.secondaryGold}
              strokeWidth="1.2"
            />
            <path
              d="M300 295C308 310 312 320 300 332C288 320 292 310 300 295Z"
              fill={p.secondaryGold}
              fillOpacity="0.85"
            />
          </g>
        )}

        {(type === 'jharokha' || type === 'haldi' || type === 'mehendi') && (
          <g>
            {/* Ornate Carved Jharokha Balcony & Brass Urli with Floating Lotus */}
            <rect
              x="220"
              y="185"
              width="160"
              height="135"
              rx="80"
              fill={p.primaryGold}
              fillOpacity="0.1"
              stroke={p.secondaryGold}
              strokeWidth="1.5"
            />
            {/* Brass Urli Bowl at Forefront */}
            <path
              d="M210 335C235 342 365 342 390 335C378 365 342 378 300 378C258 378 222 365 210 335Z"
              fill={p.primaryGold}
              fillOpacity="0.28"
              stroke={p.secondaryGold}
              strokeWidth="1.6"
            />
            {/* Floating Marigolds & Lotus in Urli */}
            <circle cx="260" cy="334" r="6" fill={p.accent} />
            <circle cx="300" cy="332" r="8" fill={p.secondaryGold} />
            <circle cx="340" cy="334" r="6" fill={p.accent} />
          </g>
        )}

        {(type === 'archway' || type === 'sangeet' || type === 'sheeshmahal' || type === 'reception' || type === 'procession') && (
          <g>
            {/* Royal Chandelier & Mirrored Archway Reflection */}
            <line x1="300" y1="55" x2="300" y2="145" stroke={p.secondaryGold} strokeWidth="1.5" />
            <path
              d="M255 175C270 150 330 150 345 175L365 205H235L255 175Z"
              fill={p.secondaryGold}
              fillOpacity="0.2"
              stroke={p.secondaryGold}
              strokeWidth="1.4"
            />
            <circle cx="245" cy="215" r="3" fill={p.secondaryGold} />
            <circle cx="272" cy="222" r="3.5" fill={p.secondaryGold} />
            <circle cx="300" cy="226" r="4" fill="#FFFDF9" />
            <circle cx="328" cy="222" r="3.5" fill={p.secondaryGold} />
            <circle cx="355" cy="215" r="3" fill={p.secondaryGold} />
            {/* Courtyard Lotus Reflection Pool */}
            <ellipse
              cx="300"
              cy="355"
              rx="135"
              ry="22"
              fill={p.primaryGold}
              fillOpacity="0.14"
              stroke={p.primaryGold}
              strokeWidth="1.2"
            />
          </g>
        )}

        {/* Courtyard Floor Perspective Lines & Glowing Diyas */}
        <line x1="40" y1="390" x2="560" y2="390" stroke={p.primaryGold} strokeOpacity="0.6" strokeWidth="1.4" />
        <line x1="90" y1="405" x2="510" y2="405" stroke={p.primaryGold} strokeOpacity="0.35" strokeWidth="1" />
        {[130, 215, 300, 385, 470].map((dx) => (
          <g key={dx}>
            <path d={`M${dx - 8} 386 Q${dx} 393 ${dx + 8} 386 Z`} fill={p.primaryGold} />
            <circle cx={dx} cy="381" r="2.8" fill="#FFF6D6" />
            <circle cx={dx} cy="381" r="6" fill={p.secondaryGold} fillOpacity="0.3" />
          </g>
        ))}
      </svg>

      {/* Subtle Vignette & Editorial Plate Caption Tag */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A040A]/85 via-transparent to-[#1A040A]/30 pointer-events-none" />
      {badgeText && (
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#2A0812]/80 border border-[#C6A15B]/35 text-[11px] tracking-wider uppercase text-[#E7D6AD]">
          {badgeText}
        </div>
      )}
    </div>
  );
};
