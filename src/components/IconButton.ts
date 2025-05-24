import { typography } from "@/global-styles";
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

    @property({ type: String, attribute: "label-text" })
    labelText: string = "";

    static styles = [
        typography,
        css`
            .icon-button {
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: var(--border-radius);
                border: 1px solid var(--color-accent);
                background-color: var(--color-primary);
                color: var(--color-white);
                cursor: pointer;
            }

            .icon-button > svg {
                fill: var(--color-white);
            }

            .active {
                background-color: var(--color-tint-primary-active);
            }

            .label-text {
                font-size: 0.7em;
            }

            .icon-button-wrapper {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 4px;
            }
        `,
    ];

    private delegateClick(event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();

        this.isActive = !this.isActive;
        this.dispatchEvent(
            new CustomEvent("handle-click", {
                detail: { active: this.isActive },
            }),
        );
    }

    render() {
        return html`
            <div class="icon-button-wrapper">
                <button
                    class=${classMap({
                        "icon-button": true,
                        active: this.isActive && this.isActive !== undefined,
                    })}
                    @click=${this.delegateClick}
                    style=${styleMap({
                        width: this.size + "px",
                        height: this.size + "px",
                    })}
                >
                    <slot></slot>
                </button>
                ${this.labelText
                    ? html`<span class="label-text typography-500"
                          >${this.labelText}</span
                      >`
                    : ""}
            </div>
        `;
    }
}
