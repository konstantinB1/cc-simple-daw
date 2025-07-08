import {
    css,
    html,
    LitElement,
    nothing,
    type CSSResultGroup,
    type PropertyValues,
    type TemplateResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { portal } from "lit-modal-portal";
import type { AnchorElementProps, AnchorPosition } from "./AnchorElement";
import type { DirectiveResult } from "lit/async-directive.js";

export type SelectOption = {
    value: string;
    label: string;
};

export type SelectData = {
    value: string;
};

export enum SelectSize {
    Small = "small",
    Medium = "medium",
    Large = "large",
}

@customElement("menu-list")
export default class MenuList extends LitElement implements AnchorElementProps {
    @property({ type: String })
    anchor: AnchorPosition = "bottom-left";

    @property({ type: String })
    size: SelectSize = SelectSize.Medium;

    @property({ type: Object })
    targetElement!: HTMLElement | Promise<HTMLElement>;

    @property({ type: Boolean })
    private isOpen: boolean = false;

    @state()
    selectedIndex: number = 0;

    @property({ type: Boolean, reflect: true })
    visible: boolean = false;

    @property({ type: Number })
    width?: number | undefined;

    @property({ type: Object })
    content!: TemplateResult<1>;

    @property({ type: Number })
    height?: number | undefined;

    @property({ type: Object })
    root: HTMLElement = document.body;

    @property({ type: Object })
    override?: CSSResultGroup;

    @property({ type: Boolean })
    backdrop: boolean = true;

    @state()
    backdropElement: HTMLElement | null = null;

    constructor() {
        super();

        this.backdropClick = this.backdropClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    static styles = [
        css`
            .select-container {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 0.9em;
                border-radius: 5px;
                cursor: pointer;
                min-width: 100px;
                width: fit-content;
                border-radius: var(--border-radius);

                > p {
                    margin: 0;
                }
            }

            .select {
                border-radius: var(--border-radius);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .size-small {
                font-size: 0.9em;
                padding: 6px 10px;
                width: fit-content;
            }

            .size-medium {
                font-size: 1em;
                padding: 10px 15px;
                width: fit-content;
            }

            .size-large {
                font-size: 1em;
                padding: 15px 20px;
            }

            .select {
                width: 100%;
                border: 1px solid var(--color-accent);
                background-color: var(--color-secondary);
                color: var(--color-text);
            }

            .open {
                display: block; /* Show when open */
            }

            .value-text {
                margin: 0;
            }
        `,
    ];

    protected firstUpdated(_changedProperties: PropertyValues): void {
        if (this.override) {
            const stylesheet = new CSSStyleSheet();
            stylesheet.replaceSync(this.override?.toString() || "");
            this.shadowRoot?.adoptedStyleSheets.push(stylesheet);
        }
    }

    private get dropdownStyles() {
        return [
            css`
                .select-backdrop {
                    background-color: red;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1000;

                    cursor: pointer;
                }

                .select-menu {
                    width: 100%;
                    background-color: var(--color-secondary);
                    border: 1px solid var(--color-border);
                    border-radius: 10px;
                    overflow-y: auto;
                }

                .select-option {
                    padding: 10px;
                    cursor: pointer;
                    background-color: var(--color-secondary);
                    border-bottom: 1px solid var(--color-accent);
                    transition: background-color 0.2s ease;
                    color: var(--color-text);
                    font-size: 0.9em;
                    box-sizing: border-box;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    &:hover {
                        background-color: var(--color-tint-primary);
                    }

                    > span {
                        font-size: 0.95em;
                    }
                }

                .select-option + .selected-item {
                    color: var(--color-text);
                    font-weight: bold;

                    &:hover {
                        background-color: var(--color-tint-primary);
                    }
                }

                .open {
                    display: block;
                }
            `,
        ];
    }

    private backdropClick(_: Event) {
        this.dispatchEvent(
            new CustomEvent("close", {
                bubbles: true,
                composed: true,
            }),
        );
    }

    private handleKeyDown(event: KeyboardEvent) {
        const key = event.key;

        if (key === "ArrowUp") {
        }
    }

    private async openDropdown() {
        this.isOpen = !this.isOpen;

        if (this.isOpen && this.backdropElement) {
            this.backdropElement!.classList.add("visible");
            window.addEventListener("keydown", this.handleKeyDown);
        } else {
            window.removeEventListener("keydown", this.handleKeyDown);
        }
    }

    protected updated(_changedProperties: PropertyValues): void {
        super.updated(_changedProperties);

        if (_changedProperties.has("visible") && this.backdropElement) {
            this.backdropElement!.classList.toggle("hidden", !this.visible);
            this.backdropElement!.classList.toggle("visible", this.visible);
        }
    }

    private backdropAndDropdownElement(container: HTMLElement) {
        this.backdropElement = container;

        container.classList.add(
            "full-space",
            "fixed",
            "cursor-pointer",
            "top",
            "left",
            "z-backdrop",
            "hidden",
        );

        container.addEventListener("click", this.backdropClick);
    }

    private get renderBackdrop(): DirectiveResult | typeof nothing {
        if (!this.backdrop) {
            return nothing;
        }

        return portal(nothing, this.root, {
            modifyContainer: this.backdropAndDropdownElement.bind(this),
        });
    }

    render() {
        return html`
            <div
                @focus=${this.openDropdown}
                @blur=${this.backdropClick}
                class="select-container"
                tabindex="0"
            >
                ${this.renderBackdrop}
                <anchor-element
                    .visible=${this.visible}
                    anchor="bottom-left"
                    .targetElement=${this.targetElement}
                    .styles=${this.dropdownStyles}
                    width=${this.width || 200}
                    height=${this.height || 200}
                    .content=${this.content}
                    @close=${this.backdropClick}
                >
                </anchor-element>
            </div>
        `;
    }
}
