import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import IconConsumerMixin from "./IconConsumerMixin";

@customElement("select-icon")
export default class SelectIcon extends IconConsumerMixin(LitElement) {
    protected override renderIcon() {
        return html`
            <svg
                fill=${this.color}
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M1,7V3A1,1,0,0,1,2,2H6A1,1,0,0,1,6,4H3V7A1,1,0,0,1,1,7ZM2,22H6a1,1,0,0,0,0-2H3V17a1,1,0,0,0-2,0v4A1,1,0,0,0,2,22Zm21-5a1,1,0,0,0-2,0v3H18a1,1,0,0,0,0,2h4a1,1,0,0,0,1-1ZM17,3a1,1,0,0,0,1,1h3V7a1,1,0,0,0,2,0V3a1,1,0,0,0-1-1H18A1,1,0,0,0,17,3ZM10,22h4a1,1,0,0,0,0-2H10a1,1,0,0,0,0,2ZM23,10.5a1,1,0,0,0-2,0v3a1,1,0,0,0,2,0Zm-21,4a1,1,0,0,0,1-1v-3a1,1,0,0,0-2,0v3A1,1,0,0,0,2,14.5ZM10,4h4a1,1,0,0,0,0-2H10a1,1,0,0,0,0,2Z"
                />
            </svg>
        `;
    }
}
