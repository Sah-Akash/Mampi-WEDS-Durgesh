import React from 'react';
import {
  MessageCircle,
  Share2,
  Printer,
  ArrowUp,
  Compass,
} from 'lucide-react';
import { LanguageMode, WeddingConfig } from '../config/weddingConfig';
import { FloralCornerOrnament, GlowingDiya, RoyalLotusEmblem } from './RoyalOrnaments';

interface RoyalRsvpAndFooterProps {
  config: WeddingConfig;
  language: LanguageMode;
  onShareInvitation: () => void;
  onPrintInvitation: () => void;
  shareFeedback: string | null;
}

export const RoyalRsvpAndFooter: React.FC<RoyalRsvpAndFooterProps> = ({
  config,
  language,
  onShareInvitation,
  onPrintInvitation,
  shareFeedback,
}) => {
  const fixedWhatsappMessage = `Namaste! With warm regards and blessings for ${config.brideName} & ${config.groomName}, we are delighted to confirm our presence at the wedding celebrations on ${config.weddingDate} at ${config.venueName}, ${config.city}.`;

  const showHindi = language === 'hi' || language === 'bilingual';

  const handleOpenWhatsApp = () => {
    const cleanedPhone = config.rsvpPhone.replace(/[^\d]/g, '');
    const encodedText = encodeURIComponent(fixedWhatsappMessage);
    const waUrl = cleanedPhone
      ? `https://wa.me/${cleanedPhone}?text=${encodedText}`
      : `https://wa.me/?text=${encodedText}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenVenueMaps = () => {
    if (
      config.googleMapsUrl &&
      !config.googleMapsUrl.includes('[') &&
      config.googleMapsUrl.startsWith('http')
    ) {
      window.open(config.googleMapsUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const query = encodeURIComponent(`${config.venueName} ${config.city}`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* RSVP & VENUE DIRECTIONS SECTION */}
      <section
        id="rsvp"
        className="relative py-20 sm:py-28 px-4 sm:px-8 bg-[#2A0812] bg-royal-jaali overflow-hidden no-print"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.25em] uppercase text-[#C6A15B] mb-2">
              Prarthana &amp; RSVP · सादर निमंत्रण
            </p>
            <h2 className="font-display text-3xl sm:text-5xl text-[#F8F0E3] font-semibold tracking-wide">
              Awaiting Your Gracious Presence
            </h2>
            {showHindi && (
              <p className="font-devanagari text-lg text-[#E7D6AD]/85 mt-1">
                आपकी गरिमामयी उपस्थिति की प्रतीक्षा में
              </p>
            )}
          </div>

          {/* Royal RSVP Box */}
          <div className="relative bg-[#3B0C18]/95 border border-[#C6A15B]/65 p-6 sm:p-12 shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
            <div className="absolute inset-2.5 border border-[#C6A15B]/25 pointer-events-none" />
            <div className="absolute top-1.5 left-1.5 pointer-events-none">
              <FloralCornerOrnament position="top-left" className="w-12 h-12" />
            </div>
            <div className="absolute top-1.5 right-1.5 pointer-events-none">
              <FloralCornerOrnament position="top-right" className="w-12 h-12" />
            </div>
            <div className="absolute bottom-1.5 left-1.5 pointer-events-none">
              <FloralCornerOrnament position="bottom-left" className="w-12 h-12" />
            </div>
            <div className="absolute bottom-1.5 right-1.5 pointer-events-none">
              <FloralCornerOrnament position="bottom-right" className="w-12 h-12" />
            </div>

            <div className="relative z-10 text-center">
              <span className="text-xs tracking-[0.2em] uppercase text-[#C6A15B] block">
                Shubh Vivah Venue · शुभ विवाह स्थल
              </span>
              <h3 className="font-display text-2xl sm:text-4xl text-[#F8F0E3] font-semibold mt-1">
                {config.venueName}
              </h3>
              <p className="text-sm sm:text-base text-[#E7D6AD]/90 mt-1">
                {config.fullAddress}
              </p>
              <p className="text-xs sm:text-sm tracking-[0.18em] uppercase text-[#C6A15B] mt-2">
                {config.weddingDate} · {config.weddingTime}
              </p>

              {/* Fixed Blessing Note */}
              <div className="mt-6 py-4 px-5 bg-[#22060E]/90 border border-[#C6A15B]/35 max-w-2xl mx-auto">
                <p className="font-display italic text-base sm:text-lg text-[#F8F0E3]/90 leading-relaxed">
                  “{fixedWhatsappMessage}”
                </p>
              </div>

              {/* Primary RSVP & Keepsake Actions */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={handleOpenVenueMaps}
                  className="btn-gold-sweep inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#C6A15B] text-[#2A0812] font-semibold text-xs sm:text-sm tracking-[0.16em] uppercase border border-[#E7D6AD] hover:bg-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Google Maps Directions</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#2A0812] text-[#E7D6AD] text-xs sm:text-sm tracking-[0.15em] uppercase border border-[#C6A15B]/60 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#C6A15B]" />
                  <span>Send Blessings on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={onShareInvitation}
                  className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#2A0812] text-[#E7D6AD] text-xs sm:text-sm tracking-[0.15em] uppercase border border-[#C6A15B]/60 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#C6A15B]" />
                  <span>{shareFeedback || 'Share Invitation'}</span>
                </button>

                <button
                  type="button"
                  onClick={onPrintInvitation}
                  className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#2A0812] text-[#E7D6AD] text-xs sm:text-sm tracking-[0.15em] uppercase border border-[#C6A15B]/60 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#C6A15B]" />
                  <span>Save Keepsake PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROYAL FOOTER */}
      <footer className="relative bg-[#1B040B] border-t border-[#C6A15B]/35 py-16 px-4 sm:px-8 text-center no-print">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Wedding Monogram Medallion */}
          <div className="w-14 h-14 rounded-full border border-[#C6A15B] bg-[#2A0812] flex items-center justify-center shadow-[0_0_24px_rgba(198,161,91,0.25)] mb-4">
            <span className="font-display text-base font-semibold tracking-widest text-[#E7D6AD]">
              {config.monogramInitials}
            </span>
          </div>

          <RoyalLotusEmblem className="w-12 h-8 mb-3" />

          <h2 className="font-display text-2xl sm:text-4xl text-[#F8F0E3] font-semibold tracking-wide">
            {config.brideName} <span className="text-[#C6A15B] italic font-normal">&amp;</span>{' '}
            {config.groomName}
          </h2>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm tracking-[0.2em] uppercase text-[#E7D6AD]/80">
            <span>{config.weddingDate}</span>
            <span aria-hidden="true">·</span>
            <span>{config.venueName}</span>
            <span aria-hidden="true">·</span>
            <span>{config.city}</span>
          </div>

          <p className="mt-4 font-display italic text-base sm:text-lg text-[#F8F0E3]/80 max-w-lg">
            “Your blessings are the greatest gift as our families unite in love and celebration.”
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <GlowingDiya size="sm" />
            <span className="text-xs tracking-[0.22em] uppercase text-[#C6A15B]">
              {config.hashtag}
            </span>
            <GlowingDiya size="sm" />
          </div>

          <button
            type="button"
            onClick={handleScrollToTop}
            className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-[#2A0812] text-[#E7D6AD] text-xs tracking-[0.18em] uppercase border border-[#C6A15B]/50 hover:border-[#E7D6AD] hover:text-[#F8F0E3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Back to Beginning</span>
          </button>
        </div>
      </footer>
    </>
  );
};
