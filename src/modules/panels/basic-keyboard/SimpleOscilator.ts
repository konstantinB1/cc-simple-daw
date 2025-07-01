import type AudioSource from "@/lib/AudioSource";

export default class SimpleOscillator {
    private ctx: AudioContext;
    private master: AudioSource;
    private activeOscillators: Map<string, OscillatorNode> = new Map();

    constructor(ctx: AudioContext, master: AudioSource) {
        this.ctx = ctx;
        this.master = master;
    }

    startNote(note: string, octave: number = 4): void {
        const noteKey = `${note}${octave}`;

        this.stopNote(note, octave);

        const noteFrequency = this.getFrequency(note, octave);
        const oscillator = new OscillatorNode(this.ctx, {
            type: "sine",
            frequency: noteFrequency,
        });

        oscillator.connect(this.master.getGainNode);
        oscillator.start(this.ctx.currentTime);

        this.activeOscillators.set(noteKey, oscillator);
    }

    stopNote(note: string, octave: number = 4): void {
        const noteKey = `${note}${octave}`;
        const oscillator = this.activeOscillators.get(noteKey);

        if (oscillator) {
            oscillator.stop(this.ctx.currentTime);
            this.activeOscillators.delete(noteKey);
        }
    }

    stopAllNotes(): void {
        for (const [_, oscillator] of this.activeOscillators) {
            oscillator.stop(this.ctx.currentTime);
        }

        this.activeOscillators.clear();
    }

    // Legacy method for backwards compatibility
    playNoteAtOctave(note: string, octave: number = 4, duration: number = 0.5) {
        this.startNote(note, octave);
        setTimeout(() => {
            this.stopNote(note, octave);
        }, duration * 1000);
    }

    private getFrequency(note: string, octave: number): number {
        const noteFrequencies: { [key: string]: number } = {
            C: 261.63,
            "C#": 277.18,
            D: 293.66,
            "D#": 311.13,
            E: 329.63,
            F: 349.23,
            "F#": 369.99,
            G: 392.0,
            "G#": 415.3,
            A: 440.0,
            "A#": 466.16,
            B: 493.88,
        };

        const baseFrequency = noteFrequencies[note];
        if (!baseFrequency) {
            throw new Error(`Invalid note: ${note}`);
        }

        return baseFrequency * Math.pow(2, octave - 4);
    }
}
