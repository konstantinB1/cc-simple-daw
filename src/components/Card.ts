import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("card-component")
export default class Card extends LitElement {
    static styles = css`
        .card {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            background-color: var(--color-primary);
            border-radius: 3px;
            border: 1px solid var(--color-accent);
        }
    `;

    render() {
        return html` <div class="card"><slot></slot></div> `;
    }
}
