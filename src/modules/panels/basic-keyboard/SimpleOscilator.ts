import type AudioSource from "@/lib/AudioSource";

export default class SimpleOscillator {
    private ctx: AudioContext;
    private master: AudioSource;
    private activeOscillators: Map<string, OscillatorNode> = new Map();
    private analyser: AnalyserNode;
    private frequencyData: Uint8Array;
    private timeData: Uint8Array;

    constructor(ctx: AudioContext, master: AudioSource) {
        this.ctx = ctx;
        this.master = master;

        // Create analyser node
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;

        // Connect analyser between oscillators and master
        this.analyser.connect(this.master.getGainNode);

        // Initialize data arrays
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        this.timeData = new Uint8Array(this.analyser.fftSize);
    }

    startNote(
        note: string,
        octave: number = 4,
        type: OscillatorType = "sine",
    ): void {
        const noteKey = `${note}${octave}`;

        this.stopNote(note, octave);

        const noteFrequency = this.getFrequency(note, octave);
        const oscillator = new OscillatorNode(this.ctx, {
            type,
            frequency: noteFrequency,
        });

        // Connect oscillator to analyser instead of directly to master
        oscillator.connect(this.analyser);
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

    getGraphicalRepresentation(): string {
        // Update frequency and time domain data
        this.analyser.getByteFrequencyData(this.frequencyData);
        this.analyser.getByteTimeDomainData(this.timeData);

        // Create a simple ASCII representation of the waveform
        let representation = "";
        const sampleStep = Math.floor(this.timeData.length / 50); // Sample 50 points

        for (let i = 0; i < 50; i++) {
            const amplitude = this.timeData[i * sampleStep];
            const normalized = Math.floor(((amplitude - 128) / 128) * 10) + 10;
            const barHeight = Math.max(0, Math.min(20, normalized));

            if (i % 10 === 0) representation += "\n";
            representation += "█".repeat(Math.floor(barHeight / 2)) || "▁";
        }

        return representation;
    }

    getFrequencyData(): Uint8Array {
        this.analyser.getByteFrequencyData(this.frequencyData);
        return this.frequencyData;
    }

    getTimeData(): Uint8Array {
        this.analyser.getByteTimeDomainData(this.timeData);
        return this.timeData;
    }

    getAnalyserNode(): AnalyserNode {
        return this.analyser;
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
