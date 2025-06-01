import { createContext } from "@lit/context";
import type { PlaybackContextStore } from "./playbackContext";
import type { BaseControls } from "@/modules/controls/BaseControls";

export const appManagerContext = createContext<PlaybackContextStore>(
    Symbol("appManagerContext"),
);

export class AppManagerContextStore {
    controls: BaseControls;

    constructor(controls: BaseControls) {
        this.controls = controls;
    }
}
