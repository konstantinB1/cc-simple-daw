import { colorClasses, litStyles, WithStyles } from "@/styles";
import { CSSResult, LitElement, type PropertyValues } from "lit";

export default class ThemedElement extends WithStyles(LitElement) {
    connectedCallback(): void {
        super.connectedCallback();
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {
        super.firstUpdated(_changedProperties);
    }
}
