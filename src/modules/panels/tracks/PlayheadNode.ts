import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { NEEDLE_START_POS } from "./TracksView";

@customElement("playhead-node")
export default class PlayheadNode extends LitElement {
    @property({ type: Number })
    xPosition!: number;

    static styles = [
        css`
            .current-time-indicator {
                position: absolute;
                width: 1px;
                top: 0;
                bottom: 0;
                background-color: var(--color-tint-primary);
                height: 100%;
                z-index: 10;
                left: 0;
                cursor: grabbing;

                &:before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -6px;
                    width: 0;
                    height: 0;
                    border-top: 6px solid var(--color-tint-primary);
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                }
            }
        `,
    ];

    firstUpdated(): void {
        const playhead = this.shadowRoot?.querySelector(
            ".current-time-indicator",
        )! as HTMLElement;

        playhead.style.left = `${NEEDLE_START_POS}px`;
    }

    protected override render() {
        return html`<div
            class="current-time-indicator"
            style=${styleMap({
                transform: `translateX(${this.xPosition}px)`,
            })}
        ></div>`;
    }
}
