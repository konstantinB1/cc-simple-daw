import { beziers, slide, type SlideAnimation } from "@/utils/animate";
import {
    CSSResult,
    LitElement,
    type Part,
    type PropertyValues,
    type TemplateResult,
} from "lit";
import { portal } from "lit-modal-portal";
import { directive, Directive } from "lit/async-directive.js";
import { customElement, property } from "lit/decorators.js";
import { TemplateResultType } from "lit/directive-helpers.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

let anchorElementId = 0;

export type AnchorPosition =
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center"
    | "left-center";

export function getAnchorPosition(
    element: HTMLElement,
    anchor: AnchorPosition,
    width: number = 0,
): [number, number] {
    const rect = element.getBoundingClientRect();
    let x: number, y: number;

    switch (anchor) {
        case "top-left":
            x = rect.left;
            y = rect.top;
            break;
        case "top-right":
            x = rect.right;
            y = rect.top;
            break;
        case "bottom-left":
            x = rect.left - width + rect.width;
            y = rect.bottom;
            break;
        case "bottom-right":
            x = rect.right - width + rect.width;
            y = rect.bottom;
            break;
        case "top-center":
            x = rect.left + rect.width / 2;
            y = rect.top;
            break;
        case "bottom-center":
            x = rect.left + rect.width / 2;
            y = rect.bottom;
            break;
        case "left-center":
            x = rect.left;
            y = rect.top + rect.height / 2;
            break;
        default:
            throw new Error(`Unknown anchor position: ${anchor}`);
    }

    return [x, y];
}

export type AnchorElementProps = {
    anchor: AnchorPosition;
    content: TemplateResult;
    targetElement: Promise<HTMLElement>;
    styles?: CSSResult;
    visible?: boolean;
    width?: number;
    height?: number;
    container?: HTMLElement;
};

export class AnchorDirective extends Directive {
    private slideAnim!: SlideAnimation;

    render({
        anchor,
        content,
        targetElement,
        styles,
        visible = false,
        width = 0,
        height = 0,
        container = document.body,
    }: AnchorElementProps) {
        return portal(content, container, {
            modifyContainer: async (c) => {
                const slideAnim = slide(
                    c,
                    {
                        easing: beziers.easeOutCubic,
                        duration: 200,
                        delay: 0,
                    },
                    15,
                );

                const anchorEl = await targetElement;
                const totalWidth = width || anchorEl.offsetWidth;

                const [x, y] = getAnchorPosition(anchorEl, anchor, totalWidth);

                if (styles) {
                    const styleElement = document.createElement("style");
                    styleElement.textContent = styles.cssText;
                    document.body.appendChild(styleElement);
                }

                if (visible) {
                    container.style.display = "block";
                } else {
                    container.style.display = "none";
                }

                container.style.position = "absolute";
                container.style.left = `${x}px`;
                container.style.top = `${y}px`;
                container.style.width = `${totalWidth}px`;
                container.style.height = `${height}px`;
                container.style.zIndex = "1000";
            },
        });
    }
}

export default directive(AnchorDirective);
