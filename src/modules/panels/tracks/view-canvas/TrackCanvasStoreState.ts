import { store } from "@/store/AppStore";
import Watcher from "@/store/Watcher";

export default class TrackCanvasStoreState {
    currentTime: number;
    bpm: number;

    private watchers: Watcher<any>[] = [];

    constructor() {
        const state = store.getState();

        this.currentTime = state.playback.currentTime;
        this.bpm = state.playback.bpm;

        const watchCurrentTime = new Watcher<number>(
            store,
            "playback.currentTime",
            this.onCurrentTimeChange.bind(this),
        );

        const watchBpm = new Watcher<number>(
            store,
            "playback.bpm",
            (newBpm) => {
                this.bpm = newBpm;
            },
        );

        this.watchers.push(watchCurrentTime, watchBpm);
    }

    dispose(): void {
        this.watchers.forEach((watcher) => watcher.unwatch());
    }

    protected onCurrentTimeChange(newTime: number): void {
        this.currentTime = newTime;
    }

    protected onBpmChange(newBpm: number): void {
        this.bpm = newBpm;
    }
}
