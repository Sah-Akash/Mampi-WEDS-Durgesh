import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Sparkles, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { WeddingConfig } from '../config/weddingConfig';

interface SacredMangalamFilmProps {
  config: WeddingConfig;
  isLocked: boolean;
  onUnlock: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  isUsingPlaceholders: boolean;
  onTogglePlaceholders: () => void;
  onOpenCustomizer: () => void;
}

interface TextLineItem {
  id: string;
  text: string;
  font: 'cormorant' | 'dancing-script' | 'cinzel' | 'marcellus';
  sizeDesktop: string;
  sizeMobile: string;
  style?: 'italic' | 'normal' | 'bold';
  color: string;
  spacingTop?: string;
  spacingBottom?: string;
  type?: 'text' | 'map' | 'rsvp-actions';
  mapUrl?: string;
}

interface HoldStackConfig {
  id: string;
  label: string;
  holdFramesDesktop: [number, number];
  holdFramesMobile: [number, number];
  positionDesktop: { left: string; top: string; width?: string };
  positionMobile: { left: string; top: string; width?: string };
  blurBg?: boolean;
  holdFadeOut?: boolean;
  lines: TextLineItem[];
}

interface HoldWindowRange {
  start: number;
  end: number;
  fadeEnd: number;
}

const DESKTOP_FRAMES_BASE =
  'https://cdn.akhyankriti.com/web-invites/templates/sacred-mangalam/frames/Full-desktop.df2c5fdbe477/hashed';
const DESKTOP_FRAME_COUNT = 440;

const MOBILE_FRAMES_BASE =
  'https://cdn.akhyankriti.com/web-invites/templates/sacred-mangalam/frames/Full-v2.80df3b7cb6f7/hashed';
const MOBILE_FRAME_COUNT = 364;

const FONT_FAMILY_MAP: Record<TextLineItem['font'], string> = {
  cormorant: "'Cormorant Garamond', Georgia, serif",
  'dancing-script': "'Dancing Script', cursive",
  cinzel: "'Cinzel', Georgia, serif",
  marcellus: "'Marcellus', Georgia, serif",
};

/**
 * Exact piecewise scroll-to-frame & hold window calculation (`Ae` from SacredMangalamTemplate)
 */
function computeScrollHoldPiecewise(
  holds: { id: string; fs: number; fe: number }[],
  maxFrameIdx: number,
  baseTravelVh: number,
  holdDurationVh: number,
  fadeOutFrames: number
) {
  const sorted = [...holds].sort((a, b) => a.fs - b.fs);
  const totalHoldFrames = sorted.reduce((acc, h) => acc + Math.max(0, h.fe - h.fs), 0);
  const movingFrames = Math.max(1, maxFrameIdx - totalHoldFrames);
  const movingTravelVh = (movingFrames / maxFrameIdx) * baseTravelVh;
  const totalTravel = Math.max(1e-6, movingTravelVh + sorted.length * holdDurationVh);

  const inputs: number[] = [0];
  const outputs: number[] = [0];
  const windows: Record<string, HoldWindowRange> = {};

  let currentScroll = 0;
  let prevFrame = 0;

  for (const h of sorted) {
    const z = Math.max(prevFrame, Math.min(maxFrameIdx, h.fs));
    const L = Math.max(z, Math.min(maxFrameIdx, h.fe));

    currentScroll += (((z - prevFrame) / maxFrameIdx) * baseTravelVh) / totalTravel;
    inputs.push(currentScroll);
    outputs.push(z / maxFrameIdx);

    const holdStart = currentScroll;
    currentScroll += holdDurationVh / totalTravel;
    inputs.push(currentScroll);
    outputs.push(L / maxFrameIdx);

    windows[h.id] = {
      start: holdStart,
      end: currentScroll,
      fadeEnd: currentScroll + ((fadeOutFrames / maxFrameIdx) * baseTravelVh) / totalTravel,
    };

    prevFrame = L;
  }

  if (prevFrame < maxFrameIdx) {
    inputs.push(1);
    outputs.push(1);
  } else {
    inputs[inputs.length - 1] = 1;
    outputs[outputs.length - 1] = 1;
  }

  // Ensure strictly monotonic inputs
  for (let i = 1; i < inputs.length; i++) {
    if (inputs[i] <= inputs[i - 1]) {
      inputs[i] = inputs[i - 1] + 1e-4;
    }
  }

  return { inputs, outputs, windows, totalTravel };
}

