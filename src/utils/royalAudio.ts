/**
 * Sacred Mangalam & Royal Indian Wedding Audio Engine
 * Plays the official Sacred Mangalam soundtrack (https://cdn.akhyankriti.com/web-invites/templates/sacred-mangalam/audio/music.f06c723ae353.mp3)
 * and automatically falls back to Web Audio API Raag Yaman synthesis if offline.
 */

const SACRED_MANGALAM_AUDIO_URL =
  'https://cdn.akhyankriti.com/web-invites/templates/sacred-mangalam/audio/music.f06c723ae353.mp3';

class RoyalAudioEngine {
  private audioEl: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private isPlayingAmbient = false;
  private ambientIntervalId: number | null = null;
  private droneGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  private listenersAttached = false;

  private ensureAudioElement(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioEl) {
      const audio = new Audio(SACRED_MANGALAM_AUDIO_URL);
      audio.loop = true;
      audio.preload = 'none';
      audio.volume = 0.75;
      audio.addEventListener('ended', () => {
        if (this.isPlayingAmbient && this.audioEl) {
          this.audioEl.currentTime = 0;
          this.audioEl.play().catch(() => {});
        }
      });
      this.audioEl = audio;
    }

    if (!this.listenersAttached) {
      this.listenersAttached = true;
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.audioEl?.pause();
        } else if (this.isPlayingAmbient) {
          this.audioEl?.play().catch(() => {});
        }
      });
    }

    return this.audioEl;
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playPalaceGateChime(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const partials = [
      { freq: 528, gain: 0.1, duration: 3.0 },
      { freq: 792, gain: 0.07, duration: 2.5 },
      { freq: 1056, gain: 0.04, duration: 2.0 },
      { freq: 660, gain: 0.05, duration: 2.8 },
    ];

    partials.forEach((p, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(p.freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.0001, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(p.gain, now + idx * 0.05 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + p.duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + p.duration + 0.05);
    });
  }

  public startAmbientMusic(): boolean {
    if (this.isPlayingAmbient) return true;
    this.isPlayingAmbient = true;

    const audio = this.ensureAudioElement();
    if (audio) {
      audio.loop = true;
      audio.play().catch(() => {
        // Fallback to Web Audio synthesizer if external MP3 fails
        this.startSynthesizedFallback();
      });
      return true;
    }

    return this.startSynthesizedFallback();
  }

  private startSynthesizedFallback(): boolean {
    const ctx = this.ensureContext();
    if (!ctx) return false;

    const now = ctx.currentTime;
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.001, now);
    droneGain.gain.linearRampToValueAtTime(0.03, now + 1.2);
    droneGain.connect(ctx.destination);
    this.droneGain = droneGain;

    const droneFreqs = [130.81, 196.0, 261.63];
    this.droneOscs = droneFreqs.map((freq, index) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      osc.type = index === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, now);
      osc.connect(filter);
      filter.connect(droneGain);
      osc.start(now);
      return osc;
    });

    const raagYamanNotes = [261.63, 293.66, 329.63, 369.99, 392.0, 440.0, 493.88, 523.25];
    let step = 0;
    const melodyPattern = [0, 2, 4, 3, 4, 6, 7, 5, 4, 2, 1, 0];

    const playPluck = () => {
      if (!this.isPlayingAmbient || !this.ctx) return;
      const t = this.ctx.currentTime;
      const noteFreq = raagYamanNotes[melodyPattern[step % melodyPattern.length]];
      step++;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, t);
      noteGain.gain.setValueAtTime(0.0001, t);
      noteGain.gain.linearRampToValueAtTime(0.035, t + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.3);
      osc.connect(noteGain);
      noteGain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 2.4);
    };

    playPluck();
    this.ambientIntervalId = window.setInterval(playPluck, 1900);
    return true;
  }

  public stopAmbientMusic(): void {
    this.isPlayingAmbient = false;
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (this.ambientIntervalId !== null) {
      window.clearInterval(this.ambientIntervalId);
      this.ambientIntervalId = null;
    }
    if (this.ctx && this.droneGain) {
      const now = this.ctx.currentTime;
      try {
        this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
        this.droneGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
      } catch {
        // ignore
      }
    }
    setTimeout(() => {
      this.droneOscs.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.droneOscs = [];
    }, 350);
  }

  public toggleAmbientMusic(): boolean {
    if (this.isPlayingAmbient) {
      this.stopAmbientMusic();
      return false;
    } else {
      return this.startAmbientMusic();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlayingAmbient;
  }
}

export const royalAudio = new RoyalAudioEngine();
