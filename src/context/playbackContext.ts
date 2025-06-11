import AudioSource from "@/lib/AudioSource";
import Scheduler from "@/lib/Scheduler";
import VSTRegistry from "@/lib/VSTRegistry";
import { ContextProvider, createContext } from "@lit/context";
import type { LitElement } from "lit";

export const playbackContext = createContext<PlaybackContextStore>(
    Symbol("playbackContext"),
);

export enum TimeEventChange {
    Rewinded,
    Forwarded,
    SeekStart,
    SeekEnd,
    Natural,
}

export type TimeChangeEvent = {
    type?: TimeEventChange;
    value: number;
};

export class PlaybackContextStore {
    // This sources are only exposed to the root of the context
    // so the UI parts can subscribe to changes
    // All tracks belong to the master AudioSource,
    // and can be accessed via playbackContext.master.subChannels aswell
    // So every time you add a track, you should also add it to the master AudioSource
    // via master.addSubChannel(track);
    sources: AudioSource[] = [];
    audioContext: AudioContext;
    isPlaying = false;
    isRecording = false;
    isLooping = false;
    bpm = 120;
    master: AudioSource;
    preview: AudioSource;
    timeSignature: [number, number] = [4, 4];
    currentTime: number = 0;
    scheduler: Scheduler;
    vstRegistry: VSTRegistry = new VSTRegistry();
    lastTimeEventChange?: TimeEventChange = undefined;

    constructor() {
        this.audioContext = new AudioContext();

        this.master = new AudioSource(
            "master",
            this.audioContext,
            "Master",
            undefined,
            true,
        );

        this.preview = new AudioSource(
            "preview",
            this.audioContext,
            "Preview",
            this.master,
            true,
        );

        this.scheduler = new Scheduler(this);
    }
}

export function attachPlaybackContextEvents(
    host: LitElement,
    ctx: ContextProvider<typeof playbackContext>,
): void {
    host.addEventListener("playback-context/bpm", (event: Event) => {
        ctx.setValue({
            ...ctx.value,
            lastTimeEventChange: TimeEventChange.Natural,
            bpm: (event as CustomEvent<number>).detail,
        });
    });

    host.addEventListener("playback-context/play", () => {
        ctx.setValue({
            ...ctx.value,
            isPlaying: true,
        });
    });

    host.addEventListener("playback-context/stop", () => {
        ctx.setValue({
            ...ctx.value,
            isPlaying: false,
        });
    });

    host.addEventListener("playback-context/record", () => {
        ctx.setValue({
            ...ctx.value,
            isRecording: !ctx.value.isRecording,
        });
    });

    host.addEventListener("playback-context/stop-recording", () => {
        ctx.setValue({
            ...ctx.value,
            isRecording: false,
        });
    });

    host.addEventListener("playback-context/toggle-loop", () => {
        ctx.setValue({
            ...ctx.value,
            isLooping: !ctx.value.isLooping,
        });
    });

    host.addEventListener("playback-context/toggle-is-playing", () => {
        ctx.setValue({
            ...ctx.value,
            isPlaying: !ctx.value.isPlaying,
        });
    });

    host.addEventListener(
        "playback-context/set-time-signature",
        (event: Event) => {
            const [numerator, denominator] = (
                event as CustomEvent<[number, number]>
            ).detail;
            ctx.setValue({
                ...ctx.value,
                timeSignature: [numerator, denominator],
            });
        },
    );

    host.addEventListener(
        "playback-context/set-current-time",
        (event: Event) => {
            const { type = TimeEventChange.Natural, value } = (
                event as CustomEvent<TimeChangeEvent>
            ).detail;

            if (type === TimeEventChange.SeekStart) {
                return;
            }

            ctx.setValue({
                ...ctx.value,
                currentTime: value,
                lastTimeEventChange: type,
            });
        },
    );

    host.addEventListener("playback-context/add-channel", (event: Event) => {
        const source = (event as CustomEvent<AudioSource[]>).detail;

        if (ctx.value.sources.some((s) => s.id === source[0].id)) {
            console.warn(
                `AudioSource with id ${source[0].id} already exists in playback context.`,
            );
        }

        ctx.setValue({
            ...ctx.value,
            sources: [...ctx.value.sources, ...source],
        });
    });
}
