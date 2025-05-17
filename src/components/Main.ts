import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Program } from "../lib/ProgramManager";

@customElement("main-init")
export default class Root extends LitElement {
    @property({ type: Object })
    private currentProgram: Program | null = null;

    static styles = [
        css`
            .container {
                width: var(--container-width);
                margin: 20vh auto;
            }
        `,
    ];

    private setProgramFromEvent(e: CustomEvent) {
        const program = e.detail.program;

        if (program) {
            this.currentProgram = program;
        } else {
            console.error("No program found in event");
        }
    }

    render() {
        return html`
            <program-container
                @program-loaded=${this.setProgramFromEvent}
            ></program-container>
            <pads-bank></pads-bank>
            <card-component>
                <pads-container
                    .programData=${this.currentProgram}
                ></pads-container>
            </card-component>
        `;
    }
}
