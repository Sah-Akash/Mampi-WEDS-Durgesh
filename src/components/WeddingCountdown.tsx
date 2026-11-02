import React, { useState, useEffect } from 'react';
import { Sparkles, CalendarClock } from 'lucide-react';
import { LanguageMode, WeddingConfig } from '../config/weddingConfig';
import { ChapterDivider, GlowingDiya } from './RoyalOrnaments';

interface WeddingCountdownProps {
  config: WeddingConfig;
  language: LanguageMode;
}

type SimulationMode = 'configured' | 'celebration' | 'placeholder';

interface TimeRemaining {
  status: 'counting' | 'reached' | 'invalid';
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateRemaining(targetISO: string, mode: SimulationMode): TimeRemaining {
  if (mode === 'celebration') {
    return { status: 'reached', days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  if (mode === 'placeholder' || !targetISO || targetISO.includes('[') || targetISO.trim() === '') {
    return { status: 'invalid', days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const targetTime = Date.parse(targetISO);
  if (Number.isNaN(targetTime)) {
    return { status: 'invalid', days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const now = Date.now();
  const diffMs = targetTime - now;

  if (diffMs <= 0) {
    return { status: 'reached', days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    status: 'counting',
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds),
  };
}

export const WeddingCountdown: React.FC<WeddingCountdownProps> = ({ config, language }) => {
  const [simMode, setSimMode] = useState<SimulationMode>('configured');
  const [remaining, setRemaining] = useState<TimeRemaining>(() =>
    calculateRemaining(config.countdownTargetISO, 'configured')
  );

  useEffect(() => {
    setRemaining(calculateRemaining(config.countdownTargetISO, simMode));
    const timer = window.setInterval(() => {
      setRemaining(calculateRemaining(config.countdownTargetISO, simMode));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [config.countdownTargetISO, simMode]);

  const pad = (val: number) => String(Math.max(0, Math.floor(val))).padStart(2, '0');
  const showHindi = language === 'hi' || language === 'bilingual';

  return (
    <section
      id="countdown"
      className="relative py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-[#2A0812] via-[#3D0C19] to-[#2A0812] no-print"
    >
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-[#C6A15B] mb-2">
          Chapter II · Shubh Muhurat
        </p>
        <h2 className="font-display text-3xl sm:text-5xl text-[#F8F0E3] font-semibold tracking-wide">
          Counting the Moments to Forever
        </h2>
        {showHindi && (
          <p className="font-devanagari text-base sm:text-lg text-[#E7D6AD]/85 mt-1">
            शुभ विवाह की पावन घड़ी की प्रतीक्षा
          </p>
        )}

        {/* Venue Timezone & Configured Date Kicker (Unboxed Metadata with · separators) */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-[#E7D6AD]/80">
          <span>{config.weddingDate}</span>
          <span aria-hidden="true">·</span>
          <span>{config.weddingTime}</span>
          <span aria-hidden="true">·</span>
          <span>Timezone: {config.venueTimezoneLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{config.city}</span>
        </div>

        {/* Main Countdown Display Surface */}
        <div className="mt-10 relative p-6 sm:p-12 bg-[#2A0812]/90 border border-[#C6A15B]/50 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          <div className="absolute inset-2 border border-[#C6A15B]/20 pointer-events-none" />

          {remaining.status === 'counting' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 items-center">
              {[
                {
                  value: String(remaining.days).padStart(2, '0'),
                  label: 'Days',
                  labelHi: 'दिन',
                },
                {
                  value: pad(remaining.hours),
                  label: 'Hours',
                  labelHi: 'घंटे',
                },
                {
                  value: pad(remaining.minutes),
                  label: 'Minutes',
                  labelHi: 'मिनट',
                },
                {
                  value: pad(remaining.seconds),
                  label: 'Seconds',
                  labelHi: 'सेकंड',
                },
              ].map((unit, idx) => (
                <div
                  key={unit.label}
                  className={`flex flex-col items-center justify-center px-3 py-2 ${
                    idx < 3 ? 'sm:border-r sm:border-[#C6A15B]/30' : ''
                  }`}
                >
                  <span
                    className="font-display font-semibold text-4xl sm:text-6xl md:text-7xl text-[#E7D6AD] tracking-wider"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {unit.value}
                  </span>
                  <span className="mt-2 text-xs tracking-[0.22em] uppercase text-[#C6A15B] font-medium">
                    {unit.label}
                  </span>
                  {showHindi && (
                    <span className="font-devanagari text-xs text-[#F8F0E3]/70 mt-0.5">
                      {unit.labelHi}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {remaining.status === 'reached' && (
            <div className="py-6 px-4 flex flex-col items-center text-center">
              <GlowingDiya size="md" className="mb-3" />
              <p className="text-xs tracking-[0.25em] uppercase text-[#C6A15B] mb-2">
                Shubh Vivah Muhurat Has Arrived
              </p>
              <h3 className="font-display text-3xl sm:text-5xl text-[#E7D6AD] font-semibold">
                Today {config.brideName} &amp; {config.groomName} Begin Their Forever!
              </h3>
              {showHindi && (
                <p className="font-devanagari text-lg text-[#F8F0E3]/90 mt-2">
                  शुभ घड़ी आ गई है! {config.brideNameHindi} और {config.groomNameHindi} के पावन परिणय उत्सव में आपका स्वागत है।
                </p>
              )}
              <p className="mt-3 text-sm text-[#F8F0E3]/80 max-w-xl">
                With glowing diyas, sacred chants, and the blessings of both families, the royal celebration is underway in {config.city}.
              </p>
            </div>
          )}

          {remaining.status === 'invalid' && (
            <div className="py-6 px-4 flex flex-col items-center text-center">
              <CalendarClock className="w-8 h-8 text-[#C6A15B] mb-3" />
              <p className="text-xs tracking-[0.22em] uppercase text-[#C6A15B] mb-1">
                Auspicious Muhurat Announcement
              </p>
              <h3 className="font-display text-2xl sm:text-4xl text-[#E7D6AD] font-semibold">
                {config.weddingDate} · {config.weddingTime}
              </h3>
              <p className="mt-2 text-sm text-[#F8F0E3]/80 max-w-lg">
                The exact ISO date and muhurat time in <code className="text-[#E7D6AD]">weddingConfig.ts</code> is currently set to placeholder mode. Update <code className="text-[#E7D6AD]">countdownTargetISO</code> to activate the live second-by-second countdown.
              </p>
            </div>
          )}
        </div>

        {/* Interactive State Verification Switcher (Allows testing Live Countdown vs Zero Reached vs Placeholder gracefully) */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-[#E7D6AD]/70 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Preview Countdown State:</span>
          </span>
          {(
            [
              { id: 'configured', label: 'Live IST Countdown' },
              { id: 'celebration', label: 'Wedding Day Reached (00:00:00)' },
              { id: 'placeholder', label: 'Unset Date Fallback' },
            ] as { id: SimulationMode; label: string }[]
          ).map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setSimMode(btn.id)}
              className={`px-3 py-1.5 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                simMode === btn.id
                  ? 'bg-[#C6A15B] text-[#2A0812] border-[#E7D6AD] font-semibold'
                  : 'bg-[#2A0812]/80 text-[#E7D6AD]/80 border-[#C6A15B]/35 hover:border-[#E7D6AD]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <ChapterDivider className="mt-12" />
      </div>
    </section>
  );
};
