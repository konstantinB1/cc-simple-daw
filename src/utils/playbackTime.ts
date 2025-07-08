import type { PlaybackTime } from "@/types";

export type ConfvertOptions = {
    bpm: number;
};

export function convertCurrentTime(
    time: PlaybackTime,
    options: ConfvertOptions,
): PlaybackTime {
    // Convert time from seconds to beats
    const secondsPerBeat = 60 / options.bpm;
    return time / secondsPerBeat;
}
