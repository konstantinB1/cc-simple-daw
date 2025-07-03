import PanelScreenManager, { Panel } from "@/lib/PanelScreenManager";
import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./TracksView";
import "./view-canvas/TracksViewCanvas";
import { SEQUENCER_CANVAS } from "@/features";
import { consumeProp } from "@/decorators/sync";
import { playbackContext } from "@/context/playbackContext";
import type AudioSource from "@/lib/AudioSource";
import type { SelectOption } from "@/components/Select";
import Track from "@/lib/AudioTrack";
import type { PlayEvent } from "@/lib/AudioSource";

export const tracksPanelElement = "tracks-panel";

export enum QuantisizeOptions {
    "1/2" = 2,
    "1/4" = 4,
    "1/8" = 8,
    "1/16" = 16,
    "1/32" = 32,
    "1/64" = 64,
}

const quantisizeOptions: SelectOption[] = [
    { value: "1", label: "1/1" },
    { value: "2", label: "1/2" },
    { value: "4", label: "1/4" },
    { value: "8", label: "1/8" },
    { value: "16", label: "1/16" },
    { value: "32", label: "1/32" },
    { value: "64", label: "1/64" },
];

@customElement(tracksPanelElement)
export default class TracksPanel extends LitElement {
    @consumeProp({ context: playbackContext, subscribe: true })
    sources!: AudioSource[];

    @state()
    private currentQuantisize: string = quantisizeOptions[2].value;

    @state()
    events: PlayEvent[] = [];

    @property({ type: Object, attribute: false })
    screenManager!: PanelScreenManager;

    @property({ type: Array })
    startPos: [number, number] = [0, 0];

    @property({ type: Object })
    panel!: Panel;

    static styles = css`
        .tracks-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
        }
    `;

    private get tracks(): Track[] {
        return this.sources.map((source) => new Track(source));
    }

    private setQuantisize({
        detail: { value },
    }: CustomEvent<{ value: string }>) {
        this.currentQuantisize = value;
    }

    override render() {
        return html`
            <panel-card
                .cardId=${tracksPanelElement}
                card-width="1140px"
                .isDraggable=${true}
                .startPos=${this.startPos}
                .screenManagerInstance=${this.screenManager as any}
            >
                <card-sub-header>
                    <div slot="menu-items">
                        <daw-select
                            .options=${quantisizeOptions}
                            size="small"
                            .value=${this.currentQuantisize}
                            @select-changed=${this.setQuantisize}
                        ></daw-select>
                    </div>
                </card-sub-header>
                <div class="tracks-wrapper">
                    ${SEQUENCER_CANVAS
                        ? html`<tracks-view-canvas
                              .screenManager=${this.screenManager}
                              .quantisize=${this.currentQuantisize}
                              .tracks=${this.tracks}
                              .panel=${this.panel}
                          ></tracks-view-canvas>`
                        : html`<tracks-view
                              .tracks=${this.tracks}
                          ></tracks-view>`}
                </div>
            </panel-card>
        `;
    }
}
