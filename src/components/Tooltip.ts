import { helperStyles } from "@/styles";
import { computePosition, offset } from "@floating-ui/dom";
import { css, html, LitElement } from "lit";
import { customElement, property, queryAsync, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("tooltip-element")
export default class Tooltip extends LitElement {
    @property({ type: String })
    text: string = "";

    @state()
    private isOpen: boolean = false;

    @state()
    private isHovered: boolean = false;

    @queryAsync(".tooltip-content")
    private tooltipContent!: Promise<HTMLDivElement>;

    @queryAsync(".root")
    private rootElement!: Promise<HTMLDivElement>;

    @state()
    position: [number, number] = [0, 0];

    static styles = [
        helperStyles,
        css`
            .tooltip-hovered.tooltip-content {
                opacity: 1;
                visibility: visible;
            }

            .tooltip-content {
                transition:
                    opacity 0.15s ease-in-out,
                    visibility 0.2s ease-in-out;
                background-color: var(--color-tint-primary-active);
                color: var(--color-text-primary);
                padding: 8px;
                border-radius: 4px;
                box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
                position: absolute;
                z-index: 1000;
                opacity: 0;
                white-space: nowrap;
            }

            .tooltip-open.tooltip-content {
                opacity: 1;
                visibility: visible;
            }
        `,
    ];

    setIsHovered(isHovered: boolean) {
        return () => {
            this.isHovered = isHovered;

            if (isHovered) {
                this.isOpen = true;
            } else {
                this.isOpen = false;
            }
        };
    }

    async firstUpdated() {
        await this.updateComplete;
        const tooltipContent = await this.tooltipContent;
        const rootElement = await this.rootElement;
        const { x, y } = await computePosition(rootElement, tooltipContent, {
            placement: "bottom",
            middleware: [offset(10)],
        });

        this.position = [x, y];
    }

    override render() {
        const classes = classMap({
            root: true,
            relative: true,
            "tooltip-open": this.isOpen,
            "tooltip-hovered": this.isHovered,
        });

        const [x, y] = this.position;

        const contentStyles = styleMap({
            transform: `translate(${x}px, ${y}px)`,
        });

        const contentClasses = classMap({
            "tooltip-content": true,
            "tooltip-open": this.isOpen,
            "tooltip-hovered": this.isHovered,
        });

        return html`
            <div
                class=${classes}
                @mouseover=${this.setIsHovered(true)}
                @mouseout=${this.setIsHovered(false)}
            >
                <div class=${contentClasses} style=${contentStyles}>
                    <text-element variant="body1"> ${this.text} </text-element>
                </div>
                <slot></slot>
            </div>
        `;
    }
}
