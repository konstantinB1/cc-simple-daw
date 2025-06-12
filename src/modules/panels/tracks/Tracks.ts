import { CustomPanel } from "@/lib/PanelScreenManager";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import WithScreenManager from "@/mixins/WithScreenManager";
import "./TracksView";
import "./view-canvas/TracksViewCanvas";
import { SEQUENCER_CANVAS } from "@/features";

export const tracksPanelElement = "tracks-panel";

@customElement(tracksPanelElement)
export default class TracksPanel extends WithScreenManager(LitElement) {
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
                ${SEQUENCER_CANVAS
                    ? html`<tracks-view-canvas></tracks-view-canvas>`
                    : html`<tracks-view></tracks-view>`}
            </panel-card>
        `;
    }
}
