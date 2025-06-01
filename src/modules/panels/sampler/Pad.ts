import { typography } from "@/global-styles";
import { css, html, LitElement, type CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import type { MappedPadKeyWithPressed } from "./Pads";

export type PadClickData = {
    mapping: MappedPadKeyWithPressed | null;
};

@customElement("daw-pad")
export default class Pad extends LitElement {
    @property({ type: Object })
    mappedPad!: MappedPadKeyWithPressed;

    @property({ type: Number })
    volume: number = 0;

    @property({ type: Boolean })
    isActive: boolean = true;

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
                    mapping: this.mappedPad,
                },
                bubbles: true,
                composed: true,
            }),
        );
    }

    render() {
        const name = this.mappedPad?.name || "Unnamed Pad";
        const key = this.mappedPad?.description || "No Description";
        const isActive = this.mappedPad?.pressed;

        return html`
            <div>
                <p class="pad-name typography-300">${name}</p>
                <button
                    @click=${this.emitClickData}
                    class=${classMap({
                        pad: true,
                        active: isActive !== undefined && isActive,
                    })}
                >
                    <span class="key typography-500">${key}</span>
                </button>
            </div>
        `;
    }
}
