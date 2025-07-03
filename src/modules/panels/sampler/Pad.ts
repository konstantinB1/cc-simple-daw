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
        css`
            :host {
                display: block;
                overflow: hidden;
                width: 100px;
            }

            .pad-wrapper::before {
                width: 100%;
                height: 100%;
            }
            .pad {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                border-radius: 3px;
                border: 0;
                background-color: var(--color-accent);
                width: 100%;
                height: 60px;
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
                text-transform: uppercase;
                position: absolute;
                bottom: 8px;
                right: 10px;
            }

            .pad-name {
                background-color: var(--color-secondary);
                padding: 6px;
                margin-bottom: 4px;
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
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
            <div class="pad-wrapper">
                <div class="pad-name">
                    <text-element variant="tiny">${name}</text-element>
                </div>
                <button
                    @click=${this.emitClickData}
                    class=${classMap({
                        pad: true,
                        active: isActive !== undefined && isActive,
                    })}
                >
                    <text-element overflow variant="body2" class="key"
                        >${key}</text-element
                    >
                </button>
            </div>
        `;
    }
}
