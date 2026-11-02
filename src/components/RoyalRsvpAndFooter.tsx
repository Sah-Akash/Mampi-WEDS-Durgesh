import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Share2,
  Printer,
  Copy,
  Check,
  ArrowUp,
  Compass,
  Info,
  Sparkles,
} from 'lucide-react';
import { LanguageMode, WeddingConfig } from '../config/weddingConfig';
import { FloralCornerOrnament, GlowingDiya, RoyalLotusEmblem } from './RoyalOrnaments';

interface RoyalRsvpAndFooterProps {
  config: WeddingConfig;
  language: LanguageMode;
  onShareInvitation: () => void;
  onPrintInvitation: () => void;
  onOpenCustomizer: () => void;
  shareFeedback: string | null;
}

export const RoyalRsvpAndFooter: React.FC<RoyalRsvpAndFooterProps> = ({
  config,
  language,
  onShareInvitation,
  onPrintInvitation,
  onOpenCustomizer,
  shareFeedback,
}) => {
  const defaultWhatsappMessage = `Namaste! With warm regards and blessings for ${config.brideName} & ${config.groomName}, we are delighted to confirm our presence at the wedding celebrations on ${config.weddingDate} at ${config.venueName}, ${config.city}.`;

  const [whatsappMessage, setWhatsappMessage] = useState(defaultWhatsappMessage);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [showPublishGuide, setShowPublishGuide] = useState(false);

  // Sync default message if placeholders are edited live
  useEffect(() => {
    setWhatsappMessage(
      `Namaste! With warm regards and blessings for ${config.brideName} & ${config.groomName}, we are delighted to confirm our presence at the wedding celebrations on ${config.weddingDate} at ${config.venueName}, ${config.city}.`
    );
  }, [config.brideName, config.groomName, config.weddingDate, config.venueName, config.city]);

  const showHindi = language === 'hi' || language === 'bilingual';

  const handleOpenWhatsApp = () => {
    const cleanedPhone = config.rsvpPhone.replace(/[^\d]/g, '');
    const encodedText = encodeURIComponent(whatsappMessage);
    const waUrl = cleanedPhone
      ? `https://wa.me/${cleanedPhone}?text=${encodedText}`
      : `https://wa.me/?text=${encodedText}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopiedMsg(true);
      window.setTimeout(() => setCopiedMsg(false), 2500);
    } catch {
      // Fallback
    }
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
    const query = encodeURIComponent(
      `${config.venueName !== '[VENUE NAME]' ? config.venueName : 'Royal Palace'} ${
        config.city !== '[CITY]' ? config.city : 'Udaipur'
      }`
    );
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
      {/* RSVP & GUEST CONCIERGE SECTION */}
      <section
        id="rsvp"
        className="relative py-20 sm:py-28 px-4 sm:px-8 bg-[#2A0812] bg-royal-jaali overflow-hidden no-print"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.25em] uppercase text-[#C6A15B] mb-2">
              Chapter V · Prarthana &amp; RSVP
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

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#C6A15B]/30">
                <div>
                  <span className="text-xs tracking-[0.2em] uppercase text-[#C6A15B] block">
                    Direct Family RSVP &amp; Blessings
                  </span>
                  <p className="font-display text-2xl sm:text-3xl text-[#F8F0E3] font-semibold mt-1">
                    {config.rsvpPhone
                      ? `WhatsApp / Phone: ${config.rsvpPhone}`
                      : `${config.brideName} Weds ${config.groomName} · ${config.city}`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenVenueMaps}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2A0812] text-[#E7D6AD] text-xs tracking-[0.15em] uppercase border border-[#C6A15B]/50 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Main Venue Map</span>
                </button>
              </div>

              {/* Editable Prefilled WhatsApp Message */}
              <div className="mt-6">
                <label
                  htmlFor="whatsapp-rsvp-textarea"
                  className="block text-xs tracking-[0.18em] uppercase text-[#E7D6AD] mb-2"
                >
                  Editable WhatsApp RSVP Message (Customize before sending):
                </label>
                <textarea
                  id="whatsapp-rsvp-textarea"
                  rows={3}
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  className="w-full p-4 bg-[#22060E] text-[#F8F0E3] text-sm border border-[#C6A15B]/50 focus:border-[#E7D6AD] focus:outline-none leading-relaxed"
                />
                <p className="mt-1.5 text-xs text-[#E7D6AD]/65">
                  No guest data is stored or tracked on this website. Clicking below opens WhatsApp directly on your device.
                </p>
              </div>

              {/* Primary RSVP & Keepsake Actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="btn-gold-sweep inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#C6A15B] text-[#2A0812] font-semibold text-xs sm:text-sm tracking-[0.16em] uppercase border border-[#E7D6AD] hover:bg-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send RSVP via WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center gap-2 px-4 py-3.5 bg-[#2A0812] text-[#E7D6AD] text-xs tracking-[0.15em] uppercase border border-[#C6A15B]/50 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedMsg ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#C6A15B]" />
                      <span>Message Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#C6A15B]" />
                      <span>Copy RSVP Text</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onShareInvitation}
                  className="inline-flex items-center gap-2 px-4 py-3.5 bg-[#2A0812] text-[#E7D6AD] text-xs tracking-[0.15em] uppercase border border-[#C6A15B]/50 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>{shareFeedback || 'Share Invitation'}</span>
                </button>

                <button
                  type="button"
                  onClick={onPrintInvitation}
                  className="inline-flex items-center gap-2 px-4 py-3.5 bg-[#2A0812] text-[#E7D6AD] text-xs tracking-[0.15em] uppercase border border-[#C6A15B]/50 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Save Keepsake PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Discreet Family Guide for Replacing Placeholders & Publishing */}
          <div className="mt-10 border border-[#C6A15B]/30 bg-[#21060E]/90 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-[#C6A15B] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-[#E7D6AD]">
                  Family Guide: How to Replace Placeholders, Configure WhatsApp Share Cards &amp; Publish
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenCustomizer}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#C6A15B] text-[#2A0812] hover:bg-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Live Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPublishGuide((prev) => !prev)}
                  className="px-3 py-1.5 text-xs text-[#E7D6AD] border border-[#C6A15B]/40 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {showPublishGuide ? 'Hide Guide' : 'View Setup Instructions'}
                </button>
              </div>
            </div>

            {showPublishGuide && (
              <div className="mt-5 pt-5 border-t border-[#C6A15B]/25 text-xs sm:text-sm text-[#F8F0E3]/80 space-y-4 leading-relaxed">
                <div>
                  <h4 className="font-semibold text-[#E7D6AD] uppercase tracking-wider text-xs">
                    1. Updating All Placeholders in One File
                  </h4>
                  <p className="mt-1">
                    Open <code className="text-[#E7D6AD]">src/config/weddingConfig.ts</code> and update{' '}
                    <code className="text-[#E7D6AD]">DEFAULT_WEDDING_CONFIG</code>. Every placeholder (
                    <code className="text-[#C6A15B]">[BRIDE NAME]</code>,{' '}
                    <code className="text-[#C6A15B]">[GROOM NAME]</code>, parents’ names,{' '}
                    <code className="text-[#C6A15B]">[WEDDING DATE]</code>,{' '}
                    <code className="text-[#C6A15B]">[VENUE NAME]</code>,{' '}
                    <code className="text-[#C6A15B]">[GOOGLE MAPS URL]</code>, and{' '}
                    <code className="text-[#C6A15B]">[PHONE NUMBER]</code>) flows automatically across the palace doors, hero, parchment card, countdown, itinerary, and WhatsApp RSVP. You can also click <strong>“Live Editor”</strong> above to test changes right now and copy the generated config object.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#E7D6AD] uppercase tracking-wider text-xs">
                    2. WhatsApp &amp; Social Share Preview Metadata (index.html)
                  </h4>
                  <p className="mt-1">
                    When sharing the deployed link on WhatsApp or iMessage, crawlers read the static tags in{' '}
                    <code className="text-[#E7D6AD]">index.html</code>. Before deploying, replace{' '}
                    <code className="text-[#C6A15B]">[BRIDE NAME]</code>,{' '}
                    <code className="text-[#C6A15B]">[GROOM NAME]</code>,{' '}
                    <code className="text-[#C6A15B]">[WEDDING DATE]</code>, and{' '}
                    <code className="text-[#C6A15B]">[CITY]</code> inside <code className="text-[#E7D6AD]">&lt;title&gt;</code>,{' '}
                    <code className="text-[#E7D6AD]">og:title</code>, and{' '}
                    <code className="text-[#E7D6AD]">og:description</code>, and add an absolute{' '}
                    <code className="text-[#E7D6AD]">&lt;meta property=&quot;og:image&quot; content=&quot;https://your-domain.com/og-preview.jpg&quot; /&gt;</code>{' '}
                    (1200×630px JPG/PNG under 300KB for instant WhatsApp thumbnail rendering).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ROYAL FOOTER */}
      <footer className="relative bg-[#1B040B] border-t border-[#C6A15B]/35 py-16 px-4 sm:px-8 text-center no-print">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Discreet Wedding Monogram Medallion */}
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

          <div className="mt-2 flex items-center justify-center gap-2 text-xs sm:text-sm tracking-[0.2em] uppercase text-[#E7D6AD]/80">
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