/**
 * Piecewise linear interpolation helper
 */
function interpolatePiecewise(value: number, domain: number[], range: number[]): number {
  if (domain.length === 0 || range.length === 0) return 0;
  if (value <= domain[0]) return range[0];
  const last = domain.length - 1;
  if (value >= domain[last]) return range[last];

  for (let i = 0; i < last; i++) {
    const d0 = domain[i];
    const d1 = domain[i + 1];
    if (value >= d0 && value <= d1) {
      const span = d1 - d0;
      const t = span <= 1e-9 ? 0 : (value - d0) / span;
      return range[i] + (range[i + 1] - range[i]) * t;
    }
  }
  return range[last];
}

export const SacredMangalamFilm: React.FC<SacredMangalamFilmProps> = ({
  config,
  isLocked,
  onUnlock,
  isMusicPlaying,
  onToggleMusic,
  isUsingPlaceholders,
  onTogglePlaceholders,
  onOpenCustomizer,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showScrollHint, setShowScrollHint] = useState<boolean>(false);
  const [loadedCount, setLoadedCount] = useState<number>(0);

  // Detect Mobile vs Desktop breakpoint
  useEffect(() => {
    const checkViewport = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Lock page scroll before "Tap to Open"
  useEffect(() => {
    if (!isLocked) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };
    const preventKeys = (e: KeyboardEvent) => {
      if ([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('keydown', preventKeys);
    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('keydown', preventKeys);
    };
  }, [isLocked]);

  // Show "SCROLL ↓" cue once unlocked, dismiss once scrolled > 8px
  useEffect(() => {
    if (!isLocked) {
      setShowScrollHint(true);
    }
  }, [isLocked]);

  // Build the 5 Hold Stacks matching Sacred Mangalam (`Bw` & `Ow`)
  const holdStacks: HoldStackConfig[] = useMemo(
    () => [
      {
        id: 'inv-greeting',
        label: 'Invitation',
        holdFramesDesktop: [120, 154],
        holdFramesMobile: [96, 112],
        positionDesktop: { left: '50%', top: '53%', width: '52%' },
        positionMobile: { left: '57%', top: '50.5%', width: '56%' },
        blurBg: false,
        holdFadeOut: true,
        lines: [
          {
            id: 'inv-greeting-line',
            text: `Dear ${config.guestName || 'Guest'},`,
            font: 'cormorant',
            sizeDesktop: 'clamp(22px, 2.5vw, 38px)',
            sizeMobile: 'clamp(18px, 5vw, 25px)',
            style: 'italic',
            color: '#ffffff',
            spacingBottom: '6px',
          },
          {
            id: 'inv-line-1',
            text: 'you are cordially invited to the',
            font: 'cormorant',
            sizeDesktop: 'clamp(16px, 1.7vw, 26px)',
            sizeMobile: 'clamp(14px, 3.8vw, 19px)',
            style: 'italic',
            color: '#ffffff',
          },
          {
            id: 'inv-line-2',
            text: 'wedding ceremony of',
            font: 'cormorant',
            sizeDesktop: 'clamp(16px, 1.7vw, 26px)',
            sizeMobile: 'clamp(14px, 3.8vw, 19px)',
            style: 'italic',
            color: '#ffffff',
            spacingBottom: '10px',
          },
          {
            id: 'inv-bride',
            text: config.brideName,
            font: 'dancing-script',
            sizeDesktop: 'clamp(30px, 3.4vw, 52px)',
            sizeMobile: 'clamp(26px, 7vw, 36px)',
            color: '#ffffff',
          },
          {
            id: 'inv-bride-parents',
            text: `D/o ${config.brideFatherName} &`,
            font: 'cormorant',
            sizeDesktop: 'clamp(16px, 1.8vw, 28px)',
            sizeMobile: 'clamp(14px, 4.1vw, 21px)',
            color: '#ffffff',
          },
          {
            id: 'inv-bride-parents-2',
            text: config.brideMotherName,
            font: 'cormorant',
            sizeDesktop: 'clamp(16px, 1.8vw, 28px)',
            sizeMobile: 'clamp(14px, 4.1vw, 21px)',
            color: '#ffffff',
            spacingBottom: '4px',
          },
          {
            id: 'inv-amp',
            text: '&',
            font: 'dancing-script',
            sizeDesktop: 'clamp(16px, 1.5vw, 22px)',
            sizeMobile: 'clamp(15px, 4vw, 20px)',
            color: '#ffffff',
            spacingBottom: '2px',
          },
          {
            id: 'inv-groom',
            text: config.groomName,
            font: 'dancing-script',
            sizeDesktop: 'clamp(30px, 3.4vw, 52px)',
            sizeMobile: 'clamp(26px, 7vw, 36px)',
            color: '#ffffff',
          },
          {
            id: 'inv-groom-parents',
            text: `S/o ${config.groomFatherName} &`,
            font: 'cormorant',
            sizeDesktop: 'clamp(16px, 1.8vw, 28px)',
            sizeMobile: 'clamp(14px, 4.1vw, 21px)',
            color: '#ffffff',
          },
          {
            id: 'inv-groom-parents-2',
            text: config.groomMotherName,
            font: 'cormorant',
            sizeDesktop: 'clamp(16px, 1.8vw, 28px)',
            sizeMobile: 'clamp(14px, 4.1vw, 21px)',
            color: '#ffffff',
          },
        ],
      },
      {
        id: 'haldi-title',
        label: 'Haldi',
        holdFramesDesktop: [182, 199],
        holdFramesMobile: [150, 160],
        positionDesktop: { left: '50%', top: '26%' },
        positionMobile: { left: '50%', top: '25%' },
        blurBg: true,
        holdFadeOut: true,
        lines: [
          {
            id: 'haldi-heading',
            text: config.haldiName,
            font: 'cinzel',
            sizeDesktop: 'clamp(28px, 3vw, 46px)',
            sizeMobile: 'clamp(24px, 6.5vw, 34px)',
            color: '#ffffff',
            spacingBottom: '6px',
          },
          {
            id: 'haldi-date',
            text: config.haldiDate,
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2.1vw, 32px)',
            sizeMobile: 'clamp(17px, 4.6vw, 24px)',
            style: 'italic',
            color: '#ffffff',
          },
          {
            id: 'haldi-time',
            text: config.haldiTime,
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2.1vw, 32px)',
            sizeMobile: 'clamp(17px, 4.6vw, 24px)',
            style: 'italic',
            color: '#ffffff',
          },
          {
            id: 'haldi-venue',
            text: config.haldiVenue,
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2.1vw, 32px)',
            sizeMobile: 'clamp(17px, 4.6vw, 24px)',
            color: '#ffffff',
          },
          {
            id: 'haldi-venue-map',
            type: 'map',
            text: 'Location',
            mapUrl: config.haldiMapUrl,
            font: 'cormorant',
            sizeDesktop: 'clamp(14px, 1.4vw, 21px)',
            sizeMobile: 'clamp(13px, 3.6vw, 17px)',
            color: '#ffffff',
            spacingTop: '8px',
          },
        ],
      },
      {
        id: 'reception-title',
        label: 'Reception',
        holdFramesDesktop: [305, 320],
        holdFramesMobile: [248, 257],
        positionDesktop: { left: '50%', top: '30%' },
        positionMobile: { left: '50%', top: '30%' },
        blurBg: true,
        holdFadeOut: true,
        lines: [
          {
            id: 'reception-heading',
            text: config.receptionName,
            font: 'cinzel',
            sizeDesktop: 'clamp(28px, 3vw, 46px)',
            sizeMobile: 'clamp(24px, 6.5vw, 34px)',
            color: '#ffffff',
            spacingBottom: '6px',
          },
          {
            id: 'reception-date',
            text: config.receptionDate,
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2.1vw, 32px)',
            sizeMobile: 'clamp(17px, 4.6vw, 24px)',
            style: 'italic',
            color: '#ffffff',
          },
          {
            id: 'reception-time',
            text: config.receptionTime,
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2.1vw, 32px)',
            sizeMobile: 'clamp(17px, 4.6vw, 24px)',
            style: 'italic',
            color: '#ffffff',
          },
          {
            id: 'reception-venue',
            text: config.receptionVenue,
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2.1vw, 32px)',
            sizeMobile: 'clamp(17px, 4.6vw, 24px)',
            color: '#ffffff',
          },
          {
            id: 'reception-venue-map',
            type: 'map',
            text: 'Location',
            mapUrl: config.receptionMapUrl,
            font: 'cormorant',
            sizeDesktop: 'clamp(14px, 1.4vw, 21px)',
            sizeMobile: 'clamp(13px, 3.6vw, 17px)',
            color: '#ffffff',
            spacingTop: '8px',
          },
        ],
      },
      {
        id: 'wedding-title',
        label: 'Wedding',
        holdFramesDesktop: [370, 378],
        holdFramesMobile: [299, 307],
        positionDesktop: { left: '50%', top: '30%' },
        positionMobile: { left: '50%', top: '30%' },
        blurBg: true,
        holdFadeOut: true,
        lines: [
          {
            id: 'wedding-heading',
            text: config.weddingName,
            font: 'cinzel',
            sizeDesktop: 'clamp(28px, 3vw, 46px)',
            sizeMobile: 'clamp(24px, 6.5vw, 34px)',
            color: '#ffffff',
            spacingBottom: '6px',
          },
          {
            id: 'wedding-date',
            text: config.weddingDate,
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2.1vw, 32px)',
            sizeMobile: 'clamp(17px, 4.6vw, 24px)',
            style: 'italic',
            color: '#ffffff',
          },
          {
            id: 'wedding-time',
            text: config.weddingTime,
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2.1vw, 32px)',
            sizeMobile: 'clamp(17px, 4.6vw, 24px)',
            style: 'italic',
            color: '#ffffff',
          },
          {
            id: 'wedding-venue',
            text: config.venueName,
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2.1vw, 32px)',
            sizeMobile: 'clamp(17px, 4.6vw, 24px)',
            color: '#ffffff',
          },
          {
            id: 'wedding-venue-map',
            type: 'map',
            text: 'Location',
            mapUrl: config.googleMapsUrl,
            font: 'cormorant',
            sizeDesktop: 'clamp(14px, 1.4vw, 21px)',
            sizeMobile: 'clamp(13px, 3.6vw, 17px)',
            color: '#ffffff',
            spacingTop: '8px',
          },
        ],
      },
      {
        id: 'rsvp-title',
        label: 'RSVP',
        holdFramesDesktop: [425, 440],
        holdFramesMobile: [358, 363],
        positionDesktop: { left: '50%', top: '67%', width: '80%' },
        positionMobile: { left: '50%', top: '55%', width: '80%' },
        blurBg: false,
        holdFadeOut: false,
        lines: [
          {
            id: 'rsvp-heading',
            text: 'RSVP',
            font: 'cinzel',
            sizeDesktop: 'clamp(26px, 2.8vw, 44px)',
            sizeMobile: 'clamp(22px, 6vw, 32px)',
            color: '#6b2440',
            spacingBottom: '4px',
          },
          {
            id: 'rsvp-line-1',
            text: 'We would be honoured',
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2vw, 32px)',
            sizeMobile: 'clamp(14px, 4vw, 18px)',
            style: 'italic',
            color: '#6b2440',
          },
          {
            id: 'rsvp-line-2',
            text: 'by your presence!',
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2vw, 32px)',
            sizeMobile: 'clamp(14px, 4vw, 18px)',
            style: 'italic',
            color: '#6b2440',
            spacingBottom: '12px',
          },
          {
            id: 'rsvp-signoff',
            text: 'With love,',
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2vw, 32px)',
            sizeMobile: 'clamp(14px, 4vw, 18px)',
            style: 'italic',
            color: '#5a1f1f',
            spacingBottom: '4px',
          },
          {
            id: 'rsvp-couple',
            text: `${config.brideName} & ${config.groomName}`,
            font: 'dancing-script',
            sizeDesktop: 'clamp(28px, 3vw, 46px)',
            sizeMobile: 'clamp(24px, 6.2vw, 32px)',
            color: '#5a1f1f',
          },
        ],
      },
    ],
    [config]
  );

  const frameCount = isMobileViewport ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT;
  const framesBaseUrl = isMobileViewport ? MOBILE_FRAMES_BASE : DESKTOP_FRAMES_BASE;
  const maxFrameIdx = frameCount - 1;

  // Piecewise scroll-to-frame & hold window computation (`Ae`)
  const piecewise = useMemo(() => {
    const holds = holdStacks.map((s) => {
      const range = isMobileViewport ? s.holdFramesMobile : s.holdFramesDesktop;
      return {
        id: s.id,
        fs: Math.round(range[0]),
        fe: Math.round(range[1]),
      };
    });
    // Base travel 500vh + 95vh per hold window for smooth, unhurried reading
    return computeScrollHoldPiecewise(holds, maxFrameIdx, 500, 95, 8);
  }, [holdStacks, isMobileViewport, maxFrameIdx]);

  const totalHeightVh = 100 + piecewise.totalTravel;

  // Image Sequence Cache Refs
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedFlagsRef = useRef<boolean[]>([]);
  const currentFrameIdxRef = useRef<number>(0);

  // Draw a specific frame (or its nearest loaded neighbor) onto the 2D canvas
  const drawFrameToCanvas = useCallback(
    (targetFrameFloat: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.round(rect.width * dpr);
      const ch = Math.round(rect.height * dpr);

      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const clampedIdx = Math.max(0, Math.min(maxFrameIdx, Math.round(targetFrameFloat)));
      currentFrameIdxRef.current = clampedIdx;

      // Find exact frame or nearest loaded neighbor (`useFrameSequence` algorithm)
      let chosenIdx = clampedIdx;
      const flags = loadedFlagsRef.current;
      if (!flags[chosenIdx]) {
        chosenIdx = -1;
        for (let delta = 1; delta < frameCount; delta++) {
          if (clampedIdx - delta >= 0 && flags[clampedIdx - delta]) {
            chosenIdx = clampedIdx - delta;
            break;
          }
          if (clampedIdx + delta < frameCount && flags[clampedIdx + delta]) {
            chosenIdx = clampedIdx + delta;
            break;
          }
        }
      }

      const img = chosenIdx >= 0 ? imagesRef.current[chosenIdx] : null;
      if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const scale = Math.max(cw / iw, ch / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      } else {
        // Warm Royal Gold & Temple Crimson Fallback before Frame 0000 arrives
        const grad = ctx.createRadialGradient(
          cw * 0.5,
          ch * 0.45,
          cw * 0.05,
          cw * 0.5,
          ch * 0.5,
          cw * 0.7
        );
        grad.addColorStop(0, '#5a222b');
        grad.addColorStop(0.55, '#381119');
        grad.addColorStop(1, '#1e070c');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);
      }
    },
    [frameCount, maxFrameIdx]
  );

  // Smart 3-Pass Priority Preloader for the WebP Frame Sequence
  useEffect(() => {
    let cancelled = false;
    imagesRef.current = new Array(frameCount).fill(null);
    loadedFlagsRef.current = new Array(frameCount).fill(false);
    setLoadedCount(0);

    const getFrameUrl = (idx: number) =>
      `${framesBaseUrl}/${String(idx).padStart(4, '0')}.webp`;

    // Build priority order:
    // 1. Frame 0 + hold keyframes + every 8th frame
    // 2. Every 2nd frame
    // 3. All remaining frames
    const prioritySet = new Set<number>([0]);
    holdStacks.forEach((s) => {
      const [fs, fe] = isMobileViewport ? s.holdFramesMobile : s.holdFramesDesktop;
      prioritySet.add(fs);
      prioritySet.add(Math.floor((fs + fe) / 2));
      prioritySet.add(fe);
    });
    for (let i = 0; i < frameCount; i += 8) prioritySet.add(i);
    for (let i = 0; i < frameCount; i += 2) prioritySet.add(i);
    for (let i = 0; i < frameCount; i++) prioritySet.add(i);

    const loadQueue = Array.from(prioritySet).filter((i) => i >= 0 && i < frameCount);
    let pointer = 0;
    let doneCount = 0;
    const CONCURRENCY = 8;

    const loadNext = () => {
      if (cancelled || pointer >= loadQueue.length) return;
      const frameIdx = loadQueue[pointer++];
      const img = new Image();
      img.decoding = 'async';

      img.onload = () => {
        if (cancelled) return;
        imagesRef.current[frameIdx] = img;
        loadedFlagsRef.current[frameIdx] = true;
        doneCount++;
        if (doneCount % 12 === 0 || doneCount === 1 || doneCount === frameCount) {
          setLoadedCount(doneCount);
        }
        if (frameIdx === 0 || Math.abs(frameIdx - currentFrameIdxRef.current) <= 8) {
          drawFrameToCanvas(currentFrameIdxRef.current);
        }
        loadNext();
      };

      img.onerror = () => {
        if (cancelled) return;
        loadNext();
      };

      img.src = getFrameUrl(frameIdx);
    };

    for (let c = 0; c < CONCURRENCY; c++) {
      loadNext();
    }

    return () => {
      cancelled = true;
    };
  }, [frameCount, framesBaseUrl, holdStacks, isMobileViewport, drawFrameToCanvas]);

  // Listen to window scroll & map scrollProgress -> normalized frame -> canvas draw
  useEffect(() => {
    let rafId = 0;

    const updateFromScroll = () => {
      rafId = 0;
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const totalScrollable = Math.max(1, el.offsetHeight - window.innerHeight);
      const scrolled = Math.max(0, Math.min(totalScrollable, -rect.top));
      const progress = scrolled / totalScrollable;

      if (scrolled > 8) {
        setShowScrollHint(false);
      }

      setScrollProgress(progress);
      const normalizedFrame = interpolatePiecewise(
        progress,
        piecewise.inputs,
        piecewise.outputs
      );
      drawFrameToCanvas(normalizedFrame * maxFrameIdx);
    };

    const onScrollOrResize = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateFromScroll);
      }
    };

    updateFromScroll();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [piecewise, maxFrameIdx, drawFrameToCanvas]);

  // Jump smoothly to any Hold Scene in the Sacred Mangalam film
  const handleJumpToScene = (stackId: string | 'top') => {
    if (isLocked) {
      onUnlock();
    }
    const el = containerRef.current;
    if (!el) return;

    const totalScrollable = Math.max(1, el.offsetHeight - window.innerHeight);
    if (stackId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const win = piecewise.windows[stackId];
    if (!win) return;
    // Scroll to 45% into the hold window so all lines in that stack are fully revealed
    const targetProgress = win.start + (win.end - win.start) * 0.45;
    const targetScrollY = el.offsetTop + targetProgress * totalScrollable;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  const handleOpenMapUrl = (rawUrl?: string, fallbackVenue?: string) => {
    if (rawUrl && !rawUrl.includes('[') && rawUrl.startsWith('http')) {
      window.open(rawUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const query = encodeURIComponent(
      fallbackVenue && !fallbackVenue.includes('[') ? fallbackVenue : 'Sri Kapaleeshwarar Temple Chennai'
    );
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="relative w-full select-none bg-[#241316] no-print">
      {/* DISCREET TOP SCENE JUMP & CUSTOMIZER BAR */}
      <div className="fixed top-3 inset-x-0 z-[70] px-3 sm:px-6 flex items-center justify-between gap-2 pointer-events-none">
        {/* Scene Jump Links */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 overflow-x-auto max-w-[68vw] sm:max-w-none">
          <button
            type="button"
            onClick={() => handleJumpToScene('top')}
            className="px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider text-white/90 hover:bg-white/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Start
          </button>
          {holdStacks.map((s) => {
            const win = piecewise.windows[s.id];
            const isActive =
              win && scrollProgress >= win.start - 0.02 && scrollProgress <= win.fadeEnd;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleJumpToScene(s.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#b8935a] text-white font-medium shadow-sm'
                    : 'text-white/85 hover:bg-white/15'
                }`}
              >
                {s.label}
              </button>
            );
          })}
          <a
            href="#details-concierge"
            onClick={() => {
              if (isLocked) onUnlock();
            }}
            className="px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider text-[#E7D6AD] hover:bg-white/15 transition-colors whitespace-nowrap shrink-0"
          >
            Details &amp; RSVP ↓
          </a>
        </div>

        {/* Right Controls: Demo vs [PLACEHOLDERS] & Customize */}
        <div className="pointer-events-auto flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onTogglePlaceholders}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-black/55 text-white/95 border border-white/25 backdrop-blur-md hover:bg-black/75 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Switch between Sacred Mangalam Demo Names and [BRIDE NAME] Placeholders"
          >
            <Sparkles className="w-3 h-3 text-[#E7D6AD]" />
            <span>{isUsingPlaceholders ? 'Show Demo Names' : 'Use [PLACEHOLDERS]'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenCustomizer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-[#b8935a]/90 text-white border border-white/40 backdrop-blur-md hover:bg-[#b8935a] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span className="hidden sm:inline">Customize</span>
          </button>
        </div>
      </div>

      {/* BLURRED DESKTOP GUTTER BACKDROP FOR MOBILE-STAGE OR ULTRA-WIDE SCREENS */}
      <div
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <img
          src={`${DESKTOP_FRAMES_BASE}/0000.webp`}
          alt=""
          className="w-full h-full object-cover scale-110"
          style={{ filter: 'blur(24px) brightness(0.65)' }}
          draggable={false}
        />
      </div>

      {/* MAIN SCROLL-SCRUBBED FILM STAGE CONTAINER */}
      <div
        ref={containerRef}
        data-section-id="story"
        className="relative z-10 w-full select-none"
        style={{
          height: `${totalHeightVh}vh`,
        }}
      >
        {/* STICKY VIEWPORT STAGE */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {/* Canvas Wrapper */}
          <div className="relative w-full h-full overflow-hidden">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full block"
            />

            {/* Subtle Frame Preload Progress Indicator (Fades out once key frames are ready) */}
            {loadedCount < 25 && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[11px] tracking-widest uppercase text-white/85 pointer-events-none">
                Loading Sacred Mangalam Film…
              </div>
            )}

            {/* HOLD TEXT STACKS OVERLAY (`Se` & `Ce` from SacredMangalamTemplate) */}
            {holdStacks.map((stack) => {
              const hold = piecewise.windows[stack.id];
              if (!hold) return null;

              const pos = isMobileViewport ? stack.positionMobile : stack.positionDesktop;
              const holdSpan = Math.max(1e-4, hold.end - hold.start);
              const lineCount = Math.max(1, stack.lines.length);
              // De = 0.7 from SacredMangalamTemplate
              const lineStep = (0.7 * holdSpan) / lineCount;
              const lineFadeSpan = Math.max(0.001, lineStep * 0.9);
              const inRampEnd = hold.start + Math.min(0.02, 0.3 * holdSpan);

              const stackOpacity = interpolatePiecewise(
                scrollProgress,
                [hold.start, inRampEnd, hold.end, hold.fadeEnd],
                stack.holdFadeOut !== false ? [0, 1, 1, 0] : [0, 1, 1, 1]
              );

              if (stackOpacity <= 0.005) return null;

              return (
                <div
                  key={stack.id}
                  data-text-stack={stack.id}
                  className="absolute z-20 flex flex-col items-center text-center"
                  style={{
                    left: pos.left,
                    top: pos.top,
                    width: pos.width ?? (stack.blurBg ? 'auto' : '48%'),
                    maxWidth: '92vw',
                    transform: 'translate(-50%, -50%)',
                    opacity: stackOpacity,
                    pointerEvents: stackOpacity > 0.5 ? 'auto' : 'none',
                  }}
                >
                  {/* Radial Blurred Backdrop (`Le` in SacredMangalamTemplate) when `blurBg: true` */}
                  {stack.blurBg && (
                    <div
                      className="absolute inset-0 -mx-14 -my-10 sm:-mx-24 sm:-my-16 rounded-2xl pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(ellipse, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 68%)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        maskImage:
                          'radial-gradient(ellipse, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 68%)',
                        WebkitMaskImage:
                          'radial-gradient(ellipse, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 68%)',
                      }}
                    />
                  )}

                  {/* Lines Container */}
                  <div
                    className={`relative z-10 flex flex-col items-center text-center w-full ${
                      stack.blurBg ? 'px-8 py-6 sm:px-14 sm:py-10' : ''
                    }`}
                  >
                    {stack.lines.map((line, lineIdx) => {
                      const inAt = hold.start + lineIdx * lineStep;
                      const lineOpacity = interpolatePiecewise(
                        scrollProgress,
                        [inAt, inAt + lineFadeSpan],
                        [0, 1]
                      );
                      const lineTranslateY = interpolatePiecewise(
                        scrollProgress,
                        [inAt, inAt + lineFadeSpan],
                        [26, 0]
                      );

                      if (line.type === 'map') {
                        return (
                          <div
                            key={line.id}
                            className="w-full flex justify-center"
                            style={{
                              opacity: lineOpacity,
                              transform: `translate3d(0, ${lineTranslateY}px, 0)`,
                              marginTop: line.spacingTop || '8px',
                              marginBottom: line.spacingBottom || '0px',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleOpenMapUrl(line.mapUrl, stack.label)}
                              style={{
                                fontFamily: FONT_FAMILY_MAP[line.font],
                                fontSize: isMobileViewport ? line.sizeMobile : line.sizeDesktop,
                                color: line.color,
                                border: `1.5px solid ${line.color}`,
                                borderRadius: '999px',
                                padding: '0.3em 0.9em',
                                lineHeight: 1,
                              }}
                              className="inline-flex items-center gap-1.5 hover:bg-white/15 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                            >
                              <span>Location</span>
                              <svg
                                width="0.52em"
                                height="0.52em"
                                viewBox="5 6 13 13"
                                fill="currentColor"
                                aria-hidden="true"
                                className="shrink-0"
                              >
                                <path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z" />
                              </svg>
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={line.id}
                          className="w-full"
                          style={{
                            opacity: lineOpacity,
                            transform: `translate3d(0, ${lineTranslateY}px, 0)`,
                          }}
                        >
                          <p
                            style={{
                              fontFamily: FONT_FAMILY_MAP[line.font],
                              fontSize: isMobileViewport ? line.sizeMobile : line.sizeDesktop,
                              fontStyle: line.style === 'italic' ? 'italic' : 'normal',
                              fontWeight: line.style === 'bold' ? 'bold' : 'normal',
                              color: line.color,
                              textShadow:
                                line.color === '#ffffff'
                                  ? '0 1px 10px rgba(0,0,0,0.35)'
                                  : 'none',
                              marginTop: line.spacingTop || '0px',
                              marginBottom: line.spacingBottom || '0px',
                            }}
                            className="w-full leading-tight text-center"
                          >
                            {line.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* OPENING "TAP TO OPEN" OVERLAY BUTTON (Matches SacredMangalamTemplate `b && d`) */}
            {isLocked && (
              <button
                type="button"
                onClick={onUnlock}
                data-rec="gate-open"
                className="fixed inset-0 z-40 flex flex-col items-center justify-end pb-[12vh] cursor-pointer focus:outline-none"
                aria-label="Tap to Open Sacred Mangalam Wedding Invitation"
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY_MAP.marcellus,
                    fontSize: 'clamp(14px, 1.4vw, 18px)',
                  }}
                  className="rounded-full border border-white/50 bg-[#b8935a]/85 px-7 py-3 uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-sm animate-pulse hover:bg-[#b8935a] transition-transform active:scale-95 whitespace-nowrap shrink-0"
                >
                  Tap to Open
                </span>
              </button>
            )}

            {/* RADIAL BLURRED "SCROLL ↓" HINT CUE (Matches `ScrollHintCue-Dsfs_ZTA.js`) */}
            {!isLocked && showScrollHint && (
              <div className="pointer-events-none fixed inset-x-0 bottom-[6vh] z-[65] flex justify-center transition-opacity duration-500">
                <div
                  className="relative flex flex-row items-center gap-2 px-10 py-5 text-white/95"
                  style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'radial-gradient(ellipse, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 68%)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      maskImage:
                        'radial-gradient(ellipse, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 68%)',
                      WebkitMaskImage:
                        'radial-gradient(ellipse, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 68%)',
                    }}
                  />
                  <div className="relative z-10 flex items-center gap-2">
                    <span
                      className="text-[15px] uppercase tracking-[0.28em]"
                      style={{ fontFamily: FONT_FAMILY_MAP.cormorant }}
                    >
                      Scroll
                    </span>
                    <ChevronDown className="w-5 h-5 animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING CIRCULAR MUSIC TOGGLE BUTTON (Matches `p0` in `ScrollHintCue-Dsfs_ZTA.js`) */}
      <button
        type="button"
        onClick={onToggleMusic}
        className="fixed bottom-5 left-5 z-[70] w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
        aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
      >
        <svg
          className="w-4 h-4"
          fill="#5a4a33"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M20.5 2.2a1 1 0 0 0-.83-.2l-11 2A1 1 0 0 0 8 5v9.4A3.6 3.6 0 0 0 6.5 14C4.57 14 3 15.35 3 17s1.57 3 3.5 3S10 18.65 10 17V7.34l9-1.64V12.4a3.6 3.6 0 0 0-1.5-.4c-1.93 0-3.5 1.35-3.5 3s1.57 3 3.5 3 3.5-1.35 3.5-3V3a1 1 0 0 0-.5-.8Z" />
          {!isMusicPlaying && (
            <path
              d="M2.1 2.8 20.9 22.1 22.4 20.7 3.6 1.4z"
              stroke="#5a4a33"
              strokeWidth="0.5"
            />
          )}
        </svg>
      </button>
    </div>
  );
};
