import PanelScreenManager, { Panel } from "@/lib/PanelScreenManager";
import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

import type { SelectOption } from "@/components/Select";
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import TracksViewCanvas from "./view-canvas/TracksViewCanvas";
import PanelCard from "@/modules/view/PanelCard";
import TracksToolbar, { tools, type Tool } from "./Tracks.Toolbar";

export const tracksPanelId = "tracks-panel";

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

export default class TracksPanel extends ScopedRegistryHost(LitElement) {
    @state()
    private currentQuantisize: string = quantisizeOptions[2].value;

    @property({ type: Object, attribute: false })
    screenManager!: PanelScreenManager;

    @property({ type: Array })
    startPos: [number, number] = [0, 0];

    @property({ type: Object })
    panel!: Panel;

    @property({ type: Object })
    currentTool: Tool = tools.click;

    static elementDefinitions = {
        "tracks-view-canvas": TracksViewCanvas,
        "panel-card": PanelCard,
        "tracks-toolbar": TracksToolbar,
    };

    static styles = css`
        .tracks-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
        }
    `;

    private setQuantisize({
        detail: { value },
    }: CustomEvent<{ value: string }>) {
        this.currentQuantisize = value;
    }

    private onToolChange(event: CustomEvent<Tool>) {
        this.currentTool = event.detail;
    }

    override render() {
        return html`
            <panel-card
                .cardId=${tracksPanelId}
                card-width="1140px"
                .isDraggable=${true}
                .startPos=${this.startPos}
                .screenManagerInstance=${this.screenManager as any}
            >
                <tracks-toolbar
                    .currentTool=${this.currentTool}
                    @tool-change=${this.onToolChange}
                ></tracks-toolbar>
                <div class="tracks-wrapper">
                    <tracks-view-canvas
                        .screenManager=${this.screenManager}
                        .quantisize=${this.currentQuantisize}
                        .panel=${this.panel}
                    ></tracks-view-canvas>
                </div>
            </panel-card>
        `;
    }
}
