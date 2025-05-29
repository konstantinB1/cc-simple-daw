import MasterAudio from "@/lib/audio/MasterAudio";
import { ContextProvider, createContext } from "@lit/context";
import type { LitElement } from "lit";

export const playbackContext = createContext<PlaybackContextStore>(
    Symbol("playbackContext"),
);

export class PlaybackContextStore {
    isPlaying = false;
    isRecording = false;
    isLooping = false;
    bpm = 120;
    master: MasterAudio = new MasterAudio();
    timeSignature: [number, number] = [4, 4];
    currentTime: number = 0;
}

export function attachPlaybackContextEvents(
    host: LitElement,
    ctx: ContextProvider<typeof playbackContext>,
): void {
    host.addEventListener("playback-context/bpm", (event: Event) => {
        ctx.setValue({
            ...ctx.value,
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
            ctx.setValue({
                ...ctx.value,
                currentTime: (event as CustomEvent<number>).detail,
            });
        },
    );
}
