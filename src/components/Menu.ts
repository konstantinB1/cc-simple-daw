import { css, html, LitElement, type PropertyValues } from "lit";
import { property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import Backdrop from "./Backdrop";
import { helperStyles } from "@/styles";
import { computePosition, offset, type Placement } from "@floating-ui/dom";
import { styleMap } from "lit/directives/style-map.js";

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

export default class MenuList extends LitElement {
    @property({ type: String })
    placement: Placement = "bottom-start";

    @property({ type: Object })
    container: HTMLElement | null = null;

    @property({ type: String })
    size: SelectSize = SelectSize.Medium;

    @state()
    selectedIndex: number = 0;

    @property({ type: Boolean, reflect: true })
    visible: boolean = false;

    @property({ type: Boolean })
    backdrop: boolean = true;

    @property({ attribute: "initial-value", type: String })
    initialValue: string = "";

    @query(".root")
    private rootElement!: HTMLElement;

    @state()
    private pos: [number, number] = [0, 0];

    constructor() {
        super();
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    static styles = [
        helperStyles,
        css`
            .root {
                position: fixed;
                background-color: var(--color-primary);
                box-shadow: var(--box-shadow-menu);
                z-index: var(--backdrop);
                top: 0;
                left: 0;
            }

            .items {
                background-color: var(--color-primary);
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                background-color: var(--color-bg);
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                z-index: 1000;
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
        `,
    ];

    protected firstUpdated(_changedProperties: PropertyValues): void {
        super.firstUpdated(_changedProperties);

        const slot = this.shadowRoot?.querySelector("slot");

        if (!slot) {
            throw new Error("Slot element not found in MenuList.");
        }
    }

    private dispatchClose() {
        this.dispatchEvent(
            new CustomEvent("close", {
                bubbles: true,
                composed: true,
            }),
        );
    }

    private async resolvePosition(): Promise<void> {
        if (!this.container || !this.rootElement) {
            throw new Error("Container or root element is not defined.");
        }

        const { x, y } = await computePosition(
            this.container,
            this.rootElement,
            {
                placement: this.placement,
                middleware: [offset(2)],
            },
        );

        this.pos = [Math.round(x), Math.round(y)];
    }

    connectedCallback(): void {
        super.connectedCallback();

        Backdrop.onClick(() => {
            if (!Backdrop.isVisible) {
                return;
            }

            Backdrop.hide();
            this.dispatchClose();
        });
    }

    update(changedProperties: PropertyValues): void {
        if (changedProperties.has("visible") && this.backdrop) {
            if (this.visible) {
                Backdrop.show();
                document.addEventListener("keydown", this.handleKeyDown);

                this.resolvePosition().catch((error) => {
                    throw new Error(
                        `Failed to resolve position: ${error.message}`,
                    );
                });
            } else {
                Backdrop.hide();
                document.removeEventListener("keydown", this.handleKeyDown);
            }
        }

        super.update(changedProperties);
    }

    private get widthPx(): string {
        if (!this.container) {
            return "auto";
        }

        return `${this.container.offsetWidth}px`;
    }

    private handleKeyDown(event: KeyboardEvent) {
        const key = event.key;

        if (!this.visible) {
            return;
        }

        if (key === "ArrowUp") {
            this.dispatchEvent(
                new CustomEvent("navigate-up", {
                    bubbles: true,
                    composed: true,
                }),
            );
        } else if (key === "Escape") {
            this.dispatchClose();
        }
    }

    private dispatchClick() {
        this.dispatchEvent(
            new CustomEvent("click", {
                bubbles: true,
                composed: true,
            }),
        );
    }

    private handleItemClick(event: CustomEvent<SelectData>) {
        const { value } = event.detail;
        console.log("Menu item clicked:", value);
    }

    protected override render() {
        const classes = classMap({
            root: true,
            hidden: !this.visible,
        });

        const [x, y] = this.pos;

        const styles = styleMap({
            transform: `translate(${x}px, ${y}px)`,
            width: this.widthPx,
        });

        return html`
            <div class=${classes} tabindex="1" @click=${this.dispatchClick} style=${styles}>
                <div class="items"></div>
                    <slot @click-item=${this.handleItemClick}></slot>
                </div>
            </div>
        `;
    }
}
