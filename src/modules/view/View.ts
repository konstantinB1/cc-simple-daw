import PanelScreenManager from "@/lib/PanelScreenManager";
import "./PanelCard";
import WithPlaybackContext from "@/mixins/WithPlaybackContext";
import { css, html, LitElement, type PropertyValues } from "lit";
import { customElement, query } from "lit/decorators.js";
import SamplerPanel from "@modules//panels/sampler/Sampler";
import TracksPanel from "../panels/tracks/Tracks";

@customElement("app-view")
export default class AppView extends WithPlaybackContext(LitElement) {
    private panelMgr = new PanelScreenManager();

    @query(".container")
    private container!: HTMLDivElement;

    static styles = css`
        .container {
            position: relative;
            width: 100%;
            height: calc(100vh - 80px);
        }
    `;

    protected firstUpdated(_changedProperties: PropertyValues): void {
        super.firstUpdated(_changedProperties);

        const ctx = this.playbackContext.master;
        const sampler = new SamplerPanel(ctx, this.panelMgr);
        const tracks = new TracksPanel(this.panelMgr);

        this.panelMgr.add(sampler.name, sampler);
        this.panelMgr.add(tracks.name, tracks);

        this.requestUpdate();
    }

    private handleClick(event: MouseEvent): void {
        if (
            event.target instanceof HTMLElement &&
            event.target.classList.contains("container")
        ) {
            PanelScreenManager.handleBackgroundClick();
        }
    }

    override render() {
        return html` <top-nav></top-nav>
            <div class="container" @click="${this.handleClick}">
                ${this.panelMgr.panels.map((panel) => panel.render())}
            </div>`;
    }
}
