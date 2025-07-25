import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import IconConsumerMixin from "./IconConsumerMixin";

@customElement("up-down-icon")
export default class UpAndDownIcon extends IconConsumerMixin(LitElement) {
    static styles = css`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;

    renderIcon() {
        return html`
            <svg
                viewBox="0 0 24 24"
                id="up-down-scroll-bar-2"
                data-name="Flat Line"
                class="icon flat-line"
            >
                <polyline
                    id="primary"
                    points="10 5 12 3 14 5"
                    style="fill: none; stroke: var(--color-tint-primary); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"
                ></polyline>
                <polyline
                    id="primary-2"
                    data-name="primary"
                    points="14 19 12 21 10 19"
                    style="fill: none; stroke: var(--color-tint-primary); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"
                ></polyline>
                <path
                    id="primary-3"
                    data-name="primary"
                    d="M18,12H6m6-4V3m0,18V16"
                    style="fill: none; stroke: var(--color-tint-primary); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"
                ></path>
            </svg>
        `;
    }
}
