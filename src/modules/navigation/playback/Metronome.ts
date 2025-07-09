import AudioSource from "@/lib/AudioSource";
import { getAudioAsset } from "@/utils";

export type MetronomeTick = {
    time: number;
    beat: number;
    bar: number;
    isDownbeat: boolean;
    tick: () => void;
};

export default class Metronome {
    private channel: AudioSource;
    private lastTick: number = -1;
    private countdownInterval: NodeJS.Timeout | null = null;

    constructor(channel: AudioSource, context: AudioContext) {
        const sub = channel.addSubChannel(
            new AudioSource(
                "metronome-tick",
                context,
                "Metronome tick sound",
                channel,
            ),
        );

        this.channel = sub;
    }

    getCountsForTime(time: number, bpm: number): number {
        const secondsPerBeat = 60 / bpm;
        return Math.floor(time / secondsPerBeat);
    }

    // Generate tick schedule for a given time range
    generateTickSchedule(
        startTime: number,
        endTime: number,
        bpm: number,
        timeSignature: [number, number] = [4, 4],
    ): MetronomeTick[] {
        const ticks: MetronomeTick[] = [];
        const [beatsPerBar, noteValue] = timeSignature;

        // Calculate beat duration in milliseconds
        const beatDuration = (60 / bpm) * 1000;

        // Find the first beat at or after startTime
        const firstBeatTime =
            Math.ceil(startTime / beatDuration) * beatDuration;

        // Generate ticks from first beat to end time
        for (let time = firstBeatTime; time <= endTime; time += beatDuration) {
            const totalBeats = Math.floor(time / beatDuration);
            const beat = (totalBeats % beatsPerBar) + 1;
            const bar = Math.floor(totalBeats / beatsPerBar) + 1;
            const isDownbeat = beat === 1;

            ticks.push({
                time,
                beat,
                bar,
                isDownbeat,
                tick: () => this.playTick(isDownbeat),
            });
        }

        return ticks;
    }

    // Get next tick for a given time
    getNextTick(
        currentTime: number,
        bpm: number,
        timeSignature: [number, number] = [4, 4],
    ): MetronomeTick | null {
        const ticks = this.generateTickSchedule(
            currentTime,
            currentTime + (60 / bpm) * 1000, // Look ahead one beat
            bpm,
            timeSignature,
        );

        return ticks.length > 0 ? ticks[0] : null;
    }

    // Get all ticks within a time window
    getTicksInRange(
        startTime: number,
        endTime: number,
        bpm: number,
        timeSignature: [number, number] = [4, 4],
    ): MetronomeTick[] {
        return this.generateTickSchedule(
            startTime,
            endTime,
            bpm,
            timeSignature,
        );
    }

    // Check if a tick should occur at the current time
    shouldTick(
        currentTime: number,
        bpm: number,
        tolerance: number = 50, // ms tolerance
        timeSignature: [number, number] = [4, 4],
    ): MetronomeTick | null {
        const beatDuration = (60 / bpm) * 1000;
        const nearestBeatTime =
            Math.round(currentTime / beatDuration) * beatDuration;

        // Check if we're within tolerance of a beat
        if (Math.abs(currentTime - nearestBeatTime) <= tolerance) {
            const totalBeats = Math.floor(nearestBeatTime / beatDuration);
            const beat = (totalBeats % timeSignature[0]) + 1;
            const bar = Math.floor(totalBeats / timeSignature[0]) + 1;
            const isDownbeat = beat === 1;

            // Avoid double-triggering the same beat
            if (nearestBeatTime !== this.lastTick) {
                this.lastTick = nearestBeatTime;

                return {
                    time: nearestBeatTime,
                    beat,
                    bar,
                    isDownbeat,
                    tick: () => this.playTick(isDownbeat),
                };
            }
        }

        return null;
    }

    private playTick(isDownbeat: boolean = false): void {
        if (this.channel.isLoaded) {
            // Could use different sounds for downbeat vs regular beat
            this.channel.play();
        }
    }

    public async preloadTickSound(): Promise<void> {
        const sound = await getAudioAsset(
            "/cc-simple-daw/assets/sounds/metronome-tick.wav",
        );

        if (!sound) {
            throw new Error("Metronome sound not found");
        }

        await this.channel.load(sound).catch((err) => {
            console.error("Failed to load metronome sound:", err);
        });
    }

    // Reset the metronome state
    reset(): void {
        this.lastTick = -1;
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }
}
