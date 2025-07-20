import { DEFAULT_ZOOM_LEVEL, zooms } from "./canvasConstants";

class ZoomStateEntry {
    readonly level: number;
    readonly x: number;
    readonly index: number;

    constructor(level: number, x: number, index: number) {
        this.level = level;
        this.x = x;
        this.index = index;
    }
}

const ZOOM_HISTORY_MAX_LEN = 5;

export default class ZoomState {
    private index = zooms.indexOf(DEFAULT_ZOOM_LEVEL);

    x: number = -1;

    entries: ZoomStateEntry[] = [
        new ZoomStateEntry(DEFAULT_ZOOM_LEVEL, -1, -1),
    ];

    get current(): ZoomStateEntry {
        return this.entries?.[0];
    }

    private addToHistory() {
        const entry = new ZoomStateEntry(
            zooms[this.index],
            this.x ?? -1,
            this.index,
        );

        if (this.entries.length === ZOOM_HISTORY_MAX_LEN) {
            this.entries = this.entries.slice(0, -1);
        }

        this.entries.unshift(entry);
    }

    next() {
        if (this.index >= zooms.length - 1) {
            return;
        }

        this.index = this.index + 1;
        this.addToHistory();
    }

    prev() {
        if (this.index <= 0) {
            return;
        }

        this.index = this.index - 1;
        this.addToHistory();
    }
}
