import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("rewind-icon")
export default class RewindIcon extends LitElement {
    @property({ type: Number })
    private size: number = 24;

    static styles = css`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;

    render() {
        return html`
            <icon-component size=${this.size}>
                <svg
                    width="800px"
                    height="800px"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6 14H8L8 9L13 14H15L15 2H13L8 7L8 2H6L0 8L6 14Z"
                        fill="var(--color-text)"
                    />
                </svg>
            </icon-component>
        `;
    }
}
