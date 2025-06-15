import { CustomPanel } from "@/lib/PanelScreenManager";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import WithScreenManager from "@/mixins/WithScreenManager";
import "./TracksView";
import "./view-canvas/TracksViewCanvas";
import { SEQUENCER_CANVAS } from "@/features";
import { consumeProp } from "@/decorators/sync";
import { playbackContext } from "@/context/playbackContext";
import type AudioSource from "@/lib/AudioSource";

export const tracksPanelElement = "tracks-panel";

export class Track {
    channel: AudioSource;

    id: string;

    parent?: Track;

    constructor(channel: AudioSource, parent?: Track) {
        this.channel = channel;
        this.id = channel.id;
        this.parent = parent;
    }

    mute(): void {
        this.channel.setMuted(true);
    }

    unmute(): void {
        this.channel.setMuted(false);
    }
}

@customElement(tracksPanelElement)
export default class TracksPanel extends WithScreenManager(LitElement) {
    @consumeProp({ context: playbackContext, subscribe: true })
    sources!: AudioSource[];

    connectedCallback(): void {
        super.connectedCallback();

        const panel = new CustomPanel(
            this.screenManager,
            "tracks-view",
            this,
            true,
            true,
        );

        this.screenManager.add(tracksPanelElement, panel);
    }

    private get tracks(): Track[] {
        return this.sources.map((source) => new Track(source));
    }

    override render() {
        return html`
            <panel-card
                card-id="tracks-view"
                card-width="1100px"
                .startPos=${[570, 80] as const}
                .isDraggable=${true}
                .screenManagerInstance=${this.screenManager as any}
            >
                ${SEQUENCER_CANVAS
                    ? html`<tracks-view-canvas
                          .tracks=${this.tracks}
                      ></tracks-view-canvas>`
                    : html`<tracks-view .tracks=${this.tracks}></tracks-view>`}
            </panel-card>
        `;
    }
}
