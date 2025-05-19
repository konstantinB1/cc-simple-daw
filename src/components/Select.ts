import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { typography } from "../global-styles";

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

    constructor() {
        super();
    }

    static styles = [
        typography,
        css`
            .select {
                width: 100%;
                padding: 10px;
                border-radius: 3px;
                border: 1px solid var(--color-accent);
                background-color: var(--color-secondary);
                color: var(--color-text);
                font-size: 0.;
            }
        `,
    ];

    private handleChange(event: Event) {
        this.dispatchEvent(
            new CustomEvent<SelectData>("select-data", {
                detail: {
                    value: (event.target as HTMLSelectElement).value,
                },
                bubbles: true,
                composed: true,
            }),
        );
    }

    render() {
        return html`
            <select class="select typography-100" @change=${this.handleChange}>
                ${this.options.map(
                    (option) =>
                        html`<option
                            value="${option.value}"
                            class="typography-100"
                        >
                            ${option.label}
                        </option>`,
                )}
            </select>
        `;
    }
}
