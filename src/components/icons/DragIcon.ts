import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("drag-icon")
export default class DragIcon extends LitElement {
    @property({ type: String })
    private color: string = "#000000";

    @property({ type: Number })
    private size: number = 24;

    static styles = css`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;

    render() {
        return html`
            <icon-component size=${this.size}>
                <svg
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                    fill="transparent"
                    xmlns="http://www.w3.org/2000/svg"
                    width=${0}
                    height=${0}
                >
                    <circle
                        cx="9.5"
                        cy="6"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="9.5"
                        cy="10"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="9.5"
                        cy="14"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="9.5"
                        cy="18"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="14.5"
                        cy="6"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="14.5"
                        cy="10"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="14.5"
                        cy="14"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <circle
                        cx="14.5"
                        cy="18"
                        r="0.5"
                        stroke=${this.color}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </icon-component>
        `;
    }
}
