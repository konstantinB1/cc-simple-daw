import { CustomPanel, PanelType } from "@/lib/PanelScreenManager";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import WithScreenManager from "@/mixins/WithScreenManager";
import "./TracksView";
import { msToSeconds } from "@/utils/TimeUtils";

export const tracksPanelElement = "tracks-panel";

export const getPlayheadPosition = (
    bpm: number,
    currentTime: number,
): number => {
    const secondsPerBeat = 60 / bpm;
    const pxPerSecond = 81 / secondsPerBeat;
    return msToSeconds(currentTime) * pxPerSecond;
};

@customElement(tracksPanelElement)
export default class TracksPanel extends WithScreenManager(LitElement) {
    connectedCallback(): void {
        super.connectedCallback();

        const panel = new CustomPanel(
            this.screenManager,
            "tracks-view",
            this,
            PanelType.Custom,
            true,
            true,
        );

        this.screenManager.add(tracksPanelElement, panel);
    }

    override render() {
        return html`
            <panel-card
                card-id="tracks-view"
                card-height="auto"
                card-width="1100px"
                .startPos=${[570, 80] as const}
                .isDraggable=${true}
                .screenManagerInstance=${this.screenManager as any}
            >
                <tracks-view></tracks-view>
            </panel-card>
        `;
    }
}
