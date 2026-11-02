/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MAMPI_DURGESH_WEDDING_CONFIG,
  LanguageMode,
  WeddingConfig,
} from './config/weddingConfig';
import { SacredMangalamFilm } from './components/SacredMangalamFilm';
import { FamilyInvitationSection } from './components/FamilyInvitationSection';
import { WeddingCountdown } from './components/WeddingCountdown';
import { WeddingEventsTimeline } from './components/WeddingEventsTimeline';
import { CinematicGallery } from './components/CinematicGallery';
import { RoyalRsvpAndFooter } from './components/RoyalRsvpAndFooter';
import { PlaceholderCustomizerModal } from './components/PlaceholderCustomizerModal';
import { royalAudio } from './utils/royalAudio';

export default function App() {
  const [config, setConfig] = useState<WeddingConfig>(MAMPI_DURGESH_WEDDING_CONFIG);
  const [isGateLocked, setIsGateLocked] = useState<boolean>(true);
  const [language, setLanguage] = useState<LanguageMode>(
    MAMPI_DURGESH_WEDDING_CONFIG.preferredLanguage
  );
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Sync document title
  useEffect(() => {
    document.title = `${config.brideName} Weds ${config.groomName} | 24.11.2026 · ${config.city}`;
  }, [config.brideName, config.groomName, config.city]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      royalAudio.stopAmbientMusic();
    };
  }, []);

  const handleUnlockGate = () => {
    setIsGateLocked(false);
    const playing = royalAudio.startAmbientMusic();
    setIsMusicPlaying(playing);
  };

  const handleToggleMusic = () => {
    const nextState = royalAudio.toggleAmbientMusic();
    setIsMusicPlaying(nextState);
  };

  const handleShareInvitation = async () => {
    const shareData = {
      title: `${config.brideName} Weds ${config.groomName} | Wedding Invitation`,
      text: `With love and the blessings of our families, we invite you to celebrate the wedding of ${config.brideName} & ${config.groomName} on ${config.weddingDate} at ${config.venueName}, ${config.city}.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareFeedback('Link Copied!');
      window.setTimeout(() => setShareFeedback(null), 2600);
    } catch {
      setShareFeedback('Share Ready');
      window.setTimeout(() => setShareFeedback(null), 2600);
    }
  };

  const handlePrintInvitation = () => {
    window.print();
  };

  const handleUpdateGalleryPhoto = (
    plateId: string,
    photoDataUrl: string | undefined
  ) => {
    setConfig((prev) => ({
      ...prev,
      gallery: prev.gallery.map((item) =>
        item.id === plateId
          ? {
              ...item,
              photoUrl: photoDataUrl,
              isPlaceholderIllustration: !photoDataUrl,
            }
          : item
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-[#241316] text-[#F8F0E3] relative">
      {/* 1. SACRED MANGALAM CONTINUOUS SCROLL-SCRUBBED WEDDING FILM */}
      <SacredMangalamFilm
        config={config}
        language={language}
        onLanguageChange={setLanguage}
        isLocked={isGateLocked}
        onUnlock={handleUnlockGate}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
      />

      {/* 2. EXTENDED ROYAL KEEPSAKE CONCIERGE BELOW THE FILM (Countdown, Printable Card, 3-Day Itinerary, Gallery & WhatsApp RSVP) */}
      {!isGateLocked && (
        <div id="details-concierge" className="relative z-20 bg-[#2A0812]">
          <WeddingCountdown config={config} language={language} />

          <FamilyInvitationSection
            config={config}
            language={language}
            onPrintInvitation={handlePrintInvitation}
          />

          <WeddingEventsTimeline config={config} language={language} />

          <CinematicGallery
            config={config}
            language={language}
            onUpdateGalleryPhoto={handleUpdateGalleryPhoto}
          />

          <RoyalRsvpAndFooter
            config={config}
            language={language}
            onShareInvitation={handleShareInvitation}
            onPrintInvitation={handlePrintInvitation}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
            shareFeedback={shareFeedback}
          />
        </div>
      )}

      {/* 3. CUSTOMIZER MODAL */}
      <PlaceholderCustomizerModal
        isOpen={isCustomizerOpen}
        config={config}
        onClose={() => setIsCustomizerOpen(false)}
        onUpdateConfig={setConfig}
        onResetToPlaceholders={() => setConfig(MAMPI_DURGESH_WEDDING_CONFIG)}
        onLoadSacredMangalamDemo={() => setConfig(MAMPI_DURGESH_WEDDING_CONFIG)}
      />
    </div>
  );
}
