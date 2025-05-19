import { css, html, LitElement, type CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";
import { typography } from "../global-styles";
import { classMap } from "lit/directives/class-map.js";
import type { KeyMapping } from "../lib/KeyManager";

export type PadClickData = {
    mapping: KeyMapping;
};

@customElement("daw-pad")
export default class Pad extends LitElement {
    @property({ type: Object })
    private mapping: KeyMapping | null = null;

    @property({ type: String })
    name?: string = "Empty pad";

    @property({ type: Number })
    volume: number = 0;

    static styles: CSSResultGroup = [
        typography,
        css`
            .pad {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                border-radius: 3px;
                border: 0;
                background-color: var(--color-accent);
                width: 100px;
                height: 70px;
                transition: background-color 0.4s
                    cubic-bezier(0.165, 0.84, 0.44, 1);
                box-shadow: 0px 0px 2px #1c1c1c;
                position: relative;
            }

            .pad:active,
            .active {
                background-color: #1c1c1c;
                transform: scale(1.05);
            }

            .key {
                font-size: 1em;
                color: var(--color-text);
                text-transform: uppercase;
                position: absolute;
                bottom: 8px;
                right: 10px;
            }

            .pad-name {
                font-size: 0.7em;
                color: var(--color-text);
                background-color: var(--color-secondary);
                padding: 6px;
                margin-bottom: 4px;
            }
        `,
    ];

    private emitClickData() {
        this.dispatchEvent(
            new CustomEvent<PadClickData>("pad-click", {
                detail: {
                    mapping: this.mapping as KeyMapping,
                },
                bubbles: true,
                composed: true,
            }),
        );
    }

    render() {
        return html`
            <div>
                <p class="pad-name typography-300">${this.name}</p>
                <button
                    @click=${this.emitClickData}
                    class=${classMap({
                        pad: true,
                        active: this.mapping?.isPressed || false,
                    })}
                >
                    <span class="key typography-500">${this.mapping?.key}</span>
                </button>
            </div>
        `;
    }
}
