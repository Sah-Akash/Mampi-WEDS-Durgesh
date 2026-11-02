import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { ChevronDown, Play, Pause } from 'lucide-react';
import { LanguageMode, WeddingConfig } from '../config/weddingConfig';

interface SacredMangalamFilmProps {
  config: WeddingConfig;
  language: LanguageMode;
  isLocked: boolean;
  onUnlock: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

interface TextLineItem {
  id: string;
  text: string;
  font: 'cormorant' | 'dancing-script' | 'cinzel' | 'marcellus' | 'devanagari';
  sizeDesktop: string;
  sizeMobile: string;
  style?: 'italic' | 'normal' | 'bold';
  color: string;
  spacingTop?: string;
  spacingBottom?: string;
  type?: 'text' | 'map';
  mapUrl?: string;
  lang?: 'en' | 'hi' | 'both';
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
  devanagari: "'Tiro Devanagari Sanskrit', 'Cormorant Garamond', serif",
};

function computeScrollHoldPiecewise(
  holds: { id: string; fs: number; fe: number }[],
  maxFrameIdx: number,
  baseTravelVh: number,
  holdDurationVh: number
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
      fadeEnd: currentScroll,
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

  for (let i = 1; i < inputs.length; i++) {
    if (inputs[i] <= inputs[i - 1]) {
      inputs[i] = inputs[i - 1] + 1e-4;
    }
  }

  return { inputs, outputs, windows, totalTravel };
}

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
  language,
  isLocked,
  onUnlock,
  isMusicPlaying,
  onToggleMusic,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const stackElsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const lineElsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollHintElRef = useRef<HTMLDivElement | null>(null);

  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [isInitialReady, setIsInitialReady] = useState<boolean>(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);

