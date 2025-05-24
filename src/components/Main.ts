import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import Sampler from "../lib/audio/Sampler";

import "../modules/navigation/Navigation";

@customElement("main-init")
export default class Root extends LitElement {
    private ctx: AudioContext = new AudioContext();

    private sampler: Sampler;

    static styles = css`
        .container {
            position: relative;
        }
    `;

    constructor() {
        super();

        this.sampler = new Sampler(this.ctx);
    }

    render() {
        return html` <top-nav></top-nav>
            <div class="container">
                <sampler-pads .sampler=${this.sampler}></sampler-pads>
                <div></div>
            </div>`;
    }
}
