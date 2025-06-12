import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { typography } from "../global-styles";
import { portal } from "lit-modal-portal";
import { classMap } from "lit/directives/class-map.js";

export type SelectOption = {
    value: string;
    label: string;
};

export type SelectData = {
    value: string;
};

@customElement("daw-select")
export default class Select extends LitElement {
    @property({ type: Array })
    options: SelectOption[] = [];

    @property({ type: String })
    placeholder: string = "";

    @property({ type: String })
    value: string = "";

    @query(".select-container")
    private selectContainer!: HTMLDivElement;

    @state()
    private isOpen: boolean = false;

    private backdropElement: HTMLDivElement | null = null;

    private selectMenu: HTMLElement | null = null;

    private isClosing: boolean = false;

    @state()
    selectedIndex: number = 0;

    constructor() {
        super();

        this.backdropClick = this.backdropClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    static styles = [
        typography,
        css`
            .select-container {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 0.9em;
                width: 100%;
                border: 1px solid var(--color-accent);
                border-radius: var(--border-radius);
                padding: 12px 10px;
                background-color: var(--color-secondary);
                cursor: pointer;

                > p {
                    margin: 0;
                }
            }

            .select {
                width: 100%;
                padding: 10px;
                border-radius: 3px;
                border: 1px solid var(--color-accent);
                background-color: var(--color-secondary);
                color: var(--color-text);
            }

            .open {
                display: block; /* Show when open */
            }
        `,
    ];

    private loadStyles() {
        const styles = [
            typography,
            css`
                .select-backdrop {
                    background-color: rgba(0, 0, 0, 0.3);
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1000;
                    display: none;
                    cursor: pointer;
                }

                .select-menu {
                    width: 100%;
                    background-color: var(--color-secondary);
                    border: 1px solid var(--color-accent);
                    border-radius: var(--border-radius);
                    height: 100%;
                }

                .select-option {
                    padding: 10px;
                    cursor: pointer;
                    background-color: var(--color-secondary);
                    border-bottom: 1px solid var(--color-accent);
                    border-radius: inherit;
                    transition: background-color 0.2s ease;
                    color: var(--color-text);
                    font-size: 0.9em;
                    box-sizing: border-box;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    &:hover {
                        background-color: var(--color-accent);
                    }
                }

                .select-option + .selected-item {
                    color: var(--color-text);
                    font-weight: bold;
                    background-color: var(--color-tint-primary);

                    &:hover {
                        background-color: var(--color-tint-primary);
                    }
                }

                .open {
                    display: block;
                }
            `,
        ];

        const sheet = styles;
        const style = document.createElement("style");

        for (const s of sheet) {
            style.innerHTML += s.cssText || s.toString();
        }

        document.head.appendChild(style);
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadStyles();
    }

    private renderText() {
        if (this.value === "") {
            return this.placeholder || "Select an option";
        }

        const selectedOption = this.options.find(
            (option) => option.value === this.value,
        );

        return selectedOption ? selectedOption.label : this.placeholder;
    }

    private backdropClick(e: Event) {
        const backdrop = this.backdropElement!;

        if (this.isClosing) {
            return;
        }

        this.isClosing = true;

        backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 200,
            fill: "forwards",
            easing: "ease-in-out",
        });

        setTimeout(() => {
            backdrop.classList.remove("open");
            this.isClosing = false;
        }, 200);

        const selectMenu = this.selectMenu!;

        selectMenu.animate(
            [
                { transform: "translateY(0)", opacity: 1 },
                {
                    opacity: 0,
                    transform: "translateY(-50px)",
                },
            ],
            {
                duration: 200,
                easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            },
        );

        setTimeout(() => {
            selectMenu.style.display = "none";
            this.isOpen = false;
        }, 200);

