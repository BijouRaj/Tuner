// utils/pitchUtils.ts

const noteStrings = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B"
];

// Get closest note number from frequency
export function frequencyToNoteNumber(frequency: number): number {
  return Math.round(12 * (Math.log2(frequency / 440)) + 69); // A4 = 440Hz
}

// Convert note number to note name
export function noteNumberToName(note: number): string {
  return noteStrings[note % 12] + Math.floor(note / 12 - 1);
}

// Calculate how many cents away from the true pitch
export function centsOffFromPitch(frequency: number, note: number): number {
  return Math.floor(1200 * Math.log2(frequency / noteNumberToFrequency(note)));
}

// Convert note number back to frequency
export function noteNumberToFrequency(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}
