import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("card-component")
export default class Card extends LitElement {
    @property({ type: Boolean, attribute: "is-draggable" })
    private isDraggable = false;

    static styles = css`
        :root {
            --color-drag: #3f3f3f;
        }

        .card {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            background-color: var(--card-color);
            border-radius: 2px;
            border: 1px solid var(--color-accent);
            position: relative;
        }

        .drag-handle {
            position: absolute;
            top: 0;
            right: -5px;
            cursor: grab;
        }
    `;

    render() {
        return html`<div class="card">
            <slot></slot>
            ${this.isDraggable
                ? html`<div class="drag-handle">
                      <drag-icon color="#444444" size=${30}></drag-icon>
                  </div>`
                : ""}
            <slot></slot>
        </div> `;
    }
}
