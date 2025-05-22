import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import Sampler from "../lib/audio/Sampler";

@customElement("main-init")
export default class Root extends LitElement {
    private ctx: AudioContext = new AudioContext();

    private sampler: Sampler;

    constructor() {
        super();

        this.sampler = new Sampler(this.ctx);
    }

    static styles = [
        css`
            .container {
                display: grid;
                grid-template-areas:
                    "recorder ."
                    "pads" "empty";
                gap: 10px;
                grid-gap: 10px;
            }
        `,
    ];

    render() {
        return html`<div class="container">
            <recorder-component></recorder-component>
            <sampler-pads .sampler=${this.sampler}></sampler-pads>
            <div></div>
        </div>`;
    }
}
