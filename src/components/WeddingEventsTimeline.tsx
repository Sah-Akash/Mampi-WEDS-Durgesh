import React, { useState } from 'react';
import { MapPin, Clock, Calendar, Sparkles, ExternalLink, Compass } from 'lucide-react';
import { LanguageMode, WeddingConfig, WeddingEventItem } from '../config/weddingConfig';
import { ChapterDivider, FloralCornerOrnament, RoyalArchitecturalPlate } from './RoyalOrnaments';

interface WeddingEventsTimelineProps {
  config: WeddingConfig;
  language: LanguageMode;
}

export const WeddingEventsTimeline: React.FC<WeddingEventsTimelineProps> = ({
  config,
  language,
}) => {
  const enabledEvents = config.events.filter((ev) => ev.enabled);
  const [activeEventId, setActiveEventId] = useState<string>(
    enabledEvents[0]?.id || 'haldi'
  );

  const showEnglish = language === 'en' || language === 'bilingual';
  const showHindi = language === 'hi' || language === 'bilingual';

  const handleOpenDirections = (event: WeddingEventItem) => {
    const rawUrl = event.googleMapsUrl || config.googleMapsUrl;
    if (rawUrl && !rawUrl.includes('[') && rawUrl.startsWith('http')) {
      window.open(rawUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    // Graceful fallback when [GOOGLE MAPS URL] placeholder is active: open Google Maps search query
    const query = encodeURIComponent(
      `${event.venueName !== '[VENUE NAME]' ? event.venueName : 'Royal Palace Venue'} ${
        config.city !== '[CITY]' ? config.city : 'Udaipur Rajasthan'
      }`
    );
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (enabledEvents.length === 0) return null;

  return (
    <section
      id="events"
      className="relative py-14 sm:py-24 px-3.5 sm:px-8 bg-[#2A0812] bg-royal-jaali overflow-hidden no-print"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p className="text-xs tracking-[0.25em] uppercase text-[#C6A15B] mb-2">
            Chapter III · Vivah Utsav Itinerary
          </p>
          <h2 className="font-display text-3xl sm:text-5xl text-[#F8F0E3] font-semibold tracking-wide">
            A Celebration Across Days
          </h2>
          {showHindi && (
            <p className="font-devanagari text-lg text-[#E7D6AD]/85 mt-1">
              मंगल उत्सव एवं वैवाहिक कार्यक्रमों की रूपरेखा
            </p>
          )}
          <p className="mt-3 text-sm text-[#F8F0E3]/75">
            Each ceremony is a cherished chapter in the union of our two families.
          </p>
        </div>

        {/* DESKTOP HORIZONTAL TIMELINE TRACK (lg+) */}
        <div className="hidden lg:block mb-14">
          <div className="relative pt-4 pb-6">
            {/* Connecting Horizontal Gold Filigree Line */}
            <div
              className="absolute top-[38px] left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent"
              aria-hidden="true"
            />

            <div
              className={`grid ${
                enabledEvents.length === 3
                  ? 'grid-cols-3 max-w-4xl mx-auto'
                  : 'grid-cols-5'
              } gap-4 relative z-10`}
            >
              {enabledEvents.map((ev, index) => {
                const isActive = ev.id === activeEventId;
                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => {
                      setActiveEventId(ev.id);
                      const el = document.getElementById(`event-card-${ev.id}`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }
                    }}
                    className="group flex flex-col items-center text-center px-2 focus-visible:outline-2 focus-visible:outline-[#E7D6AD] cursor-pointer"
                  >
                    {/* Numeral & Ornamental Diamond Node */}
                    <div
                      className={`w-12 h-12 rotate-45 flex items-center justify-center border transition-all duration-300 ${
                        isActive
                          ? 'bg-[#C6A15B] border-[#F8F0E3] shadow-[0_0_24px_rgba(198,161,91,0.6)] scale-110'
                          : 'bg-[#2A0812] border-[#C6A15B]/60 group-hover:border-[#E7D6AD]'
                      }`}
                    >
                      <span
                        className={`-rotate-45 font-mono-tabular text-xs font-semibold ${
                          isActive ? 'text-[#2A0812]' : 'text-[#E7D6AD]'
                        }`}
                      >
                        0{index + 1}
                      </span>
                    </div>

                    {/* Event Title & Date */}
                    <span
                      className={`mt-5 font-display text-lg font-semibold tracking-wider uppercase transition-colors ${
                        isActive ? 'text-[#E7D6AD]' : 'text-[#F8F0E3]/80 group-hover:text-[#F8F0E3]'
                      }`}
                    >
                      {ev.name}
                    </span>
                    {showHindi && (
                      <span className="font-devanagari text-xs text-[#C6A15B] mt-0.5">
                        {ev.nameHindi}
                      </span>
                    )}
                    <span className="mt-1 text-[11px] text-[#F8F0E3]/65 tracking-wider">
                      {ev.date} · {ev.startTime}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RESPONSIVE VERTICAL TIMELINE (Mobile) & EDITORIAL CEREMONY SHOWCASE CARDS (Desktop) */}
        <div className="relative">
          {/* Vertical Timeline Spine on Mobile/Tablet */}
          <div
            className="lg:hidden absolute left-2.5 sm:left-5 top-4 bottom-4 w-[1px] bg-gradient-to-b from-[#C6A15B]/20 via-[#C6A15B] to-[#C6A15B]/20"
            aria-hidden="true"
          />

          <div className="space-y-8 sm:space-y-14">
            {enabledEvents.map((ev, index) => {
              const isEven = index % 2 === 1;
              const isSelected = ev.id === activeEventId;

              return (
                <article
                  id={`event-card-${ev.id}`}
                  key={ev.id}
                  onClick={() => setActiveEventId(ev.id)}
                  className={`relative pl-7 sm:pl-14 lg:pl-0 transition-all duration-300`}
                >
                  {/* Mobile Timeline Node Marker */}
                  <div
                    className="lg:hidden absolute left-0.5 sm:left-3 top-8 w-4 h-4 sm:w-5 sm:h-5 rotate-45 bg-[#4A101D] border border-[#C6A15B] flex items-center justify-center shadow-[0_0_12px_rgba(198,161,91,0.5)]"
                    aria-hidden="true"
                  >
                    <div className="w-1.5 h-1.5 bg-[#E7D6AD]" />
                  </div>

                  {/* Card Container */}
                  <div
                    className={`relative grid grid-cols-1 lg:grid-cols-12 items-stretch bg-[#380B16]/90 border transition-colors ${
                      isSelected
                        ? 'border-[#C6A15B] shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
                        : 'border-[#C6A15B]/35 hover:border-[#C6A15B]/70'
                    }`}
                  >
                    {/* Corner Ornaments */}
                    <div className="absolute top-1.5 left-1.5 pointer-events-none z-20">
                      <FloralCornerOrnament position="top-left" className="w-10 h-10" />
                    </div>
                    <div className="absolute bottom-1.5 right-1.5 pointer-events-none z-20">
                      <FloralCornerOrnament position="bottom-right" className="w-10 h-10" />
                    </div>

                    {/* Visual Illustration / Photo Column (5 cols on lg) */}
                    <div
                      className={`lg:col-span-5 relative min-h-[240px] sm:min-h-[280px] lg:h-full ${
                        isEven ? 'lg:order-2' : 'lg:order-1'
                      }`}
                    >
                      <RoyalArchitecturalPlate
                        type={ev.illustrationType}
                        photoUrl={ev.photoUrl}
                        alt={`${ev.name} — ${ev.subtitle}`}
                        className="w-full h-full min-h-[240px]"
                        badgeText={`0${index + 1} · ${ev.name}`}
                      />
                    </div>

                    {/* Ceremony Details Column (7 cols on lg) */}
                    <div
                      className={`lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between ${
                        isEven ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      <div>
                        {/* Unboxed Chapter & Accent Kicker */}
                        <div className="flex flex-wrap items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#C6A15B]">
                          <span className="font-mono-tabular">Ceremony 0{index + 1}</span>
                          <span aria-hidden="true">·</span>
                          <span>{ev.subtitle}</span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-baseline gap-3">
                          <h3 className="font-display text-2xl sm:text-4xl font-semibold text-[#F8F0E3] tracking-wide">
                            {ev.name}
                          </h3>
                          {showHindi && (
                            <span className="font-devanagari text-lg sm:text-xl text-[#E7D6AD]">
                              ({ev.nameHindi})
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {showEnglish && (
                          <p className="mt-3 text-sm sm:text-base text-[#F8F0E3]/85 leading-relaxed">
                            {ev.description}
                          </p>
                        )}
                        {showHindi && (
                          <p className="mt-2 font-devanagari text-sm sm:text-base text-[#E7D6AD]/80 leading-relaxed">
                            {ev.descriptionHindi}
                          </p>
                        )}

                        {/* Metadata Grid: Date, Time, Venue, Dress Code */}
                        <div className="mt-6 pt-5 border-t border-[#C6A15B]/25 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                          <div className="flex items-start gap-2.5">
                            <Calendar className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                            <div>
                              <span className="block text-[11px] tracking-[0.16em] uppercase text-[#E7D6AD]/70">
                                Date
                              </span>
                              <span className="font-medium text-[#F8F0E3]">{ev.date}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <Clock className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                            <div>
                              <span className="block text-[11px] tracking-[0.16em] uppercase text-[#E7D6AD]/70">
                                Auspicious Timing
                              </span>
                              <span className="font-medium text-[#F8F0E3]">
                                {ev.startTime} {ev.endTime ? `· ${ev.endTime}` : ''}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                            <div>
                              <span className="block text-[11px] tracking-[0.16em] uppercase text-[#E7D6AD]/70">
                                Royal Venue &amp; Address
                              </span>
                              <span className="font-medium text-[#F8F0E3] block">{ev.venueName}</span>
                              <span className="text-xs text-[#F8F0E3]/70">{ev.fullAddress}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                            <div>
                              <span className="block text-[11px] tracking-[0.16em] uppercase text-[#E7D6AD]/70">
                                Dress Code
                              </span>
                              {showEnglish && (
                                <span className="font-medium text-[#E7D6AD] block">{ev.dressCode}</span>
                              )}
                              {showHindi && (
                                <span className="font-devanagari text-xs text-[#F8F0E3]/75 block">
                                  {ev.dressCodeHindi}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Footer: Google Maps Directions */}
                      <div className="mt-6 pt-4 border-t border-[#C6A15B]/20 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs text-[#E7D6AD]/75">
                          <span
                            className="w-2.5 h-2.5 rotate-45 inline-block border border-[#E7D6AD]"
                            style={{ backgroundColor: ev.accentHex }}
                            aria-hidden="true"
                          />
                          <span>Palette Accent: {ev.name}</span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDirections(ev);
                          }}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2A0812] text-[#E7D6AD] text-xs font-medium tracking-[0.15em] uppercase border border-[#C6A15B]/60 hover:bg-[#C6A15B] hover:text-[#2A0812] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>Google Maps Directions</span>
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <ChapterDivider className="mt-16" />
      </div>
    </section>
  );
};
