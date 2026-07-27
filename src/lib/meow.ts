let audioContext: AudioContext | null = null;

/**
 * 用 WebAudio 现场合成一声卡通"喵"：两段频率滑音 + 快速衰减。
 * 这样不用往仓库里塞音频文件，也不会有自动播放策略的麻烦（只在点击后调用）。
 */
export function playMeow(): void {
  if (typeof window === "undefined") return;
  audioContext ??= new AudioContext();
  const ctx = audioContext;
  void ctx.resume();

  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(520, now);
  oscillator.frequency.linearRampToValueAtTime(880, now + 0.12);
  oscillator.frequency.linearRampToValueAtTime(420, now + 0.42);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1800, now);

  oscillator.connect(filter).connect(gain).connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.52);
}