  useEffect(() => {
    let resizeTimer = 0;
    const checkViewport = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setIsMobileViewport(window.innerWidth < 768);
      }, 120);
    };
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  useEffect(() => {
    if (!isLocked) return;
    window.scrollTo(0, 0);

    const originalOverflowHtml = document.documentElement.style.overflow;
    const originalOverflowBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const preventKeys = (e: KeyboardEvent) => {
      if ([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', preventKeys);
    return () => {
      document.documentElement.style.overflow = originalOverflowHtml;
      document.body.style.overflow = originalOverflowBody;
      window.removeEventListener('keydown', preventKeys);
    };
  }, [isLocked]);

  const showEnglish = language === 'en' || language === 'bilingual';
  const showHindi = language === 'hi' || language === 'bilingual';

  const holdStacks: HoldStackConfig[] = useMemo(() => {
    const filterByLang = (items: TextLineItem[]) =>
      items.filter((item) => {
        if (!item.lang || item.lang === 'both') return true;
        if (item.lang === 'en') return showEnglish;
        if (item.lang === 'hi') return showHindi;
        return true;
      });

    return [
      {
        id: 'inv-greeting',
        label: 'Invitation',
        holdFramesDesktop: [126, 154],
        holdFramesMobile: [100, 112],
        positionDesktop: { left: '50%', top: '53%', width: '54%' },
        positionMobile: { left: '57%', top: '50.5%', width: '58%' },
        blurBg: false,
        holdFadeOut: true,
        lines: filterByLang([
          {
            id: 'inv-shloka',
            text: '|| श्री गणेशाय नमः ||',
            font: 'devanagari',
            sizeDesktop: 'clamp(13px, 1.3vw, 19px)',
            sizeMobile: 'clamp(11px, 3.2vw, 15px)',
            color: '#E7D6AD',
            spacingBottom: '4px',
            lang: 'both',
          },
          {
            id: 'inv-greeting-line',
            text: `Dear ${config.guestName || 'Family & Friends'},`,
            font: 'cormorant',
            sizeDesktop: 'clamp(20px, 2.2vw, 34px)',
            sizeMobile: 'clamp(16px, 4.4vw, 22px)',
            style: 'italic',
            color: '#ffffff',
            spacingBottom: '4px',
            lang: 'en',
          },
          {
            id: 'inv-line-1',
            text: 'you are cordially invited to the',
            font: 'cormorant',
            sizeDesktop: 'clamp(15px, 1.55vw, 24px)',
            sizeMobile: 'clamp(13px, 3.5vw, 17px)',
            style: 'italic',
            color: '#ffffff',
            lang: 'en',
          },
          {
            id: 'inv-line-2',
            text: 'wedding ceremony of',
            font: 'cormorant',
            sizeDesktop: 'clamp(15px, 1.55vw, 24px)',
            sizeMobile: 'clamp(13px, 3.5vw, 17px)',
            style: 'italic',
            color: '#ffffff',
            spacingBottom: '6px',
            lang: 'en',
          },
          {
            id: 'inv-line-hi',
            text: 'स्नेहिल पारिवारिक विवाह निमंत्रण',
            font: 'devanagari',
            sizeDesktop: 'clamp(14px, 1.4vw, 21px)',
            sizeMobile: 'clamp(12px, 3.3vw, 16px)',
            color: '#E7D6AD',
            spacingBottom: '6px',
            lang: 'hi',
          },
          {
            id: 'inv-bride',
            text:
              language === 'hi'
                ? config.brideNameHindi
                : language === 'bilingual'
                ? `${config.brideName} (${config.brideNameHindi})`
                : config.brideName,
            font: language === 'hi' ? 'devanagari' : 'dancing-script',
            sizeDesktop: 'clamp(28px, 3.1vw, 48px)',
            sizeMobile: 'clamp(22px, 6.2vw, 32px)',
            color: '#ffffff',
            lang: 'both',
          },
          {
            id: 'inv-bride-parents',
            text: `D/o ${config.brideFatherName} &`,
            font: 'cormorant',
            sizeDesktop: 'clamp(15px, 1.65vw, 25px)',
            sizeMobile: 'clamp(12px, 3.6vw, 18px)',
            color: '#ffffff',
            lang: 'both',
          },
          {
            id: 'inv-bride-parents-2',
            text: config.brideMotherName,
            font: 'cormorant',
            sizeDesktop: 'clamp(15px, 1.65vw, 25px)',
            sizeMobile: 'clamp(12px, 3.6vw, 18px)',
            color: '#ffffff',
            spacingBottom: '3px',
            lang: 'both',
          },
          {
            id: 'inv-amp',
            text: '&',
            font: 'dancing-script',
            sizeDesktop: 'clamp(15px, 1.4vw, 21px)',
            sizeMobile: 'clamp(14px, 3.8vw, 18px)',
            color: '#E7D6AD',
            spacingBottom: '2px',
            lang: 'both',
          },
          {
            id: 'inv-groom',
            text:
              language === 'hi'
                ? config.groomNameHindi
                : language === 'bilingual'
                ? `${config.groomName} (${config.groomNameHindi})`
                : config.groomName,
            font: language === 'hi' ? 'devanagari' : 'dancing-script',
            sizeDesktop: 'clamp(28px, 3.1vw, 48px)',
            sizeMobile: 'clamp(22px, 6.2vw, 32px)',
            color: '#ffffff',
            lang: 'both',
          },
          {
            id: 'inv-groom-parents',
            text: `S/o ${config.groomFatherName} &`,
            font: 'cormorant',
            sizeDesktop: 'clamp(15px, 1.65vw, 25px)',
            sizeMobile: 'clamp(12px, 3.6vw, 18px)',
            color: '#ffffff',
            lang: 'both',
          },
          {
            id: 'inv-groom-parents-2',
            text: config.groomMotherName,
            font: 'cormorant',
            sizeDesktop: 'clamp(15px, 1.65vw, 25px)',
            sizeMobile: 'clamp(12px, 3.6vw, 18px)',
            color: '#ffffff',
            lang: 'both',
          },
        ]),
      },
      {
        id: 'haldi-title',
        label: 'Mehendi (22 Nov)',
        holdFramesDesktop: [186, 199],
        holdFramesMobile: [152, 160],
        positionDesktop: { left: '50%', top: '26%' },
        positionMobile: { left: '50%', top: '25%' },
        blurBg: true,
        holdFadeOut: true,
        lines: filterByLang([
          {
            id: 'haldi-heading',
            text: config.haldiName,
            font: 'cinzel',
            sizeDesktop: 'clamp(26px, 2.8vw, 44px)',
            sizeMobile: 'clamp(22px, 6vw, 32px)',
            color: '#ffffff',
            spacingBottom: '2px',
            lang: 'both',
          },
          {
            id: 'haldi-heading-hi',
            text: config.haldiNameHindi || 'मेहंदी रस्म',
            font: 'devanagari',
            sizeDesktop: 'clamp(16px, 1.6vw, 24px)',
            sizeMobile: 'clamp(14px, 3.8vw, 19px)',
            color: '#E7D6AD',
            spacingBottom: '6px',
            lang: 'hi',
          },
          {
            id: 'haldi-date',
            text: config.haldiDate,
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2vw, 30px)',
            sizeMobile: 'clamp(16px, 4.4vw, 22px)',
            style: 'italic',
            color: '#ffffff',
            lang: 'both',
          },
          {
            id: 'haldi-time',
            text: config.haldiTime,
            font: 'cormorant',
            sizeDesktop: 'clamp(17px, 1.85vw, 28px)',
            sizeMobile: 'clamp(15px, 4.1vw, 20px)',
            style: 'italic',
            color: '#ffffff',
            lang: 'both',
          },
          {
            id: 'haldi-venue',
            text: config.haldiVenue,
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2vw, 30px)',
            sizeMobile: 'clamp(16px, 4.4vw, 22px)',
            color: '#ffffff',
            lang: 'both',
          },
          {
            id: 'haldi-venue-map',
            type: 'map',
            text: 'Location',
            mapUrl: config.haldiMapUrl,
            font: 'cormorant',
            sizeDesktop: 'clamp(14px, 1.35vw, 20px)',
            sizeMobile: 'clamp(13px, 3.5vw, 16px)',
            color: '#ffffff',
            spacingTop: '8px',
            lang: 'both',
          },
        ]),
      },
      {
        id: 'reception-title',
        label: 'Pujan & Haldi (23 Nov)',
        holdFramesDesktop: [308, 320],
        holdFramesMobile: [250, 257],
        positionDesktop: { left: '50%', top: '30%' },
        positionMobile: { left: '50%', top: '30%' },
        blurBg: true,
        holdFadeOut: true,
        lines: filterByLang([
          {
            id: 'reception-heading',
            text: config.receptionName,
            font: 'cinzel',
            sizeDesktop: 'clamp(20px, 2.2vw, 34px)',
            sizeMobile: 'clamp(17px, 4.6vw, 24px)',
            color: '#ffffff',
            spacingBottom: '3px',
            lang: 'both',
          },
          {
            id: 'reception-heading-hi',
            text: config.receptionNameHindi || 'सत्यनारायण पूजन, मटकोर, घी ढारी एवं हल्दी',
            font: 'devanagari',
            sizeDesktop: 'clamp(15px, 1.5vw, 23px)',
            sizeMobile: 'clamp(13px, 3.6vw, 18px)',
            color: '#E7D6AD',
            spacingBottom: '6px',
            lang: 'hi',
          },
          {
            id: 'reception-date',
            text: config.receptionDate,
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2vw, 30px)',
            sizeMobile: 'clamp(16px, 4.4vw, 22px)',
            style: 'italic',
            color: '#ffffff',
            lang: 'both',
          },
          {
            id: 'reception-time',
            text: config.receptionTime,
            font: 'cormorant',
            sizeDesktop: 'clamp(17px, 1.85vw, 28px)',
            sizeMobile: 'clamp(15px, 4.1vw, 20px)',
            style: 'italic',
            color: '#ffffff',
            lang: 'both',
          },
          {
            id: 'reception-venue',
            text: config.receptionVenue,
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2vw, 30px)',
            sizeMobile: 'clamp(16px, 4.4vw, 22px)',
            color: '#ffffff',
            lang: 'both',
          },
          {
            id: 'reception-venue-map',
            type: 'map',
            text: 'Location',
            mapUrl: config.receptionMapUrl,
            font: 'cormorant',
            sizeDesktop: 'clamp(14px, 1.35vw, 20px)',
            sizeMobile: 'clamp(13px, 3.5vw, 16px)',
            color: '#ffffff',
            spacingTop: '8px',
            lang: 'both',
          },
        ]),
      },
      {
        id: 'wedding-title',
        label: 'Wedding (24 Nov)',
        holdFramesDesktop: [372, 378],
        holdFramesMobile: [301, 307],
        positionDesktop: { left: '50%', top: '30%' },
        positionMobile: { left: '50%', top: '30%' },
        blurBg: true,
        holdFadeOut: true,
        lines: filterByLang([
          {
            id: 'wedding-heading',
            text: config.weddingName,
            font: 'cinzel',
            sizeDesktop: 'clamp(24px, 2.6vw, 42px)',
            sizeMobile: 'clamp(20px, 5.5vw, 30px)',
            color: '#ffffff',
            spacingBottom: '2px',
            lang: 'both',
          },
          {
            id: 'wedding-heading-hi',
            text: config.weddingNameHindi || 'शुभ विवाह उत्सव',
            font: 'devanagari',
            sizeDesktop: 'clamp(16px, 1.6vw, 24px)',
            sizeMobile: 'clamp(14px, 3.8vw, 19px)',
            color: '#E7D6AD',
            spacingBottom: '6px',
            lang: 'hi',
          },
          {
            id: 'wedding-date',
            text: `${config.weddingDate} · ${config.weddingTime}`,
            font: 'cormorant',
            sizeDesktop: 'clamp(18px, 2vw, 30px)',
            sizeMobile: 'clamp(16px, 4.4vw, 22px)',
            style: 'italic',
            color: '#ffffff',
            lang: 'both',
          },
          {
            id: 'wedding-venue',
            text: config.venueName,
            font: 'cormorant',
            sizeDesktop: 'clamp(19px, 2.1vw, 32px)',
            sizeMobile: 'clamp(16px, 4.5vw, 23px)',
            style: 'bold',
            color: '#E7D6AD',
            lang: 'both',
          },
          {
            id: 'wedding-address',
            text: config.fullAddress,
            font: 'cormorant',
            sizeDesktop: 'clamp(16px, 1.75vw, 26px)',
            sizeMobile: 'clamp(14px, 3.9vw, 19px)',
            color: '#ffffff',
            lang: 'both',
          },
          {
            id: 'wedding-venue-map',
            type: 'map',
            text: 'Google Maps Directions',
            mapUrl: config.googleMapsUrl,
            font: 'cormorant',
            sizeDesktop: 'clamp(14px, 1.35vw, 20px)',
            sizeMobile: 'clamp(13px, 3.5vw, 16px)',
            color: '#ffffff',
            spacingTop: '8px',
            lang: 'both',
          },
        ]),
      },
      {
        id: 'rsvp-title',
        label: 'RSVP',
        holdFramesDesktop: [429, 439],
        holdFramesMobile: [359, 363],
        positionDesktop: { left: '50%', top: '67%', width: '80%' },
        positionMobile: { left: '50%', top: '55%', width: '82%' },
        blurBg: false,
        holdFadeOut: false,
        lines: filterByLang([
          {
            id: 'rsvp-heading',
            text: 'RSVP',
            font: 'cinzel',
            sizeDesktop: 'clamp(24px, 2.6vw, 42px)',
            sizeMobile: 'clamp(20px, 5.5vw, 30px)',
            color: '#6b2440',
            spacingBottom: '4px',
            lang: 'both',
          },
          {
            id: 'rsvp-line-1',
            text: 'We would be honoured',
            font: 'cormorant',
            sizeDesktop: 'clamp(17px, 1.9vw, 30px)',
            sizeMobile: 'clamp(14px, 3.8vw, 18px)',
            style: 'italic',
            color: '#6b2440',
            lang: 'en',
          },
          {
            id: 'rsvp-line-2',
            text: 'by your presence!',
            font: 'cormorant',
            sizeDesktop: 'clamp(17px, 1.9vw, 30px)',
            sizeMobile: 'clamp(14px, 3.8vw, 18px)',
            style: 'italic',
            color: '#6b2440',
            spacingBottom: '6px',
            lang: 'en',
          },
          {
            id: 'rsvp-line-hi',
            text: 'आपकी गरिमामयी उपस्थिति की प्रतीक्षा में',
            font: 'devanagari',
            sizeDesktop: 'clamp(15px, 1.5vw, 22px)',
            sizeMobile: 'clamp(12px, 3.4vw, 16px)',
            color: '#6b2440',
            spacingBottom: '8px',
            lang: 'hi',
          },
          {
            id: 'rsvp-signoff',
            text: 'With love & blessings,',
            font: 'cormorant',
            sizeDesktop: 'clamp(16px, 1.75vw, 26px)',
            sizeMobile: 'clamp(13px, 3.6vw, 17px)',
            style: 'italic',
            color: '#5a1f1f',
            spacingBottom: '2px',
            lang: 'both',
          },
          {
            id: 'rsvp-couple',
            text: `${config.brideName} & ${config.groomName}`,
            font: 'dancing-script',
            sizeDesktop: 'clamp(28px, 3vw, 46px)',
            sizeMobile: 'clamp(22px, 6vw, 32px)',
            color: '#5a1f1f',
            lang: 'both',
          },
        ]),
      },
    ];
  }, [config, language, showEnglish, showHindi]);

  const frameCount = isMobileViewport ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT;
  const framesBaseUrl = isMobileViewport ? MOBILE_FRAMES_BASE : DESKTOP_FRAMES_BASE;
  const maxFrameIdx = frameCount - 1;

  const piecewise = useMemo(() => {
    const holds = holdStacks.map((s) => {
      const range = isMobileViewport ? s.holdFramesMobile : s.holdFramesDesktop;
      return {
        id: s.id,
        fs: Math.round(range[0]),
        fe: Math.round(range[1]),
      };
    });
    return computeScrollHoldPiecewise(holds, maxFrameIdx, 520, 120);
  }, [holdStacks, isMobileViewport, maxFrameIdx]);

  const totalHeightVh = 100 + piecewise.totalTravel;

  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedFlagsRef = useRef<boolean[]>([]);
  const currentFrameIdxRef = useRef<number>(0);
  const lastDrawnFrameIdxRef = useRef<number>(-1);
  const canvasMetricsRef = useRef<{ cw: number; ch: number }>({ cw: 0, ch: 0 });

  const targetProgressRef = useRef<number>(0);
  const smoothedProgressRef = useRef<number>(0);

  const syncCanvasAndScrollMetrics = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.max(1, Math.round(width * dpr));
      const ch = Math.max(1, Math.round(height * dpr));

      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
        canvasMetricsRef.current = { cw, ch };
        lastDrawnFrameIdxRef.current = -1;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'medium';
          ctxRef.current = ctx;
        }
      }
    }
  }, []);

  const drawFrameToCanvas = useCallback(
    (targetFrameFloat: number, forceRedraw = false) => {
      let ctx = ctxRef.current;
      let { cw, ch } = canvasMetricsRef.current;

      if (!ctx || cw === 0 || ch === 0) {
        syncCanvasAndScrollMetrics();
        ctx = ctxRef.current;
        cw = canvasMetricsRef.current.cw;
        ch = canvasMetricsRef.current.ch;
        if (!ctx || cw === 0 || ch === 0) return;
      }

      const clampedIdx = Math.max(0, Math.min(maxFrameIdx, Math.round(targetFrameFloat)));
      currentFrameIdxRef.current = clampedIdx;

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

      if (!forceRedraw && chosenIdx >= 0 && chosenIdx === lastDrawnFrameIdxRef.current) {
        return;
      }

      const img = chosenIdx >= 0 ? imagesRef.current[chosenIdx] : null;
      if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const scale = Math.max(cw / iw, ch / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, (cw - dw) * 0.5, (ch - dh) * 0.5, dw, dh);
        lastDrawnFrameIdxRef.current = chosenIdx;
      } else if (lastDrawnFrameIdxRef.current === -1) {
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
    [frameCount, maxFrameIdx, syncCanvasAndScrollMetrics]
  );

  const applyProgressToDOM = useCallback(
    (progress: number) => {
      if (scrollHintElRef.current) {
        const hideHint = progress > 0.004;
        scrollHintElRef.current.style.opacity = hideHint ? '0' : '1';
      }

      const drawnFrame = lastDrawnFrameIdxRef.current;

      for (let sIdx = 0; sIdx < holdStacks.length; sIdx++) {
        const stack = holdStacks[sIdx];
        const stackEl = stackElsRef.current[stack.id];
        const hold = piecewise.windows[stack.id];
        if (!stackEl || !hold) continue;

        const [fs, fe] = isMobileViewport ? stack.holdFramesMobile : stack.holdFramesDesktop;

        // Ensure the actual rendered canvas frame has reached this scene's hold range
        // so text never appears early over an earlier transition frame
        const isFrameInScene =
          drawnFrame >= fs - 3 &&
          (stack.holdFadeOut === false ? drawnFrame <= maxFrameIdx : drawnFrame <= fe + 3);

        const holdSpan = Math.max(1e-4, hold.end - hold.start);
        // Delay text appearance until the camera transition has settled (18% into the hold window)
        const settleStart = hold.start + 0.18 * holdSpan;
        const inRampEnd = hold.start + 0.32 * holdSpan;
        // Fade text out completely BEFORE hold.end (from 84% to 98% of the hold window)
        // so text disappears before the camera begins transitioning to the next scene
        const outRampStart = hold.start + 0.84 * holdSpan;
        const outRampEnd = hold.start + 0.98 * holdSpan;

        const rawStackOpacity = interpolatePiecewise(
          progress,
          [settleStart, inRampEnd, outRampStart, outRampEnd],
          stack.holdFadeOut !== false ? [0, 1, 1, 0] : [0, 1, 1, 1]
        );

        const stackOpacity = isFrameInScene ? rawStackOpacity : 0;

        if (stackOpacity <= 0.004) {
          if (stackEl.style.visibility !== 'hidden') {
            stackEl.style.visibility = 'hidden';
            stackEl.style.opacity = '0';
            stackEl.style.pointerEvents = 'none';
          }
          continue;
        }

        stackEl.style.visibility = 'visible';
        stackEl.style.opacity = stackOpacity.toFixed(3);
        stackEl.style.pointerEvents = stackOpacity > 0.5 ? 'auto' : 'none';

        // Cascade lines in between 18% and 68% of the hold window (after camera settles)
        const cascadeSpan = 0.50 * holdSpan;
        const lineCount = Math.max(1, stack.lines.length);
        const lineStep = cascadeSpan / lineCount;
        const lineFadeSpan = Math.max(0.001, lineStep * 1.15);

        for (let lIdx = 0; lIdx < stack.lines.length; lIdx++) {
          const line = stack.lines[lIdx];
          const lineEl = lineElsRef.current[`${stack.id}__${line.id}`];
          if (!lineEl) continue;

          const inAt = settleStart + lIdx * lineStep;
          const lineOpacity = interpolatePiecewise(
            progress,
            [inAt, inAt + lineFadeSpan],
            [0, 1]
          );
          const lineTranslateY = interpolatePiecewise(
            progress,
            [inAt, inAt + lineFadeSpan],
            [20, 0]
          );

          lineEl.style.opacity = lineOpacity.toFixed(3);
          lineEl.style.transform = `translate3d(0, ${lineTranslateY.toFixed(1)}px, 0)`;
        }
      }
    },
    [holdStacks, piecewise, isMobileViewport, maxFrameIdx]
  );

  // Preload & pre-decode frames: load hold windows and global keyframes FIRST so scene frames are never behind
  useEffect(() => {
    let cancelled = false;
    imagesRef.current = new Array(frameCount).fill(null);
    loadedFlagsRef.current = new Array(frameCount).fill(false);
    lastDrawnFrameIdxRef.current = -1;
    setIsInitialReady(false);

    const getFrameUrl = (idx: number) =>
      `${framesBaseUrl}/${String(idx).padStart(4, '0')}.webp`;

    const prioritySet = new Set<number>([0]);
    // 1. All hold window frames first so every text scene has its exact backdrop ready immediately
    holdStacks.forEach((s) => {
      const [fs, fe] = isMobileViewport ? s.holdFramesMobile : s.holdFramesDesktop;
      prioritySet.add(fs);
      prioritySet.add(Math.floor((fs + fe) / 2));
      prioritySet.add(fe);
      for (let f = Math.max(0, fs - 2); f <= Math.min(maxFrameIdx, fe + 2); f++) {
        prioritySet.add(f);
      }
    });
    // 2. Strided keyframes across the entire film so no scroll position ever lags behind
    for (let i = 0; i < frameCount; i += 8) prioritySet.add(i);
    for (let i = 0; i < frameCount; i += 4) prioritySet.add(i);
    for (let i = 0; i < frameCount; i += 2) prioritySet.add(i);
    for (let i = 0; i < frameCount; i++) prioritySet.add(i);

    const pendingSet = new Set<number>(
      Array.from(prioritySet).filter((i) => i >= 0 && i < frameCount)
    );
    const orderedQueue = Array.from(pendingSet);
    let queueCursor = 0;
    let doneCount = 0;
    let readySignaled = false;
    const CONCURRENCY = 10;

    const pickNextFrame = (): number | null => {
      const cur = currentFrameIdxRef.current;
      for (let offset = 0; offset <= 16; offset++) {
        const candidate = cur + offset;
        if (candidate < frameCount && pendingSet.has(candidate)) {
          pendingSet.delete(candidate);
          return candidate;
        }
      }
      while (queueCursor < orderedQueue.length) {
        const candidate = orderedQueue[queueCursor++];
        if (pendingSet.has(candidate)) {
          pendingSet.delete(candidate);
          return candidate;
        }
      }
      return null;
    };

    const loadNext = () => {
      if (cancelled) return;
      const frameIdx = pickNextFrame();
      if (frameIdx === null) return;

      const img = new Image();
      img.decoding = 'async';

      const finalizeFrame = () => {
        if (cancelled) return;
        imagesRef.current[frameIdx] = img;
        loadedFlagsRef.current[frameIdx] = true;
        doneCount++;

        if (!readySignaled && (doneCount >= 6 || frameIdx === 0)) {
          readySignaled = true;
          setIsInitialReady(true);
        }

        if (
          frameIdx === 0 ||
          Math.abs(frameIdx - currentFrameIdxRef.current) <= 8
        ) {
          drawFrameToCanvas(currentFrameIdxRef.current, true);
          applyProgressToDOM(smoothedProgressRef.current);
        }

        loadNext();
      };

      img.onload = () => {
        if (cancelled) return;
        if (typeof img.decode === 'function') {
          img.decode().then(finalizeFrame).catch(finalizeFrame);
        } else {
          finalizeFrame();
        }
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
  }, [
    frameCount,
    maxFrameIdx,
    framesBaseUrl,
    holdStacks,
    isMobileViewport,
    drawFrameToCanvas,
    applyProgressToDOM,
  ]);

  // Buttery-smooth inertial scroll scrubbing loop (zero React state updates)
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const computeTargetProgress = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalScrollable = Math.max(1, el.offsetHeight - window.innerHeight);
      const scrolled = Math.max(0, Math.min(totalScrollable, -rect.top));
      targetProgressRef.current = scrolled / totalScrollable;
    };

    const tick = (now: number) => {
      const dt = Math.min(48, Math.max(4, now - lastTime));
      lastTime = now;

      const target = targetProgressRef.current;
      const current = smoothedProgressRef.current;
      const diff = target - current;

      // Exponential smoothing for silky 60/120fps frame interpolation
      const alpha = 1 - Math.pow(1 - 0.24, dt / 16.667);
      const next = Math.abs(diff) < 0.00012 ? target : current + diff * alpha;
      smoothedProgressRef.current = next;

      const normalizedFrame = interpolatePiecewise(
        next,
        piecewise.inputs,
        piecewise.outputs
      );
      drawFrameToCanvas(normalizedFrame * maxFrameIdx);
      applyProgressToDOM(next);

      if (Math.abs(target - next) > 0.00012) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const startLoopIfNeeded = () => {
      if (!rafId) {
        lastTime = performance.now();
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      computeTargetProgress();
      startLoopIfNeeded();
    };

    const onResize = () => {
      syncCanvasAndScrollMetrics();
      computeTargetProgress();
      smoothedProgressRef.current = targetProgressRef.current;
      const normalizedFrame = interpolatePiecewise(
        smoothedProgressRef.current,
        piecewise.inputs,
        piecewise.outputs
      );
      drawFrameToCanvas(normalizedFrame * maxFrameIdx, true);
      applyProgressToDOM(smoothedProgressRef.current);
    };

    syncCanvasAndScrollMetrics();
    computeTargetProgress();
    smoothedProgressRef.current = targetProgressRef.current;
    const initialFrame = interpolatePiecewise(
      smoothedProgressRef.current,
      piecewise.inputs,
      piecewise.outputs
    );
    drawFrameToCanvas(initialFrame * maxFrameIdx, true);
    applyProgressToDOM(smoothedProgressRef.current);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [piecewise, maxFrameIdx, drawFrameToCanvas, applyProgressToDOM, syncCanvasAndScrollMetrics]);

  // Touch & user interrupt tracking (optimized for mobile touch screens)
  const touchStartYRef = useRef<number | null>(null);
  const autoScrollStartTimeRef = useRef<number>(0);
  const unlockTriggeredRef = useRef(false);

  useEffect(() => {
    if (!isAutoScrolling) return;

    autoScrollStartTimeRef.current = Date.now();

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // 850ms grace window after auto-scroll activation so residual tap lifting doesn't pause
      if (Date.now() - autoScrollStartTimeRef.current < 850) {
        return;
      }
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('[data-autoscroll-toggle="true"]') ||
        target?.closest('button') ||
        target?.closest('a')
      ) {
        return;
      }
      if (e.touches && e.touches.length > 0 && touchStartYRef.current !== null) {
        const deltaY = Math.abs(e.touches[0].clientY - touchStartYRef.current);
        // Only pause if the user intentionally dragged/swiped by more than 22px
        if (deltaY > 22) {
          setIsAutoScrolling(false);
          touchStartYRef.current = null;
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-autoscroll-toggle="true"]')) return;
      if (Math.abs(e.deltaY) > 6) {
        setIsAutoScrolling(false);
      }
    };

    const handleKeyInterrupt = (e: KeyboardEvent) => {
      if ([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key)) {
        setIsAutoScrolling(false);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyInterrupt, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyInterrupt);
    };
  }, [isAutoScrolling]);

  // Ultra-smooth auto-scroll animation loop (works synchronously on all mobile browsers)
  useEffect(() => {
    if (isLocked || !isAutoScrolling) return;

    let animId = 0;
    let lastTime = performance.now();
    let accumulatedDistance = 0;

    const autoScrollLoop = (now: number) => {
      const dt = Math.min(64, Math.max(1, now - lastTime));
      lastTime = now;

      const el = containerRef.current;
      let inHold = false;
      let inFilm = true;
      let currentProgress = 0;

      if (el) {
        const rect = el.getBoundingClientRect();
        const totalFilmScroll = Math.max(1, el.offsetHeight - window.innerHeight);
        const scrolledFilm = Math.max(0, -rect.top);
        currentProgress = Math.min(1, Math.max(0, scrolledFilm / totalFilmScroll));

        if (scrolledFilm >= totalFilmScroll) {
          inFilm = false;
        } else {
          for (let i = 0; i < holdStacks.length; i++) {
            const hold = piecewise.windows[holdStacks[i].id];
            if (hold && currentProgress >= hold.start && currentProgress <= hold.end) {
              inHold = true;
              break;
            }
          }
        }
      }

      // Speeds in px per second:
      // In text hold scenes: ~88px/s (giving ~10-12s of easy reading for each event card)
      // In transition frames: ~165px/s (majestic, cinematic camera glide)
      // Below the film (details / itinerary / blessings): ~115px/s
      const speedPxPerSec = inHold ? 88 : inFilm ? 165 : 115;
      accumulatedDistance += (speedPxPerSec * dt) / 1000;

      if (accumulatedDistance >= 1) {
        const toMove = Math.floor(accumulatedDistance);
        accumulatedDistance -= toMove;

        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const currentY =
          window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        const nextY = Math.min(maxScroll, currentY + toMove);

        // Perform scroll on both window and documentElement for cross-platform mobile compatibility
        window.scrollTo(0, nextY);
        if (document.documentElement.scrollTop !== nextY) {
          document.documentElement.scrollTop = nextY;
        }

        // Direct canvas & DOM progress sync:
        // By calculating and drawing immediately in this loop, the film advances smoothly
        // at 60fps even if mobile WebKit/Android Chrome defers or throttles native scroll events!
        if (el) {
          const rect = el.getBoundingClientRect();
          const totalScrollable = Math.max(1, el.offsetHeight - window.innerHeight);
          const scrolled = Math.max(0, Math.min(totalScrollable, -rect.top));
          const directProgress = scrolled / totalScrollable;
          targetProgressRef.current = directProgress;
          smoothedProgressRef.current = directProgress;

          const normalizedFrame = interpolatePiecewise(
            directProgress,
            piecewise.inputs,
            piecewise.outputs
          );
          drawFrameToCanvas(normalizedFrame * maxFrameIdx);
          applyProgressToDOM(directProgress);
        }

        // Stop if reached the very bottom of the document
        if (nextY >= maxScroll - 6) {
          setIsAutoScrolling(false);
          return;
        }
      }

      animId = window.requestAnimationFrame(autoScrollLoop);
    };

    animId = window.requestAnimationFrame(autoScrollLoop);
    return () => {
      if (animId) window.cancelAnimationFrame(animId);
    };
  }, [
    isLocked,
    isAutoScrolling,
    holdStacks,
    piecewise,
    maxFrameIdx,
    drawFrameToCanvas,
    applyProgressToDOM,
  ]);

  const handleUnlockAndAutoScroll = useCallback(() => {
    if (unlockTriggeredRef.current) return;
    unlockTriggeredRef.current = true;
    onUnlock();
    // Start auto-scrolling with a gentle delay so the palace doors reveal smoothly first
    window.setTimeout(() => {
      setIsAutoScrolling(true);
    }, 550);
  }, [onUnlock]);

  const toggleAutoScroll = () => {
    if (isLocked) {
      handleUnlockAndAutoScroll();
      return;
    }
    setIsAutoScrolling((prev) => {
      const next = !prev;
      if (next) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= maxScroll - 40) {
          window.scrollTo(0, 0);
        }
      }
      return next;
    });
  };

  const handleOpenMapUrl = (rawUrl?: string, fallbackVenue?: string) => {
    if (rawUrl && !rawUrl.includes('[') && rawUrl.startsWith('http')) {
      window.open(rawUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const query = encodeURIComponent(
      fallbackVenue && !fallbackVenue.includes('[')
        ? fallbackVenue
        : 'Jay Maa Tara Anusthan Bhawan Sanghata Para Rampurhat Birbhum'
    );
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="relative w-full select-none bg-[#241316] no-print">
      {/* MAIN SCROLL-SCRUBBED FILM STAGE CONTAINER */}
      <div
        ref={containerRef}
        data-section-id="story"
        className="relative z-10 w-full select-none"
        style={{
          height: `${totalHeightVh}vh`,
        }}
      >
        <div className="sticky top-0 h-[100dvh] h-screen w-full overflow-hidden flex items-center justify-center touch-pan-y">
          <div className="relative w-full h-full overflow-hidden touch-pan-y">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full block touch-pan-y"
              style={{ willChange: 'contents', transform: 'translateZ(0)', touchAction: 'pan-y' }}
            />

            {!isInitialReady && (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1 rounded-full bg-black/65 border border-white/20 text-[10px] sm:text-[11px] tracking-widest uppercase text-white/85 whitespace-nowrap pointer-events-none">
                Loading Mampi &amp; Durgesh’s Wedding Film…
              </div>
            )}

            {/* HOLD TEXT STACKS OVERLAY (Driven directly via DOM refs for 0 React re-renders) */}
            {holdStacks.map((stack) => {
              const pos = isMobileViewport ? stack.positionMobile : stack.positionDesktop;

              return (
                <div
                  key={stack.id}
                  ref={(el) => {
                    stackElsRef.current[stack.id] = el;
                  }}
                  data-text-stack={stack.id}
                  className="absolute z-20 flex flex-col items-center text-center"
                  style={{
                    left: pos.left,
                    top: pos.top,
                    width: pos.width ?? (stack.blurBg ? (isMobileViewport ? '88%' : 'auto') : '50%'),
                    maxWidth: '92vw',
                    transform: 'translate3d(-50%, -50%, 0)',
                    opacity: 0,
                    visibility: 'hidden',
                    pointerEvents: 'none',
                    willChange: 'opacity',
                  }}
                >
                  {stack.blurBg && (
                    <div
                      className="absolute inset-0 -mx-8 -my-7 sm:-mx-24 sm:-my-16 rounded-2xl pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(ellipse at center, rgba(16, 4, 8, 0.86) 0%, rgba(16, 4, 8, 0.62) 38%, rgba(16, 4, 8, 0.2) 64%, rgba(16, 4, 8, 0) 82%)',
                      }}
                    />
                  )}

                  <div
                    className={`relative z-10 flex flex-col items-center text-center w-full ${
                      stack.blurBg ? 'px-4 py-4 sm:px-14 sm:py-10' : ''
                    }`}
                  >
                    {stack.lines.map((line) => {
                      const lineRefKey = `${stack.id}__${line.id}`;

                      if (line.type === 'map') {
                        return (
                          <div
                            key={line.id}
                            ref={(el) => {
                              lineElsRef.current[lineRefKey] = el;
                            }}
                            className="w-full flex justify-center"
                            style={{
                              opacity: 0,
                              transform: 'translate3d(0, 22px, 0)',
                              willChange: 'transform, opacity',
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
                                padding: '0.35em 0.95em',
                                lineHeight: 1,
                              }}
                              className="inline-flex items-center gap-1.5 hover:bg-white/15 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                            >
                              <span>{line.text || 'Location'}</span>
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
                          ref={(el) => {
                            lineElsRef.current[lineRefKey] = el;
                          }}
                          className="w-full"
                          style={{
                            opacity: 0,
                            transform: 'translate3d(0, 22px, 0)',
                            willChange: 'transform, opacity',
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
                                line.color === '#ffffff' || line.color === '#E7D6AD'
                                  ? '0 1px 10px rgba(0,0,0,0.55)'
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

            {/* OPENING "TAP TO OPEN" OVERLAY WITH SMOOTH GPU FADE TRANSITION */}
            <div
              className={`fixed inset-0 z-40 flex flex-col items-center justify-between py-8 sm:py-12 px-4 transition-all duration-700 ease-out ${
                isLocked
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-3 pointer-events-none'
              }`}
              style={{ willChange: 'opacity, transform' }}
            >
              <div
                className="mt-2 max-w-[92vw] text-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-black/55 border border-white/15"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.75)' }}
              >
                <p className="font-devanagari text-[11px] sm:text-sm text-[#E7D6AD] tracking-widest">
                  {config.sanskritInvocation}
                </p>
                <h1 className="font-display text-2xl sm:text-4xl text-white font-semibold tracking-wider mt-0.5 sm:mt-1">
                  {config.brideName}{' '}
                  <span className="italic font-normal text-[#E7D6AD]">weds</span>{' '}
                  {config.groomName}
                </h1>
                <p className="text-[10px] sm:text-sm tracking-[0.16em] sm:tracking-[0.2em] uppercase text-[#E7D6AD]/90 mt-1">
                  24.11.2026 · {config.venueName}, {config.city}
                </p>
              </div>

              <button
                type="button"
                onClick={handleUnlockAndAutoScroll}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUnlockAndAutoScroll();
                }}
                data-rec="gate-open"
                className="mb-[5vh] sm:mb-[6vh] cursor-pointer focus:outline-none touch-manipulation select-none pointer-events-auto"
                aria-label="Tap to Open Mampi Weds Durgesh Wedding Invitation"
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY_MAP.marcellus,
                    fontSize: 'clamp(13px, 3.6vw, 18px)',
                  }}
                  className="inline-block rounded-full border border-white/50 bg-[#b8935a] px-6 sm:px-8 py-3 sm:py-3.5 uppercase tracking-[0.16em] sm:tracking-[0.18em] text-white shadow-lg hover:bg-[#c6a15b] transition-transform duration-300 active:scale-95 whitespace-nowrap shrink-0"
                >
                  Tap to Open Invitation
                </span>
              </button>
            </div>

            {/* RADIAL "SCROLL ↓" HINT CUE */}
            {!isLocked && (
              <div
                ref={scrollHintElRef}
                className="pointer-events-none fixed inset-x-0 bottom-[6vh] z-[65] flex justify-center transition-opacity duration-500"
                style={{ opacity: 1, willChange: 'opacity' }}
              >
                <div
                  className="relative flex flex-row items-center gap-2 px-10 py-5 text-white/95"
                  style={{ textShadow: '0 1px 8px rgba(0,0,0,0.65)' }}
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'radial-gradient(ellipse at center, rgba(16, 4, 8, 0.82) 0%, rgba(16, 4, 8, 0.45) 48%, rgba(16, 4, 8, 0) 76%)',
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

      {/* FLOATING ROYAL CONTROLS DOCK (MUSIC & AUTO-SCROLL) */}
      <div
        className="fixed z-[70] flex items-center gap-2.5 select-none touch-manipulation"
        style={{
          bottom: 'max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))',
          left: 'max(1rem, env(safe-area-inset-left, 0px))',
        }}
      >
        {/* MUSIC TOGGLE BUTTON */}
        <button
          type="button"
          onClick={onToggleMusic}
          className="w-10 h-10 rounded-full bg-[#2A0812]/90 border border-[#C6A15B]/70 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform duration-200 active:scale-90 cursor-pointer hover:border-[#E7D6AD] touch-manipulation"
          aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
          title={isMusicPlaying ? 'Mute Music' : 'Play Music'}
        >
          <svg
            className="w-4 h-4"
            fill="#E7D6AD"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20.5 2.2a1 1 0 0 0-.83-.2l-11 2A1 1 0 0 0 8 5v9.4A3.6 3.6 0 0 0 6.5 14C4.57 14 3 15.35 3 17s1.57 3 3.5 3S10 18.65 10 17V7.34l9-1.64V12.4a3.6 3.6 0 0 0-1.5-.4c-1.93 0-3.5 1.35-3.5 3s1.57 3 3.5 3 3.5-1.35 3.5-3V3a1 1 0 0 0-.5-.8Z" />
            {!isMusicPlaying && (
              <path
                d="M2.1 2.8 20.9 22.1 22.4 20.7 3.6 1.4z"
                stroke="#E7D6AD"
                strokeWidth="1"
              />
            )}
          </svg>
        </button>

        {/* AUTO-SCROLL TOGGLE PILL */}
        <button
          type="button"
          data-autoscroll-toggle="true"
          onClick={toggleAutoScroll}
          className={`h-10 px-3.5 rounded-full backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-1.5 transition-all duration-300 active:scale-95 cursor-pointer border touch-manipulation ${
            isAutoScrolling
              ? 'bg-[#C6A15B] text-[#2A0812] border-[#F8F0E3] shadow-[0_0_18px_rgba(198,161,91,0.6)] font-semibold'
              : 'bg-[#2A0812]/90 text-[#E7D6AD] border-[#C6A15B]/70 hover:border-[#E7D6AD]'
          }`}
          aria-label={isAutoScrolling ? 'Pause Auto Scroll' : 'Start Auto Scroll'}
          title={isAutoScrolling ? 'Pause Auto Scroll' : 'Start Auto Scroll'}
        >
          {isAutoScrolling ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span className="text-[11px] tracking-wider uppercase font-sans">
                Pause
              </span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              <span className="text-[11px] tracking-wider uppercase font-sans">
                Auto Scroll
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
