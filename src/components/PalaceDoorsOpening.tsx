import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { WeddingConfig } from '../config/weddingConfig';
import { GlowingDiya, RoyalLotusEmblem } from './RoyalOrnaments';
import { royalAudio } from '../utils/royalAudio';

interface PalaceDoorsOpeningProps {
  config: WeddingConfig;
  isOpen: boolean;
  onOpenComplete: (enableAmbientAudio: boolean) => void;
}

export const PalaceDoorsOpening: React.FC<PalaceDoorsOpeningProps> = ({
  config,
  isOpen,
  onOpenComplete,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [soundChimeEnabled, setSoundChimeEnabled] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  if (isOpen) return null;

  const handleOpenDoors = (skipAnimation = false) => {
    if (isOpening) return;

    if (soundChimeEnabled) {
      royalAudio.playPalaceGateChime();
    }

    if (skipAnimation || prefersReducedMotion) {
      onOpenComplete(false);
      return;
    }

    setIsOpening(true);
    window.setTimeout(() => {
      onOpenComplete(false);
    }, 1650);
  };

  // Floating dust motes & rose petals
  const dustParticles = [
    { left: '18%', top: '24%', delay: '0s' },
    { left: '32%', top: '65%', delay: '1.2s' },
    { left: '48%', top: '18%', delay: '0.5s' },
    { left: '53%', top: '76%', delay: '2.1s' },
    { left: '68%', top: '34%', delay: '1.6s' },
    { left: '82%', top: '58%', delay: '0.8s' },
  ];

  const floatingPetals = [
    { left: '15%', delay: '0s', duration: '13s', size: 14 },
    { left: '38%', delay: '3.5s', duration: '15s', size: 18 },
    { left: '64%', delay: '1.8s', duration: '12s', size: 15 },
    { left: '84%', delay: '5.2s', duration: '16s', size: 16 },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-[#2A0812] select-none transition-opacity duration-700 ${
        isOpening ? 'pointer-events-none' : ''
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Royal Wedding Invitation Opening Gates"
    >
      {/* Golden Palace Radiance Revealed Behind Doors */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 ease-out ${
          isOpening ? 'opacity-100 scale-110' : 'opacity-35 scale-95'
        }`}
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(248, 240, 227, 0.92) 0%, rgba(231, 214, 173, 0.55) 26%, rgba(198, 161, 91, 0.25) 52%, rgba(42, 8, 18, 0.95) 80%)',
        }}
      />

      {/* Ambient Floating Golden Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {dustParticles.map((p, idx) => (
          <span
            key={idx}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#E7D6AD] animate-dust"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              boxShadow: '0 0 8px 2px rgba(231, 214, 173, 0.6)',
            }}
          />
        ))}
        {/* Drifting Rose Petals */}
        {floatingPetals.map((petal, idx) => (
          <svg
            key={idx}
            viewBox="0 0 24 24"
            className="absolute -top-8 animate-petal"
            style={{
              left: petal.left,
              width: petal.size,
              height: petal.size,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
            }}
          >
            <path
              d="M12 2C17 6 20 11 17 17C14 22 8 22 6 17C3 11 7 6 12 2Z"
              fill="#B87978"
              fillOpacity="0.65"
              stroke="#E7D6AD"
              strokeWidth="0.6"
              strokeOpacity="0.4"
            />
          </svg>
        ))}
      </div>

      {/* Ornate Palace Door Frame Surround */}
      <div
        className="absolute inset-2 sm:inset-5 border border-[#C6A15B]/45 pointer-events-none z-20"
        aria-hidden="true"
      >
        <div className="absolute inset-1.5 border border-[#C6A15B]/25" />
        {/* Top Arch Filigree Crown */}
        <svg
          viewBox="0 0 800 90"
          fill="none"
          className="w-full max-w-3xl mx-auto h-10 sm:h-14 text-[#C6A15B] opacity-75"
        >
          <path
            d="M0 2H800M80 2C140 42 260 22 400 68C540 22 660 42 720 2"
            stroke="#C6A15B"
            strokeWidth="1.4"
          />
          <circle cx="400" cy="40" r="6" fill="#E7D6AD" fillOpacity="0.3" stroke="#C6A15B" strokeWidth="1.2" />
          <circle cx="280" cy="24" r="3" fill="#C6A15B" />
          <circle cx="520" cy="24" r="3" fill="#C6A15B" />
        </svg>
      </div>

      {/* 3D Perspective Symmetrical Palace Doors Container */}
      <div className="absolute inset-0 flex perspective-palace overflow-hidden">
        {/* LEFT PALACE DOOR */}
        <div
          className="relative w-1/2 h-full bg-gradient-to-br from-[#4A101D] via-[#350B15] to-[#24060E] border-r border-[#E7D6AD]/50 door-left-hinge preserve-3d transition-transform"
          style={{
            transitionDuration: '1600ms',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            transform: isOpening ? 'rotateY(-106deg)' : 'rotateY(0deg)',
            boxShadow: isOpening
              ? '20px 0 60px rgba(0,0,0,0.7)'
              : 'inset -12px 0 32px rgba(231, 214, 173, 0.14)',
          }}
          aria-hidden="true"
        >
          <div className="absolute inset-4 sm:inset-8 border border-[#C6A15B]/35 bg-royal-jaali flex flex-col justify-between p-4 sm:p-8">
            {/* Upper Carved Arch Panel */}
            <div className="w-full h-1/3 border border-[#C6A15B]/25 relative flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 200 200" className="w-28 h-28 sm:w-40 sm:h-40 opacity-25">
                <circle cx="100" cy="100" r="76" stroke="#C6A15B" strokeWidth="1.2" fill="none" />
                <circle cx="100" cy="100" r="52" stroke="#E7D6AD" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                <path
                  d="M100 24L118 82L176 100L118 118L100 176L82 118L24 100L82 82L100 24Z"
                  stroke="#C6A15B"
                  strokeWidth="1.2"
                  fill="#C6A15B"
                  fillOpacity="0.1"
                />
              </svg>
            </div>
            {/* Lower Carved Sandstone Panel */}
            <div className="w-full h-1/3 border border-[#C6A15B]/25 relative flex items-center justify-center">
              <div className="w-3/4 h-3/4 border border-[#C6A15B]/20" />
            </div>
          </div>
          {/* Ornate Brass Door Ring Handle on Right Edge of Left Door */}
          <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-5 h-16 sm:w-7 sm:h-24 flex flex-col items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#E7D6AD] border border-[#2A0812]" />
            <div className="w-4 h-8 sm:w-5 sm:h-10 rounded-full border-2 border-[#C6A15B] -mt-1" />
          </div>
        </div>

        {/* NARROW LUMINOUS CENTER GAP BETWEEN DOORS */}
        <div
          className={`relative z-10 w-[2px] h-full bg-gradient-to-b from-transparent via-[#FFF6D6] to-transparent transition-all duration-1000 ${
            isOpening ? 'opacity-0 scale-x-150' : 'opacity-95 shadow-[0_0_28px_6px_rgba(231,214,173,0.75)]'
          }`}
          aria-hidden="true"
        />

        {/* RIGHT PALACE DOOR */}
        <div
          className="relative w-1/2 h-full bg-gradient-to-bl from-[#4A101D] via-[#350B15] to-[#24060E] border-l border-[#E7D6AD]/50 door-right-hinge preserve-3d transition-transform"
          style={{
            transitionDuration: '1600ms',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            transform: isOpening ? 'rotateY(106deg)' : 'rotateY(0deg)',
            boxShadow: isOpening
              ? '-20px 0 60px rgba(0,0,0,0.7)'
              : 'inset 12px 0 32px rgba(231, 214, 173, 0.14)',
          }}
          aria-hidden="true"
        >
          <div className="absolute inset-4 sm:inset-8 border border-[#C6A15B]/35 bg-royal-jaali flex flex-col justify-between p-4 sm:p-8">
            {/* Upper Carved Arch Panel */}
            <div className="w-full h-1/3 border border-[#C6A15B]/25 relative flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 200 200" className="w-28 h-28 sm:w-40 sm:h-40 opacity-25">
                <circle cx="100" cy="100" r="76" stroke="#C6A15B" strokeWidth="1.2" fill="none" />
                <circle cx="100" cy="100" r="52" stroke="#E7D6AD" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                <path
                  d="M100 24L118 82L176 100L118 118L100 176L82 118L24 100L82 82L100 24Z"
                  stroke="#C6A15B"
                  strokeWidth="1.2"
                  fill="#C6A15B"
                  fillOpacity="0.1"
                />
              </svg>
            </div>
            {/* Lower Carved Sandstone Panel */}
            <div className="w-full h-1/3 border border-[#C6A15B]/25 relative flex items-center justify-center">
              <div className="w-3/4 h-3/4 border border-[#C6A15B]/20" />
            </div>
          </div>
          {/* Ornate Brass Door Ring Handle on Left Edge of Right Door */}
          <div className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-16 sm:w-7 sm:h-24 flex flex-col items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#E7D6AD] border border-[#2A0812]" />
            <div className="w-4 h-8 sm:w-5 sm:h-10 rounded-full border-2 border-[#C6A15B] -mt-1" />
          </div>
        </div>
      </div>

      {/* Top Controls: Audio Chime Toggle & Skip Intro */}
      <div
        className={`relative z-30 w-full max-w-6xl mx-auto px-6 pt-6 sm:pt-8 flex items-center justify-between transition-opacity duration-500 ${
          isOpening ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <button
          type="button"
          onClick={() => setSoundChimeEnabled((prev) => !prev)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs text-[#E7D6AD] bg-[#2A0812]/80 border border-[#C6A15B]/40 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#E7D6AD]"
          aria-label={soundChimeEnabled ? 'Mute opening bell chime' : 'Enable opening bell chime'}
        >
          {soundChimeEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#C6A15B]" /> : <VolumeX className="w-3.5 h-3.5 text-[#B87978]" />}
          <span>{soundChimeEnabled ? 'Bell Chime: On' : 'Bell Chime: Muted'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleOpenDoors(true)}
          className="px-3.5 py-2 text-xs text-[#E7D6AD]/80 hover:text-[#F8F0E3] underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#E7D6AD]"
        >
          Skip Intro
        </button>
      </div>

      {/* Center Royal Seal & Invitation Typography Plaque */}
      <div
        className={`relative z-30 flex flex-col items-center justify-center px-4 sm:px-6 text-center max-w-xl mx-auto my-auto transition-all duration-700 ${
          isOpening ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {/* Ornate Royal Seal Plaque */}
        <div className="relative px-6 py-7 sm:px-12 sm:py-10 bg-[#2A0812]/92 border border-[#C6A15B]/65 shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-md">
          {/* Inner hairline gold border */}
          <div className="absolute inset-2 border border-[#C6A15B]/30 pointer-events-none" />

          {/* Sanskrit Invocation */}
          <p className="font-devanagari text-base sm:text-lg text-[#E7D6AD] tracking-wider mb-3">
            {config.sanskritInvocation}
          </p>

          <RoyalLotusEmblem className="w-14 h-9 mx-auto mb-3" />

          <p className="text-xs sm:text-sm tracking-[0.22em] uppercase text-[#E7D6AD]/85 mb-4">
            Together with their families
          </p>

          {/* Bride & Groom Names — Prominent & Regal */}
          <h1
            className="font-display text-3xl sm:text-5xl md:text-6xl font-semibold text-[#F8F0E3] tracking-wide leading-tight"
            style={{ textWrap: 'balance' }}
          >
            <span className="block text-[#E7D6AD] drop-shadow-[0_2px_12px_rgba(198,161,91,0.3)]">
              {config.brideName}
            </span>
            <span className="block font-display italic font-normal text-xl sm:text-2xl text-[#C6A15B] my-1.5">
              and
            </span>
            <span className="block text-[#E7D6AD] drop-shadow-[0_2px_12px_rgba(198,161,91,0.3)]">
              {config.groomName}
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#F8F0E3]/85 font-light tracking-wide">
            invite you to celebrate their wedding
          </p>

          {/* Royal Seal Monogram Medallion */}
          <div className="my-5 flex items-center justify-center gap-3" aria-hidden="true">
            <span className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#C6A15B]" />
            <div className="w-10 h-10 rounded-full border border-[#C6A15B] bg-[#4A101D] flex items-center justify-center shadow-[0_0_20px_rgba(198,161,91,0.35)]">
              <span className="font-display text-xs font-semibold tracking-widest text-[#E7D6AD]">
                {config.monogramInitials}
              </span>
            </div>
            <span className="h-[1px] w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#C6A15B]" />
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => handleOpenDoors(false)}
            className="btn-gold-sweep mt-2 w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#B68F46] via-[#C6A15B] to-[#B68F46] text-[#2A0812] font-semibold text-xs sm:text-sm tracking-[0.18em] uppercase border border-[#E7D6AD] shadow-[0_0_30px_rgba(198,161,91,0.4)] hover:shadow-[0_0_42px_rgba(231,214,173,0.65)] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8F0E3]"
          >
            OPEN THE ROYAL INVITATION
          </button>
        </div>
      </div>

      {/* Bottom Ornamental Diya & Subtle Instruction */}
      <div
        className={`relative z-30 pb-5 sm:pb-7 flex flex-col items-center gap-1 transition-opacity duration-500 ${
          isOpening ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <GlowingDiya size="md" />
        <span className="text-[11px] tracking-[0.2em] uppercase text-[#E7D6AD]/65">
          Tap the seal to unveil the celebration
        </span>
      </div>
    </div>
  );
};
