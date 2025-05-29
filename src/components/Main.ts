import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import Sampler from "../lib/audio/Sampler";

import "../modules/navigation/Navigation";
import "../modules/tracks/Tracks";
import WithPlaybackContext from "@/mixins/WithPlaybackContext";

@customElement("main-init")
export default class Root extends WithPlaybackContext(LitElement) {
    private sampler!: Sampler;

    static styles = css`
        .container {
            position: relative;
            width: 100%;
            height: 100%;
        }
    `;

    connectedCallback(): void {
        super.connectedCallback();

        this.sampler = new Sampler(this.playbackContext.master.audioContext);
    }

    render() {
        console.log(this.playbackContext.master.audioContext);
        return html` <top-nav></top-nav>
            <div class="container">
                <sampler-pads .sampler=${this.sampler}></sampler-pads>
                <tracks-component></tracks-component>
            </div>`;
    }
}
