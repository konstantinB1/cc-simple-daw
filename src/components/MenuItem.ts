import { helperStyles } from "@/styles";
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import { css, html, LitElement } from "lit";
import Text from "./Text";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

export type ClickEventDetail = {
    value: string;
    label: string;
};

export default class MenuItem extends ScopedRegistryHost(LitElement) {
    static elementDefinitions = {
        "text-element": Text,
    };

    @property({ type: String })
    value: string = "";

    @property({ type: String })
    label: string = "";

    @property({ type: Boolean })
    selected: boolean = false;

    static styles = [
        helperStyles,
        css`
            :host {
                display: block;
                cursor: pointer;
                user-select: none;
                border-bottom: 1px solid var(--color-border);
                height: 100%;
            }

            :host(:first-child) .value {
            }

            :host(:last-child) {
                border-bottom: none;
            }

            :host(:last-child) .value {
            }

            .value {
                padding: 10px 18px;
                background-color: var(--color-secondary);

                &:hover {
                    background-color: var(--color-dark-contrast);
                }
            }

            .value.selected {
                background-color: var(--color-secondary);
                color: var(--color-on-primary);
                border-bottom: 1px solid var(--color-tint-primary);
            }
        `,
    ];

    private handleClick() {
        this.dispatchEvent(
            new CustomEvent<ClickEventDetail>("menu-item-click", {
                detail: { value: this.value, label: this.label },
                bubbles: true,
                composed: true,
            }),
        );
    }

    protected render() {
        const classes = classMap({
            value: true,
            selected: this.selected,
            "full-width": true,
        });

        return html`<div
            class="flex gap-2 full-width"
            role="menuitem"
            tabindex="0"
            aria-selected=${this.selected}
            aria-label=${this.label}
            @click=${this.handleClick}
            @keydown=${this.handleKeydown}
        >
            <slot name="before-text"></slot>
            <text-element variant="body1" class=${classes} color="text"
                >${this.label}</text-element
            >
            <slot name="after-text"></slot>
        </div>`;
    }

    private handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            this.handleClick();
        }
    }
}
