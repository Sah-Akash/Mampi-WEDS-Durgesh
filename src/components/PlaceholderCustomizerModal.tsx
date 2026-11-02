import React, { useState } from 'react';
import { X, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';
import {
  DEFAULT_WEDDING_CONFIG,
  SACRED_MANGALAM_DEMO_CONFIG,
  WeddingConfig,
} from '../config/weddingConfig';

interface PlaceholderCustomizerModalProps {
  isOpen: boolean;
  config: WeddingConfig;
  onClose: () => void;
  onUpdateConfig: (updated: WeddingConfig) => void;
  onResetToPlaceholders: () => void;
  onLoadSacredMangalamDemo: () => void;
}

export const PlaceholderCustomizerModal: React.FC<PlaceholderCustomizerModalProps> = ({
  isOpen,
  config,
  onClose,
  onUpdateConfig,
  onResetToPlaceholders,
  onLoadSacredMangalamDemo,
}) => {
  const [copiedConfig, setCopiedConfig] = useState(false);

  if (!isOpen) return null;

  const handleFieldChange = (field: keyof WeddingConfig, value: string) => {
    const next = { ...config, [field]: value };
    if (field === 'brideName' || field === 'groomName') {
      const bClean = next.brideName.replace(/[\[\]]/g, '').trim();
      const gClean = next.groomName.replace(/[\[\]]/g, '').trim();
      const bInit = bClean ? bClean[0].toUpperCase() : 'B';
      const gInit = gClean ? gClean[0].toUpperCase() : 'G';
      next.monogramInitials = `${bInit} & ${gInit}`;
    }
    onUpdateConfig(next);
  };

  const handleCopyConfigCode = async () => {
    const snippet = `export const WEDDING_CONFIG: WeddingConfig = ${JSON.stringify(
      config,
      null,
      2
    )};`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedConfig(true);
      window.setTimeout(() => setCopiedConfig(false), 2500);
    } catch {
      // Ignore clipboard error
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-[#140207]/85 backdrop-blur-sm flex items-center justify-end no-print"
      role="dialog"
      aria-modal="true"
      aria-label="Customize Sacred Mangalam Wedding Details"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full bg-[#2A0812] border-l border-[#C6A15B]/60 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#C6A15B]/30">
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-[#C6A15B] block">
                Sacred Mangalam · Live Configuration
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-[#F8F0E3] font-semibold">
                Customize Names &amp; Hold Scenes
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#E7D6AD] border border-[#C6A15B]/40 hover:bg-[#C6A15B] hover:text-[#2A0812] transition-colors cursor-pointer"
              aria-label="Close editor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Switchers */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pb-5 border-b border-[#C6A15B]/20">
            <button
              type="button"
              onClick={onLoadSacredMangalamDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#3B0C18] text-[#E7D6AD] border border-[#C6A15B]/50 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Load Sacred Mangalam Demo (Ananya &amp; Rohan)</span>
            </button>

            <button
              type="button"
              onClick={onResetToPlaceholders}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#E7D6AD]/80 bg-[#21060E] border border-[#C6A15B]/35 hover:text-[#F8F0E3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#B87978]" />
              <span>Use Strict [PLACEHOLDERS]</span>
            </button>
          </div>

          {/* Form Grid */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {(
              [
                { key: 'guestName', label: 'Guest Salutation (e.g. Guest / Family)' },
                { key: 'rsvpPhone', label: 'WhatsApp RSVP Number' },
                { key: 'brideName', label: "Bride's Name" },
                { key: 'groomName', label: "Groom's Name" },
                { key: 'brideFatherName', label: "Bride's Father's Name" },
                { key: 'brideMotherName', label: "Bride's Mother's Name" },
                { key: 'groomFatherName', label: "Groom's Father's Name" },
                { key: 'groomMotherName', label: "Groom's Mother's Name" },
                { key: 'haldiName', label: 'Scene 2 Title (Haldi)' },
                { key: 'haldiDate', label: 'Haldi Date' },
                { key: 'haldiTime', label: 'Haldi Time' },
                { key: 'haldiVenue', label: 'Haldi Venue' },
                { key: 'receptionName', label: 'Scene 3 Title (Reception)' },
                { key: 'receptionDate', label: 'Reception Date' },
                { key: 'receptionTime', label: 'Reception Time' },
                { key: 'receptionVenue', label: 'Reception Venue' },
                { key: 'weddingName', label: 'Scene 4 Title (Wedding)' },
                { key: 'weddingDate', label: 'Wedding Date' },
                { key: 'weddingTime', label: 'Wedding Time (Muhurtham)' },
                { key: 'venueName', label: 'Wedding Venue' },
                { key: 'city', label: 'City' },
                { key: 'countdownTargetISO', label: 'Countdown Target ISO (+05:30)' },
                { key: 'googleMapsUrl', label: 'Wedding Venue Google Maps URL' },
              ] as { key: keyof WeddingConfig; label: string }[]
            ).map((item) => (
              <div
                key={item.key}
                className={item.key === 'googleMapsUrl' ? 'sm:col-span-2' : ''}
              >
                <label className="block text-[11px] tracking-wider uppercase text-[#E7D6AD]/80 mb-1">
                  {item.label}
                </label>
                <input
                  type="text"
                  value={String(config[item.key] ?? '')}
                  onChange={(e) => handleFieldChange(item.key, e.target.value)}
                  placeholder={String(
                    DEFAULT_WEDDING_CONFIG[item.key] ?? SACRED_MANGALAM_DEMO_CONFIG[item.key] ?? ''
                  )}
                  className="w-full px-3 py-2 bg-[#1D040B] text-[#F8F0E3] border border-[#C6A15B]/40 focus:border-[#E7D6AD] focus:outline-none text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-[#C6A15B]/30 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopyConfigCode}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3B0C18] text-[#E7D6AD] text-xs font-medium uppercase tracking-wider border border-[#C6A15B]/60 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copiedConfig ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Copied Config!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Copy Config Object</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#C6A15B] text-[#2A0812] text-xs font-semibold uppercase tracking-wider hover:bg-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Apply &amp; Return to Film
          </button>
        </div>
      </div>
    </div>
  );
};
