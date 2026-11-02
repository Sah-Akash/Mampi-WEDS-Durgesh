import React, { useState, useEffect } from 'react';
import {
  Send,
  Heart,
  RefreshCw,
  ArrowUp,
  Sparkles,
  CheckCircle2,
  MapPin,
  Share2,
  Printer,
  ChevronDown,
} from 'lucide-react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { LanguageMode, WeddingConfig } from '../config/weddingConfig';
import { FloralCornerOrnament, GlowingDiya, RoyalLotusEmblem } from './RoyalOrnaments';

interface RoyalRsvpAndFooterProps {
  config: WeddingConfig;
  language: LanguageMode;
  onShareInvitation: () => void;
  onPrintInvitation: () => void;
  shareFeedback: string | null;
}

export interface BlessingItem {
  id: string;
  name: string;
  relation: string;
  guests: string;
  attending: string;
  message: string;
  timestamp: string;
  likes: number;
  createdAtMs: number;
}

const LIKED_IDS_STORAGE_KEY = 'mampi_durgesh_liked_blessing_ids_v1';

function formatCurrentTimeLabel(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatBlessingDateLabel(): string {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString('en-US', { month: 'short' });
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${day} ${month}, ${time}`;
}

export const RoyalRsvpAndFooter: React.FC<RoyalRsvpAndFooterProps> = ({
  config,
  onShareInvitation,
  onPrintInvitation,
  shareFeedback,
}) => {
  const [blessings, setBlessings] = useState<BlessingItem[]>([]);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = window.localStorage.getItem(LIKED_IDS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [fullName, setFullName] = useState('');
  const [relation, setRelation] = useState('');
  const [guests, setGuests] = useState('2 Guests');
  const [attending, setAttending] = useState('All Ceremonies (22nd - 24th Nov)');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>(() =>
    formatCurrentTimeLabel()
  );

  // Real-time Firestore listener on /blessings
  useEffect(() => {
    const path = 'blessings';
    const blessingsQuery = query(
      collection(db, path),
      where('visibility', '==', 'public')
    );

    const unsubscribe = onSnapshot(
      blessingsQuery,
      (snapshot) => {
        const items: BlessingItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const createdAtVal = data.createdAt as Timestamp | null | undefined;
          const createdAtMs =
            createdAtVal && typeof createdAtVal.toMillis === 'function'
              ? createdAtVal.toMillis()
              : Date.now();

          return {
            id: docSnap.id,
            name: String(data.name || ''),
            relation: String(data.relation || 'Family & Well-Wisher'),
            guests: String(data.guests || '1 Guest'),
            attending: String(data.attending || ''),
            message: String(data.message || ''),
            timestamp: String(data.timestamp || ''),
            likes: typeof data.likes === 'number' ? data.likes : 0,
            createdAtMs,
          };
        });

        items.sort((a, b) => b.createdAtMs - a.createdAtMs);
        setBlessings(items);
        setLastSyncedTime(formatCurrentTimeLabel());
        setIsSyncing(false);
      },
      (error) => {
        setIsSyncing(false);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LIKED_IDS_STORAGE_KEY, JSON.stringify(likedIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [likedIds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = fullName.trim().slice(0, 100);
    const trimmedRelation = (relation.trim() || 'Family & Well-Wisher').slice(0, 100);
    const trimmedGuests = guests.trim().slice(0, 60);
    const trimmedAttending = attending.trim().slice(0, 120);
    const trimmedMsg = message.trim().slice(0, 1000);

    if (!trimmedName) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!trimmedMsg) {
      setFormError('Please write a warm blessing or message for the couple.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const blessingId = `b_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const path = `blessings/${blessingId}`;

    try {
      await setDoc(doc(db, 'blessings', blessingId), {
        name: trimmedName,
        relation: trimmedRelation,
        guests: trimmedGuests,
        attending: trimmedAttending,
        message: trimmedMsg,
        timestamp: formatBlessingDateLabel().slice(0, 60),
        likes: 0,
        visibility: 'public',
        createdAt: serverTimestamp(),
      });

      setSubmittedSuccess(true);
      setFullName('');
      setRelation('');
      setMessage('');

      window.setTimeout(() => {
        setSubmittedSuccess(false);
      }, 4500);
    } catch (error) {
      setFormError('Unable to send right now. Please try again.');
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = async (item: BlessingItem) => {
    const alreadyLiked = Boolean(likedIds[item.id]);
    const nextLiked = !alreadyLiked;
    const nextLikes = Math.max(0, item.likes + (nextLiked ? 1 : -1));

    setLikedIds((prev) => ({ ...prev, [item.id]: nextLiked }));

    const path = `blessings/${item.id}`;
    try {
      await updateDoc(doc(db, 'blessings', item.id), {
        likes: nextLikes,
      });
    } catch (error) {
      setLikedIds((prev) => ({ ...prev, [item.id]: alreadyLiked }));
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    window.setTimeout(() => {
      setLastSyncedTime(formatCurrentTimeLabel());
      setIsSyncing(false);
    }, 350);
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
    const queryStr = encodeURIComponent(`${config.venueName} ${config.city}`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${queryStr}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* BLESSINGS & RSVP SECTION (ROYAL BURGUNDY, DARK WINE & ANTIQUE GOLD PALETTE) */}
      <section
        id="rsvp"
        className="relative py-14 sm:py-24 px-3.5 sm:px-8 bg-[#2A0812] bg-royal-jaali text-[#F8F0E3] overflow-hidden no-print"
      >
        {/* Subtle Floating Marigold & Rose Petals Decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <span className="absolute top-16 left-[6%] w-5 h-3.5 rounded-full bg-[#B87978]/35 rotate-[-18deg]" />
          <svg
            className="absolute top-28 left-[3%] w-5 h-8 text-[#C6A15B]/35 rotate-[18deg]"
            viewBox="0 0 24 40"
            fill="currentColor"
          >
            <path d="M12 0C19 10 22 22 12 40C2 22 5 10 12 0Z" />
          </svg>
          <svg
            className="absolute top-16 right-[8%] w-4 h-7 text-[#C6A15B]/35 rotate-[-35deg]"
            viewBox="0 0 24 40"
            fill="currentColor"
          >
            <path d="M12 0C19 10 22 22 12 40C2 22 5 10 12 0Z" />
          </svg>
          <svg
            className="absolute bottom-14 right-[12%] w-5 h-8 text-[#C6A15B]/30 rotate-[-48deg]"
            viewBox="0 0 24 40"
            fill="currentColor"
          >
            <path d="M12 0C19 10 22 22 12 40C2 22 5 10 12 0Z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* SECTION HEADER */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 px-1">
            <div className="inline-flex items-center justify-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.24em] uppercase text-[#C6A15B] mb-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C6A15B]" />
              <span>SHOWER YOUR BLESSINGS</span>
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C6A15B]" />
            </div>

            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-semibold text-[#F8F0E3] tracking-wide">
              Blessings <span className="italic font-normal text-[#E7D6AD]">&amp;</span> RSVP
            </h2>

            <p className="mt-2 font-display italic text-base sm:text-xl text-[#E7D6AD]/85 leading-relaxed">
              Leave a heartfelt wish for the couple or let the families know you will be joining the feasts.
            </p>

            {/* Ornamental Gold Compass Divider */}
            <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4" aria-hidden="true">
              <div className="h-[1px] w-16 sm:w-32 bg-gradient-to-r from-transparent via-[#C6A15B]/70 to-[#C6A15B]" />
              <span className="w-2 h-1.5 rounded-full bg-[#C6A15B]" />
              <div className="w-7 h-7 rounded-full border border-[#C6A15B] bg-[#380B16] flex items-center justify-center text-[#E7D6AD]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3v18M3 12h18" />
                  <polygon points="12,6 14,12 12,18 10,12" fill="currentColor" fillOpacity="0.3" />
                </svg>
              </div>
              <span className="w-2 h-1.5 rounded-full bg-[#C6A15B]" />
              <div className="h-[1px] w-16 sm:w-32 bg-gradient-to-l from-transparent via-[#C6A15B]/70 to-[#C6A15B]" />
            </div>
          </div>

          {/* TWO-COLUMN GRID: LEFT FORM CARD + RIGHT WALL OF BLESSINGS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-start">
            {/* LEFT COLUMN: SEND A BLESSING / RSVP CARD */}
            <div className="lg:col-span-6 relative bg-[#380B16]/95 border border-[#C6A15B]/65 rounded-2xl p-5 sm:p-8 md:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
              <div className="absolute top-1.5 left-1.5 pointer-events-none">
                <FloralCornerOrnament position="top-left" className="w-9 h-9 sm:w-11 sm:h-11" />
              </div>
              <div className="absolute bottom-1.5 right-1.5 pointer-events-none">
                <FloralCornerOrnament position="bottom-right" className="w-9 h-9 sm:w-11 sm:h-11" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2A0812] border border-[#C6A15B]/75 flex items-center justify-center text-[#E7D6AD] shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      <path d="M12 7.5c-.8-1-2.3-1-3.1 0-.8 1-.8 2.5 0 3.5l3.1 3 3.1-3c.8-1 .8-2.5 0-3.5-.8-1-2.3-1-3.1 0z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#F8F0E3] tracking-wide">
                    Send a Blessing / RSVP
                  </h3>
                </div>

                <p className="mt-1.5 text-xs sm:text-sm text-[#E7D6AD]/80">
                  Your warm words mean the world to {config.brideName} &amp; {config.groomName}.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 sm:mt-6 space-y-4 sm:space-y-5">
                  {/* Your Full Name */}
                  <div>
                    <label
                      htmlFor="rsvp-full-name"
                      className="block text-xs sm:text-sm font-medium text-[#E7D6AD] mb-1.5"
                    >
                      Your Full Name <span className="text-[#C6A15B]">*</span>
                    </label>
                    <input
                      id="rsvp-full-name"
                      type="text"
                      required
                      maxLength={100}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Anirban Sengupta"
                      className="w-full rounded-xl bg-[#22060E]/90 border border-[#C6A15B]/45 px-3.5 sm:px-4 py-3 text-base sm:text-sm text-[#F8F0E3] placeholder-[#E7D6AD]/40 focus:outline-none focus:border-[#E7D6AD] focus:ring-2 focus:ring-[#C6A15B]/25 transition"
                    />
                  </div>

                  {/* Relation / Side + Number of Guests Attending */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="rsvp-relation"
                        className="block text-xs sm:text-sm font-medium text-[#E7D6AD] mb-1.5"
                      >
                        Relation / Side
                      </label>
                      <input
                        id="rsvp-relation"
                        type="text"
                        maxLength={100}
                        value={relation}
                        onChange={(e) => setRelation(e.target.value)}
                        placeholder="e.g. Groom's Friend, Bride's Aunt"
                        className="w-full rounded-xl bg-[#22060E]/90 border border-[#C6A15B]/45 px-3.5 sm:px-4 py-3 text-base sm:text-sm text-[#F8F0E3] placeholder-[#E7D6AD]/40 focus:outline-none focus:border-[#E7D6AD] focus:ring-2 focus:ring-[#C6A15B]/25 transition"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="rsvp-guests"
                        className="block text-xs sm:text-sm font-medium text-[#E7D6AD] mb-1.5"
                      >
                        Number of Guests Attending
                      </label>
                      <div className="relative">
                        <select
                          id="rsvp-guests"
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className="w-full appearance-none rounded-xl bg-[#22060E]/90 border border-[#C6A15B]/45 pl-3.5 sm:pl-4 pr-9 py-3 text-base sm:text-sm text-[#F8F0E3] focus:outline-none focus:border-[#E7D6AD] focus:ring-2 focus:ring-[#C6A15B]/25 transition cursor-pointer"
                        >
                          <option value="1 Guest" className="bg-[#2A0812] text-[#F8F0E3]">
                            1 Guest
                          </option>
                          <option value="2 Guests" className="bg-[#2A0812] text-[#F8F0E3]">
                            2 Guests
                          </option>
                          <option value="3 Guests" className="bg-[#2A0812] text-[#F8F0E3]">
                            3 Guests
                          </option>
                          <option value="4 Guests" className="bg-[#2A0812] text-[#F8F0E3]">
                            4 Guests
                          </option>
                          <option value="5+ Guests (Family)" className="bg-[#2A0812] text-[#F8F0E3]">
                            5+ Guests (Family)
                          </option>
                          <option
                            value="Blessings Only (Unable to Attend)"
                            className="bg-[#2A0812] text-[#F8F0E3]"
                          >
                            Blessings Only (Unable to Attend)
                          </option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#C6A15B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Which Functions Will You Attend? */}
                  <div>
                    <label
                      htmlFor="rsvp-functions"
                      className="block text-xs sm:text-sm font-medium text-[#E7D6AD] mb-1.5"
                    >
                      Which Functions Will You Attend?
                    </label>
                    <div className="relative">
                      <select
                        id="rsvp-functions"
                        value={attending}
                        onChange={(e) => setAttending(e.target.value)}
                        className="w-full appearance-none rounded-xl bg-[#22060E]/90 border border-[#C6A15B]/45 pl-3.5 sm:pl-4 pr-9 py-3 text-base sm:text-sm text-[#F8F0E3] focus:outline-none focus:border-[#E7D6AD] focus:ring-2 focus:ring-[#C6A15B]/25 transition cursor-pointer"
                      >
                        <option
                          value="All Ceremonies (22nd - 24th Nov)"
                          className="bg-[#2A0812] text-[#F8F0E3]"
                        >
                          All Ceremonies (22nd - 24th Nov)
                        </option>
                        <option
                          value="Shubh Vivah — Wedding (24th Nov)"
                          className="bg-[#2A0812] text-[#F8F0E3]"
                        >
                          Shubh Vivah — Wedding (24th Nov)
                        </option>
                        <option
                          value="Satyanarayan Pujan, Matkor & Haldi (23rd Nov)"
                          className="bg-[#2A0812] text-[#F8F0E3]"
                        >
                          Satyanarayan Pujan, Matkor &amp; Haldi (23rd Nov)
                        </option>
                        <option
                          value="Mehendi Ceremony (22nd Nov)"
                          className="bg-[#2A0812] text-[#F8F0E3]"
                        >
                          Mehendi Ceremony (22nd Nov)
                        </option>
                        <option
                          value="Sending Warm Blessings From Afar"
                          className="bg-[#2A0812] text-[#F8F0E3]"
                        >
                          Sending Warm Blessings From Afar
                        </option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#C6A15B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Your Blessing / Message */}
                  <div>
                    <label
                      htmlFor="rsvp-message"
                      className="block text-xs sm:text-sm font-medium text-[#E7D6AD] mb-1.5"
                    >
                      Your Blessing / Message <span className="text-[#C6A15B]">*</span>
                    </label>
                    <textarea
                      id="rsvp-message"
                      rows={4}
                      required
                      maxLength={1000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share a sweet memory, joke, or Shubho Bibaho blessing..."
                      className="w-full rounded-xl bg-[#22060E]/90 border border-[#C6A15B]/45 px-3.5 sm:px-4 py-3 text-base sm:text-sm text-[#F8F0E3] placeholder-[#E7D6AD]/40 focus:outline-none focus:border-[#E7D6AD] focus:ring-2 focus:ring-[#C6A15B]/25 transition resize-none"
                    />
                  </div>

                  {formError && (
                    <p className="text-xs font-medium text-[#F8F0E3] bg-[#5E061B] border border-[#C6A15B]/60 rounded-lg px-3.5 py-2.5">
                      {formError}
                    </p>
                  )}

                  {submittedSuccess && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#E7D6AD] bg-[#24392D]/90 border border-[#C6A15B]/60 rounded-xl px-4 py-3">
                      <CheckCircle2 className="w-4 h-4 text-[#C6A15B] shrink-0" />
                      <span>
                        Thank you! Your blessing &amp; RSVP for {config.brideName} &amp;{' '}
                        {config.groomName} is now live on the Wall of Blessings.
                      </span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold-sweep w-full rounded-xl bg-gradient-to-r from-[#5E0A1E] via-[#7A0923] to-[#5E0A1E] hover:from-[#7A0923] hover:to-[#8E0E2C] active:scale-[0.99] disabled:opacity-60 border border-[#C6A15B] text-[#F8F0E3] font-semibold text-xs sm:text-sm tracking-[0.14em] uppercase py-3.5 sm:py-4 px-5 shadow-[0_12px_30px_rgba(0,0,0,0.55)] transition flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#E7D6AD] shrink-0" />
                    <span>
                      {isSubmitting ? 'SENDING BLESSING...' : 'SEND BLESSING & CONFIRM RSVP'}
                    </span>
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: REAL-TIME WALL OF BLESSINGS (NO PRE-FILLED MESSAGES, NO SCROLLBAR) */}
            <div className="lg:col-span-6 flex flex-col">
              {/* Wall Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#F8F0E3] tracking-wide">
                    Wall of Blessings ({blessings.length})
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#24392D] text-[#A8E0BC] border border-[#C6A15B]/45">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A8E0BC] animate-pulse" />
                    Live Sync
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleManualSync}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#380B16] text-[#E7D6AD] border border-[#C6A15B]/50 hover:border-[#E7D6AD] transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#C6A15B] ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Live Connected</span>
                </button>
              </div>

              <div className="text-left sm:text-right text-[11px] text-[#E7D6AD]/70 mb-4">
                <span className="bg-[#380B16] border border-[#C6A15B]/30 text-[#E7D6AD] px-2 py-0.5 rounded">
                  Real-Time Synced at
                </span>{' '}
                <span>{lastSyncedTime}</span>
              </div>

              {/* Empty State when no guest has submitted yet */}
              {blessings.length === 0 ? (
                <div className="bg-[#380B16]/85 border border-[#C6A15B]/40 rounded-2xl p-8 sm:p-12 text-center shadow-[0_14px_40px_rgba(0,0,0,0.45)] flex flex-col items-center justify-center min-h-[260px]">
                  <div className="w-12 h-12 rounded-full bg-[#2A0812] border border-[#C6A15B]/60 flex items-center justify-center text-[#E7D6AD] mb-4">
                    <Sparkles className="w-5 h-5 text-[#C6A15B]" />
                  </div>
                  <h4 className="font-display text-2xl sm:text-3xl font-semibold text-[#E7D6AD]">
                    Be the First to Shower Your Blessings
                  </h4>
                  <p className="mt-2 font-display italic text-base sm:text-lg text-[#F8F0E3]/80 max-w-md leading-relaxed">
                    Every heartfelt blessing and RSVP sent using the form will appear here live in real time for {config.brideName} &amp; {config.groomName}.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 lg:max-h-[560px] lg:overflow-y-auto no-scrollbar">
                    {(showAllMobile ? blessings : blessings.slice(0, 4)).map((item) => {
                      const isLiked = Boolean(likedIds[item.id]);
                      return (
                        <article
                          key={item.id}
                          className="bg-[#380B16]/90 border border-[#C6A15B]/40 hover:border-[#C6A15B]/80 rounded-2xl p-4 sm:p-6 shadow-[0_14px_40px_rgba(0,0,0,0.45)] transition"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="font-display text-xl sm:text-2xl font-semibold text-[#E7D6AD] leading-snug truncate">
                                {item.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                                <span className="text-xs text-[#F8F0E3]/75">{item.relation}</span>
                                {item.attending && (
                                  <>
                                    <span className="text-[#C6A15B]" aria-hidden="true">
                                      •
                                    </span>
                                    <span className="text-[11px] text-[#C6A15B] font-medium">
                                      {item.guests} · {item.attending}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleLike(item)}
                              aria-label={`Like blessing from ${item.name}`}
                              className="inline-flex items-center gap-1 text-xs text-[#C6A15B] hover:text-[#E7D6AD] transition cursor-pointer p-1 shrink-0"
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  isLiked
                                    ? 'fill-[#DE4D78] text-[#DE4D78]'
                                    : 'text-[#C6A15B]'
                                }`}
                              />
                              {item.likes > 0 && (
                                <span className="text-[11px] font-medium text-[#E7D6AD]/80">
                                  {item.likes}
                                </span>
                              )}
                            </button>
                          </div>

                          <p className="mt-3 font-display italic text-base sm:text-lg text-[#F8F0E3]/90 leading-relaxed break-words">
                            &ldquo;{item.message}&rdquo;
                          </p>

                          <div className="mt-3.5 pt-2.5 border-t border-[#C6A15B]/20 flex items-center justify-end">
                            <span className="text-[11px] text-[#E7D6AD]/60">{item.timestamp}</span>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {blessings.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setShowAllMobile((prev) => !prev)}
                      className="mt-4 self-center inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#380B16] border border-[#C6A15B]/50 text-xs uppercase tracking-[0.16em] text-[#E7D6AD] hover:border-[#E7D6AD] transition cursor-pointer"
                    >
                      <span>
                        {showAllMobile
                          ? 'Show Recent Blessings'
                          : `View All ${blessings.length} Blessings`}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          showAllMobile ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* COMPACT VENUE & SHARE QUICK BAR BELOW THE BLESSINGS WALL */}
          <div className="mt-10 sm:mt-14 pt-7 border-t border-[#C6A15B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#380B16] border border-[#C6A15B] flex items-center justify-center text-[#E7D6AD] shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#C6A15B] font-semibold">
                  Wedding Venue · 24.11.2026 (7:00 PM Onwards)
                </p>
                <p className="font-display text-lg sm:text-xl font-semibold text-[#F8F0E3]">
                  {config.venueName}, {config.fullAddress}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleOpenVenueMaps}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#C6A15B] text-[#2A0812] text-xs font-semibold tracking-wider uppercase hover:bg-[#E7D6AD] transition cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Venue Directions</span>
              </button>

              <div className="grid grid-cols-2 sm:flex gap-2.5">
                <button
                  type="button"
                  onClick={onShareInvitation}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#380B16] border border-[#C6A15B]/60 text-[#E7D6AD] text-xs font-medium tracking-wider uppercase hover:border-[#E7D6AD] transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>{shareFeedback || 'Share Invite'}</span>
                </button>

                <button
                  type="button"
                  onClick={onPrintInvitation}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#380B16] border border-[#C6A15B]/60 text-[#E7D6AD] text-xs font-medium tracking-wider uppercase hover:border-[#E7D6AD] transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Save PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROYAL FOOTER */}
      <footer className="relative bg-[#1B040B] border-t border-[#C6A15B]/35 py-14 sm:py-16 px-4 sm:px-8 text-center no-print">
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
