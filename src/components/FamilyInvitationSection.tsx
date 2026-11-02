import React from 'react';
import { MapPin, Calendar, Clock, Printer } from 'lucide-react';
import { LanguageMode, WeddingConfig } from '../config/weddingConfig';
import { ChapterDivider, FloralCornerOrnament, RoyalLotusEmblem } from './RoyalOrnaments';

interface FamilyInvitationSectionProps {
  config: WeddingConfig;
  language: LanguageMode;
  onPrintInvitation: () => void;
}

export const FamilyInvitationSection: React.FC<FamilyInvitationSectionProps> = ({
  config,
  language,
  onPrintInvitation,
}) => {
  const showEnglish = language === 'en' || language === 'bilingual';
  const showHindi = language === 'hi' || language === 'bilingual';

  return (
    <section
      id="invitation"
      className="relative py-20 sm:py-28 px-4 sm:px-8 bg-[#2A0812] bg-royal-jaali overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 no-print">
          <p className="text-xs tracking-[0.25em] uppercase text-[#C6A15B] mb-2">
            Chapter I · Nimantran Patra
          </p>
          <h2 className="font-display text-3xl sm:text-5xl text-[#F8F0E3] font-semibold tracking-wide">
            The Royal Family Invitation
          </h2>
          {showHindi && (
            <p className="font-devanagari text-lg text-[#E7D6AD]/85 mt-1">
              स्नेहिल पारिवारिक निमंत्रण पत्र
            </p>
          )}
        </div>

        {/* Handcrafted Royal Ivory Parchment Card */}
        <article
          className="print-only-card relative bg-ivory-parchment text-[#2A0812] p-6 sm:p-12 md:p-16 border-2 border-[#C6A15B] shadow-[0_28px_90px_rgba(0,0,0,0.65)]"
          aria-label="Formal Family Wedding Invitation Card"
        >
          {/* Inner Antique Gold Hairline Frame */}
          <div className="absolute inset-2.5 sm:inset-4 border border-[#4A101D]/25 pointer-events-none" />
          <div className="absolute inset-3.5 sm:inset-5 border border-[#C6A15B]/55 pointer-events-none" />

          {/* Four Floral Filigree Corners */}
          <div className="absolute top-2 left-2">
            <FloralCornerOrnament position="top-left" color="#8C6523" className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
          <div className="absolute top-2 right-2">
            <FloralCornerOrnament position="top-right" color="#8C6523" className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
          <div className="absolute bottom-2 left-2">
            <FloralCornerOrnament position="bottom-left" color="#8C6523" className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
          <div className="absolute bottom-2 right-2">
            <FloralCornerOrnament position="bottom-right" color="#8C6523" className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>

          {/* Sacred Sanskrit Shloka Header */}
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <p className="font-devanagari text-base sm:text-lg font-semibold text-[#4A101D] tracking-wider">
              {config.sanskritInvocation}
            </p>
            <p className="font-devanagari text-xs sm:text-sm text-[#4A101D]/75 mt-1 leading-relaxed">
              {config.sanskritMeaning}
            </p>

            <div className="my-4 flex justify-center">
              <RoyalLotusEmblem className="w-12 h-8" />
            </div>

            {/* Bride's Parents */}
            <div className="mt-4">
              {showEnglish && (
                <>
                  <p className="font-display text-xl sm:text-2xl font-semibold text-[#4A101D] tracking-wide">
                    Smt. {config.brideMotherName} &amp; Shri {config.brideFatherName}
                  </p>
                  <p className="mt-3 text-sm sm:text-base text-[#2A0812]/85 leading-relaxed whitespace-pre-line">
                    {config.familyInvitationWording}
                  </p>
                </>
              )}

              {showHindi && (
                <div className={showEnglish ? 'mt-5 pt-5 border-t border-[#C6A15B]/35' : 'mt-2'}>
                  <p className="font-devanagari text-lg sm:text-xl font-semibold text-[#4A101D]">
                    श्रीमती {config.brideMotherName} एवं श्री {config.brideFatherName}
                  </p>
                  <p className="mt-2 font-devanagari text-sm sm:text-base text-[#2A0812]/85 leading-relaxed whitespace-pre-line">
                    {config.familyInvitationWordingHindi}
                  </p>
                </div>
              )}
            </div>

            {/* Traditional Relationship & Couple Names */}
            <div className="my-8 py-6 px-4 border-y border-[#C6A15B]/45 bg-[#FFFDF9]/55">
              {showEnglish && (
                <p className="text-xs tracking-[0.22em] uppercase text-[#4A101D]/75 mb-2">
                  At the auspicious wedding celebration of their beloved daughter
                </p>
              )}
              {showHindi && (
                <p className="font-devanagari text-xs sm:text-sm text-[#4A101D]/80 mb-2">
                  अपनी आयुष्मती पुत्री के शुभ विवाह उत्सव पर
                </p>
              )}

              <h3 className="font-display text-3xl sm:text-5xl font-bold text-[#4A101D] tracking-wide mt-2">
                {config.brideName}
              </h3>
              {showHindi && (
                <p className="font-devanagari text-lg text-[#4A101D]/85 mt-0.5">
                  {config.brideNameHindi}
                </p>
              )}

              <div className="my-3 flex items-center justify-center gap-3">
                <span className="h-[1px] w-12 bg-[#C6A15B]" />
                <span className="font-display italic text-xl sm:text-2xl text-[#8C6523]">
                  weds
                </span>
                <span className="h-[1px] w-12 bg-[#C6A15B]" />
              </div>

              <h3 className="font-display text-3xl sm:text-5xl font-bold text-[#4A101D] tracking-wide">
                {config.groomName}
              </h3>
              {showHindi && (
                <p className="font-devanagari text-lg text-[#4A101D]/85 mt-0.5">
                  {config.groomNameHindi}
                </p>
              )}

              {/* Groom's Parents */}
              <div className="mt-4 pt-3 border-t border-[#C6A15B]/25">
                {showEnglish && (
                  <p className="text-xs sm:text-sm text-[#2A0812]/80">
                    Beloved son of{' '}
                    <strong className="font-display text-base sm:text-lg font-semibold text-[#4A101D]">
                      Smt. {config.groomMotherName} &amp; Shri {config.groomFatherName}
                    </strong>
                  </p>
                )}
                {showHindi && (
                  <p className="font-devanagari text-xs sm:text-sm text-[#4A101D]/85 mt-1">
                    सुपुत्र: श्रीमती {config.groomMotherName} एवं श्री {config.groomFatherName}
                  </p>
                )}
              </div>
            </div>

            {/* Key Wedding Details Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left sm:text-center py-2">
              <div className="p-3 border border-[#C6A15B]/35 bg-[#F8F0E3]/60">
                <div className="flex items-center sm:justify-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-[#8C6523] font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Wedding Date</span>
                </div>
                <p className="font-display text-lg font-bold text-[#4A101D] mt-1">
                  {config.weddingDate}
                </p>
              </div>

              <div className="p-3 border border-[#C6A15B]/35 bg-[#F8F0E3]/60">
                <div className="flex items-center sm:justify-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-[#8C6523] font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Auspicious Time</span>
                </div>
                <p className="font-display text-lg font-bold text-[#4A101D] mt-1">
                  {config.weddingTime}
                </p>
              </div>

              <div className="p-3 border border-[#C6A15B]/35 bg-[#F8F0E3]/60">
                <div className="flex items-center sm:justify-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-[#8C6523] font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Royal Venue</span>
                </div>
                <p className="font-display text-lg font-bold text-[#4A101D] mt-1">
                  {config.venueName}
                </p>
                <p className="text-xs text-[#2A0812]/75 mt-0.5">
                  {config.fullAddress}, {config.city}
                </p>
              </div>
            </div>

            {/* Optional Family Message */}
            {config.optionalFamilyMessage && (
              <div className="mt-6 pt-5 border-t border-[#C6A15B]/35">
                <p className="text-xs tracking-[0.2em] uppercase text-[#8C6523] mb-1">
                  Personal Note from the Family
                </p>
                {showEnglish && (
                  <p className="font-display italic text-base sm:text-lg text-[#4A101D]">
                    “{config.optionalFamilyMessage}”
                  </p>
                )}
                {showHindi && (
                  <p className="font-devanagari text-sm text-[#4A101D]/85 mt-1">
                    “{config.optionalFamilyMessageHindi}”
                  </p>
                )}
              </div>
            )}

            {/* Compliments & Print Action */}
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#C6A15B]/35">
              <div className="text-center sm:text-left">
                <p className="text-xs tracking-[0.16em] uppercase text-[#4A101D] font-semibold">
                  With Best Compliments From
                </p>
                <p className="font-display text-sm sm:text-base text-[#2A0812]/85">
                  Near &amp; Dear Relatives &amp; Friends · {config.hashtag}
                </p>
              </div>

              <button
                type="button"
                onClick={onPrintInvitation}
                className="no-print inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A101D] text-[#F8F0E3] text-xs font-medium tracking-[0.15em] uppercase border border-[#C6A15B] hover:bg-[#2A0812] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Download / Print Invitation Card</span>
              </button>
            </div>
          </div>
        </article>

        <ChapterDivider className="mt-12 no-print" />
      </div>
    </section>
  );
};
