import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import IconConsumerMixin from "./IconConsumerMixin";

@customElement("panels-icon")
export default class PanelsIcon extends IconConsumerMixin(LitElement) {
    protected override renderIcon() {
        return html`
            <svg
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M3 12H20C20.5523 12 21 11.5523 21 11V4C21 3.44772 20.5523 3 20 3H11C10.4477 3 10 3.44772 10 4V9M21 6H10M4 9H16C16.5523 9 17 9.44772 17 10V19C17 19.5523 16.5523 20 16 20H4C3.44772 20 3 19.5523 3 19V10C3 9.44771 3.44772 9 4 9Z"
                    stroke=${this.color}
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        `;
    }
}
