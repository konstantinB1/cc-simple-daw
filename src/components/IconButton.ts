import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("icon-button")
export default class IconButton extends LitElement {
    @property({ type: Number })
    size: number = 50;

    @property({ type: Boolean })
    isActive: boolean = false;

    static styles = css`
        .icon-button {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: var(--border-radius);
            border: 1px solid var(--color-secondary);
            background-color: var(--color-primary);
            color: var(--color-white);
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .icon-button > svg {
            fill: var(--color-white);
        }

        .active {
            background-color: var(--color-tint-primary-active);
        }
    `;

    render() {
        return html`
            <button
                class=${classMap({
                    "icon-button": true,
                    active: this.isActive && this.isActive !== undefined,
                })}
                }
                @click=${() => {
                    this.isActive = !this.isActive;
                    this.dispatchEvent(
                        new CustomEvent("icon-button-click", {
                            detail: { active: this.isActive },
                            bubbles: true,
                            composed: true,
                        }),
                    );
                }}
                style=${styleMap({
                    width: this.size + "px",
                    height: this.size + "px",
                })}
            >
                <slot></slot>
            </button>
        `;
    }
}
