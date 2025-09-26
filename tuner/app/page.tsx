"use client";

import { useState } from "react";
import PitchDetector from "./components/PitchDetector";
import NoteDisplay from "./components/NoteDisplay";
import Waveform from "./components/Waveform";
import Needle from "./components/Needle";

export default function Home() {
  const [pitchData, setPitchData] = useState<{ frequency: number; note: string; cents: number } | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎵 Tuner</h1>

      <PitchDetector
        onPitchDetected={setPitchData}
        onAnalyserReady={setAnalyser}
      />

      {pitchData && (
        <>
          <NoteDisplay
            frequency={pitchData.frequency}
            note={pitchData.note}
            cents={pitchData.cents}
          />
          <Needle cents={pitchData.cents} />
        </>
      )}

      <div style={{ marginTop: "2rem" }}>
        <Waveform analyser={analyser} />
      </div>
    </main>
  );
}
