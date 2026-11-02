import React, { useState, useEffect } from 'react';
import { LanguageMode, WeddingConfig } from '../config/weddingConfig';
import { ChapterDivider, GlowingDiya } from './RoyalOrnaments';

interface WeddingCountdownProps {
  config: WeddingConfig;
  language: LanguageMode;
}

interface TimeRemaining {
  status: 'counting' | 'reached';
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateRemaining(targetISO: string): TimeRemaining {
  const targetTime = Date.parse(targetISO);
  if (Number.isNaN(targetTime)) {
    return { status: 'reached', days: 0, hours: 0, minutes: 0, seconds: 0 };
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
  const [remaining, setRemaining] = useState<TimeRemaining>(() =>
    calculateRemaining(config.countdownTargetISO)
  );

  useEffect(() => {
    setRemaining(calculateRemaining(config.countdownTargetISO));
    const timer = window.setInterval(() => {
      setRemaining(calculateRemaining(config.countdownTargetISO));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [config.countdownTargetISO]);

  const pad = (val: number) => String(Math.max(0, Math.floor(val))).padStart(2, '0');
  const showHindi = language === 'hi' || language === 'bilingual';

  return (
    <section
      id="countdown"
      className="relative py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-[#2A0812] via-[#3D0C19] to-[#2A0812] no-print"
    >
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-[#C6A15B] mb-2">
          Shubh Muhurat · शुभ मुहूर्त
        </p>
        <h2 className="font-display text-3xl sm:text-5xl text-[#F8F0E3] font-semibold tracking-wide">
          Counting the Moments to Forever
        </h2>
        {showHindi && (
          <p className="font-devanagari text-base sm:text-lg text-[#E7D6AD]/85 mt-1">
            शुभ विवाह की पावन घड़ी की प्रतीक्षा
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-[#E7D6AD]/80">
          <span>{config.weddingDate}</span>
          <span aria-hidden="true">·</span>
          <span>{config.weddingTime}</span>
          <span aria-hidden="true">·</span>
          <span>{config.venueName}, {config.city}</span>
        </div>

        {/* Main Countdown Display Surface */}
        <div className="mt-10 relative p-6 sm:p-12 bg-[#2A0812]/90 border border-[#C6A15B]/50 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          <div className="absolute inset-2 border border-[#C6A15B]/20 pointer-events-none" />

          {remaining.status === 'counting' ? (
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
          ) : (
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
            </div>
          )}
        </div>

        <ChapterDivider className="mt-12" />
      </div>
    </section>
  );
};
