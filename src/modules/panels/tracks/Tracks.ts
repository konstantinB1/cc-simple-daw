import PanelScreenManager, {
    CustomPanel,
    PanelType,
} from "@/lib/PanelScreenManager";
import "./TracksView";
import type TracksView from "./TracksView";
import { html } from "lit";

const elementName = "tracks-component";

export default class TracksPanel extends CustomPanel {
    constructor(screenManagerInstance: PanelScreenManager) {
        const id = elementName;
        const tracks = document.createElement(id) as TracksView;

        super(screenManagerInstance, id, tracks, PanelType.VSTI);

        this.screenManagerInstance = screenManagerInstance;
    }

    override render() {
        return html`
            <panel-card
                card-id=${elementName}
                card-height="auto"
                card-width="1100px"
                .startPos=${[570, 80] as const}
                .isDraggable=${true}
                .screenManagerInstance=${this.screenManagerInstance as any}
            >
                <tracks-component></tracks-component>
            </panel-card>
        `;
    }
}
