import React, { useEffect, useState } from 'react';
import { ArrowDown, Volume2, VolumeX, Share2, Printer, Languages, Sparkles, DoorOpen } from 'lucide-react';
import { LanguageMode, WeddingConfig } from '../config/weddingConfig';
import { FloralCornerOrnament, GlowingDiya, RoyalLotusEmblem } from './RoyalOrnaments';

interface RoyalHeroProps {
  config: WeddingConfig;
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onShareInvitation: () => void;
  onPrintInvitation: () => void;
  onOpenCustomizer: () => void;
  onReplayDoors: () => void;
  onOpenRsvpModal: () => void;
}

export const RoyalHero: React.FC<RoyalHeroProps> = ({
  config,
  language,
  onLanguageChange,
  isMusicPlaying,
  onToggleMusic,
  onShareInvitation,
  onPrintInvitation,
  onOpenCustomizer,
  onReplayDoors,
  onOpenRsvpModal,
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const handleScroll = () => {
      if (window.scrollY < 900) {
        setScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* TOP BAR CONTRACT: 1-row, 3-zone header */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 bg-[#2A0812]/92 backdrop-blur-md border-b border-[#C6A15B]/25 no-print">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-base sm:text-lg font-semibold tracking-wider text-[#E7D6AD] whitespace-nowrap shrink-0 truncate max-w-[200px] sm:max-w-none"
        >
          {config.brideName} &amp; {config.groomName}
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav aria-label="Primary Wedding Navigation" className="hidden md:flex items-center gap-7 text-xs tracking-[0.14em] uppercase text-[#F8F0E3]/80">
          <a
            href="#invitation"
            className="hover:text-[#E7D6AD] underline-offset-8 hover:underline transition-colors whitespace-nowrap shrink-0"
          >
            Invitation
          </a>
          <a
            href="#countdown"
            className="hover:text-[#E7D6AD] underline-offset-8 hover:underline transition-colors whitespace-nowrap shrink-0"
          >
            Countdown
          </a>
          <a
            href="#events"
            className="hover:text-[#E7D6AD] underline-offset-8 hover:underline transition-colors whitespace-nowrap shrink-0"
          >
            Events
          </a>
          <a
            href="#gallery"
            className="hover:text-[#E7D6AD] underline-offset-8 hover:underline transition-colors whitespace-nowrap shrink-0"
          >
            Gallery
          </a>
          <a
            href="#rsvp"
            className="hover:text-[#E7D6AD] underline-offset-8 hover:underline transition-colors whitespace-nowrap shrink-0"
          >
            RSVP
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenRsvpModal}
            className="btn-gold-sweep px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase bg-[#C6A15B] text-[#2A0812] hover:bg-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F8F0E3]"
          >
            WhatsApp RSVP
          </button>
        </div>
      </header>

      {/* MAIN HERO SECTION: THE ROYAL WEDDING ANNOUNCEMENT */}
      <section
        id="top"
        className="relative min-h-[90vh] flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#2A0812] via-[#4A101D] to-[#2A0812] px-4 sm:px-8 py-10 sm:py-14 no-print"
      >
        {/* Restrained Parallax Palace Architecture Backdrop */}
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-35"
          style={{
            transform: `translate3d(0, ${scrollY * 0.14}px, 0)`,
          }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 900"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Atmospheric Warm Palace Glow */}
            <defs>
              <radialGradient id="heroPalaceGlow" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#E7D6AD" stopOpacity="0.32" />
                <stop offset="45%" stopColor="#C6A15B" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#2A0812" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="1440" height="900" fill="url(#heroPalaceGlow)" />

            {/* Grand Symmetrical Mughal Cusped Palace Arch */}
            <path
              d="M180 900V320C180 220 290 165 410 120C530 75 640 42 720 18C800 42 910 75 1030 120C1150 165 1260 220 1260 320V900"
              stroke="#C6A15B"
              strokeWidth="2"
              strokeOpacity="0.65"
            />
            <path
              d="M220 900V345C220 265 320 205 440 155C550 110 650 75 720 48C790 75 890 110 1000 155C1120 205 1220 265 1220 345V900"
              stroke="#E7D6AD"
              strokeWidth="1.2"
              strokeOpacity="0.45"
            />

            {/* Side Jharokha Columns & Chhatri Domes */}
            <g stroke="#C6A15B" strokeOpacity="0.4" strokeWidth="1.1">
              <rect x="70" y="360" width="90" height="540" />
              <path d="M70 360C70 315 95 290 115 270C135 290 160 315 160 360" />
              <rect x="1280" y="360" width="90" height="540" />
              <path d="M1280 360C1280 315 1305 290 1325 270C1345 290 1370 315 1370 360" />
            </g>

            {/* Delicate Hanging Jasmine & Marigold Torans */}
            <path
              d="M220 340Q345 410 470 290Q595 390 720 260Q845 390 970 290Q1095 410 1220 340"
              stroke="#C6A15B"
              strokeOpacity="0.45"
              strokeWidth="1.4"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        {/* Delicate Floral Corner Frames */}
        <div className="absolute inset-4 sm:inset-8 pointer-events-none">
          <div className="absolute top-0 left-0">
            <FloralCornerOrnament position="top-left" />
          </div>
          <div className="absolute top-0 right-0">
            <FloralCornerOrnament position="top-right" />
          </div>
          <div className="absolute bottom-0 left-0">
            <FloralCornerOrnament position="bottom-left" />
          </div>
          <div className="absolute bottom-0 right-0">
            <FloralCornerOrnament position="bottom-right" />
          </div>
          <div className="absolute inset-3 border border-[#C6A15B]/20" />
        </div>

        {/* Top Invocation & Lotus */}
        <div className="relative z-10 flex flex-col items-center text-center pt-4">
          <p className="font-devanagari text-sm sm:text-base text-[#E7D6AD] tracking-widest mb-2">
            {config.sanskritInvocation}
          </p>
          <RoyalLotusEmblem className="w-14 h-9" />
        </div>

        {/* Central Royal Announcement Typography */}
        <div className="relative z-10 max-w-4xl mx-auto text-center my-auto py-8 px-2">
          <p className="text-xs sm:text-sm tracking-[0.26em] uppercase text-[#E7D6AD] font-medium mb-5">
            WITH THE BLESSINGS OF OUR ELDERS
          </p>

          {(language === 'hi' || language === 'bilingual') && (
            <p className="font-devanagari text-sm sm:text-base text-[#C6A15B] mb-4">
              हमारे पूजनीय बुजुर्गों के शुभाशीष के साथ
            </p>
          )}

          {/* Bride & Groom Names — The Most Prominent & Exquisite Typography on the Website */}
          <h1
            className="font-display font-semibold text-[#F8F0E3] tracking-wide leading-[1.08]"
            style={{
              fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)',
              textWrap: 'balance',
            }}
          >
            <span className="block text-[#F8F0E3] drop-shadow-[0_4px_24px_rgba(198,161,91,0.28)]">
              {config.brideName}
            </span>

            <span className="inline-flex items-center justify-center gap-4 my-2 sm:my-3">
              <span className="h-[1px] w-10 sm:w-20 bg-gradient-to-r from-transparent to-[#C6A15B]" />
              <span className="font-display italic font-normal text-2xl sm:text-4xl text-[#C6A15B] tracking-normal">
                weds
              </span>
              <span className="h-[1px] w-10 sm:w-20 bg-gradient-to-l from-transparent to-[#C6A15B]" />
            </span>

            <span className="block text-[#F8F0E3] drop-shadow-[0_4px_24px_rgba(198,161,91,0.28)]">
              {config.groomName}
            </span>
          </h1>

          {(language === 'hi' || language === 'bilingual') && (
            <p className="font-devanagari text-xl sm:text-2xl text-[#E7D6AD]/90 mt-3">
              {config.brideNameHindi} <span className="text-[#C6A15B] mx-2">संग</span> {config.groomNameHindi}
            </p>
          )}

          {/* Unboxed Metadata: Date & City with typographic separator */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-base sm:text-xl font-display tracking-[0.18em] uppercase text-[#E7D6AD]">
            <span>{config.weddingDate}</span>
            <span aria-hidden="true" className="text-[#C6A15B]">
              ·
            </span>
            <span>{config.city}</span>
          </div>

          <p className="mt-5 font-display italic text-lg sm:text-2xl text-[#F8F0E3]/90 max-w-xl mx-auto">
            “Two hearts. Two families. One beautiful beginning.”
          </p>
          {(language === 'hi' || language === 'bilingual') && (
            <p className="mt-1 font-devanagari text-sm sm:text-base text-[#E7D6AD]/80">
              “दो दिल, दो परिवार, एक पावन नई शुरुआत।”
            </p>
          )}

          {/* Primary Hero CTA Row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#invitation"
              className="btn-gold-sweep px-7 py-3.5 bg-[#C6A15B] text-[#2A0812] text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase border border-[#E7D6AD] hover:bg-[#E7D6AD] transition-colors whitespace-nowrap shrink-0"
            >
              Read Family Invitation
            </a>
            <a
              href="#events"
              className="px-7 py-3.5 bg-[#2A0812]/70 text-[#E7D6AD] text-xs sm:text-sm font-medium tracking-[0.18em] uppercase border border-[#C6A15B]/60 hover:border-[#E7D6AD] hover:text-[#F8F0E3] transition-colors whitespace-nowrap shrink-0"
            >
              Explore Wedding Events
            </a>
          </div>
        </div>

        {/* Bottom Scroll Indicator with Animated Gold Arrow & Diya */}
        <div className="relative z-10 flex flex-col items-center gap-2 pb-2">
          <GlowingDiya size="sm" />
          <a
            href="#invitation"
            aria-label="Scroll down to family invitation"
            className="group inline-flex flex-col items-center gap-1.5 text-[11px] tracking-[0.22em] uppercase text-[#E7D6AD]/80 hover:text-[#F8F0E3] transition-colors"
          >
            <span>Scroll to Unveil</span>
            <ArrowDown className="w-4 h-4 text-[#C6A15B] animate-bounce" />
          </a>
        </div>
      </section>

      {/* ROYAL UTILITY TOOLBAR BELOW HERO FOLD (Bilingual Mode, Music, Print, Share, Customize) */}
      <div className="bg-[#21060E] border-y border-[#C6A15B]/30 py-3 px-4 sm:px-8 no-print">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Language Segmented Control */}
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-[#C6A15B] shrink-0" aria-hidden="true" />
            <span className="text-xs text-[#E7D6AD]/80 hidden sm:inline whitespace-nowrap shrink-0">
              Language:
            </span>
            <div
              className="inline-flex items-center p-0.5 bg-[#2A0812] border border-[#C6A15B]/35"
              role="group"
              aria-label="Select Invitation Language"
            >
              {(
                [
                  { id: 'bilingual', label: 'Bilingual (EN + हिं)' },
                  { id: 'en', label: 'English' },
                  { id: 'hi', label: 'हिन्दी' },
                ] as { id: LanguageMode; label: string }[]
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onLanguageChange(item.id)}
                  className={`px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    language === item.id
                      ? 'bg-[#C6A15B] text-[#2A0812] font-semibold'
                      : 'text-[#E7D6AD]/80 hover:text-[#F8F0E3]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Utility Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onToggleMusic}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#E7D6AD] bg-[#2A0812] border border-[#C6A15B]/40 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              aria-pressed={isMusicPlaying}
            >
              {isMusicPlaying ? (
                <Volume2 className="w-3.5 h-3.5 text-[#C6A15B]" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-[#B87978]" />
              )}
              <span>{isMusicPlaying ? 'Ambient Music: On' : 'Ambient Music: Off'}</span>
            </button>

            <button
              type="button"
              onClick={onShareInvitation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#E7D6AD] bg-[#2A0812] border border-[#C6A15B]/40 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={onPrintInvitation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#E7D6AD] bg-[#2A0812] border border-[#C6A15B]/40 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Save PDF / Print</span>
            </button>

            <button
              type="button"
              onClick={onReplayDoors}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#E7D6AD] bg-[#2A0812] border border-[#C6A15B]/40 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <DoorOpen className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Replay Doors</span>
            </button>

            <button
              type="button"
              onClick={onOpenCustomizer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2A0812] bg-[#E7D6AD] hover:bg-[#C6A15B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Edit Placeholders</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
