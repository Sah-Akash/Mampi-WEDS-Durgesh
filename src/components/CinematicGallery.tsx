import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, Upload, RotateCcw } from 'lucide-react';
import { GalleryPlateItem, LanguageMode, WeddingConfig } from '../config/weddingConfig';
import { ChapterDivider, FloralCornerOrnament, RoyalArchitecturalPlate } from './RoyalOrnaments';

interface CinematicGalleryProps {
  config: WeddingConfig;
  language: LanguageMode;
  onUpdateGalleryPhoto: (plateId: string, photoDataUrl: string | undefined) => void;
}

export const CinematicGallery: React.FC<CinematicGalleryProps> = ({
  config,
  language,
  onUpdateGalleryPhoto,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const plates = config.gallery;
  const showEnglish = language === 'en' || language === 'bilingual';
  const showHindi = language === 'hi' || language === 'bilingual';

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + plates.length) % plates.length));
  }, [plates.length]);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % plates.length));
  }, [plates.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  const handleTriggerPhotoUpload = (plateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveUploadId(plateId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadId) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateGalleryPhoto(activeUploadId, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const featurePlate = plates[0];
  const gridPlates = plates.slice(1);
  const activeLightboxPlate: GalleryPlateItem | null =
    lightboxIndex !== null ? plates[lightboxIndex] : null;

  return (
    <section
      id="gallery"
      className="relative py-20 sm:py-28 px-4 sm:px-8 bg-gradient-to-b from-[#2A0812] via-[#3A0C18] to-[#2A0812] no-print"
    >
      {/* Hidden File Input so Family Can Test Real Portraits in Any Frame */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload family photograph to preview in royal frame"
      />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#C6A15B] mb-2">
              Chapter IV · Royal Monograph &amp; Keepsake Album
            </p>
            <h2 className="font-display text-3xl sm:text-5xl text-[#F8F0E3] font-semibold tracking-wide">
              The Royal Portrait Gallery
            </h2>
            {showHindi && (
              <p className="font-devanagari text-lg text-[#E7D6AD]/85 mt-1">
                शाही स्मृतियाँ एवं चित्र दीर्घा
              </p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#E7D6AD]/80 max-w-md border-b border-[#C6A15B]/30 pb-2">
            Displaying commissioned palace architectural illustrations as authentic placeholder plates. Click any frame to inspect in fullscreen or test-fit your own family photographs.
          </p>
        </div>

        {/* 1. LARGE FEATURE PHOTOGRAPH / ARCHITECTURAL PLATE */}
        {featurePlate && (
          <div
            onClick={() => setLightboxIndex(0)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setLightboxIndex(0);
              }
            }}
            aria-label={`Open ${featurePlate.title} in fullscreen viewer`}
            className="group relative mb-8 bg-[#2A0812] border border-[#C6A15B]/60 p-3 sm:p-5 shadow-[0_24px_70px_rgba(0,0,0,0.65)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#E7D6AD]"
          >
            <div className="absolute top-1.5 left-1.5 pointer-events-none z-20">
              <FloralCornerOrnament position="top-left" className="w-12 h-12" />
            </div>
            <div className="absolute top-1.5 right-1.5 pointer-events-none z-20">
              <FloralCornerOrnament position="top-right" className="w-12 h-12" />
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden border border-[#C6A15B]/30">
              <RoyalArchitecturalPlate
                type={featurePlate.illustrationType}
                photoUrl={featurePlate.photoUrl}
                alt={featurePlate.title}
                className="w-full h-full"
                badgeText={
                  featurePlate.photoUrl
                    ? 'Custom Family Photograph'
                    : 'Architectural Illustration Placeholder'
                }
              />

              {/* Hover Lightbox Prompt */}
              <div className="absolute top-3 left-3 px-3 py-1.5 bg-[#2A0812]/85 border border-[#C6A15B]/45 text-xs text-[#E7D6AD] inline-flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>View Fullscreen</span>
              </div>
            </div>

            {/* Editorial Caption Bar */}
            <div className="mt-4 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#C6A15B] tracking-[0.18em] uppercase">
                  <span>Plate 01</span>
                  <span aria-hidden="true">·</span>
                  <span>{featurePlate.category}</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-[#F8F0E3] font-semibold mt-0.5">
                  {featurePlate.title}
                </h3>
                {showEnglish && (
                  <p className="text-xs sm:text-sm text-[#F8F0E3]/75 mt-1">{featurePlate.caption}</p>
                )}
                {showHindi && (
                  <p className="font-devanagari text-xs sm:text-sm text-[#E7D6AD]/80 mt-0.5">
                    {featurePlate.captionHindi}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleTriggerPhotoUpload(featurePlate.id, e)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs text-[#E7D6AD] bg-[#3B0C18] border border-[#C6A15B]/50 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>{featurePlate.photoUrl ? 'Change Photo' : 'Preview Your Photo'}</span>
                </button>
                {featurePlate.photoUrl && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateGalleryPhoto(featurePlate.id, undefined);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs text-[#B87978] bg-[#2A0812] border border-[#B87978]/40 hover:text-[#F8F0E3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. CURATED ASYMMETRICAL EDITORIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {gridPlates.map((plate, idx) => {
            const actualIndex = idx + 1;
            // Asymmetrical 7 / 5 and 5 / 7 editorial pairing across rows
            const colSpanClass =
              idx === 0
                ? 'md:col-span-5'
                : idx === 1
                ? 'md:col-span-7'
                : idx === 2
                ? 'md:col-span-7'
                : 'md:col-span-5';

            return (
              <div
                key={plate.id}
                onClick={() => setLightboxIndex(actualIndex)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setLightboxIndex(actualIndex);
                  }
                }}
                aria-label={`Open ${plate.title} in fullscreen viewer`}
                className={`${colSpanClass} group relative bg-[#2A0812] border border-[#C6A15B]/45 hover:border-[#C6A15B] p-3 sm:p-4 flex flex-col justify-between transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#E7D6AD]`}
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#C6A15B]/25">
                    <RoyalArchitecturalPlate
                      type={plate.illustrationType}
                      photoUrl={plate.photoUrl}
                      alt={plate.title}
                      className="w-full h-full"
                      badgeText={
                        plate.photoUrl ? 'Custom Family Photo' : 'Illustration Placeholder'
                      }
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[#2A0812]/80 border border-[#C6A15B]/40 text-[11px] text-[#E7D6AD] inline-flex items-center gap-1 opacity-85 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3 h-3 text-[#C6A15B]" />
                      <span>Inspect</span>
                    </div>
                  </div>

                  <div className="mt-3.5">
                    <div className="flex items-center gap-2 text-[11px] text-[#C6A15B] tracking-[0.18em] uppercase">
                      <span className="font-mono-tabular">Plate 0{actualIndex + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span>{plate.category}</span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl text-[#F8F0E3] font-semibold mt-0.5">
                      {plate.title}
                    </h3>
                    {showEnglish && (
                      <p className="text-xs text-[#F8F0E3]/75 mt-1 leading-relaxed">
                        {plate.caption}
                      </p>
                    )}
                    {showHindi && (
                      <p className="font-devanagari text-xs text-[#E7D6AD]/80 mt-0.5">
                        {plate.captionHindi}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#C6A15B]/20 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#E7D6AD]/65">
                    Click frame to enlarge
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleTriggerPhotoUpload(plate.id, e)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#E7D6AD] bg-[#3B0C18] border border-[#C6A15B]/40 hover:border-[#E7D6AD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Upload className="w-3 h-3 text-[#C6A15B]" />
                      <span>{plate.photoUrl ? 'Replace Photo' : 'Try Your Photo'}</span>
                    </button>
                    {plate.photoUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateGalleryPhoto(plate.id, undefined);
                        }}
                        className="px-2.5 py-1.5 text-xs text-[#B87978] border border-[#B87978]/40 hover:text-[#F8F0E3] whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <ChapterDivider className="mt-16" />
      </div>

      {/* FULL-SCREEN LIGHTBOX VIEWER MODAL */}
      {activeLightboxPlate && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-[#160309]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Fullscreen Gallery Viewer — ${activeLightboxPlate.title}`}
          onClick={closeLightbox}
        >
          {/* Top Bar: Counter & Accessible Close Button */}
          <div
            className="w-full max-w-6xl mx-auto flex items-center justify-between gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#E7D6AD] font-mono-tabular">
              <span>
                Plate 0{lightboxIndex + 1} / 0{plates.length}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-sans uppercase tracking-wider text-[#C6A15B]">
                {activeLightboxPlate.category}
              </span>
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close fullscreen gallery viewer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A0812] text-[#F8F0E3] text-xs tracking-wider uppercase border border-[#C6A15B] hover:bg-[#C6A15B] hover:text-[#2A0812] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F8F0E3]"
            >
              <span>Close (Esc)</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Center Image Stage + Previous/Next Controls */}
          <div
            className="relative w-full max-w-5xl mx-auto my-auto flex items-center justify-center gap-3 sm:gap-6 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous photograph"
              className="p-3 sm:p-4 bg-[#2A0812]/90 border border-[#C6A15B]/60 text-[#E7D6AD] hover:bg-[#C6A15B] hover:text-[#2A0812] transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F8F0E3]"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="w-full max-h-[68vh] aspect-[16/10] border-2 border-[#C6A15B] bg-[#2A0812] p-2 sm:p-3 shadow-[0_24px_90px_rgba(0,0,0,0.9)] overflow-hidden">
              <RoyalArchitecturalPlate
                type={activeLightboxPlate.illustrationType}
                photoUrl={activeLightboxPlate.photoUrl}
                alt={activeLightboxPlate.title}
                className="w-full h-full"
                badgeText={
                  activeLightboxPlate.photoUrl
                    ? 'Family Portrait Preview'
                    : 'Architectural Heritage Illustration'
                }
              />
            </div>

            <button
              type="button"
              onClick={showNext}
              aria-label="Next photograph"
              className="p-3 sm:p-4 bg-[#2A0812]/90 border border-[#C6A15B]/60 text-[#E7D6AD] hover:bg-[#C6A15B] hover:text-[#2A0812] transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F8F0E3]"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Bottom Caption & Keyboard Hint */}
          <div
            className="w-full max-w-4xl mx-auto text-center pb-2"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl sm:text-3xl text-[#E7D6AD] font-semibold">
              {activeLightboxPlate.title}
            </h3>
            {showHindi && (
              <p className="font-devanagari text-sm text-[#C6A15B] mt-0.5">
                {activeLightboxPlate.titleHindi}
              </p>
            )}
            <p className="text-xs sm:text-sm text-[#F8F0E3]/80 mt-1">
              {activeLightboxPlate.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
