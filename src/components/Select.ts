import { litStyles } from "@/styles";
import { css, html, LitElement } from "lit";
import { customElement, property, queryAsync, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

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

@customElement("daw-select")
export default class Select extends LitElement {
    @property({ type: Array })
    options: SelectOption[] = [];

    @property({ type: String })
    placeholder: string = "";

    @property({ type: String })
    value: any = "";

    @property({ type: String })
    size: SelectSize = SelectSize.Medium;

    @queryAsync(".select")
    private selectContainerAsync!: Promise<HTMLDivElement>;

    @state()
    private isOpen: boolean = false;

    @state()
    selectedIndex: number = 0;

    constructor() {
        super();

        this.backdropClick = this.backdropClick.bind(this);

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    static styles = [
        litStyles,
        css`
            .size-small {
                font-size: 0.9em;
                padding: 6px 10px;
            }

            .size-medium {
                font-size: 1em;
                padding: 10px 15px;
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
                gap: 10px;
            }
        `,
    ];

    private renderText() {
        if (this.value === "") {
            return this.placeholder || "Select";
        }

        const selectedOption = this.options.find(
            (option) => option.value === this.value,
        );

        return selectedOption ? selectedOption.label : this.placeholder;
    }

    private backdropClick(_: Event) {
        this.isOpen = false;

        window.removeEventListener("keydown", this.handleKeyDown);
    }

    private handleKeyDown(event: KeyboardEvent) {
        const key = event.key;

        if (key === "ArrowUp") {
            this.selectedIndex =
                this.selectedIndex === 0
                    ? this.options.length - 1
                    : this.selectedIndex - 1;
        } else if (key === "ArrowDown") {
            this.selectedIndex =
                this.selectedIndex === this.options.length - 1
                    ? 0
                    : this.selectedIndex + 1;
        } else if (key === "Escape") {
            if (this.isOpen) {
                this.backdropClick(event);
            }
        } else if (key === "Enter" && this.selectedIndex !== -1) {
            const option = this.options[this.selectedIndex];
            this.isOpen = false;
            this.backdropClick(event);

            this.dispatchEvent(
                new CustomEvent<SelectData>("select-changed", {
                    detail: { value: option.value },
                    bubbles: true,
                    composed: true,
                }),
            );
        }
    }

    private async openDropdown() {
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            window.addEventListener("keydown", this.handleKeyDown);
        } else {
            window.removeEventListener("keydown", this.handleKeyDown);
        }
    }

    public get isDropdownOpen(): boolean {
        return this.isOpen;
    }

    public get displayValue(): string {
        return this.value;
    }

    private clickOption(option: SelectOption, index: number) {
        this.selectedIndex = index;
        this.isOpen = false;

        this.dispatchEvent(
            new CustomEvent<SelectData>("select-changed", {
                detail: { value: option.value },
                bubbles: true,
                composed: true,
            }),
        );
    }

    private get renderDropdown() {
        return html`
            <div class="full-width flex flex-column radius-normal bg-secondary">
                ${this.options.map(
                    (option, i) => html`
                        <div
                            class="${classMap({
                                "select-option": true,
                                "selected-item": this.selectedIndex === i,
                            })}"
                            @click="${() => this.clickOption(option, i)}"
                        >
                            <span class="typography-300 value-text"
                                >${option.label}</span
                            >
                        </div>
                    `,
                )}
            </div>
        `;
    }

    render() {
        const classes = classMap({
            select: true,
            [`size-${this.size}`]: true,
            flex: true,
            "flex-space-between": true,
            "full-width": true,
            "color-text": true,
            "radius-normal": true,
        });

        return html`
            <div
                @focus=${this.openDropdown}
                @blur=${this.backdropClick}
                class="select-container flex"
                tabindex="0"
            >
                <div class=${classes}>
                    <text-element variant="body2">
                        ${this.renderText()}
                    </text-element>
                    <arrow-down-icon color="var(--color-text)" .size=${18}>
                    </arrow-down-icon>
                </div>
                <menu-list
                    @close=${this.backdropClick}
                    .visible=${this.isOpen}
                    anchor="bottom-left"
                    .targetElement=${this.selectContainerAsync}
                    .content=${this.renderDropdown}
                >
                </menu-list>
            </div>
        `;
    }
}
