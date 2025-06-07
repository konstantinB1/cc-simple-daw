import type { Constructor } from "@/utils/types";
import { property } from "lit/decorators.js";

const IconConsumerMixin = (superClass: Constructor) => {
    class IconConsumer extends superClass {
        @property({ type: Number })
        size: number = 24;

        @property({ type: String })
        color: string = "var(--color-tint-primary)";
    }

    return IconConsumer;
};

export default IconConsumerMixin;
