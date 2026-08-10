import type { VolumeState } from '../background';

let audioContext: AudioContext | null = null;
let stream: MediaStream | null = null;
let gainNode: GainNode | null = null;
let bassFilter: BiquadFilterNode | null = null;
let stereoPanner: StereoPannerNode | null = null;
let monoSplitter: ChannelSplitterNode | null = null;
let monoMergerActive = false;

function applySettings(settings: VolumeState): void {
  if (!audioContext || !gainNode || !bassFilter || !stereoPanner) return;
  gainNode.gain.value = settings.gain / 100;
  bassFilter.gain.value = (settings.bassBoost / 100) * 15;
  stereoPanner.pan.value = settings.balance / 100;

  if (settings.mono !== monoMergerActive) {
    rebuildMonoStage(settings);
  }
}

function rebuildMonoStage(settings: VolumeState): void {
  if (!audioContext || !bassFilter || !stereoPanner) return;
  bassFilter.disconnect();
  monoSplitter?.disconnect();
  monoMergerActive = settings.mono;

  if (settings.mono) {
    monoSplitter = audioContext.createChannelSplitter(2);
    const merger = audioContext.createChannelMerger(2);
    const gainL = audioContext.createGain();
    const gainR = audioContext.createGain();
    gainL.gain.value = 0.5;
    gainR.gain.value = 0.5;

    bassFilter.connect(monoSplitter);
    monoSplitter.connect(gainL, 0);
    monoSplitter.connect(gainR, 1);
    gainL.connect(merger, 0, 0);
    gainL.connect(merger, 0, 1);
    gainR.connect(merger, 0, 0);
    gainR.connect(merger, 0, 1);
    merger.connect(stereoPanner);
  } else {
    monoSplitter = null;
    bassFilter.connect(stereoPanner);
  }
}

async function start(streamId: string, settings: VolumeState): Promise<void> {
  await stop();

  stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      mandatory: {
        chromeMediaSource: 'tab',
        chromeMediaSourceId: streamId,
      },
    } as unknown as MediaTrackConstraints,
    video: false,
  });

  audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  gainNode = audioContext.createGain();
  bassFilter = audioContext.createBiquadFilter();
  bassFilter.type = 'lowshelf';
  bassFilter.frequency.value = 200;
  stereoPanner = audioContext.createStereoPanner();

  source.connect(gainNode);
  gainNode.connect(bassFilter);
  bassFilter.connect(stereoPanner);
  stereoPanner.connect(audioContext.destination);
  monoMergerActive = false;

  applySettings(settings);
}

async function stop(): Promise<void> {
  stream?.getTracks().forEach((track) => track.stop());
  if (audioContext) {
    await audioContext.close().catch(() => {});
  }
  audioContext = null;
  stream = null;
  gainNode = null;
  bassFilter = null;
  stereoPanner = null;
  monoSplitter = null;
  monoMergerActive = false;
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === 'OFFSCREEN_START') {
    start(message.streamId, message.settings).catch((err) => console.error('Qeloma Volume: failed to start', err));
  } else if (message?.type === 'OFFSCREEN_UPDATE') {
    applySettings(message.settings);
  } else if (message?.type === 'OFFSCREEN_STOP') {
    stop();
  }
});
