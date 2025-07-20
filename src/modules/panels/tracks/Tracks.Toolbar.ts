import { helperStyles } from "@/styles";
import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";

export type Tool = {
    name: string;
    element: TemplateResult;
    description: string;
};

export const tools: Record<string, Tool> = {
    click: {
        name: "Click",
        element: html`<click-icon
            color="var(--color-text)"
            size=${17}
        ></click-icon>`,
        description: "Click tool for placing events",
    },
    select: {
        name: "Select",
        element: html`<select-icon
            color="var(--color-text)"
            size=${17}
        ></select-icon>`,
        description: "Select tool for selecting events",
    },
};

export default class TracksToolbar extends LitElement {
    static styles = [helperStyles, css``];

    @property({ type: Object })
    private currentTool = tools.click;

    private onToolChange(tool: Tool): void {
        this.dispatchEvent(
            new CustomEvent("tool-change", {
                detail: tool,
                bubbles: true,
                composed: true,
            }),
        );
    }

    override render() {
        return html` <div
            class="root full-space p-2 bg-card bbox border-bottom-accent"
        >
            <div class="flex flex-start gap-1 px-2">
                ${Object.values(tools).map(
                    (tool) => html`
                        <tooltip-element text=${tool.description}>
                            <icon-button
                                .isActive=${tool === this.currentTool}
                                @handle-click=${() => this.onToolChange(tool)}
                                size=${35}
                                >${tool.element}</icon-button
                            >
                        </tooltip-element>
                    `,
                )}
            </div>
        </div>`;
    }
}
