import { playbackContext } from "@/context/playbackContext";
import { consumeProp } from "@/decorators/sync";

import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { getPlayheadPosition } from "./Tracks";

export const NEEDLE_START_POS = 131;

@customElement("playhead-node")
export default class PlayheadNode extends LitElement {
    @consumeProp({ context: playbackContext, subscribe: true })
    bpm!: number;

    @consumeProp({ context: playbackContext, subscribe: true })
    currentTime!: number;

    static styles = [
        css`
            .current-time-indicator {
                position: absolute;
                width: 1px;
                top: 0;
                bottom: 0;
                background-color: var(--color-tint-primary);
                height: 100%;
                z-index: 10;
                left: ${NEEDLE_START_POS}px;
            }
        `,
    ];

    private getPlayheadPosition(): number {
        return getPlayheadPosition(this.bpm, this.currentTime);
    }

    protected override render() {
        return html`<div
            class="current-time-indicator"
            style=${styleMap({
                transform: `translateX(${this.getPlayheadPosition()}px)`,
            })}
        ></div>`;
    }
}
