import { WithStyles } from "@/styles";
import { beziers, slide, type SlideAnimation } from "@/utils/animate";
import {
    CSSResult,
    LitElement,
    type PropertyValues,
    type TemplateResult,
} from "lit";
import { portal } from "lit-modal-portal";
import { customElement, property } from "lit/decorators.js";

export interface AnchorElementProps {
    anchor: AnchorPosition;
    targetElement: HTMLElement | Promise<HTMLElement>;
    styles?: CSSResult | CSSResult[] | string;
    visible?: boolean;
    width?: number;
    content: TemplateResult<1>;
    height?: number;
    root?: HTMLElement;
}

export type AnchorPosition =
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center"
    | "left-center";

export default function getAnchorPosition(
    element: HTMLElement,
    anchor: AnchorPosition,
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
            x = rect.left;
            y = rect.bottom;
            break;
        case "bottom-right":
            x = rect.right;
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

@customElement("anchor-element")
export class AnchorElement
    extends WithStyles(LitElement)
    implements AnchorElementProps
{
    @property({ type: String, attribute: "anchor" })
    anchor!: AnchorPosition;

    @property({ type: Object })
    targetElement!: Promise<HTMLElement> | HTMLElement;

    @property({ type: Array })
    styles!: CSSResult | CSSResult[];

    @property({ type: Boolean, reflect: true })
    visible: boolean = false;

    @property({ type: Number })
    width: number = 0;

    @property({ type: Object })
    content!: TemplateResult<1>;

    @property({ type: Number })
    height: number = 0;

    @property({ type: Object })
    root: HTMLElement = document.body;

    @property({ type: String, attribute: true })
    styleId?: string;

    private slideAnim!: SlideAnimation;

    private container: HTMLElement | null = null;

    private async resolvedElement(): Promise<HTMLElement> {
        if (this.targetElement instanceof Promise) {
            return await this.targetElement;
        }

        return this.targetElement as HTMLElement;
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {
        super.firstUpdated(_changedProperties);

        if (this.styles) {
            this.styleManager.createStyleElement(
                "anchor-element-styles",
                this.styles,
            );
        }
    }

    protected update(changedProperties: PropertyValues): void {
        super.update(changedProperties);

        if (changedProperties.has("visible") && this.container) {
            this.updatePosition().catch((error) => {
                console.error("Error updating position:", error);
            });

            if (this.visible) {
                this.container.style.display = "block";
            }

            this.visible
                ? this.slideAnim.inFromTop()
                : this.slideAnim.outToTop();

            if (!this.visible) {
                this.dispatchEvent(
                    new CustomEvent("close", { bubbles: true, composed: true }),
                );
            }
        }
    }

    private async updatePosition(): Promise<void> {
        if (!this.container) {
            throw new Error("Container is not initialized");
        }

        const anchorEl = await this.resolvedElement();

        const [x, y] = getAnchorPosition(anchorEl, this.anchor);

        this.container!.style.left = `${x}px`;
        this.container!.style.top = `${y + 5}px`;
    }

    render() {
        return portal(this.content, this.root, {
            modifyContainer: async (container) => {
                this.container = container;

                this.slideAnim = slide(
                    this.container,
                    {
                        easing: beziers.easeOutCubic,
                        duration: 200,
                        delay: 0,
                    },
                    15,
                );

                await this.updateComplete;
                const anchorEl = await this.targetElement;

                const [x, y] = getAnchorPosition(anchorEl, this.anchor);

                if (this.visible) {
                    container.style.display = "block";
                } else {
                    container.style.display = "none";
                }

                const width = this.width || anchorEl.offsetWidth;

                container.style.position = "absolute";
                container.style.left = `${x}px`;
                container.style.top = `${y}px`;
                container.style.width = `${width}px`;
                container.style.height = `${this.height}px`;
                container.style.zIndex = "1000";
            },
        });
    }
}
