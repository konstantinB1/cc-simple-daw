import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import IconConsumerMixin from "./IconConsumerMixin";

@customElement("checked-icon")
export default class CheckedIcon extends IconConsumerMixin(LitElement) {
    protected override renderIcon() {
        return html`
            <svg
                width="800px"
                height="800px"
                viewBox="0 -0.5 17 17"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                class="si-glyph si-glyph-checked"
            >
                <title>1228</title>

                <defs></defs>
                <g
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                >
                    <path
                        d="M3.432,6.189 C3.824,5.798 4.455,5.798 4.847,6.189 L6.968,8.31 L13.147,2.131 C13.531,1.747 14.157,1.753 14.548,2.144 L16.67,4.266 C17.06,4.657 17.066,5.284 16.684,5.666 L7.662,14.687 C7.278,15.07 6.651,15.064 6.261,14.673 L1.311,9.723 C0.92,9.333 0.92,8.7 1.311,8.31 L3.432,6.189 Z"
                        fill=${this.color}
                        class="si-glyph-fill"
                    ></path>
                </g>
            </svg>
        `;
    }
}
