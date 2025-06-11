import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import IconConsumerMixin from "./IconConsumerMixin";

@customElement("stop-icon")
export default class StopIcon extends IconConsumerMixin(LitElement) {
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
                    <rect
                        x="1"
                        y="1"
                        width="14"
                        height="14"
                        fill="var(--color-text)"
                    />
                </svg>
            </icon-component>
        `;
    }
}
