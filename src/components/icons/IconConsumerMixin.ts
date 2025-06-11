import type { Constructor } from "@/utils/types";
import { html, type LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";

interface IconComponent {
    renderIcon(): TemplateResult;
}

const IconConsumerMixin = <T extends Constructor<LitElement>>(
    superClass: T,
) => {
    class IconConsumer extends superClass {
        @property({ type: Number })
        size: number = 24;

        @property({ type: String })
        color: string = "var(--color-tint-primary)";

        protected renderIcon(): TemplateResult {
            // This method should be overridden by the subclass to provide the actual icon rendering
            return html`icon not implemented`;
        }

        protected override render() {
            return html`
                <icon-component .size=${this.size} .color=${this.color}>
                    ${this.renderIcon()}
                </icon-component>
            `;
        }
    }

    return IconConsumer;
};

export default IconConsumerMixin;
