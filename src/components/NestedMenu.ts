import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, queryAsync, state } from "lit/decorators.js";
import "@/components/Menu";
import { TempStylesheet } from "@/utils/stylesheets";

export enum NestedMenuItemType {
    Bool = "bool",
    SubMenu = "submenu",
}

export type NestedMenuItem = {
    label: string;
    description?: string;
    icon?: string;
    items?: NestedMenuItem[];
    onClick: () => void;
    type: NestedMenuItemType;
    checked?: boolean;
};

@customElement("nested-menu")
export default class NestedMenu extends LitElement {
    @property({ type: Array })
    items: NestedMenuItem[] = [];

    @property({ type: String, attribute: "menu-title" })
    menuTitle: string = "Menu";

    @state()
    private isOpen: boolean = false;

    private tempStylesheet: TempStylesheet = new TempStylesheet(
        "nested-menu-styles",
        css`
            :root {
                --menu-list-width: 270px;
                --menu-list-height: 120px;
            }

            .menu-dropdown {
                width: var(--menu-list-width);
                height: var(--menu-list-height);
            }
        `,
    );

    @queryAsync(".menu-list")
    private menuListAsync!: Promise<HTMLDivElement>;

    connectedCallback(): void {
        super.connectedCallback();
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this.tempStylesheet.removeFromHost();
    }

    private toggleMenu(): void {
        this.isOpen = !this.isOpen;
    }

    private renderMenuItems() {
        return this.items.map((item) => {
            switch (item.type) {
                case NestedMenuItemType.Bool: {
                    const renderChecked = item.checked
                        ? html`<div class="flex flex-center pr-1">
                              <checked-icon
                                  color="var(--color-text)"
                                  size=${13}
                              ></checked-icon>
                          </div>`
                        : nothing;
                    return html`<div
                        class="flex flex-space-between clickable menu-item full-width p-2 bg-hover-accent border-bottom-accent"
                        @click=${() => {
                            item.onClick();
                            this.requestUpdate();
                        }}
                    >
                        <text-element> ${item.label} </text-element>
                        ${renderChecked}
                    </div>`;
                }
            }
        });
    }

    private get renderDropdownContent(): TemplateResult<1> {
        return html`<div
            class="menu-dropdown scroll bg-primary border-accent radius-normal"
        >
            ${this.renderMenuItems()}
        </div>`;
    }

    protected render(): unknown {
        return html`<div class="menu-list flex flex-center gap-1">
            <mpc-button
                label="${this.menuTitle}"
                size="medium"
                @click=${this.toggleMenu}
            >
                <div slot="after-label">
                    <arrow-down-icon
                        color="var(--color-text)"
                        size=${15}
                    ></arrow-down-icon>
                </div>
            </mpc-button>
            <menu-list
                .backdrop=${true}
                @close=${() => {
                    this.isOpen = false;
                }}
                .content=${this.renderDropdownContent}
                .targetElement=${this.menuListAsync}
                .visible=${true}
            >
            </menu-list>
        </div>`;
    }
}
