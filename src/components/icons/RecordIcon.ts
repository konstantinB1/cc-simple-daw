import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import IconConsumerMixin from "./IconConsumerMixin";

@customElement("record-icon")
export default class RecordIcon extends IconConsumerMixin(LitElement) {
    static styles = css`
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;

    protected override renderIcon() {
        return html`
            <svg
                width=${0}
                height=${0}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle opacity="0" cx="12" cy="12" r="7" fill="#ffffff" />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z"
                    fill="var(--color-tint-primary)"
                />
            </svg>
        `;
    }
}