        window.removeEventListener("keydown", this.handleKeyDown);
    }

    private handleKeyDown(event: KeyboardEvent) {
        const selectedOption = this.options.findIndex(
            (_, i) => i === this.selectedIndex,
        );
        const index = selectedOption === -1 ? 0 : selectedOption;
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
            this.value = option.value;
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

        // const selectedOption = this.options.find(
        //     (option) => option.value === this.value,
        // );
        // console.log("Key pressed:", event.key);
        // if (event.key === "Enter" || event.key === " ") {
        //     if (this.isOpen) {
        //         this.backdropClick(event);
        //     } else {
        //         this.openDropdown();
        //     }
        // } else if (event.key === "Escape") {
        //     if (this.isOpen) {
        //         this.backdropClick(event);
        //     }
        // } else if (this.isOpen) {
        //     const currentIndex = this.options.findIndex(
        //         (_, i) => i === this.selectedIndex,
        //     );
        //     let newIndex = currentIndex === -1 ? 0 : currentIndex;
        //     if (event.key === "ArrowDown") {
        //         newIndex = (currentIndex + 1) % this.options.length;
        //     } else if (event.key === "ArrowUp") {
        //         newIndex =
        //             (currentIndex - 1 + this.options.length) %
        //             this.options.length;
        //     }
        //     console.log("New index:", newIndex);
        //     this.selectedIndex = newIndex;
        //     this.dispatchEvent(
        //         new CustomEvent<SelectData>("select-changed", {
        //             detail: { value: this.value },
        //             bubbles: true,
        //             composed: true,
        //         }),
        //     );
        // }
    }

    private openDropdown() {
        this.isOpen = !this.isOpen;
        const backdrop = this.backdropElement!;

        backdrop.classList.toggle("open", this.isOpen);
        backdrop.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 200,
            fill: "forwards",
            easing: "ease-in-out",
        });

        const selectMenu = this.selectMenu!;

        selectMenu.style.display = "block";

        selectMenu.animate(
            [
                { transform: "translateY(-50px)", opacity: 0 },
                {
                    opacity: 1,
                    transform: "translateY(0)",
                },
            ],
            {
                duration: 200,
                fill: "forwards",
                easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            },
        );

        window.addEventListener("keydown", this.handleKeyDown);
    }

    public get isDropdownOpen(): boolean {
        return this.isOpen;
    }

    private backdropAndDropdownElement(container: HTMLElement) {
        this.backdropElement = container as HTMLDivElement;
        container.classList.add("select-backdrop");
        container.addEventListener("click", this.backdropClick);
    }

    private dropdownElement(container: HTMLElement) {
        this.selectMenu = container as HTMLDivElement;
        const bounds = this.selectContainer.getBoundingClientRect();

        setTimeout(() => {
            container.style.position = "absolute";
            container.style.zIndex = "1001";
            container.style.top = `${bounds.bottom + 10}px`;
            container.style.left = `${bounds.left}px`;
            container.style.width = `${bounds.width}px`;
            container.style.display = "none";
        }, 0);
    }

    private clickOption(
        option: SelectOption,
        index: number,
        event: MouseEvent,
    ) {
        this.selectedIndex = index;
        this.value = option.value;
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

    render() {
        console.log(this.selectedIndex);
        return html`
            <div
                @focus=${this.openDropdown}
                @blur=${this.backdropClick}
                class="select-container"
                @click=${this.openDropdown}
                tabindex="0"
            >
                <p class="typography-300">${this.renderText()}</p>
                <arrow-down-icon color="var(--color-text)" .size=${18}>
                </arrow-down-icon>
                ${portal(html``, document.body, {
                    modifyContainer: this.backdropAndDropdownElement.bind(this),
                })}
                ${portal(
                    html`<div class="select-menu">
                        ${this.options.map(
                            (option, i) => html`
                                <div
                                    class="${classMap({
                                        "select-option": true,
                                        "selected-item":
                                            this.selectedIndex === i,
                                    })}"
                                    @click="${(e) =>
                                        this.clickOption(
                                            option,
                                            i,
                                            e as MouseEvent,
                                        )}"
                                >
                                    <span class="typography-300"
                                        >${option.label}</span
                                    >
                                </div>
                            `,
                        )}
                    </div> `,
                    document.body,
                    {
                        modifyContainer: this.dropdownElement.bind(this),
                    },
                )}
            </div>
        `;
    }
}
