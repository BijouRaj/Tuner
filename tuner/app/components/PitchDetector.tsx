"use client";

import { useEffect, useRef } from "react";
import { frequencyToNoteNumber, noteNumberToName, centsOffFromPitch } from "../utils/pitchUtils";

interface PitchData {
  frequency: number;
  note: string;
  cents: number;
}

export default function PitchDetector({
  onPitchDetected,
  onAnalyserReady,
}: {
  onPitchDetected: (data: PitchData) => void;
  onAnalyserReady?: (analyser: AnalyserNode) => void;
}) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bufferRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    async function init() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);
      bufferRef.current = new Float32Array(analyserRef.current.fftSize);

      if (onAnalyserReady && analyserRef.current) {
        onAnalyserReady(analyserRef.current);
      }

      detectPitch();
    }
    init();

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  function detectPitch() {
    if (!analyserRef.current || !bufferRef.current) return;

    analyserRef.current.getFloatTimeDomainData(bufferRef.current);
    const frequency = autoCorrelate(bufferRef.current, audioContextRef.current!.sampleRate);

    if (frequency !== -1) {
      const noteNumber = frequencyToNoteNumber(frequency);
      const note = noteNumberToName(noteNumber);
      const cents = centsOffFromPitch(frequency, noteNumber);
      onPitchDetected({ frequency, note, cents });
    }

    requestAnimationFrame(detectPitch);
  }

  // Autocorrelation algorithm
  function autoCorrelate(buf: Float32Array, sampleRate: number): number {
    let SIZE = buf.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      rms += buf[i] * buf[i];
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1; // too quiet

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }
    }

    buf = buf.slice(r1, r2);
    SIZE = buf.length;

    let c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE - i; j++) {
        c[i] = c[i] + buf[j] * buf[j + i];
      }
    }

    let d = 0; while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    return sampleRate / T0;
  }

  return null;
}
