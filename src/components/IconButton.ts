import { LitElement, css, html, nothing } from "lit";
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

    @property({ type: String, attribute: "variant" })
    variant: "classic" | "basic" = "classic";

    @property({ type: String })
    color: "primary" | "white" | "tool" = "primary";

    static styles = [
        css`
            .icon-button {
                display: flex;
                justify-content: center;
                align-items: center;
                color: var(--color-white);
                cursor: pointer;

                &:hover {
                    transform: scale(0.99);
                    border-color: var(--color-tint-primary);
                }

                &:active {
                    transform: scale(0.975);
                }
            }

            .icon-button:focus {
                outline: none;
                border: 1px solid var(--color-tint-primary);
            }

            .variant-classic {
                border-radius: var(--border-radius);
                border: 0;
                background-color: var(--color-primary);
                border: 1px solid var(--color-border);
                /* box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2); */
            }

            .variant-basic {
                border: 1px solid transparent;
                background-color: transparent;
                border-radius: var(--border-radius);
            }

            .icon-button > svg {
                fill: var(--color-white);
            }

            .active {
                border: 1px solid var(--color-tint-primary) !important;
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

    private delegateClick(event: Event): void {
        event.stopPropagation();
        event.preventDefault();

        this.dispatchEvent(
            new CustomEvent("handle-click", {
                detail: { active: this.isActive },
            }),
        );
    }

    private handleKeydown(event: KeyboardEvent): void {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            if (this.isActive !== undefined) {
                this.delegateClick(event);
            }
        }
    }

    private handleFocus(event: FocusEvent): void {
        const button = event.target as HTMLButtonElement;
        button.addEventListener("keydown", this.handleKeydown.bind(this));
        button.addEventListener("blur", this.handleBlur.bind(this));
    }

    private handleBlur(event: FocusEvent): void {
        const button = event.target as HTMLButtonElement;
        button.removeEventListener("keydown", this.handleKeydown.bind(this));
        button.removeEventListener("blur", this.handleBlur.bind(this));
    }

    render() {
        return html`
            <div class="icon-button-wrapper">
                <button
                    @focus=${this.handleFocus}
                    @blur=${this.handleFocus}
                    class=${classMap({
                        "icon-button": true,
                        [`variant-${this.variant}`]: true,
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
                    ? html`<text-element variant="tiny"
                          >${this.labelText}</text-element
                      >`
                    : nothing}
            </div>
        `;
    }
}
