import { StopWatch } from "@/utils/TimeUtils";
import Store from "./Store";
import Scheduler from "@/lib/Scheduler";
import AudioSource from "@/lib/AudioSource";

export type PlaybackState = {
    isPlaying: boolean; // Indicates if playback is currently active
    isRecording: boolean; // Indicates if recording is currently active
    bpm: number; // Beats per minute for the playback
    currentTime: number; // Current playback time in milliseconds
    timeEventChange?: TimeEventChange; // Optional time event change
    channels: AudioSource[]; // List of audio sources (channels) in the playback
};

export type ConfigState = {
    persistPlaybackData?: boolean; // Optional flag to persist playback data
};

type InitialState = {
    playback: PlaybackState; // Optional playback state
    config: ConfigState; // Optional configuration state
};

export enum TimeEventChange {
    Rewinded,
    Forwarded,
    SeekStart,
    SeekEnd,
    Natural,
}

const initialState: InitialState = {
    playback: {
        isPlaying: false,
        isRecording: false,
        bpm: 120,
        currentTime: 0,
        timeEventChange: undefined, // Optional time event change
        channels: [],
    },
    config: {
        persistPlaybackData: true,
    },
};

class AppStore extends Store<InitialState> {
    protected override state: InitialState = initialState;

    private stopWatch: StopWatch = new StopWatch();

    private audioContext: AudioContext = new AudioContext();

    scheduler: Scheduler = new Scheduler(this);
    master: AudioSource; // Master audio source
    preview: AudioSource; // Preview audio source

    constructor() {
        super(initialState);

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
    }

    get ctx(): AudioContext {
        return this.audioContext;
    }

    rewind(): void {
        this.stopWatch.reset();
        const isPlaying = this.state.playback.isPlaying;

        this.setState((state) => {
            state.playback.currentTime = 0;
            state.playback.timeEventChange = TimeEventChange.Rewinded;

            if (state.playback.isPlaying) {
                state.playback.isPlaying = false;
            }
        });

        if (isPlaying) {
            this.startPlayback();
        }
    }

    startPlayback(onTick?: (currentTime: number) => void): void {
        const currentTime = this.state.playback.currentTime;

        this.stopWatch.start(() => {
            const time = this.stopWatch.getElapsedTime();
            this.setState((state) => {
                state.playback.currentTime = time;
                state.playback.timeEventChange = TimeEventChange.Natural;

                if (!state.playback.isPlaying) {
                    state.playback.isPlaying = true;
                }
            });

            this.scheduler.startFrom(time);
            onTick?.(time);
        }, currentTime);
    }

    stopPlayback(): void {
        this.stopWatch.stop();

        this.setState((state) => {
            state.playback.isPlaying = false;
            state.playback.timeEventChange = undefined;
        });

        this.scheduler.stop();
    }

    toggleRecording(): void {
        this.setState((state) => {
            state.playback.isRecording = !state.playback.isRecording;
        });
    }

    addChannel(channel: AudioSource, master?: AudioSource): void {
        master?.addSubChannel(channel);

        this.setState((state) => {
            state.playback.channels.push(channel);
        });
    }

    addChannels(channels: AudioSource[], master?: AudioSource): void {
        channels.forEach((channel) => {
            master?.addSubChannel(channel);
        });

        this.setState((state) => {
            state.playback.channels = channels;
        });
    }
}

export const store = new AppStore();
