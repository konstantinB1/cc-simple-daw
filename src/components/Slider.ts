import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("daw-slider")
export default class Slider extends LitElement {
    @property({ type: Number })
    height: number = 100;

    static styles = [
        css`
            :host {
                display: block;
            }

            input[type="range"] {
                appearance: slider-vertical;
                width: 2px;
                vertical-align: bottom;
                height: 60px;
                background-color: var(--color-secondary);
            }
        `,
    ];

    render() {
        return html`
            <input
                type="range"
                orientation="vertical"
                min="0"
                max="100"
                value="50"
            />
        `;
    }
}
